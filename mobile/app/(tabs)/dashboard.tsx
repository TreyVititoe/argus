import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "@/components/ScreenHeader";
import KpiTile from "@/components/KpiTile";
import DonutChart from "@/components/DonutChart";
import HorizontalBarChart from "@/components/HorizontalBarChart";
import { colors } from "@/lib/theme";
import { formatCurrency } from "@/lib/format";
import { useSession } from "@/lib/session";
import stats from "@/data/dashboard-stats.json";

interface DashboardStats {
  totalSpend: number;
  totalTransactions: number;
  totalAgencies: number;
  expiringCount: number;
  activeCount: number;
  topAgencies: { name: string; spend: number; count: number; lastYear: number; type: string; state: string }[];
  topCompanies: { name: string; spend: number }[];
  topVendors: { name: string; spend: number }[];
  states: { code: string; name: string; count: number; spend: number }[];
}

const s = stats as DashboardStats;

export default function DashboardTab() {
  const { session } = useSession();
  const email = session?.user?.email ?? "";

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          eyebrow="Market Overview"
          title="Dashboard"
          subtitle={email ? `Signed in as ${email}` : undefined}
        />

        <View style={styles.kpiRow}>
          <KpiTile label="Total Contract Value" value={formatCurrency(s.totalSpend)} delta="across all years" />
          <KpiTile label="Transactions" value={s.totalTransactions.toLocaleString()} delta={`${s.totalAgencies} agencies`} />
          <KpiTile label="Renewal Window" value={String(s.expiringCount)} delta="3-5 years out" deltaTone="positive" />
          <KpiTile label="Active Agencies" value={String(s.activeCount)} delta="last 2 years" />
        </View>

        <Text style={styles.sectionTitle}>Top vendors by spend</Text>
        <View style={styles.card}>
          <DonutChart slices={s.topVendors.map((v) => ({ name: v.name, value: v.spend }))} />
        </View>

        <Text style={styles.sectionTitle}>Top resellers by spend</Text>
        <View style={styles.card}>
          <DonutChart slices={s.topCompanies.map((c) => ({ name: c.name, value: c.spend }))} />
        </View>

        <Text style={styles.sectionTitle}>Top agencies by contract value</Text>
        <View style={styles.card}>
          <HorizontalBarChart
            rows={s.topAgencies.map((a) => ({ name: a.name, value: a.spend }))}
            topN={8}
          />
        </View>

        <Text style={styles.sectionTitle}>States</Text>
        <View style={styles.list}>
          {s.states.map((st, i) => (
            <Row
              key={st.code}
              index={i + 1}
              primary={`${st.name} (${st.code})`}
              secondary={`${st.count.toLocaleString()} txns · ${formatCurrency(st.spend)}`}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ index, primary, secondary }: { index: number; primary: string; secondary: string }) {
  return (
    <View style={rowStyles.row}>
      <Text style={rowStyles.rank}>{index}</Text>
      <Text style={rowStyles.primary} numberOfLines={1}>
        {primary}
      </Text>
      <Text style={rowStyles.secondary} numberOfLines={1}>
        {secondary}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 24, paddingBottom: 48 },
  kpiRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 28 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.ink,
    marginBottom: 12,
    marginTop: 4,
    letterSpacing: -0.3,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },
  list: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    paddingVertical: 4,
    marginBottom: 24,
  },
});

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 10,
  },
  rank: {
    width: 22,
    fontSize: 11,
    fontWeight: "700",
    color: colors.ink4,
    textAlign: "right",
  },
  primary: { flex: 1, fontSize: 14, fontWeight: "600", color: colors.ink },
  secondary: { fontSize: 13, color: colors.ink3, fontVariant: ["tabular-nums"] },
});
