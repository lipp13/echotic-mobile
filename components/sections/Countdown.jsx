import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../constants/colors';

export function Countdown({ targetDate = '2026-08-24T20:00:00', title = 'NEON FUTURE MASSIVE TICKETS CLOSE IN:' }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isExpired: false,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft.isExpired) {
    return (
      <View style={styles.expiredContainer}>
        <Text style={styles.expiredText}>⚡ EVENT TICKETS ARE SOLD OUT / SALES CLOSED ⚡</Text>
      </View>
    );
  }

  const timeBlocks = [
    { label: 'DAYS', value: String(timeLeft.days).padStart(2, '0') },
    { label: 'HRS', value: String(timeLeft.hours).padStart(2, '0') },
    { label: 'MINS', value: String(timeLeft.minutes).padStart(2, '0') },
    { label: 'SECS', value: String(timeLeft.seconds).padStart(2, '0') },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.urgencyNotice}>URGENCY NOTICE</Text>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.blocksRow}>
        {timeBlocks.map((block, idx) => (
          <View key={idx} style={styles.blockWrapper}>
            <View style={styles.numberBox}>
              <Text style={styles.numberText}>{block.value}</Text>
            </View>
            <Text style={styles.label}>{block.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    padding: 18,
    borderRadius: 18,
    marginVertical: 12,
    alignItems: 'center',
  },
  expiredContainer: {
    backgroundColor: 'rgba(250, 35, 59, 0.1)',
    borderColor: colors.primary,
    borderWidth: 1,
    padding: 14,
    borderRadius: 14,
    marginVertical: 12,
  },
  expiredText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  urgencyNotice: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  title: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 14,
  },
  blocksRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  blockWrapper: {
    alignItems: 'center',
  },
  numberBox: {
    width: 52,
    height: 52,
    backgroundColor: colors.surfaceAlt,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  label: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: '600',
    marginTop: 6,
  },
});

export default Countdown;

