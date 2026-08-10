import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Button from '../components/ui/Button';
import colors from '../constants/colors';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: '',
    bio: '',
  });
  const [saving, setSaving] = useState(false);

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    if (!form.username.trim() || !form.email.trim()) {
      Alert.alert('VALIDATION ERROR', 'Username and email are required fields.');
      return;
    }
    setSaving(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    setSaving(false);
    showToast('Profile updated successfully', 'success');
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← BACK</Text>
        </Pressable>
        <Text style={styles.subHeader}>PERSONAL CENTER</Text>
        <Text style={styles.pageTitle}>EDIT PROFILE.</Text>
      </View>

      {/* Avatar */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarInitials}>
            {form.username ? form.username.substring(0, 2).toUpperCase() : 'US'}
          </Text>
        </View>
        <Pressable style={styles.changeAvatarBtn}>
          <Text style={styles.changeAvatarText}>CHANGE AVATAR</Text>
        </Pressable>
      </View>

      {/* Form */}
      <View style={styles.formCard}>
        <View style={styles.accentBar} />

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>USERNAME</Text>
          <TextInput
            style={styles.input}
            value={form.username}
            onChangeText={(v) => updateField('username', v)}
            placeholderTextColor={colors.textMuted}
            placeholder="Enter username"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>SECURITY EMAIL</Text>
          <TextInput
            style={styles.input}
            value={form.email}
            onChangeText={(v) => updateField('email', v)}
            placeholderTextColor={colors.textMuted}
            placeholder="Enter email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>PHONE NUMBER</Text>
          <TextInput
            style={styles.input}
            value={form.phone}
            onChangeText={(v) => updateField('phone', v)}
            placeholderTextColor={colors.textMuted}
            placeholder="+62 xxx-xxxx-xxxx"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>BIO</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            value={form.bio}
            onChangeText={(v) => updateField('bio', v)}
            placeholderTextColor={colors.textMuted}
            placeholder="Tell us about yourself..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </View>

      {/* Save Button */}
      <Button variant="primary" onPress={handleSave} disabled={saving}>
        {saving ? 'SAVING...' : 'SAVE CHANGES'}
      </Button>

      {/* Danger Zone */}
      <View style={styles.dangerCard}>
        <Text style={styles.dangerTitle}>⚠️  DANGER ZONE</Text>
        <Text style={styles.dangerDesc}>
          Permanently delete your account and all associated data. This action cannot be reversed.
        </Text>
        <Pressable
          style={styles.deleteBtn}
          onPress={() =>
            Alert.alert(
              'DELETE ACCOUNT',
              'Are you sure you want to permanently delete your account?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => showToast('Account deletion is not available in demo mode', 'info') },
              ]
            )
          }
        >
          <Text style={styles.deleteBtnText}>DELETE ACCOUNT</Text>
        </Pressable>
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.primary,
    borderWidth: 2,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarInitials: {
    color: colors.primary,
    fontSize: 24,
    fontFamily: 'Courier',
    fontWeight: '900',
  },
  changeAvatarBtn: {
    borderColor: colors.border,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 4,
  },
  changeAvatarText: {
    color: colors.textSecondary,
    fontSize: 9,
    fontFamily: 'Courier',
    fontWeight: '700',
    letterSpacing: 1,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 6,
    padding: 16,
    marginBottom: 20,
    position: 'relative',
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 3,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  fieldGroup: {
    marginLeft: 8,
  },
  fieldLabel: {
    color: colors.textMuted,
    fontSize: 9,
    fontFamily: 'Courier',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 4,
    color: '#ffffff',
    fontSize: 13,
    fontFamily: 'Courier',
    padding: 12,
  },
  bioInput: {
    minHeight: 80,
  },
  divider: {
    height: 1,
    backgroundColor: '#18181b',
    marginVertical: 14,
  },
  dangerCard: {
    backgroundColor: 'rgba(255,0,85,0.05)',
    borderColor: 'rgba(255,0,85,0.2)',
    borderWidth: 1,
    borderRadius: 6,
    padding: 16,
    marginTop: 24,
    alignItems: 'center',
  },
  dangerTitle: {
    color: colors.accent,
    fontSize: 11,
    fontFamily: 'Courier',
    fontWeight: '900',
    marginBottom: 6,
  },
  dangerDesc: {
    color: colors.textMuted,
    fontSize: 10,
    fontFamily: 'Courier',
    textAlign: 'center',
    lineHeight: 15,
    marginBottom: 14,
  },
  deleteBtn: {
    borderColor: colors.accent,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  deleteBtnText: {
    color: colors.accent,
    fontSize: 10,
    fontFamily: 'Courier',
    fontWeight: '900',
  },
});
