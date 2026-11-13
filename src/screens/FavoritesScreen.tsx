import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Property, User } from '../types/property';
import { PropertyCard } from '../components/PropertyCard';
import { Header } from '../components/Header';
import { theme } from '../constants/theme';
import { BeachWeather, fetchPraiaGrandeWeather } from '../services/externalApis';
import { LucideWaves } from '../components/LucideIcons';

interface FavoritesScreenProps {
  properties: Property[];
  currentUser: User;
  onLogout: () => void;
  onSelectProperty: (property: Property) => void;
  onToggleFavorite: (id: string) => void;
  onPressHome: () => void;
}

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({
  properties,
  currentUser,
  onLogout,
  onSelectProperty,
  onToggleFavorite,
  onPressHome,
}) => {
  const favoriteProperties = properties.filter((p) => p.isFavorite);
  const [weather, setWeather] = useState<BeachWeather | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(false);

  useEffect(() => {
    let active = true;
    fetchPraiaGrandeWeather()
      .then((w) => {
        if (active) setWeather(w);
      })
      .catch(() => {
        if (active) setWeatherError(true);
      })
      .finally(() => {
        if (active) setWeatherLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const weatherBanner = (
    <View style={styles.weatherCard}>
      <View style={styles.weatherIconBox}>
        <LucideWaves size={22} color="#0369A1" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.weatherTitle}>Agora em Praia Grande</Text>
        {weatherLoading ? (
          <ActivityIndicator size="small" color="#0369A1" style={{ alignSelf: 'flex-start', marginTop: 4 }} />
        ) : weatherError || !weather ? (
          <Text style={styles.weatherSub}>Clima indisponível no momento</Text>
        ) : (
          <Text style={styles.weatherSub}>
            {weather.label} · vento {weather.windSpeed} km/h
          </Text>
        )}
      </View>
      {weather && !weatherLoading && (
        <Text style={styles.weatherTemp}>{weather.temperature}°</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Meus Imóveis Favoritos"
        onPressHome={onPressHome}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      <FlatList
        data={favoriteProperties}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={weatherBanner}
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
    paddingBottom: 108,
  },
  weatherCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F0F9FF',
    borderRadius: 20,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0F2FE',
  },
  weatherIconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0C4A6E',
  },
  weatherSub: {
    fontSize: 12,
    color: '#0369A1',
    marginTop: 2,
  },
  weatherTemp: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0C4A6E',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
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
