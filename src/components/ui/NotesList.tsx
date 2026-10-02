import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

interface NotesListProps {
  title?: string;
  notes: string[];
}

export const NotesList: React.FC<NotesListProps> = ({
  title = 'Anotações:',
  notes,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {notes && notes.length > 0 ? (
        notes.map((note, index) => (
          <View key={index} style={styles.bulletRow}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>{note}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>Nenhuma anotação cadastrada.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    borderStyle: 'dashed',
    padding: theme.spacing.lg,
    backgroundColor: '#FAFAFA',
    marginBottom: 24,
    width: '100%',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textMain,
    marginBottom: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  bulletDot: {
    fontSize: 14,
    color: theme.colors.textMain,
    marginRight: 8,
    lineHeight: 20,
  },
  bulletText: {
    fontSize: 13,
    color: theme.colors.textMain,
    flex: 1,
    lineHeight: 20,
  },
  emptyText: {
    fontSize: 13,
    color: theme.colors.textLight,
    fontStyle: 'italic',
  },
});
