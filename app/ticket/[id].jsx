import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import QRCode from 'react-native-qrcode-svg';
import orderService from '../../services/orderService';
import { useToast } from '../../contexts/ToastContext';
import Button from '../../components/ui/Button';
import colors from '../../constants/colors';

export default function TicketScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { showToast } = useToast();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      if (id) {
        const found = await orderService.getOrderById(id);
        setOrder(found);
      }
      setLoading(false);
    }
    loadOrder();
  }, [id]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `EchoTic Pass for ${order?.eventTitle} - Gate Code: ${order?.ticketCode}`,
      });
    } catch (e) {
      showToast('Copied to clipboard', 'info');
    }
  };

  const handleDownload = () => {
    showToast('Pass saved to photos gallery!', 'success');
  };

  if (loading || !order) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>LOCATING TICKET KEY...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.replace('/(tabs)/tickets')}>
          <Text style={styles.backText}>← MY PASSES</Text>
        </Pressable>
        <Text
          style={[
            styles.statusBadge,
            order.status === 'approved' && { color: colors.secondary },
          ]}
        >
          {order.status === 'approved' ? '✓ CHECKED IN AT GATE' : '✓ ACTIVE PASS'}
        </Text>
      </View>

      {/* Main Ticket Pass Card */}
      <View style={styles.ticketCard}>
        <View style={styles.topAccent} />

        {/* Header */}
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.officialTag}>OFFICIAL PASS</Text>
            <Text style={styles.brandTitle}>ECHOTIC TICKETS</Text>
          </View>
          <Text style={styles.orderIdText}>NO: {order.orderId}</Text>
        </View>

        {/* Event Banner */}
        <View style={styles.imageBox}>
          <Image source={{ uri: order.eventImage }} style={styles.eventImg} contentFit="cover" />
          <View style={styles.imgOverlay} />
          <Text style={styles.eventTitle}>{order.eventTitle}</Text>
        </View>

        {/* Ticket Details */}
        <View style={styles.detailsBody}>
          <View style={styles.detailGrid}>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>ATTENDEE</Text>
              <Text style={styles.gridVal} numberOfLines={1}>{order.attendeeName}</Text>
            </View>

            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>GATE CODE</Text>
              <Text style={[styles.gridVal, { color: colors.secondary }]}>{order.ticketCode}</Text>
            </View>

            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>DATE & TIME</Text>
              <Text style={styles.gridVal}>{order.eventDate} @ {order.eventTime}</Text>
            </View>

            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>PASS CATEGORY</Text>
              <Text style={[styles.gridVal, { color: colors.primary }]}>{order.categoryName}</Text>
            </View>
          </View>

          {order.isSeated && order.seats && order.seats.length > 0 && (
            <View style={styles.seatsRow}>
              <Text style={styles.seatsLabel}>ALLOCATED SEATS</Text>
              <View style={styles.seatsBadges}>
                {order.seats.map((s) => (
                  <View key={s.id} style={styles.seatBadge}>
                    <Text style={styles.seatBadgeText}>{s.row}-{s.seatNum}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Barcode Rip-off section */}
        <View style={styles.barcodeSection}>
          <View style={styles.barcodeStripes}>
            {Array.from({ length: 30 }).map((_, idx) => {
              const w = [1, 2, 3, 4][(idx * 7) % 4];
              return <View key={idx} style={[styles.barLine, { width: w }]} />;
            })}
          </View>
          <Text style={styles.barcodeCode}>{order.ticketCode}</Text>
        </View>
      </View>

      {/* QR Gate Scanner Card */}
      <View style={styles.qrCard}>
        <Text style={styles.qrTitle}>GATE ADMISSION PASS</Text>
        <Text style={styles.qrSub}>SCAN THIS CODE AT VENUE GATES TO ENTER</Text>

        <View style={styles.qrContainer}>
          <QRCode
            value={order.ticketCode}
            size={160}
            color="#000000"
            backgroundColor="#ffffff"
          />
        </View>

        <View style={styles.gateInfo}>
          <Text style={styles.gateInfoText}>👤 GATE HOLDER: {order.attendeeName} ({order.attendeeId})</Text>
          <Text style={styles.gateInfoText}>📍 LOCATION: {order.venueName}</Text>
        </View>

        <View style={styles.buttonGroup}>
          <Button variant="primary" onPress={handleDownload} style={styles.actionBtn}>
            DOWNLOAD PASS
          </Button>
          <Button variant="secondary" onPress={handleShare} style={styles.actionBtn}>
            SHARE SECURED PASS
          </Button>
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
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  statusBadge: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  ticketCard: {
    backgroundColor: colors.surface,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 20,
  },
  topAccent: {
    height: 4,
    backgroundColor: colors.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.surfaceAlt,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    borderBottomWidth: 1,
  },
  officialTag: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  brandTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  orderIdText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '500',
  },
  imageBox: {
    height: 140,
    position: 'relative',
    backgroundColor: colors.surfaceAlt,
  },
  eventImg: {
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  imgOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  eventTitle: {
    position: 'absolute',
    bottom: 14,
    left: 16,
    right: 16,
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  detailsBody: {
    padding: 16,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 14,
  },
  gridItem: {
    width: '50%',
  },
  gridLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 3,
  },
  gridVal: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  seatsRow: {
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seatsLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  seatsBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  seatBadge: {
    backgroundColor: colors.surfaceAlt,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  seatBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  barcodeSection: {
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    borderTopWidth: 1,
    borderStyle: 'dashed',
    padding: 18,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  barcodeStripes: {
    flexDirection: 'row',
    height: 38,
    gap: 3,
    alignItems: 'center',
    marginBottom: 8,
  },
  barLine: {
    backgroundColor: '#ffffff',
    height: '100%',
  },
  barcodeCode: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2,
  },
  qrCard: {
    backgroundColor: colors.surface,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
  },
  qrTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  qrSub: {
    color: colors.textSecondary,
    fontSize: 11,
    marginBottom: 18,
  },
  qrContainer: {
    padding: 14,
    backgroundColor: '#ffffff',
    borderColor: colors.primary,
    borderWidth: 2,
    borderRadius: 16,
    marginBottom: 18,
  },
  gateInfo: {
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    borderTopWidth: 1,
    paddingTop: 14,
    width: '100%',
    gap: 6,
    marginBottom: 18,
  },
  gateInfoText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  buttonGroup: {
    width: '100%',
    gap: 10,
  },
  actionBtn: {
    width: '100%',
  },
});

export default TicketScreen;

