import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "@/components/ScreenHeader";
import { colors } from "@/lib/theme";
import { formatCurrency } from "@/lib/format";
import stats from "@/data/dashboard-stats.json";

const vendors = (stats as { topVendors: { name: string; spend: number }[] }).topVendors;
const total = vendors.reduce((s, v) => s + v.spend, 0) || 1;

export default function VendorsTab() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ScreenHeader
          eyebrow="Manufacturers"
          title="Vendors"
          subtitle={`Top ${vendors.length} product vendors by tracked spend`}
        />
        <View style={styles.list}>
          {vendors.map((v, i) => {
            const pct = (v.spend / total) * 100;
            return (
              <View key={v.name} style={styles.row}>
                <Text style={styles.rank}>{i + 1}</Text>
                <View style={styles.middle}>
                  <Text style={styles.name} numberOfLines={1}>
                    {v.name}
                  </Text>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { width: `${Math.max(pct, 1)}%` }]} />
                  </View>
                </View>
                <View style={styles.right}>
                  <Text style={styles.amount}>{formatCurrency(v.spend)}</Text>
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
