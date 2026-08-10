import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import orderService from '../../services/orderService';
import { useQuery } from '@tanstack/react-query';
import eventService from '../../services/eventService';
import { useToast } from '../../contexts/ToastContext';
import Button from '../../components/ui/Button';
import colors from '../../constants/colors';
import { formatPrice } from '../../utils/format';

export default function PaymentScreen() {
  const { data } = useLocalSearchParams();
  const router = useRouter();
  const { showToast } = useToast();

  const payload = data ? JSON.parse(data) : null;
  const [method, setMethod] = useState('qris'); // qris | va
  const [processing, setProcessing] = useState(false);

  const { data: event } = useQuery({
    queryKey: ['payment-event', payload?.booking?.eventId],
    queryFn: () => eventService.getEventById(payload?.booking?.eventId),
    enabled: !!payload?.booking?.eventId,
  });

  if (!payload || !event) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>PAYMENT SESSION EXPIRED</Text>
        <Button variant="primary" onPress={() => router.replace('/(tabs)/discover')}>
          RETURN TO DISCOVER
        </Button>
      </View>
    );
  }

  const handlePay = async () => {
    setProcessing(true);
    try {
      const order = await orderService.createOrder(payload.booking, payload.attendee, event);
      showToast('Transaction Approved! Generating tickets...', 'success');
      router.replace({
        pathname: '/payment/success',
        params: { orderId: order.orderId },
      });
    } catch (err) {
      showToast('Payment processing failed', 'error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backText}>← EDIT ATTENDEE INFO</Text>
      </Pressable>

      <Text style={styles.pageTitle}>SECURED PAYMENT</Text>

      {/* Payment Method Selector */}
      <View style={styles.methodRow}>
        <Pressable
          onPress={() => setMethod('qris')}
          style={[styles.methodCard, method === 'qris' && styles.methodCardSelected]}
        >
          <Text style={styles.methodIcon}>📱</Text>
          <Text style={[styles.methodText, method === 'qris' && styles.methodTextSelected]}>
            QRIS INSTANT
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setMethod('va')}
          style={[styles.methodCard, method === 'va' && styles.methodCardSelected]}
        >
          <Text style={styles.methodIcon}>💳</Text>
          <Text style={[styles.methodText, method === 'va' && styles.methodTextSelected]}>
            VIRTUAL ACCOUNT
          </Text>
        </Pressable>
      </View>

      {/* Dynamic Payment Box */}
      {method === 'qris' ? (
        <View style={styles.paymentBox}>
          <View style={styles.qrPlaceholder}>
            <Text style={styles.qrText}>MOCK QRIS BARCODE</Text>
            <Text style={styles.qrSub}>SCAN VIA ANY BANKING APP</Text>
          </View>
        </View>
      ) : (
        <View style={styles.paymentBox}>
          <View style={styles.vaRow}>
            <Text style={styles.vaLabel}>BANK PARTNER</Text>
            <Text style={styles.vaVal}>BCA / MANDIRI / BNI</Text>
          </View>
          <View style={styles.vaRow}>
            <Text style={styles.vaLabel}>ACCOUNT NO</Text>
            <Text style={styles.vaValHighlight}>8930 2003 1204 9011</Text>
          </View>
          <View style={styles.vaRow}>
            <Text style={styles.vaLabel}>RECEIPT NAME</Text>
            <Text style={styles.vaVal}>ECHOTIC TICKET INTL</Text>
          </View>
        </View>
      )}

      {/* Timer warning */}
      <View style={styles.warningBox}>
        <Text style={styles.warningText}>
          ⚠️ Complete payment within 10 minutes. Unpaid tickets will be released back to the general pool.
        </Text>
      </View>

      <Button
        variant="primary"
        onPress={handlePay}
        loading={processing}
        style={styles.payBtn}
      >
        CONFIRM & PAY {formatPrice(payload.finalTotal)}
      </Button>
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
    marginBottom: 20,
  },
  methodRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  methodCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    padding: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  methodCardSelected: {
    borderColor: colors.secondary,
    backgroundColor: 'rgba(0,240,255,0.05)',
  },
  methodIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  methodText: {
    color: colors.textMuted,
    fontSize: 9,
    fontFamily: 'Courier',
    fontWeight: '700',
  },
  methodTextSelected: {
    color: colors.secondary,
    fontWeight: '900',
  },
  paymentBox: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 6,
    padding: 20,
    marginBottom: 16,
  },
  qrPlaceholder: {
    height: 160,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    padding: 12,
  },
  qrText: {
    color: '#000000',
    fontSize: 14,
    fontFamily: 'Courier',
    fontWeight: '900',
    marginBottom: 4,
  },
  qrSub: {
    color: colors.textMuted,
    fontSize: 8,
    fontFamily: 'Courier',
  },
  vaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomColor: '#18181b',
    borderBottomWidth: 1,
  },
  vaLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontFamily: 'Courier',
  },
  vaVal: {
    color: '#ffffff',
    fontSize: 10,
    fontFamily: 'Courier',
    fontWeight: '700',
  },
  vaValHighlight: {
    color: colors.secondary,
    fontSize: 11,
    fontFamily: 'Courier',
    fontWeight: '900',
  },
  warningBox: {
    backgroundColor: 'rgba(0,240,255,0.05)',
    borderColor: 'rgba(0,240,255,0.2)',
    borderWidth: 1,
    padding: 12,
    borderRadius: 4,
    marginBottom: 20,
  },
  warningText: {
    color: colors.secondary,
    fontSize: 10,
    fontFamily: 'Courier',
    lineHeight: 14,
  },
  payBtn: {
    marginTop: 8,
  },
});
