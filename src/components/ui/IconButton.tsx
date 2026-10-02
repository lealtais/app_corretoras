import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TouchableOpacityProps,
} from 'react-native';
import { theme } from '../../constants/theme';

interface IconButtonProps extends TouchableOpacityProps {
  icon: React.ReactNode;
  variant?: 'surface' | 'ghost' | 'primary';
  size?: number;
  style?: ViewStyle;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  variant = 'surface',
  size = 38,
  style,
  ...rest
}) => {
  const getContainerStyle = (): ViewStyle[] => {
    const list: ViewStyle[] = [
      styles.base,
      { width: size, height: size, borderRadius: size / 2 },
    ];

    if (variant === 'surface') list.push(styles.surface);
    else if (variant === 'primary') list.push(styles.primary);
    else list.push(styles.ghost);

    if (style) list.push(style);

    return list;
  };

  return (
    <TouchableOpacity
      style={getContainerStyle()}
      activeOpacity={0.75}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      {...rest}
    >
      {icon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  surface: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 3,
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
});
