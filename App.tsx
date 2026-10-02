import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { Property } from './src/types/property';
import { useProperties } from './src/hooks/useProperties';
import { BottomNav, TabType } from './src/components/BottomNav';
import { HomeScreen } from './src/screens/HomeScreen';
import { FavoritesScreen } from './src/screens/FavoritesScreen';
import { StatisticsScreen } from './src/screens/StatisticsScreen';
import { PropertyDetailModal } from './src/screens/PropertyDetailModal';
import { PropertyFormModal } from './src/screens/PropertyFormModal';
import { AdvancedSearchModal } from './src/screens/AdvancedSearchModal';

export default function App() {
  const {
    filteredProperties,
    favoriteProperties,
    statistics,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    hasActiveAdvancedFilter,
    clearFilter,
    toggleFavorite,
    saveProperty,
    deleteProperty,
  } = useProperties();

  const [currentTab, setCurrentTab] = useState<TabType>('home');

  // Modals state
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState<Property | null>(null);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);

  // Sync selectedProperty when mutated
  const handleToggleFavorite = (id: string) => {
    toggleFavorite(id);
    if (selectedProperty && selectedProperty.id === id) {
      setSelectedProperty({
        ...selectedProperty,
        isFavorite: !selectedProperty.isFavorite,
      });
    }
  };

  const handleSaveProperty = (saved: Property) => {
    saveProperty(saved);
    if (selectedProperty && selectedProperty.id === saved.id) {
      setSelectedProperty(saved);
    }
  };

  const handleDeleteProperty = (id: string) => {
    deleteProperty(id);
    if (selectedProperty && selectedProperty.id === id) {
      setSelectedProperty(null);
    }
  };

  const handleOpenEdit = (property: Property) => {
    setPropertyToEdit(property);
    setIsFormOpen(true);
  };

  const handleOpenAdd = () => {
    setPropertyToEdit(null);
    setIsFormOpen(true);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar style="dark" />

        <View style={styles.container}>
          {currentTab === 'home' && (
            <HomeScreen
              properties={filteredProperties}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSelectProperty={(prop) => setSelectedProperty(prop)}
              onToggleFavorite={handleToggleFavorite}
              onOpenAdvancedSearch={() => setIsAdvancedSearchOpen(true)}
              hasActiveAdvancedFilter={hasActiveAdvancedFilter}
              onClearFilter={clearFilter}
            />
          )}

          {currentTab === 'statistics' && (
            <StatisticsScreen
              statistics={statistics}
              onPressHome={() => setCurrentTab('home')}
            />
          )}

          {currentTab === 'favorites' && (
            <FavoritesScreen
              properties={favoriteProperties}
              onSelectProperty={(prop) => setSelectedProperty(prop)}
              onToggleFavorite={handleToggleFavorite}
              onPressHome={() => setCurrentTab('home')}
            />
          )}
        </View>

        <BottomNav
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          onPressAdd={handleOpenAdd}
        />

        {/* Modal: Detalhes do Imóvel */}
        <PropertyDetailModal
          visible={!!selectedProperty}
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onEdit={handleOpenEdit}
          onToggleFavorite={handleToggleFavorite}
        />

        {/* Modal: Novo Imóvel / Editar Imóvel */}
        <PropertyFormModal
          visible={isFormOpen}
          propertyToEdit={propertyToEdit}
          onClose={() => {
            setIsFormOpen(false);
            setPropertyToEdit(null);
          }}
          onSave={handleSaveProperty}
          onDelete={handleDeleteProperty}
        />

        {/* Modal: Busca Avançada */}
        <AdvancedSearchModal
          visible={isAdvancedSearchOpen}
          currentFilter={activeFilter}
          onClose={() => setIsAdvancedSearchOpen(false)}
          onApply={(filter) => setActiveFilter(filter)}
          onReset={clearFilter}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
