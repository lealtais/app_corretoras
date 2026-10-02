import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

export type TabType = 'home' | 'statistics' | 'favorites';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onPressAdd: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  onPressAdd,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onSelectTab('statistics')}
        activeOpacity={0.7}
      >
        <Ionicons
          name={currentTab === 'statistics' ? 'bar-chart' : 'bar-chart-outline'}
          size={24}
          color={currentTab === 'statistics' ? theme.colors.primary : theme.colors.textMain}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.addButton}
        onPress={onPressAdd}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onSelectTab('favorites')}
        activeOpacity={0.7}
      >
        <Ionicons
          name={currentTab === 'favorites' ? 'heart' : 'heart-outline'}
          size={25}
          color={currentTab === 'favorites' ? theme.colors.favorite : theme.colors.textMain}
        />
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
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
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
