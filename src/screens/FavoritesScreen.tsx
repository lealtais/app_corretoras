import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Property } from '../types/property';
import { PropertyCard } from '../components/PropertyCard';
import { Header } from '../components/Header';
import { theme } from '../constants/theme';

interface FavoritesScreenProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onToggleFavorite: (id: string) => void;
  onPressHome: () => void;
}

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({
  properties,
  onSelectProperty,
  onToggleFavorite,
  onPressHome,
}) => {
  const favoriteProperties = properties.filter((p) => p.isFavorite);

  return (
    <View style={styles.container}>
      <Header title="Favoritos" onPressHome={onPressHome} />

      <FlatList
        data={favoriteProperties}
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
            <Ionicons name="heart-outline" size={56} color={theme.colors.border} />
            <Text style={styles.emptyTitle}>Nenhum imóvel favoritado</Text>
            <Text style={styles.emptySubtitle}>
              Toque no coração nos cards para salvar seus imóveis prediletos aqui.
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
  listContent: {
    padding: theme.spacing.lg,
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textMain,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
});
