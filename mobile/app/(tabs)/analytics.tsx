import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "@/components/ScreenHeader";
import AreaTrendChart from "@/components/AreaTrendChart";
import HorizontalBarChart from "@/components/HorizontalBarChart";
import { colors } from "@/lib/theme";
import { formatCurrency } from "@/lib/format";
import stats from "@/data/dashboard-stats.json";

interface YearSpend {
  year: number;
  spend: number;
}

interface DashboardStats {
  yearSpend: YearSpend[];
  topVendors: { name: string; spend: number }[];
  topAgencies: { name: string; spend: number }[];
}

const s = stats as DashboardStats;

export default function AnalyticsTab() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ScreenHeader eyebrow="Deep Dive" title="Analytics" />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Spend by year</Text>
          <Text style={styles.cardMeta}>{s.yearSpend.length} years tracked</Text>
          <View style={{ marginTop: 8 }}>
            <AreaTrendChart data={s.yearSpend} />
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(s.yearSpend.reduce((sum, y) => sum + y.spend, 0))}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Top vendors by spend</Text>
          <Text style={styles.cardMeta}>Top 8 of {s.topVendors.length}</Text>
          <View style={{ marginTop: 12 }}>
            <HorizontalBarChart
              rows={s.topVendors.map((v) => ({ name: v.name, value: v.spend }))}
              topN={8}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Top agencies by contract value</Text>
          <Text style={styles.cardMeta}>Top 8 of {s.topAgencies.length}</Text>
          <View style={{ marginTop: 12 }}>
            <HorizontalBarChart
              rows={s.topAgencies.map((a) => ({ name: a.name, value: a.spend }))}
              topN={8}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 24, paddingBottom: 48 },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: colors.ink, marginBottom: 4 },
  cardMeta: { fontSize: 11, color: colors.ink3 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: colors.ink4,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.ink,
    fontVariant: ["tabular-nums"],
  },
});
