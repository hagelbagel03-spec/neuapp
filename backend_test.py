#!/usr/bin/env python3
"""
Comprehensive Backend Testing for Stadtwache Police Management System
Tests all core functionality including authentication, APIs, and real-time features
"""

import requests
import json
import time
import uuid
from datetime import datetime, timedelta
from typing import Dict, Any, Optional

class StadtwacheBackendTester:
    def __init__(self):
        # Use the frontend environment variable for backend URL
        self.base_url = "https://theme-overhaul-2.preview.emergentagent.com/api"
        self.session = requests.Session()
        self.auth_token = None
        self.current_user = None
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, message: str, details: Any = None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "details": details
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def make_request(self, method: str, endpoint: str, data: Dict = None, headers: Dict = None) -> requests.Response:
        """Make HTTP request with proper error handling"""
        url = f"{self.base_url}{endpoint}"
        request_headers = {"Content-Type": "application/json"}
        
        if self.auth_token:
            request_headers["Authorization"] = f"Bearer {self.auth_token}"
        
        if headers:
            request_headers.update(headers)
        
        try:
            if method.upper() == "GET":
                response = self.session.get(url, headers=request_headers, timeout=30)
            elif method.upper() == "POST":
                response = self.session.post(url, json=data, headers=request_headers, timeout=30)
            elif method.upper() == "PUT":
                response = self.session.put(url, json=data, headers=request_headers, timeout=30)
            elif method.upper() == "DELETE":
                response = self.session.delete(url, headers=request_headers, timeout=30)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
            
            return response
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            raise
    
    def test_server_connectivity(self):
        """Test if the backend server is accessible"""
        try:
            response = self.make_request("GET", "/")
            if response.status_code == 200:
                self.log_test("Server Connectivity", True, "Backend server is accessible")
                return True
            else:
                self.log_test("Server Connectivity", False, f"Server returned status {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Server Connectivity", False, f"Cannot connect to server: {str(e)}")
            return False
    
    def test_create_first_admin_user(self):
        """Create the first admin user if no users exist"""
        try:
            # Try to create first admin user
            admin_data = {
                "email": "admin@stadtwache.sys",
                "username": "Administrator",
                "password": "admin123",
                "role": "admin",
                "badge_number": "ADMIN001",
                "department": "Administration",
                "phone": "+49-2336-123456",
                "service_number": "SVC001",
                "rank": "Hauptkommissar"
            }
            
            response = self.make_request("POST", "/admin/create-first-user", admin_data)
            
            if response.status_code == 200:
                self.log_test("Create First Admin User", True, "First admin user created successfully")
                return True
            elif response.status_code == 400 and "Users already exist" in response.text:
                self.log_test("Create First Admin User", True, "Admin user already exists (expected)")
                return True
            else:
                self.log_test("Create First Admin User", False, f"Failed to create admin user: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            self.log_test("Create First Admin User", False, f"Error creating admin user: {str(e)}")
            return False
    
    def test_authentication_login(self):
        """Test user authentication with admin credentials"""
        try:
            login_data = {
                "email": "admin@stadtwache.sys",
                "password": "admin123"
            }
            
            response = self.make_request("POST", "/auth/login", login_data)
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "user" in data:
                    self.auth_token = data["access_token"]
                    self.current_user = data["user"]
                    self.log_test("Authentication Login", True, f"Successfully logged in as {self.current_user['username']}")
                    return True
                else:
                    self.log_test("Authentication Login", False, "Login response missing required fields")
                    return False
            else:
                self.log_test("Authentication Login", False, f"Login failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            self.log_test("Authentication Login", False, f"Login error: {str(e)}")
            return False
    
    def test_get_current_user(self):
        """Test getting current user profile"""
        try:
            response = self.make_request("GET", "/auth/me")
            
            if response.status_code == 200:
                user_data = response.json()
                if user_data.get("email") == "admin@stadtwache.sys":
                    self.log_test("Get Current User", True, "Successfully retrieved current user profile")
                    return True
                else:
                    self.log_test("Get Current User", False, "Retrieved user profile doesn't match expected user")
                    return False
            else:
                self.log_test("Get Current User", False, f"Failed to get user profile: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Get Current User", False, f"Error getting user profile: {str(e)}")
            return False
    
    def test_create_incident(self):
        """Test creating a new incident"""
        try:
            incident_data = {
                "title": "Test Incident - Verkehrsunfall",
                "description": "Schwerer Verkehrsunfall auf der B7 mit mehreren Fahrzeugen beteiligt. Rettungsdienst und Feuerwehr sind bereits vor Ort.",
                "priority": "high",
                "location": {
                    "lat": 51.2879,
                    "lng": 7.2954
                },
                "address": "Hauptstraße 123, 58332 Schwelm",
                "images": []
            }
            
            response = self.make_request("POST", "/incidents", incident_data)
            
            if response.status_code == 200:
                incident = response.json()
                if incident.get("title") == incident_data["title"]:
                    self.log_test("Create Incident", True, f"Successfully created incident: {incident['id']}")
                    # Store incident ID for later tests
                    self.test_incident_id = incident["id"]
                    return True
                else:
                    self.log_test("Create Incident", False, "Created incident data doesn't match input")
                    return False
            else:
                self.log_test("Create Incident", False, f"Failed to create incident: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            self.log_test("Create Incident", False, f"Error creating incident: {str(e)}")
            return False
    
    def test_get_incidents(self):
        """Test retrieving all incidents"""
        try:
            response = self.make_request("GET", "/incidents")
            
            if response.status_code == 200:
                incidents = response.json()
                if isinstance(incidents, list):
                    self.log_test("Get Incidents", True, f"Successfully retrieved {len(incidents)} incidents")
                    return True
                else:
                    self.log_test("Get Incidents", False, "Response is not a list of incidents")
                    return False
            else:
                self.log_test("Get Incidents", False, f"Failed to get incidents: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Get Incidents", False, f"Error getting incidents: {str(e)}")
            return False
    
    def test_assign_incident(self):
        """Test assigning an incident to current user"""
        if not hasattr(self, 'test_incident_id'):
            self.log_test("Assign Incident", False, "No test incident available")
            return False
        
        try:
            response = self.make_request("PUT", f"/incidents/{self.test_incident_id}/assign")
            
            if response.status_code == 200:
                incident = response.json()
                if incident.get("assigned_to") == self.current_user["id"]:
                    self.log_test("Assign Incident", True, "Successfully assigned incident to current user")
                    return True
                else:
                    self.log_test("Assign Incident", False, "Incident assignment failed")
                    return False
            else:
                self.log_test("Assign Incident", False, f"Failed to assign incident: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Assign Incident", False, f"Error assigning incident: {str(e)}")
            return False
    
    def test_create_person_entry(self):
        """Test creating a person entry in the database"""
        try:
            person_data = {
                "first_name": "Max",
                "last_name": "Mustermann",
                "address": "Musterstraße 42, 58332 Schwelm",
                "age": 35,
                "birth_date": "1988-05-15",
                "status": "vermisst",
                "description": "Etwa 1,80m groß, braune Haare, trägt eine blaue Jacke. Zuletzt gesehen am Bahnhof Schwelm.",
                "last_seen_location": "Bahnhof Schwelm",
                "last_seen_date": "2024-01-15",
                "contact_info": "Ehefrau: Maria Mustermann, Tel: 02336-123456",
                "case_number": "VM-2024-001",
                "priority": "high"
            }
            
            response = self.make_request("POST", "/persons", person_data)
            
            if response.status_code == 200:
                person = response.json()
                if person.get("first_name") == person_data["first_name"]:
                    self.log_test("Create Person Entry", True, f"Successfully created person entry: {person['id']}")
                    self.test_person_id = person["id"]
                    return True
                else:
                    self.log_test("Create Person Entry", False, "Created person data doesn't match input")
                    return False
            else:
                self.log_test("Create Person Entry", False, f"Failed to create person: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            self.log_test("Create Person Entry", False, f"Error creating person: {str(e)}")
            return False
    
    def test_get_persons(self):
        """Test retrieving persons from database"""
        try:
            response = self.make_request("GET", "/persons")
            
            if response.status_code == 200:
                persons = response.json()
                if isinstance(persons, list):
                    self.log_test("Get Persons", True, f"Successfully retrieved {len(persons)} person entries")
                    return True
                else:
                    self.log_test("Get Persons", False, "Response is not a list of persons")
                    return False
            else:
                self.log_test("Get Persons", False, f"Failed to get persons: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Get Persons", False, f"Error getting persons: {str(e)}")
            return False
    
    def test_send_message(self):
        """Test sending a message"""
        try:
            message_data = {
                "content": "Test-Nachricht: Alle Einheiten, bitte Status melden. Dies ist ein automatisierter Test der Kommunikationssysteme.",
                "channel": "general",
                "message_type": "text"
            }
            
            response = self.make_request("POST", "/messages", message_data)
            
            if response.status_code == 200:
                message = response.json()
                if message.get("content") == message_data["content"]:
                    self.log_test("Send Message", True, f"Successfully sent message: {message['id']}")
                    self.test_message_id = message["id"]
                    return True
                else:
                    self.log_test("Send Message", False, "Sent message data doesn't match input")
                    return False
            else:
                self.log_test("Send Message", False, f"Failed to send message: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            self.log_test("Send Message", False, f"Error sending message: {str(e)}")
            return False
    
    def test_get_messages(self):
        """Test retrieving messages"""
        try:
            response = self.make_request("GET", "/messages?channel=general")
            
            if response.status_code == 200:
                messages = response.json()
                if isinstance(messages, list):
                    self.log_test("Get Messages", True, f"Successfully retrieved {len(messages)} messages")
                    return True
                else:
                    self.log_test("Get Messages", False, "Response is not a list of messages")
                    return False
            else:
                self.log_test("Get Messages", False, f"Failed to get messages: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Get Messages", False, f"Error getting messages: {str(e)}")
            return False
    
    def test_create_report(self):
        """Test creating a report"""
        try:
            report_data = {
                "title": "Schichtbericht - Tagesdienst",
                "content": "Schichtbericht für den 15.01.2024:\n\n- 3 Verkehrskontrollen durchgeführt\n- 1 Verkehrsunfall aufgenommen (siehe Vorfall VM-2024-001)\n- Streifenfahrt durch Innenstadt ohne besondere Vorkommnisse\n- Bürgersprechstunde von 14:00-16:00 Uhr\n\nBesondere Vorkommnisse: Keine\nEmpfehlungen: Verstärkte Kontrollen im Bereich Bahnhof",
                "shift_date": "2024-01-15"
            }
            
            response = self.make_request("POST", "/reports", report_data)
            
            if response.status_code == 200:
                report = response.json()
                if report.get("title") == report_data["title"]:
                    self.log_test("Create Report", True, f"Successfully created report: {report['id']}")
                    self.test_report_id = report["id"]
                    return True
                else:
                    self.log_test("Create Report", False, "Created report data doesn't match input")
                    return False
            else:
                self.log_test("Create Report", False, f"Failed to create report: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            self.log_test("Create Report", False, f"Error creating report: {str(e)}")
            return False
    
    def test_get_reports(self):
        """Test retrieving reports"""
        try:
            response = self.make_request("GET", "/reports")
            
            if response.status_code == 200:
                reports = response.json()
                if isinstance(reports, list):
                    self.log_test("Get Reports", True, f"Successfully retrieved {len(reports)} reports")
                    return True
                else:
                    self.log_test("Get Reports", False, "Response is not a list of reports")
                    return False
            else:
                self.log_test("Get Reports", False, f"Failed to get reports: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Get Reports", False, f"Error getting reports: {str(e)}")
            return False
    
    def test_emergency_broadcast(self):
        """Test emergency SOS broadcasting"""
        try:
            alert_data = {
                "type": "sos_alarm",
                "message": "NOTFALL-TEST: Beamter benötigt sofortige Unterstützung! Dies ist ein automatisierter Test des Notrufsystems.",
                "location": {
                    "latitude": 51.2879,
                    "longitude": 7.2954,
                    "accuracy": 10
                },
                "location_status": "GPS verfügbar",
                "priority": "urgent"
            }
            
            response = self.make_request("POST", "/emergency/broadcast", alert_data)
            
            if response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("broadcast_id"):
                    self.log_test("Emergency Broadcast", True, f"Successfully sent emergency broadcast: {result['broadcast_id']}")
                    return True
                else:
                    self.log_test("Emergency Broadcast", False, "Emergency broadcast response missing required fields")
                    return False
            else:
                self.log_test("Emergency Broadcast", False, f"Failed to send emergency broadcast: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            self.log_test("Emergency Broadcast", False, f"Error sending emergency broadcast: {str(e)}")
            return False
    
    def test_get_users_by_status(self):
        """Test getting users grouped by status"""
        try:
            response = self.make_request("GET", "/users/by-status")
            
            if response.status_code == 200:
                users_by_status = response.json()
                if isinstance(users_by_status, dict):
                    total_users = sum(len(users) for users in users_by_status.values())
                    self.log_test("Get Users By Status", True, f"Successfully retrieved users by status: {total_users} total users")
                    return True
                else:
                    self.log_test("Get Users By Status", False, "Response is not a dictionary of user statuses")
                    return False
            else:
                self.log_test("Get Users By Status", False, f"Failed to get users by status: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Get Users By Status", False, f"Error getting users by status: {str(e)}")
            return False
    
    def test_admin_statistics(self):
        """Test admin statistics endpoint"""
        try:
            response = self.make_request("GET", "/admin/stats")
            
            if response.status_code == 200:
                stats = response.json()
                required_fields = ["total_users", "total_incidents", "open_incidents", "total_messages"]
                if all(field in stats for field in required_fields):
                    self.log_test("Admin Statistics", True, f"Successfully retrieved admin stats: {stats}")
                    return True
                else:
                    self.log_test("Admin Statistics", False, "Admin stats missing required fields")
                    return False
            else:
                self.log_test("Admin Statistics", False, f"Failed to get admin stats: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Admin Statistics", False, f"Error getting admin stats: {str(e)}")
            return False
    
    def test_person_statistics(self):
        """Test person database statistics"""
        try:
            response = self.make_request("GET", "/persons/stats/overview")
            
            if response.status_code == 200:
                stats = response.json()
                required_fields = ["total_persons", "missing_persons", "wanted_persons", "found_persons"]
                if all(field in stats for field in required_fields):
                    self.log_test("Person Statistics", True, f"Successfully retrieved person stats: {stats}")
                    return True
                else:
                    self.log_test("Person Statistics", False, "Person stats missing required fields")
                    return False
            else:
                self.log_test("Person Statistics", False, f"Failed to get person stats: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Person Statistics", False, f"Error getting person stats: {str(e)}")
            return False
    
    def test_live_locations(self):
        """Test live location tracking"""
        try:
            response = self.make_request("GET", "/locations/live")
            
            if response.status_code == 200:
                locations = response.json()
                if isinstance(locations, list):
                    self.log_test("Live Locations", True, f"Successfully retrieved {len(locations)} live locations")
                    return True
                else:
                    self.log_test("Live Locations", False, "Response is not a list of locations")
                    return False
            else:
                self.log_test("Live Locations", False, f"Failed to get live locations: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Live Locations", False, f"Error getting live locations: {str(e)}")
            return False
    
    def test_app_configuration(self):
        """Test app configuration endpoint"""
        try:
            response = self.make_request("GET", "/app/config")
            
            if response.status_code == 200:
                config = response.json()
                required_fields = ["app_name", "organization_name", "primary_color"]
                if all(field in config for field in required_fields):
                    self.log_test("App Configuration", True, f"Successfully retrieved app config: {config['app_name']}")
                    return True
                else:
                    self.log_test("App Configuration", False, "App config missing required fields")
                    return False
            else:
                self.log_test("App Configuration", False, f"Failed to get app config: {response.status_code}")
                return False
        except Exception as e:
            self.log_test("App Configuration", False, f"Error getting app config: {str(e)}")
            return False
    
    def test_districts_and_teams(self):
        """Test districts and teams endpoints"""
        try:
            # Test districts
            districts_response = self.make_request("GET", "/districts")
            teams_response = self.make_request("GET", "/teams")
            
            districts_ok = districts_response.status_code == 200 and isinstance(districts_response.json(), list)
            teams_ok = teams_response.status_code == 200 and isinstance(teams_response.json(), list)
            
            if districts_ok and teams_ok:
                districts = districts_response.json()
                teams = teams_response.json()
                self.log_test("Districts and Teams", True, f"Successfully retrieved {len(districts)} districts and {len(teams)} teams")
                return True
            else:
                self.log_test("Districts and Teams", False, "Failed to retrieve districts or teams")
                return False
        except Exception as e:
            self.log_test("Districts and Teams", False, f"Error getting districts/teams: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Stadtwache Backend Testing...")
        print(f"🔗 Testing against: {self.base_url}")
        print("=" * 80)
        
        # Core connectivity and setup
        if not self.test_server_connectivity():
            print("❌ Cannot connect to server. Aborting tests.")
            return False
        
        # Authentication setup
        self.test_create_first_admin_user()
        if not self.test_authentication_login():
            print("❌ Authentication failed. Cannot continue with authenticated tests.")
            return False
        
        # User management tests
        self.test_get_current_user()
        self.test_get_users_by_status()
        
        # Core functionality tests
        self.test_create_incident()
        self.test_get_incidents()
        self.test_assign_incident()
        
        # Person database tests
        self.test_create_person_entry()
        self.test_get_persons()
        self.test_person_statistics()
        
        # Communication tests
        self.test_send_message()
        self.test_get_messages()
        
        # Reports tests
        self.test_create_report()
        self.test_get_reports()
        
        # Emergency features
        self.test_emergency_broadcast()
        
        # Admin features
        self.test_admin_statistics()
        self.test_live_locations()
        self.test_app_configuration()
        self.test_districts_and_teams()
        
        # Summary
        self.print_test_summary()
        return True
    
    def print_test_summary(self):
        """Print comprehensive test summary"""
        print("\n" + "=" * 80)
        print("🏁 STADTWACHE BACKEND TEST SUMMARY")
        print("=" * 80)
        
        passed = sum(1 for result in self.test_results if result["success"])
        failed = len(self.test_results) - passed
        
        print(f"📊 Total Tests: {len(self.test_results)}")
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"📈 Success Rate: {(passed/len(self.test_results)*100):.1f}%")
        
        if failed > 0:
            print("\n🔍 FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"   ❌ {result['test']}: {result['message']}")
        
        print("\n📋 DETAILED RESULTS:")
        for result in self.test_results:
            status = "✅" if result["success"] else "❌"
            print(f"   {status} {result['test']}: {result['message']}")
        
        print("\n" + "=" * 80)
        
        if failed == 0:
            print("🎉 ALL TESTS PASSED! Stadtwache backend is fully functional.")
        else:
            print(f"⚠️  {failed} tests failed. Please review the issues above.")
        
        print("=" * 80)

def main():
    """Main test execution"""
    tester = StadtwacheBackendTester()
    tester.run_all_tests()

if __name__ == "__main__":
    main()