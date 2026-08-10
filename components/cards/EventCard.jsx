import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import colors from '../../constants/colors';
import { formatPrice, formatDate } from '../../utils/format';

export function EventCard({ event }) {
  const router = useRouter();

  if (!event) return null;

  const { id, title, subtitle, date, venueId, venue, ticketCategories, image } = event;

  const lowestPrice = ticketCategories && ticketCategories.length > 0
    ? Math.min(...ticketCategories.map((c) => c.price))
    : 0;

  const formattedDateStr = formatDate(date || new Date().toISOString());
  const venueDisplayName = venue?.name || venueId || 'VENUE';

  return (
    <Pressable
      onPress={() => router.push(`/concert/${id}`)}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressedCard,
      ]}
    >
      {/* Image Banner */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: image }}
          style={styles.image}
          contentFit="cover"
          transition={300}
        />
        <View style={styles.dateStamp}>
          <Text style={styles.dateStampText}>
            {formattedDateStr.split(',')[1]?.trim() || date}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle || 'FEATURED CONCERT'}
        </Text>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>📍 {venueDisplayName}</Text>
          <Text style={styles.metaPrice}>{formatPrice(lowestPrice)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 16,
  },
  pressedCard: {
    transform: [{ scale: 0.985 }],
    opacity: 0.9,
  },
  imageContainer: {
    height: 190,
    width: '100%',
    backgroundColor: colors.surfaceAlt,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  dateStamp: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dateStampText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  content: {
    padding: 16,
  },
  subtitle: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
    lineHeight: 22,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  metaText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  metaPrice: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});


export default EventCard;
