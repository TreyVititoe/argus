import { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "@/components/ScreenHeader";
import { colors } from "@/lib/theme";
import { formatCurrency } from "@/lib/format";
import topTransactions from "@/data/top-transactions.json";

interface TopTransaction {
  agency: string;
  state: string;
  year: number;
  company: string;
  keyword: string;
  total: number;
}

const txs = topTransactions as TopTransaction[];

export default function CustomersTab() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return txs;
    return txs.filter(
      (t) =>
        t.agency.toLowerCase().includes(q) ||
        t.company.toLowerCase().includes(q) ||
        t.keyword.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.headerWrap}>
        <ScreenHeader
          eyebrow="Customer Activity"
          title="Customers"
          subtitle={`Top ${txs.length} transactions by amount · showing ${filtered.length}`}
        />

        <View style={styles.searchRow}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Filter by agency, vendor, keyword..."
            placeholderTextColor={colors.ink4}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.search}
          />
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.agency} numberOfLines={1}>
                {item.agency}
              </Text>
              <View style={styles.metaRow}>
                <Text style={styles.meta}>{item.state}</Text>
                <Text style={styles.metaDot}>·</Text>
                <Text style={styles.meta}>{item.year}</Text>
                <Text style={styles.metaDot}>·</Text>
                <Text style={styles.meta} numberOfLines={1}>
                  {item.company}
                </Text>
              </View>
            </View>
            <Text style={styles.amount}>{formatCurrency(item.total)}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No transactions match that filter.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  headerWrap: { paddingHorizontal: 24, paddingTop: 24 },
  searchRow: { marginTop: 8, marginBottom: 14 },
  search: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.ink,
  },
  list: { paddingHorizontal: 24, paddingBottom: 32 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  rowLeft: { flex: 1, minWidth: 0 },
  agency: { fontSize: 14, fontWeight: "600", color: colors.ink },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 3 },
  meta: { fontSize: 11, color: colors.ink3, flexShrink: 1 },
  metaDot: { fontSize: 11, color: colors.ink4 },
  amount: { fontSize: 14, fontWeight: "700", color: colors.ink, fontVariant: ["tabular-nums"] },
  sep: { height: 1, backgroundColor: colors.line, opacity: 0.5 },
  empty: { textAlign: "center", color: colors.ink3, marginTop: 32 },
});
