import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Button from '../../components/ui/Button';
import colors from '../../constants/colors';

export default function PaymentSuccessScreen() {
  const { orderId } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.successIcon}>✅</Text>
        <Text style={styles.title}>TRANSACTION APPROVED</Text>
        <Text style={styles.subtitle}>
          CRYPTOGRAPHIC E-TICKET ISSUED SUCCESSFULLY
        </Text>
        <Text style={styles.orderText}>ORDER ID: {orderId}</Text>

        <Text style={styles.desc}>
          Your seats are reserved and your digital QR access code is generated. Present your code at venue gates.
        </Text>

        <Button
          variant="primary"
          onPress={() => router.replace(`/ticket/${orderId}`)}
          style={styles.viewBtn}
        >
          VIEW DIGITAL PASS →
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 6,
    padding: 28,
    alignItems: 'center',
  },
  successIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    color: colors.primary,
    fontSize: 18,
    fontFamily: 'Courier',
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 9,
    fontFamily: 'Courier',
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 12,
  },
  orderText: {
    color: colors.secondary,
    fontSize: 12,
    fontFamily: 'Courier',
    fontWeight: '700',
    marginBottom: 16,
  },
  desc: {
    color: colors.textSecondary,
    fontSize: 11,
    fontFamily: 'Courier',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 24,
  },
  viewBtn: {
    width: '100%',
  },
});
