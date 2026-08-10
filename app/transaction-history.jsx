import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, FlatList, Pressable, StyleSheet, Image } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import orderService from '../services/orderService';
import Button from '../components/ui/Button';
import { formatPrice, formatDate } from '../utils/format';
import colors from '../constants/colors';

export default function TransactionHistoryScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
        (async () => {
          setLoading(true);
          const data = await orderService.getOrders();
          setOrders(data);
          setLoading(false);
        })();
      }
    }, [isAuthenticated])
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← BACK</Text>
        </Pressable>
        <Text style={styles.subHeader}>ORDER ARCHIVE</Text>
        <Text style={styles.pageTitle}>TRANSACTIONS.</Text>
      </View>

      {/* Stats bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{orders.length}</Text>
          <Text style={styles.statLabel}>TOTAL ORDERS</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {formatPrice(orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0))}
          </Text>
          <Text style={styles.statLabel}>TOTAL SPENT</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{orders.filter((o) => o.status === 'active').length}</Text>
          <Text style={styles.statLabel}>ACTIVE</Text>
        </View>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.orderId}
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={() => {}}
        renderItem={({ item, index }) => (
          <Pressable
            style={({ pressed }) => [styles.txCard, pressed && styles.txCardPressed]}
            onPress={() => router.push(`/ticket/${item.orderId}`)}
          >
            {/* Sequence number */}
            <View style={styles.seqBadge}>
              <Text style={styles.seqText}>#{String(index + 1).padStart(2, '0')}</Text>
            </View>

            <View style={styles.txBody}>
              <View style={styles.txTopRow}>
                <Text style={styles.txOrderId}>{item.orderId}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    item.status === 'active' ? styles.statusActive : styles.statusUsed,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      item.status === 'active' ? styles.statusTextActive : styles.statusTextUsed,
                    ]}
                  >
                    {item.status?.toUpperCase() || 'ACTIVE'}
                  </Text>
                </View>
              </View>

              <Text style={styles.txEventTitle}>{item.eventTitle}</Text>

              <View style={styles.txMetaRow}>
                <Text style={styles.txMeta}>📅 {item.eventDate}</Text>
                <Text style={styles.txMeta}>📍 {item.venueName}</Text>
              </View>

              <View style={styles.txBottomRow}>
                <Text style={styles.txCategory}>{item.categoryName}</Text>
                <Text style={styles.txPrice}>{formatPrice(item.totalPrice)}</Text>
              </View>

              <View style={styles.txDateRow}>
                <Text style={styles.txPurchaseDate}>PURCHASED: {item.purchaseDate}</Text>
              </View>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyTitle}>NO TRANSACTIONS</Text>
              <Text style={styles.emptyDesc}>
                Your order archive is empty. Purchase concert tickets to see your transaction history here.
              </Text>
              <Button variant="primary" size="sm" onPress={() => router.push('/(tabs)/discover')}>
                EXPLORE CONCERTS
              </Button>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    paddingTop: 54,
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
  subHeader: {
    color: colors.textMuted,
    fontSize: 9,
    fontFamily: 'Courier',
    fontWeight: '700',
    letterSpacing: 1,
  },
  pageTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontFamily: 'Courier',
    fontWeight: '900',
    marginTop: 2,
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    marginHorizontal: 16,
    borderRadius: 6,
    padding: 14,
    marginBottom: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: colors.primary,
    fontSize: 13,
    fontFamily: 'Courier',
    fontWeight: '900',
    marginBottom: 2,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 8,
    fontFamily: 'Courier',
    fontWeight: '700',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  txCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 12,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  txCardPressed: {
    backgroundColor: colors.surfaceAlt,
  },
  seqBadge: {
    width: 40,
    backgroundColor: 'rgba(204,255,0,0.05)',
    borderRightColor: colors.border,
    borderRightWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seqText: {
    color: colors.primary,
    fontSize: 10,
    fontFamily: 'Courier',
    fontWeight: '900',
  },
  txBody: {
    flex: 1,
    padding: 14,
  },
  txTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  txOrderId: {
    color: colors.textMuted,
    fontSize: 9,
    fontFamily: 'Courier',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 2,
    borderWidth: 1,
  },
  statusActive: {
    backgroundColor: 'rgba(204,255,0,0.1)',
    borderColor: 'rgba(204,255,0,0.3)',
  },
  statusUsed: {
    backgroundColor: 'rgba(113,113,122,0.1)',
    borderColor: 'rgba(113,113,122,0.3)',
  },
  statusText: {
    fontSize: 8,
    fontFamily: 'Courier',
    fontWeight: '700',
  },
  statusTextActive: {
    color: colors.primary,
  },
  statusTextUsed: {
    color: colors.textMuted,
  },
  txEventTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontFamily: 'Courier',
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  txMetaRow: {
    gap: 3,
    marginBottom: 10,
  },
  txMeta: {
    color: colors.textSecondary,
    fontSize: 10,
    fontFamily: 'Courier',
  },
  txBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopColor: '#18181b',
    borderTopWidth: 1,
    paddingTop: 10,
  },
  txCategory: {
    color: colors.textSecondary,
    fontSize: 10,
    fontFamily: 'Courier',
    fontWeight: '700',
  },
  txPrice: {
    color: colors.primary,
    fontSize: 13,
    fontFamily: 'Courier',
    fontWeight: '900',
  },
  txDateRow: {
    marginTop: 6,
  },
  txPurchaseDate: {
    color: colors.textMuted,
    fontSize: 8,
    fontFamily: 'Courier',
    letterSpacing: 0.5,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    padding: 24,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontFamily: 'Courier',
    fontWeight: '900',
    marginBottom: 4,
  },
  emptyDesc: {
    color: colors.textMuted,
    fontSize: 10,
    fontFamily: 'Courier',
    textAlign: 'center',
    lineHeight: 14,
    marginBottom: 16,
  },
});
