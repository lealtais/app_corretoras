import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

interface AmenitiesGridProps {
  bedrooms: number;
  bathrooms: number;
  parkingSpaces?: number;
}

export const AmenitiesGrid: React.FC<AmenitiesGridProps> = ({
  bedrooms,
  bathrooms,
  parkingSpaces = 0,
}) => {
  return (
    <View style={styles.metricsBox}>
      <View style={styles.metricColumn}>
        <Text style={styles.metricNumber}>{bedrooms}</Text>
        <Text style={styles.metricLabel}>Quartos</Text>
      </View>
      <View style={styles.metricDivider} />
      <View style={styles.metricColumn}>
        <Text style={styles.metricNumber}>{bathrooms}</Text>
        <Text style={styles.metricLabel}>Banheiros</Text>
      </View>
      <View style={styles.metricDivider} />
      <View style={styles.metricColumn}>
        <Text style={styles.metricNumber}>{parkingSpaces}</Text>
        <Text style={styles.metricLabel}>Vagas</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  metricsBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 20,
    width: '100%',
  },
  metricColumn: {
    alignItems: 'center',
  },
  metricNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.textMain,
  },
  metricLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 36,
    backgroundColor: theme.colors.border,
  },
});
