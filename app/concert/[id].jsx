import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import eventService from '../../services/eventService';
import { useToast } from '../../contexts/ToastContext';
import Button from '../../components/ui/Button';
import SeatMap from '../../components/sections/SeatMap';
import colors from '../../constants/colors';
import { formatPrice, formatDate } from '../../utils/format';

export default function ConcertDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { showToast } = useToast();

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);

  const { data: event, isLoading } = useQuery({
    queryKey: ['event-detail', id],
    queryFn: () => eventService.getEventById(id),
    enabled: !!id,
  });

  if (isLoading || !event) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>LOADING SHOW DATA...</Text>
      </View>
    );
  }

  const activeCategory = selectedCategory || (event.ticketCategories ? event.ticketCategories[0] : null);

  const handleCheckoutRedirect = () => {
    if (event.seatingConfig?.hasSeatedMap) {
      if (selectedSeats.length === 0) {
        showToast('Please select at least one seat from the map', 'error');
        return;
      }

      const checkoutDetails = {
        eventId: event.id,
        categoryName: selectedSeats[0].sectionName,
        seats: selectedSeats.map((s) => ({
          row: s.row,
          seatNum: s.seatNum,
          id: s.id,
          price: s.price,
        })),
        totalPrice: selectedSeats.reduce((acc, curr) => acc + curr.price, 0),
        isSeated: true,
      };

      router.push({
        pathname: '/checkout',
        params: { data: JSON.stringify(checkoutDetails) },
      });
    } else {
      if (!activeCategory) {
        showToast('Please select a ticket category', 'error');
        return;
      }

      const checkoutDetails = {
        eventId: event.id,
        categoryName: activeCategory.name,
        categoryId: activeCategory.id,
        quantity: ticketQuantity,
        totalPrice: activeCategory.price * ticketQuantity,
        isSeated: false,
      };

      router.push({
        pathname: '/checkout',
        params: { data: JSON.stringify(checkoutDetails) },
      });
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Back Header */}
      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backText}>← BACK TO DIRECTORY</Text>
      </Pressable>

      {/* Banner Graphic */}
      <View style={styles.imageCard}>
        <Image source={{ uri: event.image }} style={styles.image} contentFit="cover" />
        <View style={styles.stampOverlay}>
          <Text style={styles.stampText}>OFFICIAL HOSTED PASS</Text>
        </View>
      </View>

      {/* Meta Header */}
      <Text style={styles.subtitle}>{event.subtitle}</Text>
      <Text style={styles.title}>{event.title}</Text>

      <View style={styles.infoRow}>
        <Text style={styles.infoText}>📅 {formatDate(event.date)} at {event.time}</Text>
        <Text style={styles.infoText}>📍 {event.venue?.name}, {event.venue?.city}</Text>
      </View>

      {/* Description */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeader}>EVENT ABSTRACT</Text>
        <Text style={styles.abstractText}>{event.description}</Text>
      </View>



      {/* Buying Interface */}
      <View style={styles.buyingCard}>
        <View style={styles.buyingAccent} />
        <Text style={styles.buyingTitle}>🎫 ACQUIRE GIG PASSES</Text>

        {event.seatingConfig?.hasSeatedMap ? (
          <SeatMap event={event} onSelectionChange={setSelectedSeats} />
        ) : (
          <View style={styles.gaBlock}>
            <Text style={styles.gaHeader}>CHOOSE TIER</Text>
            {event.ticketCategories?.map((cat) => {
              const isSelected = activeCategory?.id === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat)}
                  style={[styles.catOption, isSelected && styles.catOptionSelected]}
                >
                  <View>
                    <Text style={[styles.catName, isSelected && styles.catNameSelected]}>
                      {cat.name}
                    </Text>
                    <Text style={styles.catAvail}>
                      Available • {cat.capacity - cat.sold} passes left
                    </Text>
                  </View>
                  <Text style={[styles.catPrice, isSelected && styles.catPriceSelected]}>
                    {formatPrice(cat.price)}
                  </Text>
                </Pressable>
              );
            })}

            {/* Quantity Selector */}
            <View style={styles.quantityRow}>
              <Text style={styles.quantityLabel}>SELECT QUANTITY</Text>
              <View style={styles.counterBox}>
                <Pressable
                  onPress={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                  style={styles.counterBtn}
                >
                  <Text style={styles.counterBtnText}>-</Text>
                </Pressable>
                <Text style={styles.counterValue}>{ticketQuantity}</Text>
                <Pressable
                  onPress={() => setTicketQuantity(Math.min(5, ticketQuantity + 1))}
                  style={styles.counterBtn}
                >
                  <Text style={styles.counterBtnText}>+</Text>
                </Pressable>
              </View>
            </View>

            {/* Subtotal */}
            {activeCategory && (
              <View style={styles.subtotalRow}>
                <Text style={styles.subtotalLabel}>SUBTOTAL</Text>
                <Text style={styles.subtotalValue}>
                  {formatPrice(activeCategory.price * ticketQuantity)}
                </Text>
              </View>
            )}
          </View>
        )}

        <Button
          variant="primary"
          onPress={handleCheckoutRedirect}
          style={styles.checkoutBtn}
        >
          SECURE PASSES →
        </Button>
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
  backBtn: {
    marginBottom: 16,
  },
  backText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  imageCard: {
    height: 220,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: colors.surfaceAlt,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    position: 'relative',
    marginBottom: 18,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  stampOverlay: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderColor: 'rgba(250, 35, 59, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  stampText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  infoRow: {
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    borderTopWidth: 1,
    paddingTop: 14,
    gap: 6,
    marginBottom: 20,
  },
  infoText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },
  sectionHeader: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  abstractText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  artistRow: {
    flexDirection: 'row',
    gap: 14,
  },
  artistImg: {
    width: 68,
    height: 68,
    borderRadius: 14,
    backgroundColor: colors.surfaceAlt,
  },
  artistInfo: {
    flex: 1,
  },
  artistName: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  artistBio: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  buyingCard: {
    backgroundColor: colors.surface,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    position: 'relative',
    marginBottom: 16,
  },
  buyingAccent: {
    position: 'absolute',
    top: 18,
    right: 18,
    width: 28,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  buyingTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  gaBlock: {
    gap: 10,
  },
  gaHeader: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  catOption: {
    backgroundColor: colors.surfaceAlt,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    padding: 14,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  catOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(250, 35, 59, 0.1)',
  },
  catName: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  catNameSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
  catAvail: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  catPrice: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  catPriceSelected: {
    color: colors.primary,
  },
  quantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    borderTopWidth: 1,
    paddingTop: 14,
    marginTop: 10,
  },
  quantityLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  counterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderRadius: 14,
  },
  counterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  counterBtnText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  counterValue: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    paddingHorizontal: 10,
  },
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    borderTopWidth: 1,
    paddingTop: 14,
    marginTop: 10,
  },
  subtotalLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  subtotalValue: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '800',
  },
  checkoutBtn: {
    marginTop: 18,
  },
});

export default ConcertDetailScreen;

