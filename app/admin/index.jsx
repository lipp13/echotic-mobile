import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import orderService from '../../services/orderService';
import Button from '../../components/ui/Button';
import colors from '../../constants/colors';

export default function AdminScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [ticketCodeInput, setTicketCodeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalTicketsSold: 0,
    checkedInCount: 0,
    pendingCount: 0,
  });
  const [verificationResult, setVerificationResult] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await orderService.getAdminStats();
      if (data) {
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    }
  };

  const handleVerifyTicket = async () => {
    if (!ticketCodeInput.trim()) {
      showToast('Please enter a ticket code or order ID', 'error');
      return;
    }

    setLoading(true);
    setVerificationResult(null);

    try {
      const res = await orderService.verifyTicket(ticketCodeInput.trim());
      if (res.success && res.data) {
        setVerificationResult({
          type: 'success',
          ticket: res.data,
          message: res.data.isAlreadyScanned
            ? '⛔ TIKET INI SUDAH DI-SCAN / TERVERIFIKASI SEBELUMNYA!'
            : '✓ TIKET VALID & SIAP UNTUK VERIFIKASI ENTRY',
        });
      } else {
        setVerificationResult({
          type: 'error',
          message: res.error || 'Tiket tidak ditemukan di database.',
        });
      }
    } catch (err) {
      setVerificationResult({
        type: 'error',
        message: err.message || 'Gagal memverifikasi tiket',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveEntry = async (codeToApprove) => {
    const targetCode = codeToApprove || ticketCodeInput.trim();
    if (!targetCode) return;

    setLoading(true);
    try {
      const res = await orderService.scanApproveTicket(targetCode);
      if (res.success) {
        showToast(res.message || 'Pass approved! Gate entry allowed.', 'success');
        setVerificationResult({
          type: 'approved',
          ticket: res.data,
          message: res.message,
        });
        fetchStats();
      } else {
        showToast(res.error || 'Approve gate entry failed', 'error');
        setVerificationResult({
          type: 'error',
          message: res.error,
        });
      }
    } catch (err) {
      showToast(err.message || 'Failed to approve gate entry', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClearResult = () => {
    setVerificationResult(null);
    setTicketCodeInput('');
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <View style={styles.unauthorizedContainer}>
        <Text style={styles.unauthorizedIcon}>🔒</Text>
        <Text style={styles.unauthorizedTitle}>ACCESS RESTRICTED</Text>
        <Text style={styles.unauthorizedDesc}>
          Administrator privileges are required to access Gate Entry Scanner and Event Management.
        </Text>
        <Button variant="primary" onPress={() => router.replace('/(tabs)/profile')}>
          RETURN TO PROFILE
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← RETURN TO APP</Text>
        </Pressable>
        <View style={styles.adminBadge}>
          <Text style={styles.adminBadgeText}>⚡ ECHOTIC GATE CONTROL</Text>
        </View>
      </View>

      <Text style={styles.pageTitle}>ADMIN GATEWAY.</Text>
      <Text style={styles.pageSubtitle}>REAL-TIME TICKET SCANNERS & LIVE ATTENDANCE STATS</Text>

      {/* Admin Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { borderColor: colors.secondary }]}>
          <Text style={styles.statLabel}>TOTAL ORDERS</Text>
          <Text style={[styles.statValue, { color: colors.secondary }]}>{stats.totalOrders}</Text>
        </View>

        <View style={[styles.statCard, { borderColor: colors.primary }]}>
          <Text style={styles.statLabel}>TICKETS SOLD</Text>
          <Text style={[styles.statValue, { color: colors.primary }]}>{stats.totalTicketsSold}</Text>
        </View>

        <View style={[styles.statCard, { borderColor: '#a855f7' }]}>
          <Text style={styles.statLabel}>CHECKED IN</Text>
          <Text style={[styles.statValue, { color: '#a855f7' }]}>{stats.checkedInCount}</Text>
        </View>

        <View style={[styles.statCard, { borderColor: colors.accent }]}>
          <Text style={styles.statLabel}>PENDING GATE</Text>
          <Text style={[styles.statValue, { color: colors.accent }]}>{stats.pendingCount}</Text>
        </View>
      </View>

      {/* Gate Entry Scanner Card */}
      <View style={styles.card}>
        <View style={styles.cardAccentBar} />
        <Text style={styles.cardTitle}>🔍 GATE CODE / TICKET VERIFICATION</Text>
        <Text style={styles.cardDesc}>
          Enter ticket code (e.g. TKT-ABC12345) or Order ID to inspect pass details and approve venue gate admission.
        </Text>

        <View style={styles.inputGroup}>
          <TextInput
            style={styles.textInput}
            placeholder="ENTER TICKET CODE OR ORDER ID..."
            placeholderTextColor={colors.textMuted}
            value={ticketCodeInput}
            onChangeText={setTicketCodeInput}
            autoCapitalize="characters"
          />
          <Pressable
            style={({ pressed }) => [styles.verifyBtn, pressed && styles.verifyBtnPressed]}
            onPress={handleVerifyTicket}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000000" size="small" />
            ) : (
              <Text style={styles.verifyBtnText}>VERIFY PASS</Text>
            )}
          </Pressable>
        </View>
      </View>

      {/* Verification Result Display */}
      {verificationResult && (
        <View
          style={[
            styles.resultCard,
            verificationResult.type === 'error' && styles.resultCardError,
            verificationResult.type === 'approved' && styles.resultCardApproved,
          ]}
        >
          <Text style={styles.resultMessage}>{verificationResult.message}</Text>

          {verificationResult.ticket && (
            <View style={styles.ticketDetailsBox}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>GATE PASS CODE</Text>
                <Text style={[styles.detailVal, { color: colors.primary }]}>
                  {verificationResult.ticket.ticketCode}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>ATTENDEE NAME</Text>
                <Text style={styles.detailVal}>{verificationResult.ticket.attendeeName}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>ID / NIK NUMBER</Text>
                <Text style={styles.detailVal}>{verificationResult.ticket.attendeeId || 'N/A'}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>EVENT SHOW</Text>
                <Text style={styles.detailVal}>{verificationResult.ticket.eventTitle}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>PASS CATEGORY</Text>
                <Text style={styles.detailVal}>{verificationResult.ticket.categoryName}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>QUANTITY</Text>
                <Text style={styles.detailVal}>{verificationResult.ticket.quantity} Pass(es)</Text>
              </View>

              {verificationResult.ticket.status && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>GATE STATUS</Text>
                  <Text
                    style={[
                      styles.detailVal,
                      {
                        color:
                          verificationResult.ticket.status === 'approved'
                            ? colors.accent
                            : colors.primary,
                        fontWeight: '900',
                      },
                    ]}
                  >
                    {verificationResult.ticket.status.toUpperCase()}
                  </Text>
                </View>
              )}

              {/* Action Button: Approve Gate Entry if active */}
              {verificationResult.ticket.canApprove && (
                <Button
                  variant="primary"
                  onPress={() => handleApproveEntry(verificationResult.ticket.ticketCode)}
                  style={styles.approveBtn}
                >
                  🎉 APPROVE GATE ENTRY NOW
                </Button>
              )}
            </View>
          )}

          <Pressable onPress={handleClearResult} style={styles.dismissBtn}>
            <Text style={styles.dismissBtnText}>DISMISS & RESET SCANNER</Text>
          </Pressable>
        </View>
      )}
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
  unauthorizedContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  unauthorizedIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  unauthorizedTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  unauthorizedDesc: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backBtn: {
    paddingVertical: 4,
  },
  backText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  adminBadge: {
    backgroundColor: 'rgba(250, 35, 59, 0.12)',
    borderColor: 'rgba(250, 35, 59, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  adminBadgeText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  pageTitle: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  pageSubtitle: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    padding: 14,
    borderRadius: 16,
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    position: 'relative',
    marginBottom: 20,
  },
  cardAccentBar: {
    position: 'absolute',
    top: 18,
    left: 0,
    right: 0,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  cardDesc: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 16,
  },
  inputGroup: {
    gap: 12,
  },
  textInput: {
    backgroundColor: colors.surfaceAlt,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    color: '#ffffff',
    fontSize: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
  },
  verifyBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyBtnPressed: {
    opacity: 0.85,
  },
  verifyBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  resultCard: {
    backgroundColor: colors.surface,
    borderColor: 'rgba(250, 35, 59, 0.4)',
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
  },
  resultCardError: {
    borderColor: '#ff453a',
  },
  resultCardApproved: {
    borderColor: colors.secondary,
  },
  resultMessage: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 14,
    lineHeight: 18,
  },
  ticketDetailsBox: {
    backgroundColor: colors.surfaceAlt,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    padding: 14,
    borderRadius: 14,
    gap: 8,
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '500',
  },
  detailVal: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  approveBtn: {
    marginTop: 10,
  },
  dismissBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  dismissBtnText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default AdminScreen;

