import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Property } from '../types/property';
import { Input, Button, Badge, IconButton } from '../components/ui';
import { theme } from '../constants/theme';

interface PropertyFormModalProps {
  visible: boolean;
  propertyToEdit?: Property | null;
  onClose: () => void;
  onSave: (property: Property) => void;
  onDelete?: (id: string) => void;
}

export const PropertyFormModal: React.FC<PropertyFormModalProps> = ({
  visible,
  propertyToEdit,
  onClose,
  onSave,
  onDelete,
}) => {
  const isEditing = !!propertyToEdit;

  const [name, setName] = useState('');
  const [type, setType] = useState<'Apartamento' | 'Casa' | 'Cobertura' | 'Terreno' | 'Outros'>('Apartamento');
  const [location, setLocation] = useState('');
  const [area, setArea] = useState('');
  const [price, setPrice] = useState('');
  const [condominium, setCondominium] = useState('');
  const [iptu, setIptu] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [parkingSpaces, setParkingSpaces] = useState('');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (propertyToEdit) {
      setName(propertyToEdit.name);
      setType(propertyToEdit.type);
      setLocation(propertyToEdit.location);
      setArea(propertyToEdit.area.toString());
      setPrice(propertyToEdit.price.toString());
      setCondominium(propertyToEdit.condominium ? propertyToEdit.condominium.toString() : '');
      setIptu(propertyToEdit.iptu ? propertyToEdit.iptu.toString() : '');
      setBedrooms(propertyToEdit.bedrooms.toString());
      setBathrooms(propertyToEdit.bathrooms.toString());
      setParkingSpaces(propertyToEdit.parkingSpaces ? propertyToEdit.parkingSpaces.toString() : '');
      setNotes(propertyToEdit.notes.join('\n'));
      setImageUrl(propertyToEdit.imageUrl);
    } else {
      setName('');
      setType('Apartamento');
      setLocation('');
      setArea('');
      setPrice('');
      setCondominium('');
      setIptu('');
      setBedrooms('');
      setBathrooms('');
      setParkingSpaces('');
      setNotes('');
      setImageUrl('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80');
    }
  }, [propertyToEdit, visible]);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Atenção', 'Informe o nome do imóvel.');
      return;
    }
    if (!location.trim()) {
      Alert.alert('Atenção', 'Informe a localização do imóvel.');
      return;
    }
    const parsedPrice = parseFloat(price.replace(/\D/g, '')) || 0;
    if (parsedPrice <= 0) {
      Alert.alert('Atenção', 'Informe um preço válido.');
      return;
    }

    const notesList = notes
      .split('\n')
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    const savedProperty: Property = {
      id: propertyToEdit ? propertyToEdit.id : Date.now().toString(),
      name: name.trim(),
      type,
      location: location.trim(),
      area: parseFloat(area) || 0,
      price: parsedPrice,
      condominium: condominium ? parseFloat(condominium.replace(/\D/g, '')) : undefined,
      iptu: iptu ? parseFloat(iptu.replace(/\D/g, '')) : undefined,
      bedrooms: parseInt(bedrooms, 10) || 0,
      bathrooms: parseInt(bathrooms, 10) || 0,
      parkingSpaces: parkingSpaces ? parseInt(parkingSpaces, 10) : 0,
      notes: notesList,
      isFavorite: propertyToEdit ? propertyToEdit.isFavorite : false,
      status: propertyToEdit ? propertyToEdit.status : 'Disponível',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    };

    onSave(savedProperty);
    onClose();
  };

  const propertyTypes: Array<'Apartamento' | 'Casa' | 'Cobertura' | 'Terreno' | 'Outros'> = [
    'Apartamento',
    'Casa',
    'Cobertura',
    'Terreno',
    'Outros',
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header matching Figma */}
        <View style={styles.header}>
          <IconButton
            variant="ghost"
            onPress={onClose}
            icon={<Ionicons name="arrow-back" size={24} color={theme.colors.textMain} />}
          />
          <Text style={styles.headerTitle}>{isEditing ? 'Editar imóvel' : 'Novo imóvel'}</Text>
          <IconButton
            variant="ghost"
            icon={<Ionicons name="image-outline" size={26} color={theme.colors.textMain} />}
          />
        </View>

        <ScrollView contentContainerStyle={styles.formContent} showsVerticalScrollIndicator={false}>
          {/* Nome do imóvel */}
          <Input
            label="Nome do imóvel"
            placeholder="Ex: Casa condomínio Canto do Forte"
            value={name}
            onChangeText={setName}
          />

          {/* Tipo Selector via Reusable Badges */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Tipo</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.typeSelectorRow}>
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
          <Input
            label="Localização"
            placeholder="Ex: Canto do Forte, Praia Grande"
            value={location}
            onChangeText={setLocation}
          />

          {/* Metragem */}
          <Input
            label="Metragem (m²)"
            placeholder="Ex: 800"
            keyboardType="numeric"
            value={area}
            onChangeText={setArea}
          />

          {/* Preço */}
          <Input
            label="Preço (R$)"
            placeholder="Ex: 2.800.000"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />

          {/* Condomínio */}
          <Input
            label="Condomínio (opcional)"
            placeholder="Ex: 1.000"
            keyboardType="numeric"
            value={condominium}
            onChangeText={setCondominium}
          />

          {/* IPTU */}
          <Input
            label="IPTU"
            placeholder="Ex: 200"
            keyboardType="numeric"
            value={iptu}
            onChangeText={setIptu}
          />

          {/* Quant. quartos */}
          <Input
            label="Quant. quartos"
            placeholder="Ex: 4"
            keyboardType="numeric"
            value={bedrooms}
            onChangeText={setBedrooms}
          />

          {/* Quant. banheiros */}
          <Input
            label="Quant. banheiros"
            placeholder="Ex: 5"
            keyboardType="numeric"
            value={bathrooms}
            onChangeText={setBathrooms}
          />

          {/* Quant. vagas */}
          <Input
            label="Quant. vagas (opcional)"
            placeholder="Ex: 2"
            keyboardType="numeric"
            value={parkingSpaces}
            onChangeText={setParkingSpaces}
          />

          {/* Anotações */}
          <Input
            label="Anotações"
            placeholder="Ex: Proprietário: (13) 99009-5719&#10;Com elevador&#10;Móveis planejados"
            multiline
            value={notes}
            onChangeText={setNotes}
          />

          {/* Orange OK button matching Figma */}
          <Button
            label="OK"
            variant="primary"
            onPress={handleSave}
            style={styles.okButton}
          />

          {isEditing && onDelete && (
            <Button
              label="Excluir Imóvel"
              variant="danger"
              onPress={() => {
                Alert.alert('Excluir Imóvel', 'Tem certeza que deseja remover este imóvel?', [
                  { text: 'Cancelar', style: 'cancel' },
                  {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: () => {
                      onDelete(propertyToEdit.id);
                      onClose();
                    },
                  },
                ]);
              }}
              style={styles.deleteButton}
            />
          )}
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
  formContent: {
    padding: theme.spacing.xl,
    paddingBottom: 60,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 5,
    fontWeight: '500',
  },
  typeSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  okButton: {
    marginTop: 10,
  },
  deleteButton: {
    marginTop: 14,
  },
});
