import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { theme } from '../../constants/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = true,
  disabled,
  style,
  textStyle,
  ...rest
}) => {
  const getContainerStyle = (): ViewStyle[] => {
    const list: ViewStyle[] = [styles.base];

    if (fullWidth) list.push(styles.fullWidth);

    // Size
    if (size === 'sm') list.push(styles.sizeSm);
    else if (size === 'lg') list.push(styles.sizeLg);
    else list.push(styles.sizeMd);

    // Variant
    if (variant === 'primary') list.push(styles.variantPrimary);
    else if (variant === 'secondary') list.push(styles.variantSecondary);
    else if (variant === 'outline') list.push(styles.variantOutline);
    else if (variant === 'danger') list.push(styles.variantDanger);

    if (disabled || loading) list.push(styles.disabled);

    if (style) list.push(style);

    return list;
  };

  const getTextStyle = (): TextStyle[] => {
    const list: TextStyle[] = [styles.baseText];

    if (size === 'sm') list.push(styles.textSm);
    else if (size === 'lg') list.push(styles.textLg);
    else list.push(styles.textMd);

    if (variant === 'primary') list.push(styles.textPrimary);
    else if (variant === 'secondary') list.push(styles.textSecondary);
    else if (variant === 'outline') list.push(styles.textOutline);
    else if (variant === 'danger') list.push(styles.textDanger);

    if (textStyle) list.push(textStyle);

    return list;
  };

  return (
    <TouchableOpacity
      style={getContainerStyle()}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'secondary' ? theme.colors.primary : '#FFFFFF'}
        />
      ) : (
        <>
          {leftIcon}
          <Text style={getTextStyle()}>{label}</Text>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.borderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  fullWidth: {
    width: '100%',
  },
  sizeSm: {
    height: 36,
    paddingHorizontal: 12,
  },
  sizeMd: {
    height: 48,
    paddingHorizontal: 16,
  },
  sizeLg: {
    height: 54,
    paddingHorizontal: 20,
  },
  variantPrimary: {
    backgroundColor: theme.colors.primary,
  },
  variantSecondary: {
    backgroundColor: theme.colors.borderLight,
  },
  variantOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  variantDanger: {
    backgroundColor: '#FEE2E2',
  },
  disabled: {
    opacity: 0.5,
  },
  baseText: {
    fontWeight: '700',
  },
  textSm: {
    fontSize: 13,
  },
  textMd: {
    fontSize: 15,
  },
  textLg: {
    fontSize: 17,
  },
  textPrimary: {
    color: '#FFFFFF',
  },
  textSecondary: {
    color: theme.colors.textMain,
  },
  textOutline: {
    color: theme.colors.textMain,
  },
  textDanger: {
    color: theme.colors.favorite,
  },
});
