import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import eventService from '../../services/eventService';
import { useToast } from '../../contexts/ToastContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import colors from '../../constants/colors';
import { formatPrice } from '../../utils/format';

export default function CheckoutScreen() {
  const { data } = useLocalSearchParams();
  const router = useRouter();
  const { showToast } = useToast();

  const booking = data ? JSON.parse(data) : null;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [idNumber, setIdNumber] = useState('');

  const { data: event } = useQuery({
    queryKey: ['checkout-event', booking?.eventId],
    queryFn: () => eventService.getEventById(booking?.eventId),
    enabled: !!booking?.eventId,
  });

  if (!booking || !event) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>NO ACTIVE CHECKOUT SESSION</Text>
        <Button variant="primary" onPress={() => router.replace('/(tabs)/discover')}>
          BROWSE CONCERTS
        </Button>
      </View>
    );
  }

  const subtotal = booking.totalPrice;
  const adminFee = 25000;
  const governmentTax = Math.floor(subtotal * 0.1);
  const finalTotal = subtotal + adminFee + governmentTax;

  const handleProceed = () => {
    if (!fullName || !email || !idNumber) {
      showToast('Please fill in all attendee fields', 'error');
      return;
    }
    if (!email.includes('@')) {
      showToast('Please enter a valid email', 'error');
      return;
    }
    if (idNumber.length < 8) {
      showToast('Please enter a valid National ID Number', 'error');
      return;
    }

    const payload = {
      booking,
      attendee: { fullName, email, idNumber },
      finalTotal,
    };

    router.push({
      pathname: '/payment',
      params: { data: JSON.stringify(payload) },
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backText}>← ABANDON CHECKOUT</Text>
      </Pressable>

      <Text style={styles.pageTitle}>CHECKOUT PROTOCOL</Text>

      {/* Progress Steps */}
      <View style={styles.stepsRow}>
        <View style={styles.stepActive}>
          <Text style={styles.stepNumActive}>1</Text>
          <Text style={styles.stepTextActive}>ATTENDEE</Text>
        </View>
        <Text style={styles.stepArrow}>→</Text>
        <View style={styles.stepInactive}>
          <Text style={styles.stepNumInactive}>2</Text>
          <Text style={styles.stepTextInactive}>PAYMENT</Text>
        </View>
        <Text style={styles.stepArrow}>→</Text>
        <View style={styles.stepInactive}>
          <Text style={styles.stepNumInactive}>3</Text>
          <Text style={styles.stepTextInactive}>GENERATE</Text>
        </View>
      </View>

      {/* Form Card */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>HOLDER IDENTIFICATION DETAILS</Text>

        <Input
          label="Full Name (As in ID Card)"
          value={fullName}
          onChangeText={setFullName}
          placeholder="E.g. Alif Alfathar"
        />

        <Input
          label="Email Address (Ticket Delivery)"
          value={email}
          onChangeText={setEmail}
          placeholder="alif@domain.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Input
          label="National ID Number (NIK / Passport)"
          value={idNumber}
          onChangeText={setIdNumber}
          placeholder="327xxxxxxxxxxxxx"
          keyboardType="numeric"
        />

        <Button variant="primary" onPress={handleProceed} style={styles.submitBtn}>
          VERIFY & PROCEED →
        </Button>
      </View>

      {/* Order Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.cardHeader}>PASS PURCHASE SUMMARY</Text>

        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventSub}>{event.subtitle}</Text>
        <Text style={styles.categoryBadge}>{booking.categoryName}</Text>

        <View style={styles.breakdownRow}>
          <Text style={styles.bdLabel}>Passes Subtotal</Text>
          <Text style={styles.bdValue}>{formatPrice(subtotal)}</Text>
        </View>
        <View style={styles.breakdownRow}>
          <Text style={styles.bdLabel}>System Booking Fee</Text>
          <Text style={styles.bdValue}>{formatPrice(adminFee)}</Text>
        </View>
        <View style={styles.breakdownRow}>
          <Text style={styles.bdLabel}>Government Tax (10%)</Text>
          <Text style={styles.bdValue}>{formatPrice(governmentTax)}</Text>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>TOTAL CHARGE</Text>
          <Text style={styles.totalValue}>{formatPrice(finalTotal)}</Text>
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
    padding: 16,
    paddingTop: 54,
    paddingBottom: 32,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    color: colors.accent,
    fontSize: 12,
    fontFamily: 'Courier',
    fontWeight: '700',
    marginBottom: 16,
  },
  backBtn: {
    marginBottom: 16,
  },
  backText: {
    color: colors.textMuted,
    fontSize: 10,
    fontFamily: 'Courier',
    fontWeight: '700',
  },
  pageTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontFamily: 'Courier',
    fontWeight: '900',
    marginBottom: 16,
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  stepActive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stepNumActive: {
    color: colors.primary,
    fontSize: 10,
    fontFamily: 'Courier',
    fontWeight: '900',
  },
  stepTextActive: {
    color: colors.primary,
    fontSize: 10,
    fontFamily: 'Courier',
    fontWeight: '900',
  },
  stepInactive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stepNumInactive: {
    color: colors.textMuted,
    fontSize: 10,
    fontFamily: 'Courier',
  },
  stepTextInactive: {
    color: colors.textMuted,
    fontSize: 10,
    fontFamily: 'Courier',
  },
  stepArrow: {
    color: colors.border,
    fontSize: 10,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 6,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    color: colors.textMuted,
    fontSize: 9,
    fontFamily: 'Courier',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 16,
  },
  submitBtn: {
    marginTop: 8,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 6,
    padding: 16,
  },
  eventTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Courier',
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  eventSub: {
    color: colors.textMuted,
    fontSize: 9,
    fontFamily: 'Courier',
    marginBottom: 6,
  },
  categoryBadge: {
    color: colors.primary,
    fontSize: 9,
    fontFamily: 'Courier',
    fontWeight: '700',
    marginBottom: 16,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  bdLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontFamily: 'Courier',
  },
  bdValue: {
    color: '#ffffff',
    fontSize: 10,
    fontFamily: 'Courier',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopColor: '#18181b',
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 12,
  },
  totalLabel: {
    color: '#ffffff',
    fontSize: 11,
    fontFamily: 'Courier',
    fontWeight: '900',
  },
  totalValue: {
    color: colors.primary,
    fontSize: 16,
    fontFamily: 'Courier',
    fontWeight: '900',
  },
});
