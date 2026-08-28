import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { User, MapPin, Phone, Calendar, Sprout, Settings, LogOut, ChevronRight, Award, TrendingUp } from 'lucide-react-native';
import { theme } from '@/theme';
import { currentFarmer } from '@/services/api';
import { formatNumber, formatDate } from '@/services/format';
import { Card } from '@/components';

export function ProfileScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {currentFarmer.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
          </Text>
        </View>
        <Text style={styles.profileName}>{currentFarmer.name}</Text>
        <View style={styles.locationRow}>
          <MapPin size={14} color={theme.colors.earth[400]} />
          <Text style={styles.locationText}>{currentFarmer.location}</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Sprout size={20} color={theme.colors.brand[600]} />
          <Text style={styles.statValue}>{formatNumber(currentFarmer.farmSizeHectares)} ha</Text>
          <Text style={styles.statLabel}>Farm Size</Text>
        </View>
        <View style={styles.statBox}>
          <Calendar size={20} color={theme.colors.sky[600]} />
          <Text style={styles.statValue}>{formatDate(currentFarmer.joinedDate)}</Text>
          <Text style={styles.statLabel}>Joined</Text>
        </View>
        <View style={styles.statBox}>
          <Award size={20} color={theme.colors.sun[600]} />
          <Text style={styles.statValue}>A</Text>
          <Text style={styles.statLabel}>Avg Grade</Text>
        </View>
      </View>

      {/* Contact info */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <InfoRow icon={<Phone size={18} color={theme.colors.earth[400]} />} label="Phone" value={currentFarmer.phone} />
        <InfoRow icon={<MapPin size={18} color={theme.colors.earth[400]} />} label="Location" value={currentFarmer.location} />
        <InfoRow icon={<User size={18} color={theme.colors.earth[400]} />} label="Farmer ID" value={currentFarmer.id} />
      </Card>

      {/* Menu items */}
      <Card style={styles.section}>
        <Pressable style={({ pressed }) => [styles.menuRow, pressed && styles.pressed]}>
          <Settings size={20} color={theme.colors.earth[500]} />
          <Text style={styles.menuLabel}>Settings</Text>
          <ChevronRight size={18} color={theme.colors.earth[300]} />
        </Pressable>
        <View style={styles.menuDivider} />
        <Pressable style={({ pressed }) => [styles.menuRow, pressed && styles.pressed]}>
          <TrendingUp size={20} color={theme.colors.earth[500]} />
          <Text style={styles.menuLabel}>My Performance</Text>
          <ChevronRight size={18} color={theme.colors.earth[300]} />
        </Pressable>
        <View style={styles.menuDivider} />
        <Pressable style={({ pressed }) => [styles.menuRow, pressed && styles.pressed]}>
          <Award size={20} color={theme.colors.earth[500]} />
          <Text style={styles.menuLabel}>Achievements</Text>
          <ChevronRight size={18} color={theme.colors.earth[300]} />
        </Pressable>
      </Card>

      {/* Logout */}
      <Pressable style={({ pressed }) => [styles.logoutBtn, pressed && styles.pressed]}>
        <LogOut size={20} color={theme.colors.red[500]} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </Pressable>

      <Text style={styles.versionText}>AgriFlow Farmer v1.0.0</Text>
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      {icon}
      <View style={{ flex: 1, marginLeft: theme.spacing.md }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.xl },
  profileHeader: { alignItems: 'center', marginBottom: theme.spacing.xl },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.brand[600],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  avatarText: { fontSize: 28, fontWeight: theme.fontWeight.extrabold, color: theme.colors.white },
  profileName: { fontSize: theme.fontSize.xxl, fontWeight: theme.fontWeight.extrabold, color: theme.colors.textPrimary },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  locationText: { fontSize: theme.fontSize.sm, color: theme.colors.earth[400] },
  statsRow: { flexDirection: 'row', gap: theme.spacing.sm, marginBottom: theme.spacing.lg },
  statBox: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statValue: { fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.bold, color: theme.colors.textPrimary },
  statLabel: { fontSize: theme.fontSize.xs, color: theme.colors.earth[400], fontWeight: theme.fontWeight.medium },
  section: { marginBottom: theme.spacing.md },
  sectionTitle: { fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.bold, color: theme.colors.textPrimary, marginBottom: theme.spacing.md },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  infoLabel: { fontSize: theme.fontSize.xs, color: theme.colors.earth[400], fontWeight: theme.fontWeight.medium },
  infoValue: { fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.semibold, color: theme.colors.textPrimary, marginTop: 2 },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: theme.spacing.md },
  menuLabel: { flex: 1, fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.semibold, color: theme.colors.textPrimary, marginLeft: theme.spacing.md },
  menuDivider: { height: 1, backgroundColor: theme.colors.earth[100] },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    paddingVertical: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  logoutText: { fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.bold, color: theme.colors.red[500] },
  versionText: { fontSize: theme.fontSize.xs, color: theme.colors.earth[400], textAlign: 'center', marginTop: theme.spacing.lg },
  pressed: { opacity: 0.7 },
});
