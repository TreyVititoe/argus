import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "@/components/ScreenHeader";
import { colors } from "@/lib/theme";
import { formatCurrency } from "@/lib/format";
import stats from "@/data/dashboard-stats.json";

interface YearSpend {
  year: number;
  spend: number;
}

const ys = (stats as { yearSpend: YearSpend[] }).yearSpend;
const maxSpend = Math.max(...ys.map((y) => y.spend), 1);

export default function AnalyticsTab() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ScreenHeader
          eyebrow="Deep Dive"
          title="Analytics"
          subtitle="Spend by year. Charts coming next."
        />
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Spend by year</Text>
          <View style={styles.bars}>
            {ys.map((y) => {
              const pct = (y.spend / maxSpend) * 100;
              return (
                <View key={y.year} style={styles.barRow}>
                  <Text style={styles.year}>{y.year}</Text>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { width: `${Math.max(pct, 1)}%` }]} />
                  </View>
                  <Text style={styles.amount}>{formatCurrency(y.spend)}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.note}>
          <Text style={styles.noteEyebrow}>Coming next</Text>
          <Text style={styles.noteBody}>
            Click-to-drill on bars and slices, the same expand-modal as the web, and a charts library
            (`victory-native`). The bones of the breakdowns ship in the web Analytics page already.
          </Text>
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
    marginBottom: 24,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: colors.ink, marginBottom: 14 },
  bars: { gap: 10 },
  barRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  year: { width: 38, fontSize: 12, fontWeight: "600", color: colors.ink3 },
  barTrack: {
    flex: 1,
    height: 16,
    backgroundColor: colors.surfaceLow,
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: { height: "100%", backgroundColor: colors.accent },
  amount: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.ink,
    fontVariant: ["tabular-nums"],
    minWidth: 60,
    textAlign: "right",
  },
  note: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    padding: 16,
  },
  noteEyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: colors.accent,
    marginBottom: 6,
  },
  noteBody: { fontSize: 13, color: colors.ink3, lineHeight: 18 },
});
