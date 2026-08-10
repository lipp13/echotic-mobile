import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import eventService from '../services/eventService';
import SearchBar from '../components/ui/SearchBar';
import EventCard from '../components/cards/EventCard';
import colors from '../constants/colors';

export default function SearchScreen() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: results = [] } = useQuery({
    queryKey: ['search-events', searchTerm],
    queryFn: () => eventService.getEvents({ search: searchTerm }),
    enabled: searchTerm.trim().length > 0,
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← BACK</Text>
        </Pressable>
        <Text style={styles.pageTitle}>SEARCH SPECTRUM</Text>
      </View>

      <SearchBar
        value={searchTerm}
        onChangeText={setSearchTerm}
        onClear={() => setSearchTerm('')}
        placeholder="Type artist name, concert or venue..."
      />

      <FlatList
        data={searchTerm.trim() ? results : []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EventCard event={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          searchTerm.trim() ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>NO SHOWS MATCHING "{searchTerm}"</Text>
            </View>
          ) : (
            <View style={styles.promptCard}>
              <Text style={styles.promptTitle}>POPULAR SEARCHES</Text>
              <View style={styles.tagsRow}>
                {['Hindia', 'EDM', 'Jakarta', 'Pestapora', 'Laufey'].map((tag) => (
                  <Pressable
                    key={tag}
                    onPress={() => setSearchTerm(tag)}
                    style={styles.tagChip}
                  >
                    <Text style={styles.tagText}>{tag}</Text>
                  </Pressable>
                ))}
              </View>
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
    padding: 16,
    paddingTop: 54,
  },
  header: {
    marginBottom: 16,
  },
  backBtn: {
    marginBottom: 8,
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
  },
  listContent: {
    paddingBottom: 32,
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 11,
    fontFamily: 'Courier',
  },
  promptCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    padding: 16,
    borderRadius: 6,
    marginTop: 12,
  },
  promptTitle: {
    color: colors.textMuted,
    fontSize: 9,
    fontFamily: 'Courier',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 3,
  },
  tagText: {
    color: colors.primary,
    fontSize: 10,
    fontFamily: 'Courier',
    fontWeight: '700',
  },
});
