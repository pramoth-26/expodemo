import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { signInWithEmailAndPassword, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth, GOOGLE_SIGN_IN_KEY } from '../firebase';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: GOOGLE_SIGN_IN_KEY,
    iosClientId: GOOGLE_SIGN_IN_KEY,
    androidClientId: GOOGLE_SIGN_IN_KEY,
    redirectUrl: 'https://auth.expo.io/',
    scopes: ['profile', 'email'],
    usePKCE: false,
  });

  /**
   * Handle Firebase Login
   */
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email or password');
    }
  };

  /**
   * Handle Google Sign-In
   */
  const handleGoogleSignIn = async () => {
    try {
      const result = await promptAsync();
      if (result?.type === 'success') {
        const { id_token } = result.params;
        const credential = GoogleAuthProvider.credential(id_token);
        await signInWithCredential(auth, credential);
        Alert.alert('Success', 'Logged in with Google successfully');
      }
    } catch (error) {
      Alert.alert('Google Sign-In Error', error.message || 'Failed to sign in with Google');
    }
  };

  return (
    <LinearGradient
      colors={['#0E1A24', '#1A2633']}
      style={styles.container}
    >
      
        {/* Title */}
        <Text style={styles.title}>Welcome to</Text>
        <Text style={styles.brand}>NEETWise</Text>
        <Text style={styles.subtitle}>
          Sign in or create an account to continue
        </Text>

        {/* Email */}
        <Text style={styles.label}>Email ID</Text>
        <TextInput
          placeholder="you@example.com"
          placeholderTextColor="#8FA1B2"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordBox}>
          <TextInput
            placeholder="Enter your password"
            placeholderTextColor="#8FA1B2"
            secureTextEntry={!showPassword}
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
  <Ionicons
    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
    size={18}
    color="#8FA1B2"
  />
</TouchableOpacity>

        </View>

        {/* Sign In */}
        <TouchableOpacity activeOpacity={0.8} onPress={handleLogin}>
          <LinearGradient
            colors={['#FF8A00', '#FF5F00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.signInBtn}
          >
            <Text style={styles.signInText}>Sign In</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Create Account */}
        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={styles.createText}>Create Account</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.line} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.line} />
        </View>

        {/* Social Buttons (UI Only for now) */}
        <View style={styles.socialRow}>
          <SocialButton icon="logo-google" onPress={handleGoogleSignIn} />
          <SocialButton icon="logo-facebook" />
          <SocialButton icon="logo-apple" />
        </View>
      
    </LinearGradient>
  );
};

const SocialButton = ({ icon, onPress }) => (
  <TouchableOpacity style={styles.socialBtn} onPress={onPress}>
    <Ionicons name={icon} size={22} color="#fff" />
  </TouchableOpacity>
);

export default LoginScreen;

/* ================== STYLES ================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E1A24',
    justifyContent: 'center',
    padding: 16,
  },

  card: {
    backgroundColor: '#1E2C39',
    borderRadius: 26,
    padding: 24,
  },

  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
  },

  brand: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 4,
  },

  subtitle: {
    color: '#8FA1B2',
    fontSize: 13,
    marginBottom: 28,
  },

  label: {
    color: '#8FA1B2',
    fontSize: 12,
    marginBottom: 6,
  },

  input: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#2B3A48',
    paddingHorizontal: 14,
    color: '#fff',
    marginBottom: 18,
  },

  passwordBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 10,
    backgroundColor: '#2B3A48',
    paddingHorizontal: 14,
    marginBottom: 24,
  },

  passwordInput: {
    flex: 1,
    color: '#fff',
  },

  signInBtn: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },

  signInText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },

  createBtn: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3B4A59',
    justifyContent: 'center',
    alignItems: 'center',
  },

  createText: {
    color: '#C5D2DE',
    fontWeight: '600',
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 22,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#3B4A59',
  },

  orText: {
    color: '#8FA1B2',
    marginHorizontal: 10,
    fontSize: 12,
  },

  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  socialBtn: {
    width: 70,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#2B3A48',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
