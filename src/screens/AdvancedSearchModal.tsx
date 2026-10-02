import React, { useState } from 'react';
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
  onClose: () => void;
  onApply: (filter: SearchFilter) => void;
  onReset: () => void;
}

export const AdvancedSearchModal: React.FC<AdvancedSearchModalProps> = ({
  visible,
  currentFilter,
  onClose,
  onApply,
  onReset,
}) => {
  const [name, setName] = useState(currentFilter.name || '');
  const [type, setType] = useState(currentFilter.type || 'Todos');
  const [location, setLocation] = useState(currentFilter.location || '');
  const [minArea, setMinArea] = useState(currentFilter.minArea ? currentFilter.minArea.toString() : '');
  const [maxArea, setMaxArea] = useState(currentFilter.maxArea ? currentFilter.maxArea.toString() : '');
  const [minPrice, setMinPrice] = useState(currentFilter.minPrice ? currentFilter.minPrice.toString() : '');
  const [maxPrice, setMaxPrice] = useState(currentFilter.maxPrice ? currentFilter.maxPrice.toString() : '');
  const [minCondo, setMinCondo] = useState(currentFilter.minCondominium ? currentFilter.minCondominium.toString() : '');
  const [maxCondo, setMaxCondo] = useState(currentFilter.maxCondominium ? currentFilter.maxCondominium.toString() : '');
  const [minIptu, setMinIptu] = useState(currentFilter.minIptu ? currentFilter.minIptu.toString() : '');
  const [maxIptu, setMaxIptu] = useState(currentFilter.maxIptu ? currentFilter.maxIptu.toString() : '');
  const [bedrooms, setBedrooms] = useState(currentFilter.bedrooms ? currentFilter.bedrooms.toString() : '');
  const [bathrooms, setBathrooms] = useState(currentFilter.bathrooms ? currentFilter.bathrooms.toString() : '');
  const [parkingSpaces, setParkingSpaces] = useState(currentFilter.parkingSpaces ? currentFilter.parkingSpaces.toString() : '');
  const [notesQuery, setNotesQuery] = useState(currentFilter.notesQuery || '');

  const handleApply = () => {
    const filter: SearchFilter = {};
    if (name.trim()) filter.name = name.trim();
    if (type !== 'Todos') filter.type = type;
    if (location.trim()) filter.location = location.trim();
    if (minArea) filter.minArea = parseFloat(minArea);
    if (maxArea) filter.maxArea = parseFloat(maxArea);
    if (minPrice) filter.minPrice = parseFloat(minPrice.replace(/\D/g, ''));
    if (maxPrice) filter.maxPrice = parseFloat(maxPrice.replace(/\D/g, ''));
    if (minCondo) filter.minCondominium = parseFloat(minCondo.replace(/\D/g, ''));
    if (maxCondo) filter.maxCondominium = parseFloat(maxCondo.replace(/\D/g, ''));
    if (minIptu) filter.minIptu = parseFloat(minIptu.replace(/\D/g, ''));
    if (maxIptu) filter.maxIptu = parseFloat(maxIptu.replace(/\D/g, ''));
    if (bedrooms) filter.bedrooms = parseInt(bedrooms, 10);
    if (bathrooms) filter.bathrooms = parseInt(bathrooms, 10);
    if (parkingSpaces) filter.parkingSpaces = parseInt(parkingSpaces, 10);
    if (notesQuery.trim()) filter.notesQuery = notesQuery.trim();

    onApply(filter);
    onClose();
  };

  const handleClear = () => {
    setName('');
    setType('Todos');
    setLocation('');
    setMinArea('');
    setMaxArea('');
    setMinPrice('');
    setMaxPrice('');
    setMinCondo('');
    setMaxCondo('');
    setMinIptu('');
    setMaxIptu('');
    setBedrooms('');
    setBathrooms('');
    setParkingSpaces('');
    setNotesQuery('');
    onReset();
    onClose();
  };

  const propertyTypes = ['Todos', 'Apartamento', 'Casa', 'Cobertura', 'Terreno', 'Outros'];

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <IconButton
            variant="ghost"
            onPress={onClose}
            icon={<Ionicons name="arrow-back" size={24} color={theme.colors.textMain} />}
          />
          <Text style={styles.headerTitle}>Busca avançada</Text>
          <TouchableOpacity onPress={handleClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.clearBtnText}>Limpar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Nome */}
          <Input label="Nome do imóvel" placeholder="Nome" value={name} onChangeText={setName} />

          {/* Tipo via Badges */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Tipo</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.typesRow}>
              {propertyTypes.map((t) => (
                <Badge
                  key={t}
                  label={t}
                  selected={type === t}
                  onPress={() => setType(t)}
                />
              ))}
            </ScrollView>
          </View>

          {/* Localização */}
          <Input label="Localização" placeholder="Bairro ou cidade" value={location} onChangeText={setLocation} />

          {/* Metragem Range */}
          <RangeInput
            label="Metragem (m²)"
            minValue={minArea}
            maxValue={maxArea}
            onChangeMin={setMinArea}
            onChangeMax={setMaxArea}
          />

          {/* Preço Range */}
          <RangeInput
            label="Preço (R$)"
            minValue={minPrice}
            maxValue={maxPrice}
            minPlaceholder="Mínimo"
            maxPlaceholder="Máximo"
            onChangeMin={setMinPrice}
            onChangeMax={setMaxPrice}
          />

          {/* Condomínio Range */}
          <RangeInput
            label="Condomínio (opcional)"
            minValue={minCondo}
            maxValue={maxCondo}
            onChangeMin={setMinCondo}
            onChangeMax={setMaxCondo}
          />

          {/* IPTU Range */}
          <RangeInput
            label="IPTU"
            minValue={minIptu}
            maxValue={maxIptu}
            onChangeMin={setMinIptu}
            onChangeMax={setMaxIptu}
          />

          {/* Quartos */}
          <Input
            label="Quant. quartos (mínimo)"
            placeholder="Ex: 3"
            keyboardType="numeric"
            value={bedrooms}
            onChangeText={setBedrooms}
          />

          {/* Banheiros */}
          <Input
            label="Quant. banheiros (mínimo)"
            placeholder="Ex: 2"
            keyboardType="numeric"
            value={bathrooms}
            onChangeText={setBathrooms}
          />

          {/* Vagas */}
          <Input
            label="Quant. vagas (opcional)"
            placeholder="Ex: 2"
            keyboardType="numeric"
            value={parkingSpaces}
            onChangeText={setParkingSpaces}
          />

          {/* Anotações */}
          <Input
            label="Anotações (palavra-chave)"
            placeholder="Ex: elevador, piscina, frente mar"
            value={notesQuery}
            onChangeText={setNotesQuery}
          />

          {/* Botão OK */}
          <Button
            label="OK"
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
    paddingTop: 48,
    paddingBottom: 16,
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
    fontWeight: '500',
  },
  typesRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  okButton: {
    marginTop: 10,
  },
});
