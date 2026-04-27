import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "@/components/ScreenHeader";
import { colors } from "@/lib/theme";
import { formatCurrency } from "@/lib/format";
import stats from "@/data/dashboard-stats.json";

const companies = (stats as { topCompanies: { name: string; spend: number }[] }).topCompanies;
const total = companies.reduce((s, c) => s + c.spend, 0) || 1;

export default function ResellersTab() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ScreenHeader
          eyebrow="Channel Partners"
          title="Resellers"
          subtitle={`Top ${companies.length} resellers by tracked spend`}
        />
        <View style={styles.list}>
          {companies.map((c, i) => {
            const pct = (c.spend / total) * 100;
            return (
              <View key={c.name} style={styles.row}>
                <Text style={styles.rank}>{i + 1}</Text>
                <View style={styles.middle}>
                  <Text style={styles.name} numberOfLines={1}>
                    {c.name}
                  </Text>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { width: `${Math.max(pct, 1)}%` }]} />
                  </View>
                </View>
                <View style={styles.right}>
                  <Text style={styles.amount}>{formatCurrency(c.spend)}</Text>
                  <Text style={styles.share}>{pct.toFixed(1)}%</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: 24, paddingBottom: 48 },
  list: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  rank: { width: 22, fontSize: 11, fontWeight: "700", color: colors.ink4, textAlign: "right" },
  middle: { flex: 1, minWidth: 0 },
  name: { fontSize: 14, fontWeight: "600", color: colors.ink },
  barTrack: {
    height: 4,
    backgroundColor: colors.surfaceLow,
    borderRadius: 2,
    marginTop: 6,
    overflow: "hidden",
  },
  barFill: { height: "100%", backgroundColor: colors.accent },
  right: { alignItems: "flex-end", minWidth: 78 },
  amount: { fontSize: 13, fontWeight: "700", color: colors.ink, fontVariant: ["tabular-nums"] },
  share: { fontSize: 11, color: colors.ink3, fontVariant: ["tabular-nums"] },
});
