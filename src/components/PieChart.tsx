import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import { theme } from '../constants/theme';

export interface PieData {
  label: string;
  count: number;
  color: string;
}

interface PieChartProps {
  data: PieData[];
  size?: number;
}

export const PieChart: React.FC<PieChartProps> = ({ data, size = 160 }) => {
  const total = data.reduce((acc, item) => acc + item.count, 0);

  if (total === 0) {
    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <Text style={styles.emptyText}>Sem dados</Text>
      </View>
    );
  }

  const radius = size / 2;
  const center = size / 2;

  // Function to calculate SVG arc path
  const getCoordinatesForPercent = (percent: number) => {
    const x = center + radius * Math.cos(2 * Math.PI * percent);
    const y = center + radius * Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  let cumulativePercent = 0;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <G rotation="-90" origin={`${center}, ${center}`}>
          {data.map((slice, index) => {
            if (slice.count === 0) return null;

            const slicePercent = slice.count / total;
            const startPercent = cumulativePercent;
            cumulativePercent += slicePercent;

            if (slicePercent >= 0.999) {
              // Full circle
              return (
                <Path
                  key={index}
                  d={`M ${center} ${center} m -${radius}, 0 a ${radius},${radius} 0 1,0 ${radius * 2},0 a ${radius},${radius} 0 1,0 -${radius * 2},0`}
                  fill={slice.color}
                />
              );
            }

            const [startX, startY] = getCoordinatesForPercent(startPercent);
            const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
            const largeArcFlag = slicePercent > 0.5 ? 1 : 0;

            const pathData = [
              `M ${center} ${center}`,
              `L ${startX} ${startY}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              'Z',
            ].join(' ');

            return <Path key={index} d={pathData} fill={slice.color} />;
          })}
        </G>
      </Svg>

      <View style={styles.legendContainer}>
        {data.map((item, idx) => {
          const percent = Math.round((item.count / total) * 100);
          return (
            <View key={idx} style={styles.legendItem}>
              <View style={[styles.colorSquare, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>
                {item.label} ({item.count} - {percent}%)
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 12,
  },
  emptyText: {
    color: theme.colors.textLight,
    marginTop: 60,
  },
  legendContainer: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
  },
  colorSquare: {
    width: 12,
    height: 12,
    borderRadius: 3,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
});
