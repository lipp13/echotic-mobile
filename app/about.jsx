import React from 'react';
import { View, Text, ScrollView, Pressable, Linking, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import colors from '../constants/colors';

const TEAM_MEMBERS = [
  { name: 'ALIF ALFATHAR', role: 'Lead Developer' },
  { name: 'FARRAS KHAIRY', role: 'Full-Stack Developer' },
];

const TECH_STACK = [
  { name: 'React Native', version: '0.76+' },
  { name: 'Expo SDK', version: '52' },
  { name: 'Expo Router', version: 'v4' },
  { name: 'TanStack Query', version: 'v5' },
  { name: 'NativeWind', version: 'v4' },
  { name: 'React Hook Form', version: 'v7' },
];

export default function AboutScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← BACK</Text>
        </Pressable>
        <Text style={styles.subHeader}>INFORMATION</Text>
        <Text style={styles.pageTitle}>ABOUT.</Text>
      </View>

      {/* Brand Card */}
      <View style={styles.brandCard}>
        <View style={styles.brandAccent} />
        <View style={styles.logoBlock}>
          <Text style={styles.logoText}>ECHO</Text>
          <Text style={styles.logoTextAccent}>TIC</Text>
        </View>
        <Text style={styles.tagline}>THE FUTURE OF CONCERT TICKETING</Text>
        <View style={styles.versionBadge}>
          <Text style={styles.versionBadgeText}>v1.0.0 • MOBILE</Text>
        </View>
      </View>

      {/* Description */}
      <View style={styles.descCard}>
        <Text style={styles.descTitle}>WHAT IS ECHOTIC?</Text>
        <Text style={styles.descText}>
          EchoTic is a premium concert ticketing platform designed to deliver a futuristic,
          immersive experience for music enthusiasts across Indonesia. From discovering events
          to securing your seats, every interaction is crafted with precision and style.
        </Text>
        <Text style={styles.descText}>
          The mobile app extends the full EchoTic experience to your pocket — complete with
          interactive seat selection, digital ticket passes, real-time event discovery, and
          a curated concert ecosystem.
        </Text>
      </View>

      {/* Features */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>⚡  KEY FEATURES</Text>
        {[
          'Interactive Seat Map Selection',
          'Digital Ticket QR Passes',
          'Real-time Event Discovery',
          'Genre & City Based Filtering',
          'Secure Payment Processing',
          'Personal Concert Favorites',
          'Transaction History Tracking',
          'Push Notification Alerts',
        ].map((feature, idx) => (
          <View key={idx} style={styles.featureRow}>
            <Text style={styles.featureBullet}>▸</Text>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      {/* Tech Stack */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>🛠  TECH STACK</Text>
        {TECH_STACK.map((tech, idx) => (
          <View key={idx} style={styles.techRow}>
            <Text style={styles.techName}>{tech.name}</Text>
            <Text style={styles.techVersion}>{tech.version}</Text>
          </View>
        ))}
      </View>

      {/* Team */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>👥  DEVELOPMENT TEAM</Text>
        <Text style={styles.teamSubtitle}>KELOMPOK BU HESTI</Text>
        {TEAM_MEMBERS.map((member, idx) => (
          <View key={idx} style={styles.teamRow}>
            <View style={styles.teamAvatar}>
              <Text style={styles.teamAvatarText}>
                {member.name.substring(0, 2)}
              </Text>
            </View>
            <View>
              <Text style={styles.teamName}>{member.name}</Text>
              <Text style={styles.teamRole}>{member.role}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Legal */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>📜  LEGAL</Text>

        <Pressable
          style={({ pressed }) => [styles.legalRow, pressed && styles.legalRowPressed]}
          onPress={() => Linking.openURL('https://echotic.id/terms')}
        >
          <Text style={styles.legalText}>Terms of Service</Text>
          <Text style={styles.legalChevron}>→</Text>
        </Pressable>

        <View style={styles.legalDivider} />

        <Pressable
          style={({ pressed }) => [styles.legalRow, pressed && styles.legalRowPressed]}
          onPress={() => Linking.openURL('https://echotic.id/privacy')}
        >
          <Text style={styles.legalText}>Privacy Policy</Text>
          <Text style={styles.legalChevron}>→</Text>
        </Pressable>

        <View style={styles.legalDivider} />

        <Pressable
          style={({ pressed }) => [styles.legalRow, pressed && styles.legalRowPressed]}
          onPress={() => Linking.openURL('https://echotic.id/licenses')}
        >
          <Text style={styles.legalText}>Open Source Licenses</Text>
          <Text style={styles.legalChevron}>→</Text>
        </Pressable>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2026 ECHOTIC. ALL RIGHTS RESERVED.</Text>
        <Text style={styles.footerSub}>DEVELOPED BY ALIF ALFATHAR & FARRAS KHAIRY</Text>
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
    marginBottom: 20,
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

  // Brand Card
  brandCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 6,
    padding: 24,
    alignItems: 'center',
    marginBottom: 14,
    position: 'relative',
    overflow: 'hidden',
  },
  brandAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.primary,
  },
  logoBlock: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  logoText: {
    color: '#ffffff',
    fontSize: 32,
    fontFamily: 'Courier',
    fontWeight: '900',
    letterSpacing: 4,
  },
  logoTextAccent: {
    color: colors.primary,
    fontSize: 32,
    fontFamily: 'Courier',
    fontWeight: '900',
    letterSpacing: 4,
  },
  tagline: {
    color: colors.textMuted,
    fontSize: 8,
    fontFamily: 'Courier',
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 12,
  },
  versionBadge: {
    backgroundColor: 'rgba(204,255,0,0.1)',
    borderColor: 'rgba(204,255,0,0.2)',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 2,
  },
  versionBadgeText: {
    color: colors.primary,
    fontSize: 9,
    fontFamily: 'Courier',
    fontWeight: '700',
  },

  // Description
  descCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 6,
    padding: 16,
    marginBottom: 14,
  },
  descTitle: {
    color: '#ffffff',
    fontSize: 11,
    fontFamily: 'Courier',
    fontWeight: '900',
    marginBottom: 10,
  },
  descText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontFamily: 'Courier',
    lineHeight: 17,
    marginBottom: 10,
  },

  // Section Card
  sectionCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 6,
    padding: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    color: colors.primary,
    fontSize: 10,
    fontFamily: 'Courier',
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 12,
  },

  // Features
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureBullet: {
    color: colors.primary,
    fontSize: 10,
    fontFamily: 'Courier',
    fontWeight: '900',
    marginRight: 8,
  },
  featureText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontFamily: 'Courier',
  },

  // Tech
  techRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomColor: '#18181b',
    borderBottomWidth: 1,
  },
  techName: {
    color: '#ffffff',
    fontSize: 11,
    fontFamily: 'Courier',
    fontWeight: '700',
  },
  techVersion: {
    color: colors.secondary,
    fontSize: 11,
    fontFamily: 'Courier',
    fontWeight: '700',
  },

  // Team
  teamSubtitle: {
    color: colors.secondary,
    fontSize: 9,
    fontFamily: 'Courier',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  teamAvatar: {
    width: 32,
    height: 32,
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamAvatarText: {
    color: colors.primary,
    fontSize: 10,
    fontFamily: 'Courier',
    fontWeight: '900',
  },
  teamName: {
    color: '#ffffff',
    fontSize: 11,
    fontFamily: 'Courier',
    fontWeight: '700',
  },
  teamRole: {
    color: colors.textMuted,
    fontSize: 9,
    fontFamily: 'Courier',
  },

  // Legal
  legalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  legalRowPressed: {
    opacity: 0.7,
  },
  legalText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontFamily: 'Courier',
  },
  legalChevron: {
    color: colors.primary,
    fontSize: 12,
    fontFamily: 'Courier',
    fontWeight: '900',
  },
  legalDivider: {
    height: 1,
    backgroundColor: '#18181b',
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 9,
    fontFamily: 'Courier',
    fontWeight: '700',
    letterSpacing: 1,
  },
  footerSub: {
    color: colors.textMuted,
    fontSize: 8,
    fontFamily: 'Courier',
    marginTop: 4,
    opacity: 0.6,
  },
});
