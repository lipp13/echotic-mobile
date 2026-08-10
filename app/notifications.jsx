import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import colors from '../constants/colors';

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    type: 'ticket',
    title: 'TICKET CONFIRMED',
    message: 'Your ticket for HINDIA Live in Jakarta 2026 has been confirmed. Check your ticket vault.',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    type: 'promo',
    title: 'FLASH SALE ALERT',
    message: 'Limited 20% discount on PESTAPORA 2026 tickets. Valid for the next 24 hours.',
    time: '5 hours ago',
    read: false,
  },
  {
    id: '3',
    type: 'event',
    title: 'NEW EVENT ADDED',
    message: 'REALITY CLUB Live in Jakarta 2026 just announced. Be the first to grab tickets!',
    time: '1 day ago',
    read: true,
  },
  {
    id: '4',
    type: 'system',
    title: 'SECURITY UPDATE',
    message: 'Your account password was recently changed. If this wasn\'t you, contact support immediately.',
    time: '3 days ago',
    read: true,
  },
  {
    id: '5',
    type: 'event',
    title: 'SHOW REMINDER',
    message: 'NEON FUTURE MASSIVE is happening in 3 days! Don\'t forget your ticket.',
    time: '5 days ago',
    read: true,
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'ticket':
        return '🎫';
      case 'promo':
        return '🔥';
      case 'event':
        return '🎵';
      case 'system':
        return '🔒';
      default:
        return '📢';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'ticket':
        return colors.primary;
      case 'promo':
        return colors.accent;
      case 'event':
        return colors.secondary;
      case 'system':
        return colors.textSecondary;
      default:
        return colors.textMuted;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← BACK</Text>
        </Pressable>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.subHeader}>ALERT CENTER</Text>
            <Text style={styles.pageTitle}>NOTIFICATIONS.</Text>
          </View>
          {unreadCount > 0 && (
            <Pressable style={styles.markAllBtn} onPress={markAllRead}>
              <Text style={styles.markAllText}>MARK ALL READ</Text>
            </Pressable>
          )}
        </View>
        {unreadCount > 0 && (
          <View style={styles.unreadBanner}>
            <Text style={styles.unreadText}>
              {unreadCount} UNREAD NOTIFICATION{unreadCount > 1 ? 'S' : ''}
            </Text>
          </View>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.notifCard, !item.read && styles.notifCardUnread]}
            onPress={() => markAsRead(item.id)}
          >
            {!item.read && <View style={styles.unreadDot} />}

            <View style={styles.notifIconWrap}>
              <Text style={styles.notifIcon}>{getTypeIcon(item.type)}</Text>
            </View>

            <View style={styles.notifBody}>
              <View style={styles.notifTopRow}>
                <Text style={[styles.notifTitle, { color: getTypeColor(item.type) }]}>
                  {item.title}
                </Text>
                <Text style={styles.notifTime}>{item.time}</Text>
              </View>
              <Text style={styles.notifMessage} numberOfLines={2}>
                {item.message}
              </Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyTitle}>ALL CLEAR</Text>
            <Text style={styles.emptyDesc}>
              You have no notifications at the moment. We'll alert you when something important happens.
            </Text>
          </View>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
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
  markAllBtn: {
    borderColor: colors.border,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    marginBottom: 4,
  },
  markAllText: {
    color: colors.primary,
    fontSize: 8,
    fontFamily: 'Courier',
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  unreadBanner: {
    backgroundColor: 'rgba(204,255,0,0.08)',
    borderColor: 'rgba(204,255,0,0.2)',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 12,
  },
  unreadText: {
    color: colors.primary,
    fontSize: 9,
    fontFamily: 'Courier',
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  notifCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 10,
    flexDirection: 'row',
    padding: 14,
    position: 'relative',
  },
  notifCardUnread: {
    borderColor: 'rgba(204,255,0,0.2)',
    backgroundColor: 'rgba(204,255,0,0.02)',
  },
  unreadDot: {
    position: 'absolute',
    top: 14,
    left: 8,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  notifIconWrap: {
    width: 36,
    height: 36,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notifIcon: {
    fontSize: 16,
  },
  notifBody: {
    flex: 1,
  },
  notifTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 10,
    fontFamily: 'Courier',
    fontWeight: '900',
  },
  notifTime: {
    color: colors.textMuted,
    fontSize: 8,
    fontFamily: 'Courier',
  },
  notifMessage: {
    color: colors.textSecondary,
    fontSize: 10,
    fontFamily: 'Courier',
    lineHeight: 15,
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
  },
});
