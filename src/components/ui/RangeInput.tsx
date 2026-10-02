import React from 'react';
import { View, Text, TextInput, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../../constants/theme';

interface RangeInputProps {
  label: string;
  minValue: string;
  maxValue: string;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  onChangeMin: (text: string) => void;
  onChangeMax: (text: string) => void;
  keyboardType?: 'numeric' | 'default';
  containerStyle?: ViewStyle;
}

export const RangeInput: React.FC<RangeInputProps> = ({
  label,
  minValue,
  maxValue,
  minPlaceholder = 'Mín',
  maxPlaceholder = 'Máx',
  onChangeMin,
  onChangeMax,
  keyboardType = 'numeric',
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder={minPlaceholder}
          placeholderTextColor={theme.colors.textLight}
          keyboardType={keyboardType}
          value={minValue}
          onChangeText={onChangeMin}
        />
        <Text style={styles.separator}>-</Text>
        <TextInput
          style={styles.input}
          placeholder={maxPlaceholder}
          placeholderTextColor={theme.colors.textLight}
          keyboardType={keyboardType}
          value={maxValue}
          onChangeText={onChangeMax}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 6,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: theme.colors.textMain,
    backgroundColor: '#FAFAFA',
    textAlign: 'center',
    minHeight: 44,
  },
  separator: {
    marginHorizontal: 12,
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
});
