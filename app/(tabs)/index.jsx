import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import eventService from '../../services/eventService';
import EventCard from '../../components/cards/EventCard';
import Countdown from '../../components/sections/Countdown';
import Button from '../../components/ui/Button';
import colors from '../../constants/colors';

export default function HomeScreen() {
  const router = useRouter();
  const [selectedGenre, setSelectedGenre] = useState('all');

  const { data: eventsList = [], isLoading } = useQuery({
    queryKey: ['events', selectedGenre],
    queryFn: () => eventService.getEvents({ genre: selectedGenre }),
  });

  const { data: testimonials = [] } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => eventService.getTestimonials(),
  });

  const genres = ['all', 'edm', 'rock', 'pop'];

  const steps = [
    { num: '01', title: 'SELECT SHOW', desc: 'Explore trending acts, underground sets, or global tours.' },
    { num: '02', title: 'CHOOSE SEATING', desc: 'Use our visual seat map to pick your exact vantage point.' },
    { num: '03', title: 'SECURE PASS', desc: 'Instant encrypted transaction with QR gate code.' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.brandGroup}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>E</Text>
          </View>
          <Text style={styles.brandTitle}>ECHOTIC.</Text>
        </View>

        <View style={styles.headerActions}>
          <Pressable onPress={() => router.push('/search')} style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>🔍</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/notifications')} style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>🔔</Text>
          </Pressable>
        </View>
      </View>

      {/* Hero Statement */}
      <View style={styles.heroSection}>
        <View style={styles.sparkleBadge}>
          <Text style={styles.sparkleText}>✨ FUTURE OF CONCERT TICKETS</Text>
        </View>

        <Text style={styles.heroTitle}>
          MUSIK {'\n'}MENJADI {'\n'}
          <Text style={{ color: colors.primary }}>KENYATAAN.</Text>
        </Text>

        <Text style={styles.heroDesc}>
          Experience live concerts through visual seat maps, digital QR passes, and immersive festival vibes.
        </Text>

        <View style={styles.heroButtons}>
          <Button variant="primary" onPress={() => router.push('/(tabs)/discover')}>
            EXPLORE SHOWS →
          </Button>
        </View>
      </View>

      {/* Countdown Urgent Banner */}
      <Countdown targetDate="2026-08-24T20:00:00" title="NEON FUTURE MASSIVE TICKETS CLOSE IN:" />

      {/* Genre Filter & Shows Section */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionSub}>HOT CURATED EVENTS</Text>
          <Text style={styles.sectionTitle}>LIVE SPECTRUM.</Text>
        </View>

        {/* Genre Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          {genres.map((g) => (
            <Pressable
              key={g}
              onPress={() => setSelectedGenre(g)}
              style={[styles.chip, selectedGenre === g && styles.chipActive]}
            >
              <Text style={[styles.chipText, selectedGenre === g && styles.chipTextActive]}>
                {g.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Concert Cards */}
      {eventsList.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}

      {/* How It Works Section */}
      <View style={styles.howSection}>
        <Text style={styles.sectionSub}>TICKET ACCESS PROTOCOL</Text>
        <Text style={styles.sectionTitle}>HOW IT WORKS.</Text>

        <View style={styles.stepsGrid}>
          {steps.map((step) => (
            <View key={step.num} style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <Text style={styles.stepNum}>{step.num}</Text>
                <Text style={styles.stepTitle}>{step.title}</Text>
              </View>
              <Text style={styles.stepDesc}>{step.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Testimonials */}
      <View style={styles.testimonialSection}>
        <Text style={styles.sectionSub}>COLLECTIVE FEEDBACK</Text>
        <Text style={styles.sectionTitle}>FAN DATABASE.</Text>

        {testimonials.map((t) => (
          <View key={t.id} style={styles.testiCard}>
            <Text style={styles.testiComment}>"{t.comment}"</Text>
            <View style={styles.testiUserRow}>
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{t.name[0]}</Text>
              </View>
              <View>
                <Text style={styles.testiName}>{t.name}</Text>
                <Text style={styles.testiRole}>{t.role}</Text>
              </View>
            </View>
          </View>
        ))}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 32,
    height: 32,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadgeText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 18,
  },
  brandTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceAlt,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    fontSize: 16,
  },
  heroSection: {
    marginBottom: 20,
  },
  sparkleBadge: {
    alignSelf: 'flex-start',
    borderColor: 'rgba(250, 35, 59, 0.3)',
    borderWidth: 1,
    backgroundColor: 'rgba(250, 35, 59, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    marginBottom: 14,
  },
  sparkleText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 40,
    letterSpacing: -0.8,
    marginBottom: 10,
  },
  heroDesc: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 18,
  },
  heroButtons: {
    flexDirection: 'row',
  },
  sectionHeader: {
    marginVertical: 18,
  },
  sectionSub: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: 2,
    marginBottom: 14,
  },
  chipScroll: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  chip: {
    backgroundColor: colors.surfaceAlt,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#000000',
    fontWeight: '700',
  },
  howSection: {
    marginVertical: 24,
  },
  stepsGrid: {
    gap: 12,
  },
  stepCard: {
    backgroundColor: colors.surface,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    padding: 18,
    borderRadius: 16,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  stepNum: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '800',
  },
  stepTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  stepDesc: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
  },
  testimonialSection: {
    marginVertical: 16,
  },
  testiCard: {
    backgroundColor: colors.surface,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
  },
  testiComment: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    fontStyle: 'italic',
    marginBottom: 14,
  },
  testiUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceAlt,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  testiName: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  testiRole: {
    color: colors.textMuted,
    fontSize: 11,
  },
});

