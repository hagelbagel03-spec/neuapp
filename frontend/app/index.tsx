import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  RefreshControl,
  Switch,
  Dimensions,
  Image,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
// Removed LinearGradient import for now

const { width, height } = Dimensions.get('window');

// 🚀 ULTRA-MODERN API Configuration
const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || "http://212.227.57.238:8001";

// 🎨 FUTURISTIC THEME - CYBER COLORS
const CyberTheme = {
  // Primary Colors - Neon Cyber
  primaryNeon: '#00FFFF', // Cyan Neon
  secondaryNeon: '#FF00FF', // Magenta Neon
  accentNeon: '#00FF41', // Matrix Green
  warningNeon: '#FF4444', // Red Alert
  
  // Dark Base Colors
  darkBase: '#0A0A0A', // Pure Black Base
  darkCard: '#111111', // Card Background
  darkSurface: '#1A1A1A', // Surface Elements
  darkBorder: '#333333', // Borders
  
  // Glass Effects
  glassBg: 'rgba(255, 255, 255, 0.05)',
  glassBlur: 'rgba(0, 255, 255, 0.1)',
  
  // Text Colors
  textPrimary: '#FFFFFF',
  textSecondary: '#CCCCCC',
  textMuted: '#888888',
  
  // Status Colors
  online: '#00FF41',
  offline: '#FF4444',
  warning: '#FFB800',
  
  // Gradients
  primaryGradient: ['#0A0A0A', '#001a1a', '#003333'],
  neonGradient: ['#00FFFF', '#FF00FF', '#00FF41'],
  cardGradient: ['rgba(17, 17, 17, 0.95)', 'rgba(26, 26, 26, 0.95)'],
};

// 🔮 Holographic Component
const HolographicCard = ({ children, style, ...props }) => {
  const [shimmerAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const shimmer = () => {
      shimmerAnim.setValue(0);
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start(() => shimmer());
    };
    shimmer();
  }, []);

  return (
    <View style={[styles.holographicCard, style]} {...props}>
      <Animated.View
        style={[
          styles.shimmerOverlay,
          {
            opacity: shimmerAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.3, 0.7, 0.3],
            }),
          },
        ]}
      />
      {children}
    </View>
  );
};

// 🎨 Neon Button Component
const NeonButton = ({ onPress, title, icon, style, variant = 'primary', disabled, ...props }) => {
  const [pressAnim] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.neonButtonPrimary;
      case 'secondary':
        return styles.neonButtonSecondary;
      case 'danger':
        return styles.neonButtonDanger;
      case 'success':
        return styles.neonButtonSuccess;
      default:
        return styles.neonButtonPrimary;
    }
  };

  return (
    <Animated.View style={[{ transform: [{ scale: pressAnim }] }, style]}>
      <TouchableOpacity
        style={[styles.neonButtonBase, getButtonStyle(), disabled && styles.neonButtonDisabled]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        {...props}
      >
        {icon && <Ionicons name={icon} size={20} color={CyberTheme.textPrimary} style={styles.buttonIcon} />}
        <Text style={styles.neonButtonText}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// 🌟 Ultra-Modern Styles
const styles = StyleSheet.create({
  // Holographic Effects
  holographicCard: {
    backgroundColor: CyberTheme.glassBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: CyberTheme.primaryNeon,
    padding: 20,
    margin: 8,
    shadowColor: CyberTheme.primaryNeon,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: CyberTheme.primaryNeon,
    borderRadius: 15,
  },
  
  // Neon Buttons
  neonButtonBase: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    minHeight: 56,
  },
  neonButtonPrimary: {
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
    borderColor: CyberTheme.primaryNeon,
    shadowColor: CyberTheme.primaryNeon,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  neonButtonSecondary: {
    backgroundColor: 'rgba(255, 0, 255, 0.1)',
    borderColor: CyberTheme.secondaryNeon,
    shadowColor: CyberTheme.secondaryNeon,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  neonButtonDanger: {
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    borderColor: CyberTheme.warningNeon,
    shadowColor: CyberTheme.warningNeon,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  neonButtonSuccess: {
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
    borderColor: CyberTheme.accentNeon,
    shadowColor: CyberTheme.accentNeon,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  neonButtonDisabled: {
    opacity: 0.4,
    shadowOpacity: 0.1,
  },
  neonButtonText: {
    color: CyberTheme.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  buttonIcon: {
    marginRight: 8,
  },
  
  // Main Container
  mainContainer: {
    flex: 1,
    backgroundColor: CyberTheme.darkBase,
  },
  
  // Login Screen
  loginContainer: {
    flex: 1,
    backgroundColor: CyberTheme.darkBase,
  },
  loginContent: {
    flex: 1,
    padding: 32,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(0, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: CyberTheme.primaryNeon,
    shadowColor: CyberTheme.primaryNeon,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
    marginBottom: 24,
  },
  appTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: CyberTheme.primaryNeon,
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: CyberTheme.primaryNeon,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    letterSpacing: 2,
  },
  appSubtitle: {
    fontSize: 18,
    color: CyberTheme.textSecondary,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 1,
  },
  
  // Form Inputs
  formContainer: {
    marginBottom: 48,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: CyberTheme.primaryNeon,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cyberInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    borderColor: CyberTheme.primaryNeon,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: CyberTheme.textPrimary,
    fontWeight: '500',
    shadowColor: CyberTheme.primaryNeon,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  
  // Footer
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 20,
    fontWeight: '700',
    color: CyberTheme.primaryNeon,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statusText: {
    fontSize: 16,
    color: CyberTheme.accentNeon,
    fontWeight: '600',
  },
});

// Theme Context für Ultra-Modern Design
const ThemeContext = createContext();

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

const ThemeProvider = ({ children, appConfig }) => {
  const [isDarkMode, setIsDarkMode] = useState(true); // Always dark for cyber theme

  const theme = {
    isDarkMode: true,
    colors: CyberTheme
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

// Auth Context
const AuthContext = React.createContext(null);

const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
    setupAxiosInterceptors();
  }, []);

  const setupAxiosInterceptors = () => {
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          console.log('🔄 401 Fehler - Versuche Token-Erneuerung...');
          
          try {
            const savedToken = await AsyncStorage.getItem('stadtwache_token');
            const savedUser = await AsyncStorage.getItem('stadtwache_user');
            
            if (savedToken && savedUser) {
              const response = await axios.get(`${API_URL}/api/auth/me`, {
                headers: { Authorization: `Bearer ${savedToken}` }
              });
              
              console.log('✅ Token wieder gültig nach Server-Neustart');
              axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
              originalRequest.headers['Authorization'] = `Bearer ${savedToken}`;
              
              return axios(originalRequest);
            }
          } catch (retryError) {
            console.log('❌ Token-Erneuerung fehlgeschlagen, Logout...');
            await AsyncStorage.removeItem('stadtwache_token');
            await AsyncStorage.removeItem('stadtwache_user');
            setUser(null);
            setToken(null);
            delete axios.defaults.headers.common['Authorization'];
          }
        }
        
        return Promise.reject(error);
      }
    );
  };

  const checkAuthState = async () => {
    try {
      console.log('🌐 Using API URL for auth check:', API_URL);
      
      const savedToken = await AsyncStorage.getItem('stadtwache_token');
      const savedUser = await AsyncStorage.getItem('stadtwache_user');
      
      if (savedToken && savedUser) {
        console.log('🔐 Gespeicherte Login-Daten gefunden');
        
        try {
          const response = await axios.get(`${API_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${savedToken}` }
          });
          
          console.log('✅ Token noch gültig, Auto-Login...');
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
          
        } catch (error) {
          console.log('❌ Token abgelaufen, lösche gespeicherte Daten');
          await AsyncStorage.removeItem('stadtwache_token');
          await AsyncStorage.removeItem('stadtwache_user');
        }
      }
    } catch (error) {
      console.error('❌ Auto-Login Fehler:', error);
    } finally {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('🔐 LOGIN ATTEMPT:', { email, password });
      
      const requestData = { email, password };
      
      const response = await axios.post(`${API_URL}/api/auth/login`, requestData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const { access_token, user: userData } = response.data;
      
      setToken(access_token);
      setUser(userData);
      
      await AsyncStorage.setItem('stadtwache_token', access_token);
      await AsyncStorage.setItem('stadtwache_user', JSON.stringify(userData));
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Verbindung zum Server fehlgeschlagen.' 
      };
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem('stadtwache_token');
    await AsyncStorage.removeItem('stadtwache_user');
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateUser = async (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    await AsyncStorage.setItem('stadtwache_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// 🚀 ULTRA-MODERN LOGIN SCREEN
const CyberLoginScreen = ({ appConfig }) => {
  const { login } = useAuth();
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Pulse Animation für Logo
  const [pulseAnim] = useState(new Animated.Value(1));
  
  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };
    pulse();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('⚠️ Zugang verweigert', 'Identifikation erforderlich');
      return;
    }

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
    
    if (!cleanEmail || !cleanPassword) {
      Alert.alert('⚠️ Zugang verweigert', 'Vollständige Anmeldedaten erforderlich');
      return;
    }

    setLoading(true);
    
    try {
      const result = await login(cleanEmail, cleanPassword);
      setLoading(false);

      if (!result.success) {
        Alert.alert('🚫 Zugang verweigert', result.error);
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('🚫 System-Fehler', 'Verbindung zur Zentrale fehlgeschlagen.');
    }
  };

  return (
    <SafeAreaView style={styles.loginContainer}>
      <StatusBar barStyle="light-content" backgroundColor={colors.darkBase} />
      
      <KeyboardAvoidingView 
        style={styles.loginContent}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.logoContainer}>
          <Animated.View 
            style={[
              styles.logoCircle, 
              { transform: [{ scale: pulseAnim }] }
            ]}
          >
            <Ionicons name="shield-checkmark" size={64} color={colors.primaryNeon} />
          </Animated.View>
          
          <Text style={styles.appTitle}>STADTWACHE</Text>
          <Text style={styles.appSubtitle}>SICHERHEITSZENTRALE • SYSTEM V2.0</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>BENUTZER-ID</Text>
            <TextInput
              style={styles.cyberInput}
              value={email}
              onChangeText={setEmail}
              placeholder="operator@stadtwache.sys"
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>ZUGANGS-CODE</Text>
            <TextInput
              style={styles.cyberInput}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••••••"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
            />
          </View>

          <NeonButton
            title={loading ? "AUTHENTIFIZIERUNG..." : "SYSTEM ZUGANG"}
            icon={loading ? undefined : "log-in"}
            onPress={handleLogin}
            disabled={!email.trim() || !password.trim() || loading}
            style={{ marginTop: 24 }}
          />
          
          {loading && (
            <View style={{ alignItems: 'center', marginTop: 16 }}>
              <ActivityIndicator color={colors.primaryNeon} size="large" />
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>STADTWACHE ZENTRALE</Text>
          <Text style={styles.statusText}>🟢 SICHERE VERBINDUNG AKTIV</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// 🏠 ULTRA-MODERN MAIN DASHBOARD
const CyberDashboard = ({ appConfig, setAppConfig }) => {
  const { user, logout, token, updateUser } = useAuth();
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState('home');
  const [stats, setStats] = useState({ incidents: 0, officers: 0, messages: 0 });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Mock Dashboard Data - Replace with real API calls
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Mock data - replace with real API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStats({
        incidents: 12,
        officers: 8,
        messages: 24
      });
    } catch (error) {
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor={colors.darkBase} />
      
      {/* Header */}
      <HolographicCard style={{ margin: 16, marginBottom: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ color: colors.primaryNeon, fontSize: 24, fontWeight: '900', letterSpacing: 1 }}>
              STADTWACHE
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 14 }}>
              Operator: {user?.username?.toUpperCase()}
            </Text>
          </View>
          
          <TouchableOpacity onPress={logout}>
            <Ionicons name="power" size={28} color={colors.warningNeon} />
          </TouchableOpacity>
        </View>
      </HolographicCard>

      {/* Dashboard Content */}
      <ScrollView 
        style={{ flex: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Status Cards */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 8 }}>
          <HolographicCard style={{ flex: 1, alignItems: 'center' }}>
            <Ionicons name="warning" size={32} color={colors.warningNeon} />
            <Text style={{ color: colors.warningNeon, fontSize: 28, fontWeight: '900', marginTop: 8 }}>
              {stats.incidents}
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 12, textAlign: 'center' }}>
              AKTIVE VORFÄLLE
            </Text>
          </HolographicCard>
          
          <HolographicCard style={{ flex: 1, alignItems: 'center' }}>
            <Ionicons name="people" size={32} color={colors.accentNeon} />
            <Text style={{ color: colors.accentNeon, fontSize: 28, fontWeight: '900', marginTop: 8 }}>
              {stats.officers}
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 12, textAlign: 'center' }}>
              EINHEITEN IM DIENST
            </Text>
          </HolographicCard>
          
          <HolographicCard style={{ flex: 1, alignItems: 'center' }}>
            <Ionicons name="chatbubbles" size={32} color={colors.secondaryNeon} />
            <Text style={{ color: colors.secondaryNeon, fontSize: 28, fontWeight: '900', marginTop: 8 }}>
              {stats.messages}
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 12, textAlign: 'center' }}>
              NACHRICHTEN
            </Text>
          </HolographicCard>
        </View>

        {/* Quick Actions */}
        <HolographicCard style={{ margin: 16 }}>
          <Text style={{ color: colors.primaryNeon, fontSize: 18, fontWeight: '700', marginBottom: 16, letterSpacing: 1 }}>
            SCHNELL-AKTIONEN
          </Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <NeonButton
              title="SOS"
              icon="warning"
              variant="danger"
              onPress={() => Alert.alert('🚨 SOS', 'Notfall-Alarm System aktiviert')}
              style={{ flex: 1, marginRight: 8 }}
            />
            
            <NeonButton
              title="VORFALL"
              icon="add-circle"
              variant="primary"
              onPress={() => Alert.alert('📝', 'Neuen Vorfall melden')}
              style={{ flex: 1, marginLeft: 8 }}
            />
          </View>
        </HolographicCard>

        {/* Recent Activity */}
        <HolographicCard style={{ margin: 16 }}>
          <Text style={{ color: colors.primaryNeon, fontSize: 18, fontWeight: '700', marginBottom: 16, letterSpacing: 1 }}>
            LETZTE AKTIVITÄT
          </Text>
          
          {[1,2,3].map((item, index) => (
            <View key={index} style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              paddingVertical: 12,
              borderBottomWidth: index < 2 ? 1 : 0,
              borderBottomColor: colors.darkBorder
            }}>
              <Ionicons 
                name={index === 0 ? "warning" : index === 1 ? "checkmark-circle" : "chatbubble"} 
                size={24} 
                color={index === 0 ? colors.warningNeon : index === 1 ? colors.accentNeon : colors.secondaryNeon} 
              />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ color: colors.textPrimary, fontSize: 14, fontWeight: '600' }}>
                  {index === 0 ? "Neuer Vorfall gemeldet" : index === 1 ? "Einsatz abgeschlossen" : "Team-Nachricht erhalten"}
                </Text>
                <Text style={{ color: colors.textMuted, fontSize: 12 }}>
                  vor {index + 1} Min
                </Text>
              </View>
            </View>
          ))}
        </HolographicCard>
      </ScrollView>

      {/* Bottom Navigation */}
      <HolographicCard style={{ margin: 16, marginTop: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          {[
            { id: 'home', icon: 'home', label: 'ZENTRALE' },
            { id: 'team', icon: 'people', label: 'EINHEITEN' },
            { id: 'incidents', icon: 'warning', label: 'VORFÄLLE' },
            { id: 'messages', icon: 'chatbubbles', label: 'KOMM' },
          ].map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={{ alignItems: 'center', padding: 8, flex: 1 }}
              onPress={() => setActiveTab(tab.id)}
            >
              <Ionicons 
                name={tab.icon} 
                size={24} 
                color={activeTab === tab.id ? colors.primaryNeon : colors.textMuted} 
              />
              <Text style={{ 
                color: activeTab === tab.id ? colors.primaryNeon : colors.textMuted, 
                fontSize: 10, 
                fontWeight: '600',
                marginTop: 4,
                letterSpacing: 0.5
              }}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </HolographicCard>
    </SafeAreaView>
  );
};

// 🚀 MAIN APP COMPONENT
const App = () => {
  const [appConfig, setAppConfig] = useState({
    app_name: "Stadtwache",
    organization_name: "Sicherheitszentrale",
    primary_color: CyberTheme.primaryNeon,
    secondary_color: CyberTheme.secondaryNeon,
  });

  return (
    <ThemeProvider appConfig={appConfig}>
      <AuthProvider>
        <AppContent appConfig={appConfig} setAppConfig={setAppConfig} />
      </AuthProvider>
    </ThemeProvider>
  );
};

const AppContent = ({ appConfig, setAppConfig }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={[styles.mainContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <Animated.View style={styles.logoCircle}>
          <Ionicons name="shield-checkmark" size={64} color={CyberTheme.primaryNeon} />
        </Animated.View>
        <Text style={[styles.appTitle, { marginTop: 24 }]}>STADTWACHE</Text>
        <Text style={[styles.appSubtitle, { marginTop: 8 }]}>SYSTEM WIRD GELADEN...</Text>
        <ActivityIndicator color={CyberTheme.primaryNeon} size="large" style={{ marginTop: 24 }} />
      </View>
    );
  }

  if (!user) {
    return <CyberLoginScreen appConfig={appConfig} />;
  }

  return <CyberDashboard appConfig={appConfig} setAppConfig={setAppConfig} />;
};

export default App;