import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../types/property';
import { Input, Button } from '../components/ui';
import { theme } from '../constants/theme';
import { AGENCY_CONFIG } from '../constants/agency';
import { supabaseLogin, supabaseRegister } from '../services/supabase';

interface AuthScreenProps {
  onAuthenticated: (user: User) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticated }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setErrorMessage('');
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setErrorMessage('Por favor, preencha o e-mail e a senha.');
      return;
    }

    if (mode === 'register' && !name.trim()) {
      setErrorMessage('Por favor, informe seu nome completo.');
      return;
    }

    setIsLoading(true);
    try {
      const user =
        mode === 'login'
          ? await supabaseLogin(trimmedEmail, trimmedPassword)
          : await supabaseRegister(name.trim(), trimmedEmail, trimmedPassword);
      setIsLoading(false);
      onAuthenticated(user);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err?.message || 'Erro ao autenticar no banco de dados.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.brandSection}>
          <View style={styles.logoCircle}>
            <Ionicons name="business" size={38} color={theme.colors.primary} />
          </View>
          <Text style={styles.brandTitle}>Corretoras de Sucesso Imóveis</Text>
          <Text style={styles.brandSubtitle}>
            Encontre seu imóvel ideal em Praia Grande
          </Text>
          <View style={styles.addressBadge}>
            <Ionicons name="location-outline" size={13} color={theme.colors.primary} />
            <Text style={styles.addressText}>{AGENCY_CONFIG.address}</Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <View style={styles.tabsRow}>
            <TouchableOpacity
              style={[styles.tabButton, mode === 'login' && styles.tabButtonActive]}
              onPress={() => {
                setMode('login');
                setErrorMessage('');
              }}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  mode === 'login' && styles.tabButtonTextActive,
                ]}
              >
                Entrar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                mode === 'register' && styles.tabButtonActive,
              ]}
              onPress={() => {
                setMode('register');
                setErrorMessage('');
              }}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  mode === 'register' && styles.tabButtonTextActive,
                ]}
              >
                Criar Conta
              </Text>
            </TouchableOpacity>
          </View>

          {mode === 'register' && (
            <Input
              label="Nome completo"
              placeholder="Digite seu nome"
              value={name}
              onChangeText={setName}
            />
          )}

          <Input
            label="E-mail"
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Input
            label="Senha"
            placeholder="Digite sua senha"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {errorMessage !== '' && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={16} color="#DC2626" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          <Button
            label={
              isLoading
                ? 'Carregando...'
                : mode === 'login'
                ? 'Entrar'
                : 'Cadastrar e Acessar'
            }
            onPress={handleSubmit}
            style={styles.submitBtn}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 36,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoCircle: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.textMain,
    textAlign: 'center',
  },
  brandSubtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  addressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 10,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  addressText: {
    fontSize: 11,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
    elevation: 1,
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  tabButtonTextActive: {
    color: theme.colors.primary,
    fontWeight: '800',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '600',
    flex: 1,
  },
  submitBtn: {
    marginTop: 8,
  },
});
