import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Property } from '../types/property';
import { PropertyCard } from '../components/PropertyCard';
import { Header } from '../components/Header';
import { SearchBar } from '../components/ui';
import { theme } from '../constants/theme';

interface HomeScreenProps {
  properties: Property[];
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onSelectProperty: (property: Property) => void;
  onToggleFavorite: (id: string) => void;
  onOpenAdvancedSearch: () => void;
  hasActiveAdvancedFilter: boolean;
  onClearFilter: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  properties,
  searchQuery,
  onSearchChange,
  onSelectProperty,
  onToggleFavorite,
  onOpenAdvancedSearch,
  hasActiveAdvancedFilter,
  onClearFilter,
}) => {
  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.searchSection}>
        <SearchBar
          value={searchQuery}
          onChangeText={onSearchChange}
          onClear={() => onSearchChange('')}
          onPressFilter={onOpenAdvancedSearch}
          isFilterActive={hasActiveAdvancedFilter}
        />

        {hasActiveAdvancedFilter && (
          <View style={styles.activeFilterRow}>
            <Text style={styles.activeFilterText}>Filtros avançados ativos</Text>
            <TouchableOpacity onPress={onClearFilter} style={styles.clearFilterBtn}>
              <Text style={styles.clearFilterText}>Limpar</Text>
              <Ionicons name="close" size={14} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <FlatList
        data={properties}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PropertyCard
            property={item}
            onPress={() => onSelectProperty(item)}
            onToggleFavorite={() => onToggleFavorite(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="home-outline" size={48} color={theme.colors.border} />
            <Text style={styles.emptyText}>Nenhum imóvel encontrado.</Text>
            <Text style={styles.emptySubtext}>Tente ajustar os termos da busca.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  activeFilterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  activeFilterText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  clearFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  clearFilterText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 13,
    color: theme.colors.textLight,
    marginTop: 4,
  },
});
