import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../types/property';
import {
  supabaseLogin,
  supabaseRegister,
  supabaseSocialLogin,
} from '../services/supabase';

interface AuthScreenProps {
  onAuthenticated: (user: User) => void;
}

const BrandLogoIcon = () => (
  <Svg width={28} height={28} viewBox="0 0 28 28" fill="none">
    <Rect x={2} y={2} width={13} height={13} rx={3} fill="#FFFFFF" />
    <Rect x={13} y={13} width={13} height={13} rx={3} fill="#FFFFFF" />
  </Svg>
);

const GoogleColorIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path
      fill="#EA4335"
      d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.2 8.9 5 12 5z"
    />
    <Path
      fill="#4285F4"
      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.2-2 3.7-5 3.7-8.7z"
    />
    <Path
      fill="#FBBC05"
      d="M5.3 14.8c-.2-.8-.4-1.8-.4-2.8s.2-2 .4-2.8L1.6 6.4C.6 8.4 0 10.6 0 13s.6 4.6 1.6 6.6l3.7-2.8z"
    />
    <Path
      fill="#34A853"
      d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5l-3.7 2.8C3.5 19.9 7.4 23 12 23z"
    />
  </Svg>
);

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticated }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [socialModalProvider, setSocialModalProvider] = useState<
    'Google' | 'Facebook' | 'Apple' | null
  >(null);
  const [socialEmail, setSocialEmail] = useState('');

  const handleSubmit = async () => {
    setErrorMessage('');
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setErrorMessage('Preencha seu e-mail e sua senha.');
      return;
    }

    if (mode === 'register' && !name.trim()) {
      setErrorMessage('Informe seu nome para criar a conta.');
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
      setErrorMessage(err?.message || 'Erro ao autenticar.');
    }
  };

  const handleConfirmSocialLogin = async () => {
    if (!socialModalProvider) return;
    const chosenEmail =
      socialEmail.trim().toLowerCase() ||
      (email.trim().toLowerCase() || `${socialModalProvider.toLowerCase()}@corretoras.com`);

    setIsLoading(true);
    setErrorMessage('');
    try {
      const user = await supabaseSocialLogin(socialModalProvider, chosenEmail);
      setSocialModalProvider(null);
      setIsLoading(false);
      onAuthenticated(user);
    } catch (err: any) {
      setSocialModalProvider(null);
      setIsLoading(false);
      setErrorMessage(err?.message || 'Não foi possível entrar.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.cardContainer}>
          <View style={styles.logoWrapper}>
            <BrandLogoIcon />
          </View>

          <Text style={styles.title}>
            {mode === 'login' ? 'Bem-vindo de volta!' : 'Crie sua conta'}
          </Text>

          <Text style={styles.subtitle}>
            Encontre e gerencie imóveis em Praia Grande de forma visual, rápida e inteligente com a Corretoras de Sucesso Imóveis.
          </Text>

          {mode === 'register' && (
            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.darkInput}
                placeholder="Digite seu nome completo"
                placeholderTextColor="#71717A"
                value={name}
                onChangeText={setName}
              />
            </View>
          )}

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.darkInput}
              placeholder="seuemail@seudominio.com"
              placeholderTextColor="#71717A"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.darkInput}
              placeholder={mode === 'login' ? 'Digite sua senha' : 'Crie uma senha'}
              placeholderTextColor="#71717A"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {errorMessage !== '' && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={16} color="#F87171" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.signInButton}
            onPress={handleSubmit}
            activeOpacity={0.85}
            disabled={isLoading}
          >
            <Text style={styles.signInButtonText}>
              {isLoading
                ? 'Carregando...'
                : mode === 'login'
                ? 'Sign in'
                : 'Sign up'}
            </Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialRow}>
            <TouchableOpacity
              style={styles.socialButton}
              activeOpacity={0.8}
              onPress={() => {
                setSocialEmail(email);
                setSocialModalProvider('Google');
              }}
            >
              <GoogleColorIcon />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              activeOpacity={0.8}
              onPress={() => {
                setSocialEmail(email);
                setSocialModalProvider('Facebook');
              }}
            >
              <View style={styles.facebookCircle}>
                <Ionicons name="logo-facebook" size={20} color="#1877F2" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              activeOpacity={0.8}
              onPress={() => {
                setSocialEmail(email);
                setSocialModalProvider('Apple');
              }}
            >
              <Ionicons name="logo-apple" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerLabel}>
              {mode === 'login' ? 'Não tem uma conta? ' : 'Já possui uma conta? '}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setErrorMessage('');
              }}
            >
              <Text style={styles.footerAction}>
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={socialModalProvider !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSocialModalProvider(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              Continuar com {socialModalProvider}
            </Text>
            <Text style={styles.modalSubtitle}>
              Informe o e-mail da sua conta {socialModalProvider} para acessar:
            </Text>
            <TextInput
              style={styles.darkInput}
              placeholder={`seuemail@${socialModalProvider?.toLowerCase()}.com`}
              placeholderTextColor="#71717A"
              keyboardType="email-address"
              autoCapitalize="none"
              value={socialEmail}
              onChangeText={setSocialEmail}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setSocialModalProvider(null)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleConfirmSocialLogin}
              >
                <Text style={styles.modalConfirmText}>Continuar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#09090B',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 420,
  },
  logoWrapper: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#A1A1AA',
    lineHeight: 21,
    marginBottom: 28,
  },
  fieldBlock: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  darkInput: {
    backgroundColor: '#1C1C1F',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#27272A',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.35)',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  errorText: {
    color: '#F87171',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  signInButton: {
    backgroundColor: '#1C1C1F',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 26,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#27272A',
  },
  dividerText: {
    color: '#71717A',
    fontSize: 13,
    paddingHorizontal: 14,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  socialButton: {
    flex: 1,
    height: 52,
    backgroundColor: '#1C1C1F',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#27272A',
  },
  facebookCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerLabel: {
    color: '#71717A',
    fontSize: 13,
  },
  footerAction: {
    color: '#FF6B00',
    fontSize: 13,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#121215',
    borderRadius: 14,
    padding: 22,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#A1A1AA',
    marginBottom: 16,
    lineHeight: 18,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 18,
  },
  modalCancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#1C1C1F',
  },
  modalCancelText: {
    color: '#A1A1AA',
    fontSize: 13,
    fontWeight: '600',
  },
  modalConfirmBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#FF6B00',
  },
  modalConfirmText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
