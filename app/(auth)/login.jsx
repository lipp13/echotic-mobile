import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import colors from '../../constants/colors';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    if (!email.includes('@')) {
      showToast('Please enter a valid email', 'error');
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password);
      showToast(`Welcome back, ${user.username}!`, 'success');
      router.replace('/(tabs)');
    } catch (err) {
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Top Brand */}
      <View style={styles.header}>
        <Text style={styles.brand}>ECHOTIC.</Text>
        <Pressable onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.skipBtn}>SKIP</Text>
        </Pressable>
      </View>

      {/* Hero Headline */}
      <View style={styles.statementBox}>
        <Text style={styles.title}>
          ENTER {'\n'}THE <Text style={{ color: colors.secondary }}>STAGE.</Text>
        </Text>
        <Text style={styles.subtitle}>
          Access your gig passes, purchase history, and concert preferences in one sleek hub.
        </Text>
      </View>

      {/* Form */}
      <View style={styles.formCard}>
        <View style={styles.accentLine} />
        <Text style={styles.formTitle}>SIGN IN</Text>
        <Text style={styles.formDesc}>Enter your credentials to continue</Text>

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

        <Pressable
          onPress={() => router.push('/(auth)/forgot-password')}
          style={styles.forgotBtn}
        >
          <Text style={styles.forgotText}>FORGOT PASSWORD?</Text>
        </Pressable>

        <Button
          variant="primary"
          onPress={handleSubmit}
          loading={loading}
          style={styles.submitBtn}
        >
          AUTHENTICATE
        </Button>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>NEW TO ECHOTIC? </Text>
          <Pressable onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.registerLink}>CREATE ACCOUNT</Text>
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
    color: colors.primary,
    fontSize: 20,
    fontFamily: 'Courier',
    fontWeight: '900',
    letterSpacing: 2,
  },
  skipBtn: {
    color: colors.textMuted,
    fontSize: 11,
    fontFamily: 'Courier',
    fontWeight: '700',
  },
  statementBox: {
    marginBottom: 32,
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
    backgroundColor: colors.primary,
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
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  forgotText: {
    color: colors.textMuted,
    fontSize: 9,
    fontFamily: 'Courier',
    fontWeight: '700',
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
  registerLink: {
    color: colors.secondary,
    fontSize: 10,
    fontFamily: 'Courier',
    fontWeight: '700',
  },
});
