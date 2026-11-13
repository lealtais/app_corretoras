import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

export type TabType = 'home' | 'favorites';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onPressAdd: () => void;
  isAdmin: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  onPressAdd,
  isAdmin,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onSelectTab('home')}
        activeOpacity={0.7}
      >
        <Ionicons
          name={currentTab === 'home' ? 'home' : 'home-outline'}
          size={22}
          color={currentTab === 'home' ? theme.colors.primary : theme.colors.textSecondary}
        />
        <Text
          style={[
            styles.navLabel,
            currentTab === 'home' && styles.navLabelActive,
          ]}
        >
          Imóveis
        </Text>
      </TouchableOpacity>

      {isAdmin && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={onPressAdd}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onSelectTab('favorites')}
        activeOpacity={0.7}
      >
        <Ionicons
          name={currentTab === 'favorites' ? 'heart' : 'heart-outline'}
          size={22}
          color={currentTab === 'favorites' ? theme.colors.favorite : theme.colors.textSecondary}
        />
        <Text
          style={[
            styles.navLabel,
            currentTab === 'favorites' && { color: theme.colors.favorite, fontWeight: '700' },
          ]}
        >
          Favoritos
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 64,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
    paddingHorizontal: 24,
  },
  navItem: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  navLabelActive: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 5,
  },
});
