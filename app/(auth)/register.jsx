import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import colors from '../../constants/colors';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const { showToast } = useToast();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!username || !email || !password || !confirmPassword) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    if (!email.includes('@')) {
      showToast('Please enter a valid email', 'error');
      return;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setLoading(true);
    try {
      const user = await register(username, email, password, confirmPassword);
      showToast(`Account created! Welcome, ${user.username}!`, 'success');
      router.replace('/(tabs)');
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Top Brand */}
      <View style={styles.header}>
        <Text style={[styles.brand, { color: colors.accent }]}>ECHOTIC.</Text>
        <Pressable onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.loginBtnText}>SIGN IN</Text>
        </Pressable>
      </View>

      {/* Hero Headline */}
      <View style={styles.statementBox}>
        <Text style={styles.title}>
          JOIN {'\n'}THE <Text style={{ color: colors.primary }}>PIT.</Text>
        </Text>
        <Text style={styles.subtitle}>
          Create an account to track tickets, secure early access pre-sales, and customize festival alerts.
        </Text>
      </View>

      {/* Form */}
      <View style={styles.formCard}>
        <View style={[styles.accentLine, { backgroundColor: colors.accent }]} />
        <Text style={styles.formTitle}>CREATE ACCOUNT</Text>
        <Text style={styles.formDesc}>Fill in details to register</Text>

        <Input
          label="Username"
          value={username}
          onChangeText={setUsername}
          placeholder="musiclover101"
          autoCapitalize="none"
        />

        <Input
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          placeholder="name@domain.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
        />

        <Input
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="••••••••"
          secureTextEntry
        />

        <Button
          variant="pink"
          onPress={handleSubmit}
          loading={loading}
          style={styles.submitBtn}
        >
          CREATE ACCOUNT
        </Button>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>ALREADY REGISTERED? </Text>
          <Pressable onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.loginLink}>SIGN IN NOW</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  brand: {
    fontSize: 20,
    fontFamily: 'Courier',
    fontWeight: '900',
    letterSpacing: 2,
  },
  loginBtnText: {
    color: colors.textMuted,
    fontSize: 11,
    fontFamily: 'Courier',
    fontWeight: '700',
  },
  statementBox: {
    marginBottom: 28,
  },
  title: {
    color: '#ffffff',
    fontSize: 36,
    fontFamily: 'Courier',
    fontWeight: '900',
    lineHeight: 40,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 11,
    fontFamily: 'Courier',
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  formCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 6,
    padding: 20,
    position: 'relative',
  },
  accentLine: {
    position: 'absolute',
    top: 0,
    right: 20,
    width: 40,
    height: 2,
  },
  formTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'Courier',
    fontWeight: '900',
    marginBottom: 2,
  },
  formDesc: {
    color: colors.textMuted,
    fontSize: 10,
    fontFamily: 'Courier',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  submitBtn: {
    marginTop: 8,
    marginBottom: 16,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderTopColor: '#18181b',
    borderTopWidth: 1,
    paddingTop: 16,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 10,
    fontFamily: 'Courier',
  },
  loginLink: {
    color: colors.primary,
    fontSize: 10,
    fontFamily: 'Courier',
    fontWeight: '700',
  },
});
