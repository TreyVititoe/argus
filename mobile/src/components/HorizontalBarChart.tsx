import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/lib/theme";
import { formatCurrency } from "@/lib/format";

export interface BarRow {
  name: string;
  value: number;
}

interface HorizontalBarChartProps {
  rows: BarRow[];
  topN?: number;
}

// Lightweight SVG-free bar chart — just a row of <View>s with width
// proportional to the row's value. Works without RN Svg paying off here
// since the visual is just rectangles.
export default function HorizontalBarChart({ rows, topN = 8 }: HorizontalBarChartProps) {
  const sorted = [...rows].sort((a, b) => b.value - a.value).slice(0, topN);
  const max = sorted[0]?.value || 1;

  return (
    <View style={styles.list}>
      {sorted.map((r, i) => (
        <View key={r.name} style={styles.row}>
          <Text style={styles.rank}>{i + 1}</Text>
          <View style={styles.middle}>
            <Text style={styles.name} numberOfLines={1}>
              {r.name}
            </Text>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${Math.max((r.value / max) * 100, 1)}%` }]} />
            </View>
          </View>
          <Text style={styles.amount}>{formatCurrency(r.value)}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 8 },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  rank: { width: 18, fontSize: 11, fontWeight: "700", color: colors.ink4, textAlign: "right" },
  middle: { flex: 1, minWidth: 0 },
  name: { fontSize: 12, fontWeight: "600", color: colors.ink },
  barTrack: {
    height: 5,
    backgroundColor: colors.surfaceLow,
    borderRadius: 3,
    marginTop: 4,
    overflow: "hidden",
  },
  barFill: { height: "100%", backgroundColor: colors.accent, borderRadius: 3 },
  amount: {
    minWidth: 60,
    fontSize: 12,
    fontWeight: "700",
    color: colors.ink,
    fontVariant: ["tabular-nums"],
    textAlign: "right",
  },
});
