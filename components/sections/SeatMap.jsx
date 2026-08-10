import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import eventService from '../../services/eventService';
import colors from '../../constants/colors';
import { formatPrice } from '../../utils/format';

export function SeatMap({ event, onSelectionChange }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const sections = event.seatingConfig?.sections || [];

  const { data: seatData } = useQuery({
    queryKey: ['event-seats', event?.id],
    queryFn: () => eventService.getSeats(event?.id),
    enabled: !!event?.id && !!event?.seatingConfig?.hasSeatedMap,
  });

  const occupiedSeatsList = seatData?.occupiedSeats || [];
  const occupiedSet = new Set(occupiedSeatsList);


  const handleSeatClick = (section, row, seatNum, price) => {
    const seatId = `${section.id}-${row}-${seatNum}`;

    setSelectedSeats((prev) => {
      const isSelected = prev.find((s) => s.id === seatId);
      let updated;

      if (isSelected) {
        updated = prev.filter((s) => s.id !== seatId);
      } else {
        updated = [...prev, { id: seatId, sectionName: section.name, row, seatNum, price }];
      }

      onSelectionChange(updated);
      return updated;
    });
  };

  if (!event.seatingConfig?.hasSeatedMap || sections.length === 0) {
    return (
      <View style={styles.gaBox}>
        <Text style={styles.gaText}>
          This is a General Admission / Standing event. No seat selection is required.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Stage Layout */}
      <View style={styles.stageHeader}>
        <View style={styles.stageBox}>
          <Text style={styles.stageText}>STAGE FRONT</Text>
          <View style={styles.stageGlowLine} />
        </View>
      </View>

      {/* Map Sections */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.mapGrid}>
          {sections.map((section) => (
            <View key={section.id} style={styles.sectionBlock}>
              <Text style={styles.sectionTitle}>
                {section.name} — <Text style={styles.sectionPrice}>{formatPrice(section.price)}</Text>
              </Text>

              {section.rows.map((row) => (
                <View key={row} style={styles.rowLine}>
                  <Text style={styles.rowLabel}>{row}</Text>
                  <View style={styles.seatsRow}>
                    {Array.from({ length: section.seatsPerRow }).map((_, idx) => {
                      const seatNum = idx + 1;
                      const seatId = `${section.id}-${row}-${seatNum}`;
                      const isOccupied = occupiedSet.has(seatId);
                      const isSelected = selectedSeats.some((s) => s.id === seatId);

                      return (
                        <Pressable
                          key={seatNum}
                          disabled={isOccupied}
                          onPress={() => handleSeatClick(section, row, seatNum, section.price)}
                          style={[
                            styles.seatBtn,
                            isOccupied && styles.seatOccupied,
                            isSelected && styles.seatSelected,
                          ]}
                        >
                          <Text
                            style={[
                              styles.seatBtnText,
                              isOccupied && styles.seatOccupiedText,
                              isSelected && styles.seatSelectedText,
                            ]}
                          >
                            {seatNum}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                  <Text style={styles.rowLabelRight}>{row}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Legend */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={styles.legendAvailable} />
          <Text style={styles.legendText}>Available</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.legendOccupied} />
          <Text style={styles.legendText}>Occupied</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.legendSelected} />
          <Text style={styles.legendText}>Selected</Text>
        </View>
      </View>

      {/* Summary */}
      {selectedSeats.length > 0 && (
        <View style={styles.summaryBox}>
          <View>
            <Text style={styles.summaryLabel}>SELECTED SEATS ({selectedSeats.length})</Text>
            <Text style={styles.summarySeatsText}>
              {selectedSeats.map((s) => `${s.row}-${s.seatNum}`).join(', ')}
            </Text>
          </View>
          <Text style={styles.summaryTotalText}>
            {formatPrice(selectedSeats.reduce((acc, curr) => acc + curr.price, 0))}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    padding: 16,
    borderRadius: 16,
    marginVertical: 12,
  },
  gaBox: {
    backgroundColor: colors.surface,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    padding: 16,
    borderRadius: 14,
  },
  gaText: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
  stageHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  stageBox: {
    width: '75%',
    height: 32,
    backgroundColor: colors.surfaceAlt,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  stageText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  stageGlowLine: {
    position: 'absolute',
    bottom: 0,
    left: 12,
    right: 12,
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: 1,
  },
  mapGrid: {
    paddingVertical: 8,
  },
  sectionBlock: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  sectionPrice: {
    color: colors.primary,
    fontWeight: '600',
  },
  rowLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rowLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    width: 22,
    textAlign: 'right',
    marginRight: 8,
  },
  rowLabelRight: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    width: 22,
    textAlign: 'left',
    marginLeft: 8,
  },
  seatsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  seatBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seatOccupied: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'transparent',
  },
  seatSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  seatBtnText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  seatOccupiedText: {
    color: '#3a3a3c',
  },
  seatSelectedText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    borderTopWidth: 1,
    paddingTop: 14,
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendAvailable: {
    width: 12,
    height: 12,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  legendOccupied: {
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  legendSelected: {
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  legendText: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  summaryBox: {
    backgroundColor: colors.surfaceAlt,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    padding: 14,
    borderRadius: 12,
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  summarySeatsText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  summaryTotalText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default SeatMap;

