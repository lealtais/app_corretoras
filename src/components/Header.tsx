import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { User } from '../types/property';
import { AGENCY_CONFIG } from '../constants/agency';

interface HeaderProps {
  title?: string;
  onPressHome?: () => void;
  currentUser?: User | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onPressHome,
  currentUser,
  onLogout,
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
            <Ionicons name="business" size={22} color={theme.colors.primary} />
          </View>
          <View style={styles.titleColumn}>
            <Text style={styles.brandTitle}>Corretoras de Sucesso</Text>
            <Text style={styles.brandSubtitle}>Imóveis</Text>
          </View>
        </TouchableOpacity>

        {currentUser && onLogout && (
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={onLogout}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={16} color="#DC2626" />
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.agencyAddressBar}>
        <Ionicons name="location" size={13} color={theme.colors.primary} />
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
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
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
