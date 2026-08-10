import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useToast } from '../../contexts/ToastContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import colors from '../../constants/colors';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('Password reset link sent to your email!', 'success');
      router.push('/(auth)/login');
    }, 1200);
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backText}>← BACK TO LOGIN</Text>
      </Pressable>

      <Text style={styles.title}>RECOVER ACCESS</Text>
      <Text style={styles.subtitle}>
        Enter your registered email address and we will dispatch a cryptographic reset code.
      </Text>

      <View style={styles.card}>
        <Input
          label="Registered Email"
          value={email}
          onChangeText={setEmail}
          placeholder="name@domain.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Button
          variant="secondary"
          onPress={handleSubmit}
          loading={loading}
          style={styles.submitBtn}
        >
          DISPATCH RESET LINK
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    paddingTop: 60,
  },
  backBtn: {
    marginBottom: 24,
  },
  backText: {
    color: colors.textMuted,
    fontSize: 10,
    fontFamily: 'Courier',
    fontWeight: '700',
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontFamily: 'Courier',
    fontWeight: '900',
    marginBottom: 8,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 11,
    fontFamily: 'Courier',
    lineHeight: 16,
    marginBottom: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 6,
    padding: 20,
  },
  submitBtn: {
    marginTop: 12,
  },
});
