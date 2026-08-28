import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, Check, Wheat } from 'lucide-react-native';
import { theme } from '@/theme';
import { api, crops } from '@/services/api';
import { Card } from '@/components';
import type { RootStackParamList } from '@/navigation/RootNavigator';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export function RecordHarvestScreen() {
  const navigation = useNavigation<NavProp>();
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);
  const [yieldKg, setYieldKg] = useState('');
  const [grade, setGrade] = useState('A');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const grades = ['A', 'B', 'C'];

  const submit = async () => {
    if (!selectedCrop) {
      Alert.alert('Select a crop', 'Please choose which crop you are harvesting.');
      return;
    }
    const yieldNum = parseFloat(yieldKg);
    if (!yieldNum || yieldNum <= 0) {
      Alert.alert('Enter yield', 'Please enter the actual yield in kg.');
      return;
    }
    setSaving(true);
    try {
      await api.recordHarvest({
        cropId: selectedCrop,
        actualYieldKg: yieldNum,
        grade,
        notes,
      });
      Alert.alert('Success', 'Harvest recorded successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert('Error', 'Could not save harvest. Try again.');
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Crop selection */}
      <Text style={styles.label}>Select Crop *</Text>
      <View style={styles.cropGrid}>
        {crops.map((c) => {
          const selected = selectedCrop === c.id;
          return (
            <Pressable
              key={c.id}
              onPress={() => setSelectedCrop(c.id)}
              style={({ pressed }) => [
                styles.cropChip,
                selected && styles.cropChipSelected,
                pressed && styles.pressed,
              ]}
            >
              {selected ? (
                <Check size={16} color={theme.colors.white} />
              ) : (
                <Wheat size={16} color={theme.colors.brand[600]} />
              )}
              <Text style={[styles.cropChipText, selected && styles.cropChipTextSelected]}>
                {c.name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Yield input */}
      <Text style={styles.label}>Actual Yield (kg) *</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="e.g. 3050"
        placeholderTextColor={theme.colors.earth[300]}
        value={yieldKg}
        onChangeText={setYieldKg}
      />

      {/* Grade selection */}
      <Text style={styles.label}>Quality Grade</Text>
      <View style={styles.gradeRow}>
        {grades.map((g) => {
          const selected = grade === g;
          return (
            <Pressable
              key={g}
              onPress={() => setGrade(g)}
              style={({ pressed }) => [
                styles.gradeBtn,
                selected && styles.gradeBtnSelected,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.gradeBtnText, selected && styles.gradeBtnTextSelected]}>
                Grade {g}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Notes */}
      <Text style={styles.label}>Notes (optional)</Text>
      <TextInput
        style={[styles.input, styles.notesInput]}
        placeholder="Any notes about this harvest..."
        placeholderTextColor={theme.colors.earth[300]}
        value={notes}
        onChangeText={setNotes}
        multiline
        textAlignVertical="top"
      />

      {/* Submit */}
      <Pressable
        onPress={submit}
        disabled={saving}
        style={({ pressed }) => [styles.submitBtn, pressed && styles.pressed, saving && styles.submitBtnDisabled]}
      >
        {saving ? (
          <ActivityIndicator color={theme.colors.white} />
        ) : (
          <>
            <Check size={20} color={theme.colors.white} />
            <Text style={styles.submitBtnText}>Save Harvest</Text>
          </>
        )}
      </Pressable>
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.lg },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.earth[700],
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  cropGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  cropChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.white,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  cropChipSelected: {
    backgroundColor: theme.colors.brand[600],
    borderColor: theme.colors.brand[600],
  },
  cropChipText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.earth[700],
  },
  cropChipTextSelected: { color: theme.colors.white },
  input: {
    backgroundColor: theme.colors.white,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.textPrimary,
  },
  notesInput: { minHeight: 80, paddingTop: theme.spacing.md },
  gradeRow: { flexDirection: 'row', gap: theme.spacing.sm },
  gradeBtn: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.white,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  gradeBtnSelected: {
    backgroundColor: theme.colors.sun[500],
    borderColor: theme.colors.sun[500],
  },
  gradeBtnText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.earth[600],
  },
  gradeBtnTextSelected: { color: theme.colors.white },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.brand[600],
    borderRadius: theme.radius.lg,
    paddingVertical: theme.spacing.md + 2,
    marginTop: theme.spacing.xl,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.bold, color: theme.colors.white },
  pressed: { opacity: 0.7 },
});
