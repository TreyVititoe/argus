import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, G, Path } from "react-native-svg";
import { colors } from "@/lib/theme";
import { formatCurrency } from "@/lib/format";

export interface DonutSlice {
  name: string;
  value: number;
}

interface DonutChartProps {
  slices: DonutSlice[];
  /** How many top entries to show as discrete slices; the rest are bucketed into "Other". */
  topN?: number;
  /** Outer diameter in px. */
  size?: number;
  /** Stroke thickness; the chart is rendered as a single circle path with strokeDasharray segments. */
  thickness?: number;
}

const PALETTE = [
  colors.accent,
  "#7BA593",
  "#A0341E",
  "#C68A2E",
  "#446679",
  "#8A8579",
];

// Convert a polar angle to a cartesian point on the circle's edge.
function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, start: number, end: number) {
  const startPt = polar(cx, cy, r, end);
  const endPt = polar(cx, cy, r, start);
  const large = end - start <= 180 ? 0 : 1;
  return `M ${startPt.x} ${startPt.y} A ${r} ${r} 0 ${large} 0 ${endPt.x} ${endPt.y}`;
}

export default function DonutChart({ slices, topN = 5, size = 180, thickness = 26 }: DonutChartProps) {
  const data = useMemo(() => {
    const sorted = [...slices].sort((a, b) => b.value - a.value);
    const top = sorted.slice(0, topN);
    const otherSum = sorted.slice(topN).reduce((s, r) => s + r.value, 0);
    return otherSum > 0 ? [...top, { name: "Other", value: otherSum }] : top;
  }, [slices, topN]);

  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - thickness) / 2;
  const leader = data[0];

  let cursor = 0;
  const segments = data.map((d, i) => {
    const sweep = (d.value / total) * 360;
    const start = cursor;
    const end = Math.min(cursor + sweep, 359.9999); // avoid full-circle path bug
    cursor += sweep;
    return { ...d, start, end, color: PALETTE[i % PALETTE.length] };
  });

  return (
    <View style={styles.row}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <G>
            <Circle cx={cx} cy={cy} r={r} stroke={colors.surfaceLow} strokeWidth={thickness} fill="none" />
            {segments.map((s, i) => (
              <Path
                key={i}
                d={arcPath(cx, cy, r, s.start, s.end)}
                stroke={s.color}
                strokeWidth={thickness}
                fill="none"
                strokeLinecap="butt"
              />
            ))}
          </G>
        </Svg>
        {leader ? (
          <View pointerEvents="none" style={[styles.center, { width: size, height: size }]}>
            <Text style={styles.leaderEyebrow}>Leader</Text>
            <Text numberOfLines={1} style={styles.leaderName}>
              {leader.name}
            </Text>
            <Text style={styles.leaderShare}>
              {Math.round((leader.value / total) * 100)}% · {formatCurrency(leader.value)}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.legend}>
        {segments.map((s) => (
          <View key={s.name} style={styles.legendRow}>
            <View style={[styles.swatch, { backgroundColor: s.color }]} />
            <Text style={styles.legendName} numberOfLines={1}>
              {s.name}
            </Text>
            <Text style={styles.legendValue}>{Math.round((s.value / total) * 100)}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 16 },
  center: {
    position: "absolute",
    top: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  leaderEyebrow: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: colors.ink4,
  },
  leaderName: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.ink,
    marginTop: 2,
    textAlign: "center",
  },
  leaderShare: { fontSize: 11, color: colors.ink3, marginTop: 2 },
  legend: { flex: 1, gap: 6 },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  swatch: { width: 10, height: 10, borderRadius: 2 },
  legendName: { flex: 1, fontSize: 12, color: colors.ink },
  legendValue: { fontSize: 12, color: colors.ink3, fontVariant: ["tabular-nums"] },
});
