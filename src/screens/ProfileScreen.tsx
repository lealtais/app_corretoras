import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../types/property';
import { supabaseUpdateUserProfile } from '../services/supabase';
import { fetchAddressByCep } from '../services/externalApis';

interface ProfileScreenProps {
  currentUser: User;
  favoriteCount: number;
  onUpdateUser: (updated: User) => void;
  onLogout: () => void;
  onPressHome: () => void;
  onPressFavorites: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentUser,
  favoriteCount,
  onUpdateUser,
  onLogout,
  onPressFavorites,
}) => {
  const [name, setName] = useState(currentUser.name || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || '');
  const [city, setCity] = useState(currentUser.city || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [preferredRegion, setPreferredRegion] = useState(
    currentUser.preferredRegion || ''
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [cep, setCep] = useState('');
  const [cepStatus, setCepStatus] = useState('');

  const handleCepChange = async (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    setCep(digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits);
    if (digits.length !== 8) {
      setCepStatus('');
      return;
    }
    setCepStatus('Buscando endereço...');
    try {
      const address = await fetchAddressByCep(digits);
      const formatted = [address.neighborhood, `${address.city} - ${address.state}`]
        .filter(Boolean)
        .join(', ');
      setCity(formatted);
      setCepStatus(address.street ? `Encontrado: ${address.street}` : 'Endereço encontrado');
    } catch (err) {
      setCepStatus(err instanceof Error ? err.message : 'Não foi possível buscar o CEP');
    }
  };

  const rentalsCount =
    typeof currentUser.rentalsCount === 'number' ? currentUser.rentalsCount : 0;

  const initials = (currentUser.name || currentUser.email || 'U')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');

  const handlePickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedUri = result.assets[0].uri;
      setAvatarUrl(selectedUri);
      const updated: User = {
        ...currentUser,
        name: name.trim() || currentUser.name,
        avatarUrl: selectedUri,
        city: city.trim(),
        phone: phone.trim(),
        preferredRegion: preferredRegion.trim(),
        rentalsCount,
      };
      await supabaseUpdateUserProfile(updated);
      onUpdateUser(updated);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    const updated: User = {
      ...currentUser,
      name: name.trim() || currentUser.name,
      avatarUrl,
      city: city.trim(),
      phone: phone.trim(),
      preferredRegion: preferredRegion.trim(),
      rentalsCount,
    };
    await supabaseUpdateUserProfile(updated);
    onUpdateUser(updated);
    setIsSaving(false);
    setIsEditModalOpen(false);
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topHeaderRow}>
          <Text style={styles.pageTitle}>Perfil</Text>
          <TouchableOpacity onPress={onLogout} activeOpacity={0.7}>
            <Text style={styles.logoutTopText}>Sair</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heroCenter}>
          <View style={styles.avatarContainer}>
            <TouchableOpacity
              onPress={handlePickAvatar}
              activeOpacity={0.85}
              style={styles.avatarCircle}
            >
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarInitials}>{initials}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.editFloatingPill}
              onPress={() => setIsEditModalOpen(true)}
              activeOpacity={0.85}
            >
              <Ionicons name="create-outline" size={13} color="#2563EB" />
              <Text style={styles.editFloatingPillText}>Editar</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.profileName}>{currentUser.name}</Text>
          <Text style={styles.profileSub}>{currentUser.email}</Text>
        </View>

        <View style={styles.cardGroup}>
          <Text style={styles.cardGroupHeader}>CONTA</Text>

          <TouchableOpacity
            style={styles.rowItem}
            onPress={onPressFavorites}
            activeOpacity={0.7}
          >
            <View style={styles.rowIconBox}>
              <Ionicons name="bookmark" size={18} color="#5B6384" />
            </View>
            <Text style={styles.rowTitle}>Meus Favoritos</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{favoriteCount}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#64748B" />
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          <View style={styles.rowItem}>
            <View style={styles.rowIconBox}>
              <Ionicons name="time" size={18} color="#5B6384" />
            </View>
            <Text style={styles.rowTitle}>Vezes que já alugou</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{rentalsCount}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#64748B" />
          </View>
        </View>

        <Text style={styles.sectionHeading}>Informações</Text>

        <View style={styles.cardGroup}>
          <TouchableOpacity
            style={styles.rowItem}
            onPress={handlePickAvatar}
            activeOpacity={0.7}
          >
            <View style={styles.rowIconBoxCircle}>
              <Ionicons name="camera-outline" size={19} color="#1E293B" />
            </View>
            <Text style={styles.rowTitle}>Foto do Perfil</Text>
            <Text style={styles.rowValueText}>
              {avatarUrl ? 'Alterar' : 'Adicionar'}
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#64748B" />
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          <TouchableOpacity
            style={styles.rowItem}
            onPress={() => setIsEditModalOpen(true)}
            activeOpacity={0.7}
          >
            <View style={styles.rowIconBoxCircle}>
              <Ionicons name="location-outline" size={19} color="#1E293B" />
            </View>
            <Text style={styles.rowTitle}>Onde mora</Text>
            <Text style={styles.rowValueText} numberOfLines={1}>
              {currentUser.city || 'Opcional'}
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#64748B" />
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          <TouchableOpacity
            style={styles.rowItem}
            onPress={() => setIsEditModalOpen(true)}
            activeOpacity={0.7}
          >
            <View style={styles.rowIconBoxCircle}>
              <Ionicons name="call-outline" size={19} color="#1E293B" />
            </View>
            <Text style={styles.rowTitle}>Telefone / WhatsApp</Text>
            <Text style={styles.rowValueText} numberOfLines={1}>
              {currentUser.phone || 'Opcional'}
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#64748B" />
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          <TouchableOpacity
            style={styles.rowItem}
            onPress={() => setIsEditModalOpen(true)}
            activeOpacity={0.7}
          >
            <View style={styles.rowIconBoxCircle}>
              <Ionicons name="compass-outline" size={19} color="#1E293B" />
            </View>
            <Text style={styles.rowTitle}>Região preferida</Text>
            <Text style={styles.rowValueText} numberOfLines={1}>
              {currentUser.preferredRegion || 'Opcional'}
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#64748B" />
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          <TouchableOpacity
            style={styles.rowItem}
            onPress={onLogout}
            activeOpacity={0.7}
          >
            <View style={[styles.rowIconBoxCircle, { backgroundColor: '#FEF2F2' }]}>
              <Ionicons name="log-out-outline" size={19} color="#DC2626" />
            </View>
            <Text style={[styles.rowTitle, { color: '#DC2626' }]}>
              Sair da Conta
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#DC2626" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={isEditModalOpen}
        animationType="fade"
        transparent
        onRequestClose={() => setIsEditModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Informações</Text>
              <TouchableOpacity onPress={() => setIsEditModalOpen(false)}>
                <Ionicons name="close" size={22} color="#1E293B" />
              </TouchableOpacity>
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Nome</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Seu nome"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>CEP (preenche a cidade automaticamente)</Text>
              <TextInput
                style={styles.input}
                value={cep}
                onChangeText={handleCepChange}
                placeholder="Ex: 11700-000"
                placeholderTextColor="#94A3B8"
                keyboardType="number-pad"
                maxLength={9}
              />
              {cepStatus !== '' && <Text style={styles.cepStatus}>{cepStatus}</Text>}
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Onde mora (Opcional)</Text>
              <TextInput
                style={styles.input}
                value={city}
                onChangeText={setCity}
                placeholder="Ex: São Paulo - SP"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Telefone / WhatsApp (Opcional)</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Ex: (11) 99999-9999"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>
                Região preferida em Praia Grande (Opcional)
              </Text>
              <TextInput
                style={styles.input}
                value={preferredRegion}
                onChangeText={setPreferredRegion}
                placeholder="Ex: Canto do Forte, Boqueirão"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <TouchableOpacity
              style={styles.saveModalBtn}
              onPress={handleSaveProfile}
              disabled={isSaving}
              activeOpacity={0.85}
            >
              <Text style={styles.saveModalBtnText}>
                {isSaving ? 'Salvando...' : 'Salvar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 110,
  },
  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.3,
  },
  logoutTopText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#DC2626',
  },
  heroCenter: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    overflow: 'hidden',
    backgroundColor: '#1E293B',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E293B',
  },
  avatarInitials: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  editFloatingPill: {
    position: 'absolute',
    bottom: -10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  editFloatingPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginTop: 4,
  },
  profileSub: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 3,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#DFC467',
  },
  memberBadgeCheckIcon: {
    display: 'none',
  },
  memberShieldCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
    marginTop: 4,
  },
  cardGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 18,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 2,
  },
  cardGroupHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C859E',
    letterSpacing: 0.8,
    marginTop: 6,
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    gap: 14,
  },
  rowIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F3F4F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIconBoxCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F3F6FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  rowValueText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    maxWidth: 140,
  },
  countBadge: {
    backgroundColor: '#F3F4F8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  countBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5B6384',
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 54,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  fieldBlock: {
    marginBottom: 14,
  },
  cepStatus: {
    fontSize: 11,
    color: '#2563EB',
    marginTop: 5,
    fontWeight: '500',
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  saveModalBtn: {
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 6,
  },
  saveModalBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
