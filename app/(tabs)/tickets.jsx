import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, FlatList, StyleSheet } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import orderService from '../../services/orderService';
import Button from '../../components/ui/Button';
import colors from '../../constants/colors';
import { formatPrice } from '../../utils/format';

export default function TicketsScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('active'); // active | past
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
        fetchOrders();
      }
    }, [isAuthenticated, fetchOrders])
  );

  if (!isAuthenticated) {
    return (
      <View style={styles.guestContainer}>
        <View style={styles.lockCard}>
          <Text style={styles.lockIcon}>🔒</Text>
          <Text style={styles.lockTitle}>ACCESS BLOCKED</Text>
          <Text style={styles.lockDesc}>
            You must authenticate your credentials to enter the tickets vault and purchase dashboard.
          </Text>
          <Button variant="primary" onPress={() => router.push('/(auth)/login')}>
            SIGN IN SECURELY
          </Button>
        </View>
      </View>
    );
  }

  const activeOrders = orders.filter((o) => o.status === 'active' || o.status === 'approved');
  const pastOrders = orders.filter((o) => o.status === 'used' || o.status === 'expired' || o.status === 'cancelled');
  const displayedOrders = activeTab === 'active' ? activeOrders : pastOrders;

  return (
    <View style={styles.container}>
      <View style={styles.headerBlock}>
        <Text style={styles.subHeader}>TICKET VAULT</Text>
        <Text style={styles.pageTitle}>MY PASSES.</Text>

        {/* Tab switcher */}
        <View style={styles.tabSwitcher}>
          <Pressable
            onPress={() => setActiveTab('active')}
            style={[styles.tabBtn, activeTab === 'active' && styles.tabBtnActive]}
          >
            <Text style={[styles.tabBtnText, activeTab === 'active' && styles.tabBtnTextActive]}>
              ACTIVE PASSES ({activeOrders.length})
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab('past')}
            style={[styles.tabBtn, activeTab === 'past' && styles.tabBtnActive]}
          >
            <Text style={[styles.tabBtnText, activeTab === 'past' && styles.tabBtnTextActive]}>
              ARCHIVED ({pastOrders.length})
            </Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={displayedOrders}
        keyExtractor={(item) => item.orderId}
        contentContainerStyle={styles.listContent}
        refreshing={loading}
        onRefresh={fetchOrders}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                <View style={styles.orderBadge}>
                  <Text style={styles.orderBadgeText}>{item.categoryName}</Text>
                </View>
                {item.status === 'approved' && (
                  <View style={{ backgroundColor: 'rgba(0, 240, 255, 0.15)', borderColor: colors.secondary, borderWidth: 1, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 2 }}>
                    <Text style={{ color: colors.secondary, fontSize: 8, fontFamily: 'Courier', fontWeight: '900' }}>✓ CHECKED IN</Text>
                  </View>
                )}
              </View>
              <Text style={styles.orderIdText}>{item.orderId}</Text>
            </View>

            <Text style={styles.eventTitle}>{item.eventTitle}</Text>

            <View style={styles.metaRow}>
              <Text style={styles.metaText}>📅 {item.eventDate} @ {item.eventTime}</Text>
              <Text style={styles.metaText}>📍 {item.venueName}</Text>
              {item.isSeated && item.seats && (
                <Text style={styles.metaTextHighlight}>
                  🪑 SEATS: {item.seats.map((s) => `${s.row}-${s.seatNum}`).join(', ')}
                </Text>
              )}
            </View>

            <View style={styles.orderFooter}>
              <Text style={styles.totalPrice}>{formatPrice(item.totalPrice)}</Text>
              <Button
                variant="outline"
                size="sm"
                onPress={() => router.push(`/ticket/${item.orderId}`)}
              >
                OPEN TICKET →
              </Button>
            </View>
          </View>
        )}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>🎫</Text>
              <Text style={styles.emptyTitle}>NO PASSES FOUND</Text>
              <Text style={styles.emptyDesc}>
                You don't have any ticket passes logged under this category. Visit the directory to secure show passes.
              </Text>
              <Button variant="primary" size="sm" onPress={() => router.push('/(tabs)/discover')}>
                EXPLORE CONCERTS
              </Button>
            </View>
          )
        }
      />
 const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  guestContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: 24,
  },
  lockCard: {
    backgroundColor: colors.surface,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderRadius: 18,
    padding: 28,
    alignItems: 'center',
  },
  lockIcon: {
    fontSize: 36,
    marginBottom: 12,
  },
  lockTitle: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  lockDesc: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  headerBlock: {
    padding: 16,
    paddingTop: 54,
    backgroundColor: colors.background,
  },
  subHeader: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  pageTitle: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: 2,
    marginBottom: 16,
  },
  tabSwitcher: {
    flexDirection: 'row',
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    borderBottomWidth: 1,
  },
  tabBtn: {
    paddingVertical: 10,
    marginRight: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomColor: colors.primary,
  },
  tabBtnText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  tabBtnTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  orderCard: {
    backgroundColor: colors.surface,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderBadge: {
    backgroundColor: 'rgba(250, 35, 59, 0.12)',
    borderColor: 'rgba(250, 35, 59, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  orderBadgeText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  orderIdText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '500',
  },
  eventTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: 10,
  },
  metaRow: {
    gap: 4,
    marginBottom: 14,
  },
  metaText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  metaTextHighlight: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    borderTopWidth: 1,
    paddingTop: 14,
  },
  totalPrice: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    padding: 28,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 20,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 12,
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptyDesc: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
});

export default TicketsScreen;
