import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SearchFilter } from '../types/property';
import { Input, RangeInput, Badge, Button, IconButton } from '../components/ui';
import { theme } from '../constants/theme';

interface AdvancedSearchModalProps {
  visible: boolean;
  currentFilter: SearchFilter;
  isAdmin: boolean;
  onClose: () => void;
  onApply: (filter: SearchFilter) => void;
  onReset: () => void;
}

export const AdvancedSearchModal: React.FC<AdvancedSearchModalProps> = ({
  visible,
  currentFilter,
  isAdmin,
  onClose,
  onApply,
  onReset,
}) => {
  const [bedrooms, setBedrooms] = useState(
    currentFilter.bedrooms ? currentFilter.bedrooms.toString() : ''
  );
  const [maxBeachDistance, setMaxBeachDistance] = useState(
    currentFilter.maxBeachDistance !== undefined
      ? currentFilter.maxBeachDistance.toString()
      : ''
  );
  const [minPrice, setMinPrice] = useState(
    currentFilter.minPrice ? currentFilter.minPrice.toString() : ''
  );
  const [maxPrice, setMaxPrice] = useState(
    currentFilter.maxPrice ? currentFilter.maxPrice.toString() : ''
  );
  const [type, setType] = useState(currentFilter.type || 'Todos');
  const [location, setLocation] = useState(currentFilter.location || '');
  const [minArea, setMinArea] = useState(
    currentFilter.minArea ? currentFilter.minArea.toString() : ''
  );
  const [maxArea, setMaxArea] = useState(
    currentFilter.maxArea ? currentFilter.maxArea.toString() : ''
  );
  const [bathrooms, setBathrooms] = useState(
    currentFilter.bathrooms ? currentFilter.bathrooms.toString() : ''
  );
  const [parkingSpaces, setParkingSpaces] = useState(
    currentFilter.parkingSpaces ? currentFilter.parkingSpaces.toString() : ''
  );
  const [notesQuery, setNotesQuery] = useState(currentFilter.notesQuery || '');

  useEffect(() => {
    setBedrooms(currentFilter.bedrooms ? currentFilter.bedrooms.toString() : '');
    setMaxBeachDistance(
      currentFilter.maxBeachDistance !== undefined
        ? currentFilter.maxBeachDistance.toString()
        : ''
    );
    setMinPrice(currentFilter.minPrice ? currentFilter.minPrice.toString() : '');
    setMaxPrice(currentFilter.maxPrice ? currentFilter.maxPrice.toString() : '');
    setType(currentFilter.type || 'Todos');
    setLocation(currentFilter.location || '');
    setMinArea(currentFilter.minArea ? currentFilter.minArea.toString() : '');
    setMaxArea(currentFilter.maxArea ? currentFilter.maxArea.toString() : '');
    setBathrooms(currentFilter.bathrooms ? currentFilter.bathrooms.toString() : '');
    setParkingSpaces(
      currentFilter.parkingSpaces ? currentFilter.parkingSpaces.toString() : ''
    );
    setNotesQuery(currentFilter.notesQuery || '');
  }, [currentFilter, visible]);

  const handleApply = () => {
    const filter: SearchFilter = {};
    if (bedrooms) filter.bedrooms = parseInt(bedrooms, 10);
    if (maxBeachDistance !== '') {
      filter.maxBeachDistance = parseInt(maxBeachDistance.replace(/\D/g, ''), 10);
    }
    if (minPrice) filter.minPrice = parseFloat(minPrice.replace(/\D/g, ''));
    if (maxPrice) filter.maxPrice = parseFloat(maxPrice.replace(/\D/g, ''));
    if (type !== 'Todos') filter.type = type;
    if (location.trim()) filter.location = location.trim();
    if (minArea) filter.minArea = parseFloat(minArea);
    if (maxArea) filter.maxArea = parseFloat(maxArea);
    if (bathrooms) filter.bathrooms = parseInt(bathrooms, 10);
    if (parkingSpaces) filter.parkingSpaces = parseInt(parkingSpaces, 10);
    if (isAdmin && notesQuery.trim()) filter.notesQuery = notesQuery.trim();

    onApply(filter);
    onClose();
  };

  const handleClear = () => {
    setBedrooms('');
    setMaxBeachDistance('');
    setMinPrice('');
    setMaxPrice('');
    setType('Todos');
    setLocation('');
    setMinArea('');
    setMaxArea('');
    setBathrooms('');
    setParkingSpaces('');
    setNotesQuery('');
    onReset();
    onClose();
  };

  const propertyTypes = ['Todos', 'Apartamento', 'Casa', 'Cobertura', 'Terreno', 'Outros'];
  const beachOptions = [
    { label: 'Qualquer', val: '' },
    { label: 'Frente Mar (0m)', val: '0' },
    { label: 'Até 100m', val: '100' },
    { label: 'Até 250m', val: '250' },
    { label: 'Até 500m', val: '500' },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <IconButton
            variant="ghost"
            onPress={onClose}
            icon={<Ionicons name="arrow-back" size={24} color={theme.colors.textMain} />}
          />
          <Text style={styles.headerTitle}>Filtrar Imóveis</Text>
          <TouchableOpacity onPress={handleClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.clearBtnText}>Limpar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Número de Quartos (mínimo)</Text>
            <View style={styles.typesRow}>
              {[
                { label: 'Qualquer', val: '' },
                { label: '1+ quarto', val: '1' },
                { label: '2+ quartos', val: '2' },
                { label: '3+ quartos', val: '3' },
                { label: '4+ quartos', val: '4' },
              ].map((b) => (
                <Badge
                  key={b.val}
                  label={b.label}
                  selected={bedrooms === b.val}
                  onPress={() => setBedrooms(b.val)}
                />
              ))}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Distância Máxima da Praia</Text>
            <View style={styles.typesRow}>
              {beachOptions.map((opt) => (
                <Badge
                  key={opt.label}
                  label={opt.label}
                  selected={maxBeachDistance === opt.val}
                  onPress={() => setMaxBeachDistance(opt.val)}
                />
              ))}
            </View>
            <Input
              label="Distância máxima da praia (em metros)"
              placeholder="Ex: 300"
              keyboardType="numeric"
              value={maxBeachDistance}
              onChangeText={setMaxBeachDistance}
            />
          </View>

          <RangeInput
            label="Faixa de Preço (R$)"
            minValue={minPrice}
            maxValue={maxPrice}
            minPlaceholder="Preço Mínimo"
            maxPlaceholder="Preço Máximo"
            onChangeMin={setMinPrice}
            onChangeMax={setMaxPrice}
          />

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Tipo de Imóvel</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.typesRow}
            >
              {propertyTypes.map((t) => (
                <Badge key={t} label={t} selected={type === t} onPress={() => setType(t)} />
              ))}
            </ScrollView>
          </View>

          <Input
            label="Bairro / Região"
            placeholder="Ex: Canto do Forte, Guilhermina, Vila Tupi"
            value={location}
            onChangeText={setLocation}
          />

          <RangeInput
            label="Metragem (m²)"
            minValue={minArea}
            maxValue={maxArea}
            onChangeMin={setMinArea}
            onChangeMax={setMaxArea}
          />

          <Input
            label="Quant. banheiros (mínimo)"
            placeholder="Ex: 2"
            keyboardType="numeric"
            value={bathrooms}
            onChangeText={setBathrooms}
          />

          <Input
            label="Quant. vagas (mínimo)"
            placeholder="Ex: 1"
            keyboardType="numeric"
            value={parkingSpaces}
            onChangeText={setParkingSpaces}
          />

          {isAdmin && (
            <Input
              label="Buscar nas Anotações Internas"
              placeholder="Ex: proprietário, permuta, chaves"
              value={notesQuery}
              onChangeText={setNotesQuery}
            />
          )}

          <Button
            label="Aplicar Filtros"
            variant="primary"
            onPress={handleApply}
            style={styles.okButton}
          />
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 44,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textMain,
  },
  clearBtnText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  content: {
    padding: theme.spacing.xl,
    paddingBottom: 60,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 6,
    fontWeight: '700',
  },
  typesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 4,
  },
  okButton: {
    marginTop: 10,
  },
});
