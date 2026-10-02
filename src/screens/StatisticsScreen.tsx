import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Header } from '../components/Header';
import { PieChart, PieData } from '../components/PieChart';
import { MetricCard } from '../components/ui';
import { theme } from '../constants/theme';

interface StatisticsData {
  totalCount: number;
  soldCount: number;
  apartmentsCount: number;
  housesCount: number;
  penthousesCount: number;
  landsCount: number;
  othersCount: number;
}

interface StatisticsScreenProps {
  statistics: StatisticsData;
  onPressHome: () => void;
}

export const StatisticsScreen: React.FC<StatisticsScreenProps> = ({
  statistics,
  onPressHome,
}) => {
  const pieData: PieData[] = [
    { label: 'Apartamento', count: statistics.apartmentsCount, color: theme.colors.pieApartment },
    { label: 'Casa', count: statistics.housesCount, color: theme.colors.pieHouse },
    { label: 'Cobertura', count: statistics.penthousesCount, color: theme.colors.piePenthouse },
    { label: 'Terreno', count: statistics.landsCount, color: theme.colors.pieLand },
    { label: 'Outros', count: statistics.othersCount, color: theme.colors.pieOthers },
  ].filter((item) => item.count > 0);

  return (
    <View style={styles.container}>
      <Header title="Estatísticas" onPressHome={onPressHome} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Metric Cards Grid - 2 columns using MetricCard */}
        <View style={styles.grid}>
          <MetricCard label="Imóveis cadastrados" value={statistics.totalCount} />
          <MetricCard label="Vendidos" value={statistics.soldCount} />
          <MetricCard label="Apartamento" value={statistics.apartmentsCount} />
          <MetricCard label="Casa" value={statistics.housesCount} />
          <MetricCard label="Cobertura" value={statistics.penthousesCount} />
          <MetricCard label="Outros" value={statistics.othersCount} />
          <MetricCard label="Terreno" value={statistics.landsCount} />
        </View>

        {/* Section title for Pie Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>Distribuição por Tipo</Text>
          <PieChart data={pieData} size={180} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: 40,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  chartSection: {
    marginTop: 24,
    backgroundColor: '#FAFAFA',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textMain,
    marginBottom: 10,
  },
});
