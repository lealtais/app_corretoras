import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { User } from '../types/property';
import { AGENCY_CONFIG } from '../constants/agency';
import { BrandArchitecturalLogo, LucideMapPin } from './LucideIcons';

interface HeaderProps {
  title?: string;
  onPressHome?: () => void;
  currentUser?: User | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onPressHome,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.logoRow}
          onPress={onPressHome}
          activeOpacity={0.7}
        >
          <View style={styles.iconBadge}>
            <BrandArchitecturalLogo size={36} color="#09090B" />
          </View>
          <View style={styles.titleColumn}>
            <Text style={styles.brandTitle}>Corretoras de Sucesso</Text>
            <Text style={styles.brandSubtitle}>Imóveis</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.agencyAddressBar}>
        <LucideMapPin size={13} color={theme.colors.primary} />
        <Text style={styles.agencyAddressText} numberOfLines={1}>
          {AGENCY_CONFIG.address}
        </Text>
      </View>

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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleColumn: {
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.textMain,
    lineHeight: 18,
  },
  brandSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  agencyAddressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },
  agencyAddressText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: '500',
    flex: 1,
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
