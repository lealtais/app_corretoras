import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

const { width } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
  customLogoUri?: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  customLogoUri,
}) => {
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const haloScale = useRef(new Animated.Value(0.8)).current;
  const haloOpacity = useRef(new Animated.Value(0)).current;

  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(20)).current;

  const progressScale = useRef(new Animated.Value(0)).current;
  const screenFadeOut = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(haloOpacity, {
          toValue: 0.35,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(haloScale, {
          toValue: 1.25,
          friction: 3,
          useNativeDriver: true,
        }),
      ]),

      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),

      Animated.timing(progressScale, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),

      Animated.timing(screenFadeOut, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onFinish();
    });
  }, [logoScale, logoOpacity, haloScale, haloOpacity, textOpacity, textTranslateY, progressScale, screenFadeOut, onFinish]);

  const handleSkip = () => {
    Animated.timing(screenFadeOut, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      onFinish();
    });
  };

  return (
    <Animated.View style={[styles.container, { opacity: screenFadeOut }]}>
      <TouchableOpacity
        style={styles.skipButton}
        onPress={handleSkip}
        activeOpacity={0.6}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Text style={styles.skipText}>Pular</Text>
        <Ionicons name="chevron-forward" size={14} color={theme.colors.textLight} />
      </TouchableOpacity>

      <View style={styles.centerContent}>
        <Animated.View
          style={[
            styles.halo,
            {
              opacity: haloOpacity,
              transform: [{ scale: haloScale }],
            },
          ]}
        />

        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          {customLogoUri ? (
            <Image
              source={{ uri: customLogoUri }}
              style={styles.customLogoImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.iconWrapper}>
              <Ionicons name="business" size={48} color={theme.colors.primary} />
            </View>
          )}
        </Animated.View>

        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: textOpacity,
              transform: [{ translateY: textTranslateY }],
            },
          ]}
        >
          <View style={styles.titleRow}>
            <Text style={styles.titleMain}>Corretoras</Text>
            <Text style={styles.titleHighlight}>de Sucesso</Text>
          </View>
          <Text style={styles.subtitle}>Gestão Imobiliária Inteligente</Text>
        </Animated.View>

        <View style={styles.progressBarBackground}>
          <Animated.View
            style={[
              styles.progressBarFill,
              { transform: [{ scaleX: progressScale }] },
            ]}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.versionText}>v1.0.0 • Mobile Suite</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: theme.colors.borderLight,
  },
  skipText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    marginRight: 2,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: theme.colors.primaryLight,
  },
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1.5,
    borderColor: theme.colors.primaryLight,
  },
  customLogoImage: {
    width: 70,
    height: 70,
  },
  iconWrapper: {
    width: 76,
    height: 76,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  titleMain: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.textMain,
    letterSpacing: -0.5,
  },
  titleHighlight: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.primary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontWeight: '500',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  progressBarBackground: {
    width: width * 0.55,
    height: 4,
    backgroundColor: theme.colors.borderLight,
    borderRadius: 2,
    marginTop: 36,
    overflow: 'hidden',
  },
  progressBarFill: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 11,
    color: theme.colors.textLight,
    fontWeight: '500',
    letterSpacing: 0.8,
  },
});
