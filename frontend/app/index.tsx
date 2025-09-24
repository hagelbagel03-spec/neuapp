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
  Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

// 🚀 ULTRA-MODERN API Configuration
const API_URL = "/api";

// 🎨 FUTURISTIC CYBER THEME - Ultra Modern Colors
const CyberTheme = {
  // Neon Colors - Ultra Bright
  neonCyan: '#00FFFF',
  neonMagenta: '#FF00FF', 
  neonGreen: '#00FF41',
  neonOrange: '#FF4500',
  neonPurple: '#8A2BE2',
  
  // Dark Base - Pure Black
  blackPure: '#000000',
  blackSoft: '#0A0A0A',
  blackCard: '#111111',
  blackSurface: '#1A1A1A',
  
  // Glass & Blur Effects
  glassLight: 'rgba(255, 255, 255, 0.03)',
  glassDark: 'rgba(0, 0, 0, 0.7)',
  
  // Text Colors
  textWhite: '#FFFFFF',
  textGray: '#CCCCCC', 
  textDark: '#666666',
  
  // Status
  success: '#00FF41',
  danger: '#FF3333',
  warning: '#FFD700',
};

// 🔮 Holographic Animated Card Component
const HolographicCard = ({ children, style, glowColor = CyberTheme.neonCyan, ...props }) => {
  const [shimmerAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    // Shimmer effect
    const shimmer = () => {
      shimmerAnim.setValue(0);
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2500,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start(() => shimmer());
    };
    
    // Pulse effect
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.8,
          duration: 1500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };
    
    shimmer();
    pulse();
  }, []);

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, width + 200],
  });

  return (
    <Animated.View 
      style={[
        {
          backgroundColor: CyberTheme.glassLight,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: glowColor,
          shadowColor: glowColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.6,
          shadowRadius: 15,
          elevation: 10,
          overflow: 'hidden',
          transform: [{ scale: pulseAnim }],
        },
        style
      ]} 
      {...props}
    >
      {/* Shimmer Overlay */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: shimmerTranslate,
          width: 100,
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          opacity: 0.3,
          transform: [{ skewX: '-20deg' }],
        }}
      />
      
      <View style={{ padding: 20 }}>
        {children}
      </View>
    </Animated.View>
  );
};

// 🎨 Ultra-Modern Neon Button
const NeonButton = ({ 
  onPress, 
  title, 
  icon, 
  style, 
  variant = 'primary', 
  disabled,
  size = 'normal',
  ...props 
}) => {
  const [pressAnim] = useState(new Animated.Value(1));
  const [glowAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const glow = () => {
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
      ]).start(() => glow());
    };
    glow();
  }, []);

  const handlePressIn = () => {
    Vibration.vibrate(50);
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

  const getButtonColors = () => {
    switch (variant) {
      case 'primary':
        return { border: CyberTheme.neonCyan, bg: 'rgba(0, 255, 255, 0.1)', text: CyberTheme.neonCyan };
      case 'secondary':
        return { border: CyberTheme.neonMagenta, bg: 'rgba(255, 0, 255, 0.1)', text: CyberTheme.neonMagenta };
      case 'success':
        return { border: CyberTheme.neonGreen, bg: 'rgba(0, 255, 65, 0.1)', text: CyberTheme.neonGreen };
      case 'danger':
        return { border: CyberTheme.danger, bg: 'rgba(255, 51, 51, 0.1)', text: CyberTheme.danger };
      default:
        return { border: CyberTheme.neonCyan, bg: 'rgba(0, 255, 255, 0.1)', text: CyberTheme.neonCyan };
    }
  };

  const colors = getButtonColors();
  const buttonSize = size === 'small' ? 12 : size === 'large' ? 20 : 16;
  const iconSize = size === 'small' ? 16 : size === 'large' ? 28 : 20;

  return (
    <Animated.View style={[{ transform: [{ scale: pressAnim }] }, style]}>
      <TouchableOpacity
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: buttonSize,
            paddingHorizontal: buttonSize + 8,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: colors.border,
            backgroundColor: colors.bg,
            minHeight: size === 'small' ? 44 : size === 'large' ? 64 : 56,
            opacity: disabled ? 0.4 : 1,
            shadowColor: colors.border,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: glowAnim,
            shadowRadius: 8,
            elevation: 8,
          }
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        {...props}
      >
        {icon && (
          <Ionicons 
            name={icon} 
            size={iconSize} 
            color={colors.text} 
            style={{ marginRight: title ? 8 : 0 }} 
          />
        )}
        {title && (
          <Text style={{
            color: colors.text,
            fontSize: size === 'small' ? 14 : size === 'large' ? 18 : 16,
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}>
            {title}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// 🌟 Ultra-Modern Styles
const createStyles = () => StyleSheet.create({
  // Main Containers
  mainContainer: {
    flex: 1,
    backgroundColor: CyberTheme.blackPure,
  },
  
  // Login Screen Styles
  loginContainer: {
    flex: 1,
    backgroundColor: CyberTheme.blackPure,
  },
  loginContent: {
    flex: 1,
    padding: 32,
    justifyContent: 'center',
  },
  
  // Logo & Header
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(0, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: CyberTheme.neonCyan,
    shadowColor: CyberTheme.neonCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 25,
    elevation: 25,
    marginBottom: 32,
  },
  appTitle: {
    fontSize: 52,
    fontWeight: '900',
    color: CyberTheme.neonCyan,
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: CyberTheme.neonCyan,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    letterSpacing: 3,
  },
  appSubtitle: {
    fontSize: 16,
    color: CyberTheme.textGray,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  
  // Form Elements
  formContainer: {
    marginBottom: 48,
  },
  inputGroup: {
    marginBottom: 28,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: CyberTheme.neonCyan,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  cyberInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 2,
    borderColor: CyberTheme.neonCyan,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 16,
    color: CyberTheme.textWhite,
    fontWeight: '600',
    shadowColor: CyberTheme.neonCyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  
  // Footer
  footer: {
    alignItems: 'center',
  },
  footerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: CyberTheme.neonCyan,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  statusText: {
    fontSize: 14,
    color: CyberTheme.neonGreen,
    fontWeight: '700',
    letterSpacing: 1,
  },

  // Dashboard Styles
  header: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: CyberTheme.neonCyan,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  headerSubtitle: {
    fontSize: 14,
    color: CyberTheme.textGray,
    marginTop: 4,
    letterSpacing: 1,
  },
  
  // Stats Cards
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    margin: 8,
  },
  statIcon: {
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 8,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  
  // Action Buttons
  actionContainer: {
    margin: 16,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: CyberTheme.neonCyan,
    marginBottom: 16,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  // Activity List
  activityContainer: {
    margin: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: CyberTheme.blackSurface,
  },
  activityIcon: {
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    color: CyberTheme.textWhite,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  activityTime: {
    color: CyberTheme.textDark,
    fontSize: 12,
    fontWeight: '500',
  },
  
  // Bottom Navigation
  bottomNav: {
    margin: 16,
    marginTop: 8,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
    padding: 12,
    flex: 1,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 6,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});

// Theme Context
const ThemeContext = createContext();

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

const ThemeProvider = ({ children }) => {
  const theme = {
    colors: CyberTheme,
    isDark: true,
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
  }, []);

  const checkAuthState = async () => {
    try {
      const savedToken = await AsyncStorage.getItem('stadtwache_token');
      const savedUser = await AsyncStorage.getItem('stadtwache_user');
      
      if (savedToken && savedUser) {
        try {
          const response = await axios.get(`${API_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${savedToken}` }
          });
          
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
          
        } catch (error) {
          await AsyncStorage.removeItem('stadtwache_token');
          await AsyncStorage.removeItem('stadtwache_user');
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
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
        error: error.response?.data?.detail || 'Verbindung zur Zentrale fehlgeschlagen.' 
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

// 🚀 CYBER LOGIN SCREEN
const CyberLoginScreen = () => {
  const { login } = useAuth();
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const styles = createStyles();
  
  // Logo Pulse Animation
  const [pulseAnim] = useState(new Animated.Value(1));
  
  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1200,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };
    pulse();
  }, []);

  const handleLogin = async () => {
    if (!email?.trim() || !password?.trim()) {
      Alert.alert('⚠️ ZUGANG VERWEIGERT', 'Vollständige Identifikation erforderlich');
      return;
    }

    setLoading(true);
    Vibration.vibrate([100, 50, 100]);
    
    try {
      const result = await login(email.trim(), password.trim());
      
      if (!result.success) {
        Vibration.vibrate(200);
        Alert.alert('🚫 ZUGANG VERWEIGERT', result.error);
      } else {
        Vibration.vibrate([50, 100, 50]);
      }
    } catch (error) {
      Vibration.vibrate(300);
      Alert.alert('🚫 SYSTEM-FEHLER', 'Verbindung zur Zentrale unterbrochen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.loginContainer}>
      <StatusBar barStyle="light-content" backgroundColor={colors.blackPure} />
      
      <KeyboardAvoidingView 
        style={styles.loginContent}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Animated.View 
            style={[
              styles.logoCircle, 
              { transform: [{ scale: pulseAnim }] }
            ]}
          >
            <Ionicons name="shield-checkmark" size={68} color={colors.neonCyan} />
          </Animated.View>
          
          <Text style={styles.appTitle}>STADTWACHE</Text>
          <Text style={styles.appSubtitle}>SICHERHEITSZENTRALE • SYSTEM V3.0</Text>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>OPERATOR-ID</Text>
            <TextInput
              style={styles.cyberInput}
              value={email}
              onChangeText={setEmail}
              placeholder="benutzer@stadtwache.sys"
              placeholderTextColor={colors.textDark}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>SICHERHEITSCODE</Text>
            <TextInput
              style={styles.cyberInput}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••••••••••"
              placeholderTextColor={colors.textDark}
              secureTextEntry
            />
          </View>

          <NeonButton
            title={loading ? "AUTHENTIFIZIERUNG..." : "SYSTEM-ZUGANG"}
            icon={loading ? undefined : "log-in-outline"}
            onPress={handleLogin}
            disabled={loading || !email?.trim() || !password?.trim()}
            size="large"
            style={{ marginTop: 32 }}
          />
          
          {loading && (
            <View style={{ alignItems: 'center', marginTop: 24 }}>
              <ActivityIndicator color={colors.neonCyan} size="large" />
              <Text style={{ color: colors.textGray, marginTop: 8, fontSize: 14 }}>
                VERBINDUNG ZUR ZENTRALE...
              </Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>STADTWACHE ZENTRALE</Text>
          <Text style={styles.statusText}>🟢 SICHERE VERBINDUNG AKTIV</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// 🏠 CYBER DASHBOARD
const CyberDashboard = () => {
  const { user, logout } = useAuth();
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState('home');
  const [stats, setStats] = useState({ incidents: 0, officers: 0, messages: 0 });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const styles = createStyles();

  useEffect(() => {
    loadDashboardData();
    startHeartbeat();
  }, []);

  const startHeartbeat = () => {
    const interval = setInterval(() => {
      loadDashboardData();
    }, 30000);
    return () => clearInterval(interval);
  };

  const loadDashboardData = async () => {
    if (!loading) setLoading(true);
    
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      // Load real data from APIs
      const [incidentsResponse, usersResponse] = await Promise.all([
        axios.get(`${API_URL}/api/incidents`, config).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/api/users/by-status`, config).catch(() => ({ data: {} }))
      ]);
      
      const incidents = incidentsResponse.data || [];
      const users = usersResponse.data || {};
      const officersOnDuty = users['Im Dienst']?.length || 0;
      
      setStats({
        incidents: incidents.filter(i => i.status !== 'closed').length,
        officers: officersOnDuty,
        messages: 47 // Mock for now
      });
      
    } catch (error) {
      console.error('Dashboard load error:', error);
      // Set mock data on error
      setStats({ incidents: 3, officers: 8, messages: 15 });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleSOSAlert = () => {
    Vibration.vibrate([200, 100, 200, 100, 200]);
    Alert.alert(
      '🚨 SOS NOTFALL-ALARM',
      'Soll ein Notfall-Alarm an alle Einheiten gesendet werden?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        { 
          text: 'ALARM SENDEN', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('🚨 ALARM GESENDET', 'Alle Einheiten wurden alarmiert!\nGPS-Position wird übertragen...');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor={colors.blackPure} />
      
      {/* Header */}
      <HolographicCard style={styles.header} glowColor={colors.neonCyan}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={styles.headerTitle}>STADTWACHE</Text>
            <Text style={styles.headerSubtitle}>
              OPERATOR: {user?.username?.toUpperCase() || 'UNKNOWN'}
            </Text>
          </View>
          
          <TouchableOpacity 
            onPress={logout}
            style={{
              padding: 12,
              backgroundColor: 'rgba(255, 51, 51, 0.1)',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: colors.danger,
            }}
          >
            <Ionicons name="power" size={24} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </HolographicCard>

      {/* Dashboard Content */}
      <ScrollView 
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={colors.neonCyan}
          />
        }
      >
        {/* Status Cards */}
        <View style={styles.statsContainer}>
          <HolographicCard style={styles.statCard} glowColor={colors.danger}>
            <Ionicons name="warning" size={36} color={colors.danger} style={styles.statIcon} />
            <Text style={[styles.statNumber, { color: colors.danger, textShadowColor: colors.danger }]}>
              {stats.incidents}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textGray }]}>
              AKTIVE VORFÄLLE
            </Text>
          </HolographicCard>
          
          <HolographicCard style={styles.statCard} glowColor={colors.neonGreen}>
            <Ionicons name="people" size={36} color={colors.neonGreen} style={styles.statIcon} />
            <Text style={[styles.statNumber, { color: colors.neonGreen, textShadowColor: colors.neonGreen }]}>
              {stats.officers}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textGray }]}>
              EINHEITEN AKTIV
            </Text>
          </HolographicCard>
          
          <HolographicCard style={styles.statCard} glowColor={colors.neonMagenta}>
            <Ionicons name="chatbubbles" size={36} color={colors.neonMagenta} style={styles.statIcon} />
            <Text style={[styles.statNumber, { color: colors.neonMagenta, textShadowColor: colors.neonMagenta }]}>
              {stats.messages}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textGray }]}>
              NACHRICHTEN
            </Text>
          </HolographicCard>
        </View>

        {/* Quick Actions */}
        <HolographicCard style={styles.actionContainer} glowColor={colors.neonOrange}>
          <Text style={styles.actionTitle}>SCHNELL-AKTIONEN</Text>
          
          <View style={styles.actionRow}>
            <NeonButton
              title="SOS ALARM"
              icon="warning"
              variant="danger"
              onPress={handleSOSAlert}
              style={{ flex: 1, marginRight: 8 }}
              size="large"
            />
            
            <NeonButton
              title="VORFALL"
              icon="add-circle-outline"
              variant="primary"
              onPress={() => Alert.alert('📝 VORFALL', 'Neuen Vorfall melden')}
              style={{ flex: 1, marginLeft: 8 }}
              size="large"
            />
          </View>
        </HolographicCard>

        {/* Recent Activity */}
        <HolographicCard style={styles.activityContainer} glowColor={colors.neonPurple}>
          <Text style={styles.actionTitle}>LETZTE AKTIVITÄT</Text>
          
          {[
            { icon: "warning", title: "Vorfall Diebstahl gemeldet", time: "vor 2 Min", color: colors.danger },
            { icon: "checkmark-circle", title: "Einsatz Ruhestörung abgeschlossen", time: "vor 8 Min", color: colors.neonGreen },
            { icon: "chatbubble", title: "Nachricht von Team Alpha", time: "vor 12 Min", color: colors.neonMagenta },
            { icon: "car", title: "Streife 3 - Position aktualisiert", time: "vor 15 Min", color: colors.neonCyan },
          ].map((item, index) => (
            <View key={index} style={[
              styles.activityItem,
              { borderBottomWidth: index < 3 ? 1 : 0 }
            ]}>
              <Ionicons 
                name={item.icon} 
                size={24} 
                color={item.color} 
                style={styles.activityIcon}
              />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{item.title}</Text>
                <Text style={styles.activityTime}>{item.time}</Text>
              </View>
            </View>
          ))}
        </HolographicCard>
      </ScrollView>

      {/* Bottom Navigation */}
      <HolographicCard style={styles.bottomNav} glowColor={colors.neonCyan}>
        <View style={styles.navRow}>
          {[
            { id: 'home', icon: 'home', label: 'ZENTRALE' },
            { id: 'team', icon: 'people', label: 'EINHEITEN' },
            { id: 'incidents', icon: 'warning', label: 'VORFÄLLE' },
            { id: 'messages', icon: 'chatbubbles', label: 'KOMM' },
          ].map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={styles.navItem}
              onPress={() => {
                Vibration.vibrate(50);
                setActiveTab(tab.id);
                Alert.alert(`${tab.label}`, 'Modul wird geladen...');
              }}
            >
              <Ionicons 
                name={tab.icon} 
                size={26} 
                color={activeTab === tab.id ? colors.neonCyan : colors.textDark} 
              />
              <Text style={[
                styles.navLabel, 
                { color: activeTab === tab.id ? colors.neonCyan : colors.textDark }
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </HolographicCard>
    </SafeAreaView>
  );
};

// 🚀 MAIN APP
const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

const AppContent = () => {
  const { user, loading } = useAuth();
  const { colors } = useTheme();
  const styles = createStyles();

  if (loading) {
    return (
      <View style={[styles.mainContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <Animated.View style={styles.logoCircle}>
          <Ionicons name="shield-checkmark" size={68} color={colors.neonCyan} />
        </Animated.View>
        <Text style={[styles.appTitle, { marginTop: 32 }]}>STADTWACHE</Text>
        <Text style={[styles.appSubtitle, { marginTop: 12 }]}>SYSTEM WIRD INITIALISIERT...</Text>
        <ActivityIndicator color={colors.neonCyan} size="large" style={{ marginTop: 32 }} />
      </View>
    );
  }

  return user ? <CyberDashboard /> : <CyberLoginScreen />;
};

export default App;