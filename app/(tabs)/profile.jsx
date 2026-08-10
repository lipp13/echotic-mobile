import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import Button from '../../components/ui/Button';
import colors from '../../constants/colors';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();

  const handleLogout = async () => {
    await logout();
    showToast('Logged out successfully', 'info');
    router.replace('/(auth)/login');
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.guestContainer}>
        <View style={styles.guestCard}>
          <Text style={styles.guestIcon}>👤</Text>
          <Text style={styles.guestTitle}>AUTHENTICATION REQUIRED</Text>
          <Text style={styles.guestDesc}>
            Sign in to access your personal vanguard profile, saved events, settings and ticket history.
          </Text>
          <Button variant="primary" onPress={() => router.push('/(auth)/login')}>
            SIGN IN SECURELY
          </Button>
        </View>
      </View>
    );
  }

  const baseMenuItems = [
    { label: '✏️  EDIT PROFILE', route: '/edit-profile' },
    { label: '📜  TRANSACTION HISTORY', route: '/transaction-history' },
    { label: '❤️  FAVORITE CONCERTS', route: '/favorites' },
    { label: '🔔  NOTIFICATIONS', route: '/notifications' },
    { label: '⚙️  SETTINGS', route: '/settings' },
    { label: 'ℹ️  ABOUT ECHOTIC', route: '/about' },
  ];

  const menuItems = user?.role === 'admin'
    ? [{ label: '⚡  ADMIN GATEWAY & SCANNER', route: '/admin' }, ...baseMenuItems]
    : baseMenuItems;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.subHeader}>PERSONAL CENTER</Text>
      <Text style={styles.pageTitle}>VANGUARD HUB.</Text>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.accentBar} />
        <View style={styles.userRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.username ? user.username.substring(0, 2).toUpperCase() : 'US'}
            </Text>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.username}>{user?.username || 'GUEST USER'}</Text>
            <View style={user?.role === 'admin' ? styles.adminBadge : styles.vipBadge}>
              <Text style={user?.role === 'admin' ? styles.adminBadgeText : styles.vipBadgeText}>
                {user?.role === 'admin' ? '⚡ ADMINISTRATOR' : 'VANGUARD VIP'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>SECURITY EMAIL</Text>
            <Text style={styles.detailValue}>{user?.email || 'N/A'}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>MEMBERSHIP TIER</Text>
            <Text style={styles.detailValue}>LEVEL 01</Text>
          </View>
        </View>
      </View>

      {/* Menu List */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, idx) => (
          <Pressable
            key={idx}
            onPress={() => router.push(item.route)}
            style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
          >
            <Text style={styles.menuText}>{item.label}</Text>
            <Text style={styles.menuArrow}>→</Text>
          </Pressable>
        ))}
      </View>

      {/* Logout button */}
      <Button variant="outline" onPress={handleLogout} style={styles.logoutBtn}>
        EXIT DASHBOARD
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
    paddingBottom: 40,
  },
  guestContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: 24,
  },
  guestCard: {
    backgroundColor: colors.surface,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderRadius: 18,
    padding: 28,
    alignItems: 'center',
  },
  guestIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  guestTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  guestDesc: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
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
  profileCard: {
    backgroundColor: colors.surface,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    position: 'relative',
    marginBottom: 20,
  },
  accentBar: {
    position: 'absolute',
    top: 18,
    left: 0,
    bottom: 18,
    width: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  avatar: {
    width: 52,
    height: 52,
    backgroundColor: colors.surfaceAlt,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  userInfo: {
    gap: 4,
  },
  username: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  vipBadge: {
    backgroundColor: 'rgba(250, 35, 59, 0.12)',
    borderColor: 'rgba(250, 35, 59, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    borderRadius: 12,
  },
  vipBadgeText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  adminBadge: {
    backgroundColor: 'rgba(10, 132, 255, 0.15)',
    borderColor: 'rgba(10, 132, 255, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    borderRadius: 12,
  },
  adminBadgeText: {
    color: colors.secondary,
    fontSize: 10,
    fontWeight: '700',
  },
  detailsRow: {
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    borderTopWidth: 1,
    paddingTop: 14,
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  detailValue: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  menuContainer: {
    backgroundColor: colors.surface,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderRadius: 18,
    marginBottom: 20,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
    borderBottomWidth: 1,
  },
  menuItemPressed: {
    backgroundColor: colors.surfaceAlt,
  },
  menuText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  menuArrow: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  logoutBtn: {
    marginTop: 8,
  },
});

export default ProfileScreen;

