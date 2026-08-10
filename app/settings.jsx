import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Switch, StyleSheet, Alert, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast } from '../contexts/ToastContext';
import colors from '../constants/colors';

export default function SettingsScreen() {
  const router = useRouter();
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const handleClearCache = async () => {
    Alert.alert('CLEAR CACHE', 'Remove all cached data? This will not delete your account.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.clear();
            showToast('Cache cleared successfully', 'success');
          } catch {
            showToast('Failed to clear cache', 'error');
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← BACK</Text>
        </Pressable>
        <Text style={styles.subHeader}>SYSTEM CONTROLS</Text>
        <Text style={styles.pageTitle}>SETTINGS.</Text>
      </View>

      {/* Notifications Section */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>🔔  NOTIFICATIONS</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>PUSH NOTIFICATIONS</Text>
            <Text style={styles.settingDesc}>Receive alerts for new events and ticket updates</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: colors.surfaceAlt, true: 'rgba(204,255,0,0.3)' }}
            thumbColor={notifications ? colors.primary : colors.textMuted}
          />
        </View>

        <View style={styles.rowDivider} />

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>EMAIL ALERTS</Text>
            <Text style={styles.settingDesc}>Get promotional offers and event reminders via email</Text>
          </View>
          <Switch
            value={emailAlerts}
            onValueChange={setEmailAlerts}
            trackColor={{ false: colors.surfaceAlt, true: 'rgba(204,255,0,0.3)' }}
            thumbColor={emailAlerts ? colors.primary : colors.textMuted}
          />
        </View>
      </View>

      {/* Security Section */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>🔒  SECURITY</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>BIOMETRIC LOGIN</Text>
            <Text style={styles.settingDesc}>Use fingerprint or face recognition to sign in</Text>
          </View>
          <Switch
            value={biometric}
            onValueChange={setBiometric}
            trackColor={{ false: colors.surfaceAlt, true: 'rgba(204,255,0,0.3)' }}
            thumbColor={biometric ? colors.primary : colors.textMuted}
          />
        </View>

        <View style={styles.rowDivider} />

        <Pressable
          style={({ pressed }) => [styles.settingRow, pressed && styles.settingRowPressed]}
          onPress={() => showToast('Password change is not available in demo mode', 'info')}
        >
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>CHANGE PASSWORD</Text>
            <Text style={styles.settingDesc}>Update your account security credentials</Text>
          </View>
          <Text style={styles.chevron}>→</Text>
        </Pressable>
      </View>

      {/* Appearance Section */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>🎨  APPEARANCE</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>DARK MODE</Text>
            <Text style={styles.settingDesc}>EchoTic is designed for dark mode exclusively</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={(val) => {
              if (!val) {
                showToast('Light mode is not available. EchoTic is dark-mode only.', 'info');
                return;
              }
              setDarkMode(val);
            }}
            trackColor={{ false: colors.surfaceAlt, true: 'rgba(204,255,0,0.3)' }}
            thumbColor={darkMode ? colors.primary : colors.textMuted}
          />
        </View>

        <View style={styles.rowDivider} />

        <Pressable
          style={({ pressed }) => [styles.settingRow, pressed && styles.settingRowPressed]}
          onPress={() => showToast('Language: Bahasa Indonesia (default)', 'info')}
        >
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>LANGUAGE</Text>
            <Text style={styles.settingDesc}>Bahasa Indonesia</Text>
          </View>
          <Text style={styles.chevron}>→</Text>
        </Pressable>
      </View>

      {/* Data Section */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>💾  DATA & STORAGE</Text>

        <Pressable
          style={({ pressed }) => [styles.settingRow, pressed && styles.settingRowPressed]}
          onPress={handleClearCache}
        >
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>CLEAR CACHE</Text>
            <Text style={styles.settingDesc}>Remove all locally cached data</Text>
          </View>
          <Text style={styles.chevron}>→</Text>
        </Pressable>

        <View style={styles.rowDivider} />

        <Pressable
          style={({ pressed }) => [styles.settingRow, pressed && styles.settingRowPressed]}
          onPress={() =>
            Alert.alert(
              'EXPORT DATA',
              'Data export will be sent to your registered email address.',
              [{ text: 'OK' }]
            )
          }
        >
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>EXPORT MY DATA</Text>
            <Text style={styles.settingDesc}>Download a copy of all your EchoTic data</Text>
          </View>
          <Text style={styles.chevron}>→</Text>
        </Pressable>
      </View>

      {/* Support Section */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>📞  SUPPORT</Text>

        <Pressable
          style={({ pressed }) => [styles.settingRow, pressed && styles.settingRowPressed]}
          onPress={() => Linking.openURL('mailto:support@echotic.id')}
        >
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>CONTACT SUPPORT</Text>
            <Text style={styles.settingDesc}>support@echotic.id</Text>
          </View>
          <Text style={styles.chevron}>→</Text>
        </Pressable>

        <View style={styles.rowDivider} />

        <Pressable
          style={({ pressed }) => [styles.settingRow, pressed && styles.settingRowPressed]}
          onPress={() => router.push('/about')}
        >
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>ABOUT ECHOTIC</Text>
            <Text style={styles.settingDesc}>Version, legal, and credits</Text>
          </View>
          <Text style={styles.chevron}>→</Text>
        </Pressable>
      </View>

      {/* App Version */}
      <View style={styles.versionBlock}>
        <Text style={styles.versionText}>ECHOTIC MOBILE v1.0.0</Text>
        <Text style={styles.versionSub}>BUILD 2026.07.26 • EXPO SDK 52</Text>
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
    marginBottom: 14,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  settingRowPressed: {
    opacity: 0.7,
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    color: '#ffffff',
    fontSize: 11,
    fontFamily: 'Courier',
    fontWeight: '700',
    marginBottom: 2,
  },
  settingDesc: {
    color: colors.textMuted,
    fontSize: 9,
    fontFamily: 'Courier',
    lineHeight: 13,
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#18181b',
    marginVertical: 12,
  },
  chevron: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: 'Courier',
    fontWeight: '900',
  },
  versionBlock: {
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 16,
  },
  versionText: {
    color: colors.textMuted,
    fontSize: 10,
    fontFamily: 'Courier',
    fontWeight: '700',
    letterSpacing: 1,
  },
  versionSub: {
    color: colors.textMuted,
    fontSize: 8,
    fontFamily: 'Courier',
    marginTop: 4,
    opacity: 0.6,
  },
});
