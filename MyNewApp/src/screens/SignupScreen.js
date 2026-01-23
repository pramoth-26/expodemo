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
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  /**
   * Handle Firebase Signup
   */
  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      Alert.alert('Success', 'Account created successfully');
    } catch (error) {
      Alert.alert('Signup Failed', error.message);
    }
  };

  return (
    <LinearGradient
      colors={['#0E1A24', '#1A2633']}
      style={styles.container}
    >
      
        {/* Title */}
        <Text style={styles.brand}>Create Account</Text>
        <Text style={styles.subtitle}>
          Join 1.5M+ NEET aspirants using NEETWise
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
            placeholder="Create a strong password"
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

        {/* Sign Up */}
        <TouchableOpacity activeOpacity={0.8} onPress={handleSignup}>
          <LinearGradient
            colors={['#FF8A00', '#FF5F00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.signUpBtn}
          >
            <Text style={styles.signUpText}>Sign Up</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Already have account */}
        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginText}>
            Already have an account?{' '}
            <Text style={styles.loginHighlight}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      
    </LinearGradient>
  );
};

export default SignupScreen;

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

  brand: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 6,
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

  signUpBtn: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },

  signUpText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },

  loginLink: {
    alignItems: 'center',
  },

  loginText: {
    color: '#8FA1B2',
    fontSize: 13,
  },

  loginHighlight: {
    color: '#FF8A00',
    fontWeight: '700',
  },
});
