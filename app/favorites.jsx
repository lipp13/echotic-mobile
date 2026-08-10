import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, Image, StyleSheet } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import eventService from '../services/eventService';
import Button from '../components/ui/Button';
import { formatPrice } from '../utils/format';
import colors from '../constants/colors';

const FAVORITES_KEY = 'echotic_favorites';

export default function FavoritesScreen() {
  const router = useRouter();
  const [favoriteIds, setFavoriteIds] = useState([]);

  const { data: allEvents = [] } = useQuery({
    queryKey: ['all-events'],
    queryFn: () => eventService.getEvents(),
  });

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const stored = await AsyncStorage.getItem(FAVORITES_KEY);
          setFavoriteIds(stored ? JSON.parse(stored) : []);
        } catch {
          setFavoriteIds([]);
        }
      })();
    }, [])
  );

  const favoriteEvents = allEvents.filter((e) => favoriteIds.includes(e.id));

  const removeFavorite = async (eventId) => {
    const updated = favoriteIds.filter((id) => id !== eventId);
    setFavoriteIds(updated);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← BACK</Text>
        </Pressable>
        <Text style={styles.subHeader}>SAVED COLLECTION</Text>
        <Text style={styles.pageTitle}>FAVORITES.</Text>
        <Text style={styles.countText}>{favoriteEvents.length} CONCERTS SAVED</Text>
      </View>

      <FlatList
        data={favoriteEvents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const minPrice = Math.min(...item.ticketCategories.map((c) => c.price));
          return (
            <Pressable
              style={({ pressed }) => [styles.favCard, pressed && styles.favCardPressed]}
              onPress={() => router.push(`/concert/${item.id}`)}
            >
              <Image source={{ uri: item.image }} style={styles.favImage} />
              <View style={styles.favBody}>
                <View style={styles.favGenreBadge}>
                  <Text style={styles.favGenreText}>{item.genre?.toUpperCase()}</Text>
                </View>
                <Text style={styles.favTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.favSub} numberOfLines={1}>
                  {item.subtitle}
                </Text>
                <View style={styles.favMeta}>
                  <Text style={styles.favDate}>📅 {item.date}</Text>
                  <Text style={styles.favPrice}>FROM {formatPrice(minPrice)}</Text>
                </View>
              </View>
              <Pressable
                style={styles.removeBtn}
                onPress={() => removeFavorite(item.id)}
                hitSlop={12}
              >
                <Text style={styles.removeIcon}>✕</Text>
              </Pressable>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>❤️</Text>
            <Text style={styles.emptyTitle}>NO FAVORITES YET</Text>
            <Text style={styles.emptyDesc}>
              Mark concerts as favorites from the event detail page to build your personal collection.
            </Text>
            <Button variant="primary" size="sm" onPress={() => router.push('/(tabs)/discover')}>
              DISCOVER CONCERTS
            </Button>
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
  countText: {
    color: colors.primary,
    fontSize: 10,
    fontFamily: 'Courier',
    fontWeight: '700',
    marginTop: 6,
    letterSpacing: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  favCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 12,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  favCardPressed: {
    backgroundColor: colors.surfaceAlt,
  },
  favImage: {
    width: 80,
    height: '100%',
    minHeight: 100,
  },
  favBody: {
    flex: 1,
    padding: 12,
  },
  favGenreBadge: {
    backgroundColor: 'rgba(0,240,255,0.1)',
    borderColor: 'rgba(0,240,255,0.2)',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 1,
    alignSelf: 'flex-start',
    borderRadius: 2,
    marginBottom: 6,
  },
  favGenreText: {
    color: colors.secondary,
    fontSize: 7,
    fontFamily: 'Courier',
    fontWeight: '700',
  },
  favTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Courier',
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  favSub: {
    color: colors.textMuted,
    fontSize: 10,
    fontFamily: 'Courier',
    marginBottom: 8,
  },
  favMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  favDate: {
    color: colors.textSecondary,
    fontSize: 9,
    fontFamily: 'Courier',
  },
  favPrice: {
    color: colors.primary,
    fontSize: 9,
    fontFamily: 'Courier',
    fontWeight: '900',
  },
  removeBtn: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderLeftColor: colors.border,
    borderLeftWidth: 1,
  },
  removeIcon: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '900',
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
