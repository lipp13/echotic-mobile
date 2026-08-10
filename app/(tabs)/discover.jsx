import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, FlatList, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import eventService from '../../services/eventService';
import SearchBar from '../../components/ui/SearchBar';
import EventCard from '../../components/cards/EventCard';
import Button from '../../components/ui/Button';
import colors from '../../constants/colors';

export default function DiscoverScreen() {
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('all');
  const [city, setCity] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  const { data: eventsList = [], isLoading, refetch } = useQuery({
    queryKey: ['events-discover', search, genre, city, sortBy],
    queryFn: () => eventService.getEvents({ search, genre, city, sortBy }),
  });

  const genres = [
    { id: 'all', label: 'ALL GENRES' },
    { id: 'edm', label: 'EDM' },
    { id: 'rock', label: 'ROCK' },
    { id: 'pop', label: 'POP' },
  ];

  const cities = [
    { id: 'all', label: 'ALL CITIES' },
    { id: 'Jakarta', label: 'JAKARTA' },
    { id: 'Bandung', label: 'BANDUNG' },
  ];

  const sortOptions = [
    { id: 'default', label: 'DEFAULT' },
    { id: 'price-low', label: 'PRICE: LOW' },
    { id: 'price-high', label: 'PRICE: HIGH' },
    { id: 'date-new', label: 'SOONEST' },
  ];

  const clearFilters = () => {
    setSearch('');
    setGenre('all');
    setCity('all');
    setSortBy('default');
  };

  const hasActiveFilters = search || genre !== 'all' || city !== 'all' || sortBy !== 'default';

  return (
    <View style={styles.container}>
      <FlatList
        data={eventsList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EventCard event={item} />}
        contentContainerStyle={styles.scrollContent}
        refreshing={isLoading}
        onRefresh={refetch}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <Text style={styles.catalogFeed}>CATALOG FEED</Text>
            <Text style={styles.pageTitle}>THE LIVE SPECTRUM</Text>

            <SearchBar value={search} onChangeText={setSearch} onClear={() => setSearch('')} />

            {/* Genre Filter Scroll */}
            <Text style={styles.filterLabel}>GENRE</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
              {genres.map((g) => (
                <Pressable
                  key={g.id}
                  onPress={() => setGenre(g.id)}
                  style={[styles.filterChip, genre === g.id && styles.filterChipActive]}
                >
                  <Text style={[styles.filterChipText, genre === g.id && styles.filterChipTextActive]}>
                    {g.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* City & Sort Controls */}
            <Text style={styles.filterLabel}>CITY & SORT</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
              {cities.map((c) => (
                <Pressable
                  key={c.id}
                  onPress={() => setCity(c.id)}
                  style={[styles.filterChip, city === c.id && styles.filterChipActiveCyan]}
                >
                  <Text style={[styles.filterChipText, city === c.id && styles.filterChipTextActiveCyan]}>
                    📍 {c.label}
                  </Text>
                </Pressable>
              ))}

              {sortOptions.map((s) => (
                <Pressable
                  key={s.id}
                  onPress={() => setSortBy(s.id)}
                  style={[styles.filterChip, sortBy === s.id && styles.filterChipActivePink]}
                >
                  <Text style={[styles.filterChipText, sortBy === s.id && styles.filterChipTextActivePink]}>
                    ⚡ {s.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {hasActiveFilters && (
              <Pressable onPress={clearFilters} style={styles.clearBtn}>
                <Text style={styles.clearBtnText}>RESET ALL FILTERS</Text>
              </Pressable>
            )}
          </View>
        }
        ListEmptyComponent={
          !isLoading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>?</Text>
              <Text style={styles.emptyTitle}>NO CONCERTS MATCH CRITERIA</Text>
              <Text style={styles.emptyDesc}>
                We couldn't find any upcoming shows matching your current query. Try adjusting your filters.
              </Text>
              <Button variant="outline" size="sm" onPress={clearFilters} style={styles.resetBtn}>
                RESET FILTERS
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
  scrollContent: {
    padding: 16,
    paddingTop: 54,
    paddingBottom: 40,
  },
  headerBlock: {
    marginBottom: 16,
  },
  catalogFeed: {
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
  filterLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  filterChip: {
    backgroundColor: colors.surfaceAlt,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  filterChipActiveCyan: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  filterChipTextActiveCyan: {
    color: '#ffffff',
    fontWeight: '700',
  },
  filterChipActivePink: {
    backgroundColor: '#a855f7',
    borderColor: '#a855f7',
  },
  filterChipTextActivePink: {
    color: '#ffffff',
    fontWeight: '700',
  },
  clearBtn: {
    alignSelf: 'flex-start',
    marginTop: 6,
    marginBottom: 10,
  },
  clearBtnText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    backgroundColor: colors.surface,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    padding: 28,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 24,
  },
  emptyIcon: {
    color: colors.textMuted,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
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
  resetBtn: {
    marginTop: 4,
  },
});

export default DiscoverScreen;

