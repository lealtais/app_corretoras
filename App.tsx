import React, { useState } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { Property, User } from './src/types/property';
import {
  useProperties,
  useFavorites,
  usePropertyFilters,
} from './src/hooks';
import { BottomNav, TabType } from './src/components/BottomNav';
import { HomeScreen } from './src/screens/HomeScreen';
import { FavoritesScreen } from './src/screens/FavoritesScreen';
import { AuthScreen } from './src/screens/AuthScreen';
import { PropertyDetailModal } from './src/screens/PropertyDetailModal';
import { PropertyFormModal } from './src/screens/PropertyFormModal';
import { AdvancedSearchModal } from './src/screens/AdvancedSearchModal';
import { SplashScreen } from './src/screens/SplashScreen';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  const activeRole = currentUser?.role || 'client';
  const isAdmin = activeRole === 'admin';

  const {
    properties,
    setProperties,
    saveProperty,
    deleteProperty,
  } = useProperties(activeRole);
  const { favoriteProperties, toggleFavorite } = useFavorites(properties, setProperties);
  const {
    filteredProperties,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    hasActiveAdvancedFilter,
    clearFilter,
  } = usePropertyFilters(properties, activeRole);

  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState<Property | null>(null);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);

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
    if (!isAdmin) return;
    setPropertyToEdit(property);
    setIsFormOpen(true);
  };

  const handleOpenAdd = () => {
    if (!isAdmin) return;
    setPropertyToEdit(null);
    setIsFormOpen(true);
  };

  const handleLogout = () => {
    setSelectedProperty(null);
    setIsFormOpen(false);
    setPropertyToEdit(null);
    setCurrentTab('home');
    setCurrentUser(null);
  };

  return (
    <SafeAreaProvider>
      {isSplashVisible && (
        <SplashScreen onFinish={() => setIsSplashVisible(false)} />
      )}
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />

        {!currentUser ? (
          <AuthScreen onAuthenticated={(user) => setCurrentUser(user)} />
        ) : (
          <>
            <View style={styles.container}>
              {currentTab === 'home' && (
                <HomeScreen
                  properties={filteredProperties}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  activeFilter={activeFilter}
                  onUpdateFilter={setActiveFilter}
                  onSelectProperty={(prop) => setSelectedProperty(prop)}
                  onToggleFavorite={handleToggleFavorite}
                  onOpenAdvancedSearch={() => setIsAdvancedSearchOpen(true)}
                  hasActiveAdvancedFilter={hasActiveAdvancedFilter}
                  onClearFilter={clearFilter}
                  currentUser={currentUser}
                  onLogout={handleLogout}
                />
              )}

              {currentTab === 'favorites' && (
                <FavoritesScreen
                  properties={favoriteProperties}
                  currentUser={currentUser}
                  onLogout={handleLogout}
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
              isAdmin={isAdmin}
            />

            <PropertyDetailModal
              visible={!!selectedProperty}
              property={selectedProperty}
              isAdmin={isAdmin}
              onClose={() => setSelectedProperty(null)}
              onEdit={handleOpenEdit}
              onToggleFavorite={handleToggleFavorite}
            />

            {isAdmin && (
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
            )}

            <AdvancedSearchModal
              visible={isAdvancedSearchOpen}
              currentFilter={activeFilter}
              isAdmin={isAdmin}
              onClose={() => setIsAdvancedSearchOpen(false)}
              onApply={(filter) => setActiveFilter(filter)}
              onReset={clearFilter}
            />
          </>
        )}
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
