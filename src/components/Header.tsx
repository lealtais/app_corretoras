import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

interface HeaderProps {
  title?: string;
  onPressHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onPressHome }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.logoRow} 
        onPress={onPressHome}
        activeOpacity={0.7}
      >
        <View style={styles.iconBadge}>
          <Ionicons name="business" size={24} color={theme.colors.primary} />
        </View>
        <View style={styles.titleColumn}>
          <Text style={styles.brandTitle}>Corretoras</Text>
          <Text style={styles.brandSubtitle}>de Sucesso</Text>
        </View>
      </TouchableOpacity>
      {title && (
        <View style={styles.screenTitleContainer}>
          <Text style={styles.screenTitle}>{title}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBadge: {
    width: 38,
    height: 38,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleColumn: {
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.textMain,
    lineHeight: 18,
  },
  brandSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.textSecondary,
    marginTop: -2,
  },
  screenTitleContainer: {
    marginTop: 8,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textMain,
  },
});
