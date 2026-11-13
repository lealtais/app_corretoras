import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Property, SearchFilter, User } from '../types/property';
import { PropertyCard } from '../components/PropertyCard';
import { Header } from '../components/Header';
import { SearchBar } from '../components/ui';
import { theme } from '../constants/theme';

interface HomeScreenProps {
  properties: Property[];
  searchQuery: string;
  onSearchChange: (text: string) => void;
  activeFilter: SearchFilter;
  onUpdateFilter: (filter: SearchFilter) => void;
  onSelectProperty: (property: Property) => void;
  onToggleFavorite: (id: string) => void;
  onOpenAdvancedSearch: () => void;
  hasActiveAdvancedFilter: boolean;
  onClearFilter: () => void;
  currentUser: User;
  onLogout: () => void;
}

interface QuickChip {
  key: string;
  label: string;
  isActive: (f: SearchFilter) => boolean;
  toggle: (f: SearchFilter) => SearchFilter;
}

const QUICK_CHIPS: QuickChip[] = [
  {
    key: 'beach-0',
    label: 'Frente Mar',
    isActive: (f) => f.maxBeachDistance === 0,
    toggle: (f) => ({ ...f, maxBeachDistance: f.maxBeachDistance === 0 ? undefined : 0 }),
  },
  {
    key: 'beach-200',
    label: 'Até 200m da praia',
    isActive: (f) => f.maxBeachDistance === 200,
    toggle: (f) => ({ ...f, maxBeachDistance: f.maxBeachDistance === 200 ? undefined : 200 }),
  },
  ...[2, 3, 4].map((q) => ({
    key: `bed-${q}`,
    label: `${q}+ quartos`,
    isActive: (f: SearchFilter) => f.bedrooms === q,
    toggle: (f: SearchFilter) => ({ ...f, bedrooms: f.bedrooms === q ? undefined : q }),
  })),
  {
    key: 'price-950',
    label: 'Até R$ 950 mil',
    isActive: (f) => f.maxPrice === 950000,
    toggle: (f) => ({ ...f, maxPrice: f.maxPrice === 950000 ? undefined : 950000 }),
  },
  {
    key: 'price-1500',
    label: 'Até R$ 1,5 mi',
    isActive: (f) => f.maxPrice === 1500000,
    toggle: (f) => ({ ...f, maxPrice: f.maxPrice === 1500000 ? undefined : 1500000 }),
  },
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  properties,
  searchQuery,
  onSearchChange,
  activeFilter,
  onUpdateFilter,
  onSelectProperty,
  onToggleFavorite,
  onOpenAdvancedSearch,
  hasActiveAdvancedFilter,
  onClearFilter,
  currentUser,
  onLogout,
}) => {
  return (
    <View style={styles.container}>
      <Header currentUser={currentUser} onLogout={onLogout} />

      <View style={styles.searchSection}>
        <SearchBar
          value={searchQuery}
          onChangeText={onSearchChange}
          onClear={() => onSearchChange('')}
          onPressFilter={onOpenAdvancedSearch}
          isFilterActive={hasActiveAdvancedFilter}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickFiltersRow}
        >
          {QUICK_CHIPS.map((chip) => {
            const active = chip.isActive(activeFilter);
            return (
              <TouchableOpacity
                key={chip.key}
                style={[styles.filterChip, active && styles.filterChipActive]}
                onPress={() => onUpdateFilter(chip.toggle(activeFilter))}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                  {chip.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {hasActiveAdvancedFilter && (
          <View style={styles.activeFilterRow}>
            <Text style={styles.activeFilterText}>
              {properties.length} imóvel(is) encontrado(s) com os filtros ativos
            </Text>
            <TouchableOpacity onPress={onClearFilter} style={styles.clearFilterBtn}>
              <Text style={styles.clearFilterText}>Limpar filtros</Text>
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
            <Text style={styles.emptySubtext}>
              Tente ajustar o número de quartos, distância da praia ou faixa de preço.
            </Text>
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
    paddingTop: theme.spacing.md,
    paddingBottom: 8,
  },
  quickFiltersRow: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 10,
    paddingBottom: 4,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textMain,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
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
    paddingBottom: 108,
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
    textAlign: 'center',
  },
});
