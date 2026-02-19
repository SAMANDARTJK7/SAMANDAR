import { useMemo, useState } from 'react';
import {
  FlatList,
  Keyboard,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type TradeEntry = {
  id: string;
  amount: number;
  createdAt: Date;
};

const currencyFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  minimumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  dateStyle: 'short',
  timeStyle: 'short',
});

export default function App() {
  const [amountInput, setAmountInput] = useState('');
  const [entries, setEntries] = useState<TradeEntry[]>([]);

  const totalBalance = useMemo(
    () => entries.reduce((sum, entry) => sum + entry.amount, 0),
    [entries],
  );

  const addEntry = () => {
    const parsedValue = Number(amountInput.replace(',', '.'));
    if (!Number.isFinite(parsedValue) || parsedValue === 0) {
      return;
    }

    const nextEntry: TradeEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      amount: parsedValue,
      createdAt: new Date(),
    };

    setEntries((currentEntries) => [nextEntry, ...currentEntries]);
    setAmountInput('');
    Keyboard.dismiss();
  };

  const removeEntry = (id: string) => {
    setEntries((currentEntries) =>
      currentEntries.filter((entry) => entry.id !== id),
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Трейдинг Дневник</Text>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Общий баланс</Text>
          <Text
            style={[
              styles.balanceValue,
              totalBalance >= 0 ? styles.positive : styles.negative,
            ]}
          >
            {currencyFormatter.format(totalBalance)}
          </Text>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.sectionLabel}>Сумма сделки</Text>
          <TextInput
            value={amountInput}
            onChangeText={setAmountInput}
            style={styles.input}
            keyboardType="decimal-pad"
            placeholder="Например: 1500 или -700"
            placeholderTextColor="#667085"
            returnKeyType="done"
            onSubmitEditing={addEntry}
          />
          <Pressable style={styles.addButton} onPress={addEntry}>
            <Text style={styles.addButtonText}>Добавить запись</Text>
          </Pressable>
        </View>

        <View style={styles.listSection}>
          <Text style={styles.sectionLabel}>История сделок</Text>

          <FlatList
            data={entries}
            keyExtractor={(entry) => entry.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={
              entries.length === 0 ? styles.emptyListContent : undefined
            }
            ListEmptyComponent={
              <Text style={styles.emptyText}>Записей пока нет.</Text>
            }
            renderItem={({ item }) => (
              <View style={styles.entryCard}>
                <View style={styles.entryTextBlock}>
                  <Text
                    style={[
                      styles.entryAmount,
                      item.amount >= 0 ? styles.positive : styles.negative,
                    ]}
                  >
                    {currencyFormatter.format(item.amount)}
                  </Text>
                  <Text style={styles.entryDate}>
                    {dateFormatter.format(item.createdAt)}
                  </Text>
                </View>

                <Pressable
                  style={styles.deleteButton}
                  onPress={() => removeEntry(item.id)}
                >
                  <Text style={styles.deleteButtonText}>Удалить</Text>
                </Pressable>
              </View>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090B',
  },
  content: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 16,
  },
  title: {
    color: '#F5F5F5',
    fontSize: 26,
    fontWeight: '700',
  },
  balanceCard: {
    backgroundColor: '#111114',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1F1F24',
  },
  balanceLabel: {
    color: '#A1A1AA',
    fontSize: 14,
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: '700',
  },
  inputSection: {
    backgroundColor: '#111114',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1F1F24',
    padding: 16,
    gap: 12,
  },
  sectionLabel: {
    color: '#E4E4E7',
    fontSize: 15,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#18181B',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#27272A',
    color: '#FAFAFA',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 17,
  },
  addButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 12,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  listSection: {
    flex: 1,
    backgroundColor: '#111114',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1F1F24',
    padding: 16,
    gap: 12,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyText: {
    color: '#71717A',
    textAlign: 'center',
    fontSize: 14,
  },
  entryCard: {
    backgroundColor: '#18181B',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#27272A',
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  entryTextBlock: {
    gap: 4,
    flex: 1,
  },
  entryAmount: {
    fontSize: 18,
    fontWeight: '700',
  },
  entryDate: {
    color: '#A1A1AA',
    fontSize: 13,
  },
  deleteButton: {
    backgroundColor: '#27272A',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  deleteButtonText: {
    color: '#E4E4E7',
    fontSize: 13,
    fontWeight: '600',
  },
  positive: {
    color: '#22C55E',
  },
  negative: {
    color: '#EF4444',
  },
});
