import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { theme } from '../constants/theme';

const screenWidth = Dimensions.get('window').width;

export const SalesLineChart: React.FC = () => {
  const actualSalesData = [
    { value: 3.2, label: 'Jan', dataPointText: '3.2M' },
    { value: 3.8, label: 'Fev', dataPointText: '3.8M' },
    { value: 3.5, label: 'Mar', dataPointText: '3.5M' },
    { value: 2.1, label: 'Abr', dataPointText: '2.1M' },
    { value: 1.2, label: 'Mai', dataPointText: '1.2M' },
    { value: 0.6, label: 'Jun', dataPointText: '0.6M' },
  ];

  const targetSalesData = [
    { value: 3.0 },
    { value: 3.4 },
    { value: 3.8 },
    { value: 4.0 },
    { value: 4.2 },
    { value: 4.5 },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Evolução de Vendas</Text>
      </View>

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendIndicator, { backgroundColor: '#10B981' }]} />
          <Text style={styles.legendLabel}>Meta</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendIndicator, { backgroundColor: '#EF4444' }]} />
          <Text style={styles.legendLabel}>Vendas</Text>
        </View>
      </View>

      <View style={styles.chartWrapper}>
        <LineChart
          data={actualSalesData}
          data2={targetSalesData}
          height={160}
          width={screenWidth - 100}
          spacing={42}
          initialSpacing={15}
          color1="#EF4444"
          color2="#10B981"
          textColor1="#EF4444"
          dataPointsColor1="#EF4444"
          dataPointsColor2="#10B981"
          dataPointsRadius1={5}
          dataPointsRadius2={4}
          textFontSize1={10}
          textShiftY={-8}
          textShiftX={-10}
          thickness1={3}
          thickness2={2}
          strokeDashArray2={[5, 5]}
          curved
          rulesType="dashed"
          rulesColor="#E5E7EB"
          yAxisColor="transparent"
          xAxisColor="#E5E7EB"
          yAxisTextStyle={styles.axisText}
          xAxisLabelTextStyle={styles.axisText}
          maxValue={5}
          noOfSections={4}
          isAnimated
          animationDuration={800}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: '#FAFAFA',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textMain,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 16,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendIndicator: {
    width: 14,
    height: 4,
    borderRadius: 2,
  },
  legendLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 4,
  },
  axisText: {
    color: theme.colors.textLight,
    fontSize: 10,
  },
});
