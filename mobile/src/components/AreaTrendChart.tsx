import { StyleSheet, View, Text } from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop, Line, Circle } from "react-native-svg";
import { colors } from "@/lib/theme";
import { formatCurrency } from "@/lib/format";

interface AreaTrendChartProps {
  /** Pre-sorted ascending by year. */
  data: { year: number; spend: number }[];
  height?: number;
}

export default function AreaTrendChart({ data, height = 160 }: AreaTrendChartProps) {
  if (data.length < 2) {
    return <Text style={styles.empty}>Not enough years to chart.</Text>;
  }

  // Layout: pad inside the viewBox so the line + dots aren't clipped.
  const W = 320;
  const H = height;
  const padX = 24;
  const padTop = 18;
  const padBottom = 26;
  const innerW = W - padX * 2;
  const innerH = H - padTop - padBottom;

  const xs = data.map((_, i) => padX + (i / (data.length - 1)) * innerW);
  const max = Math.max(...data.map((d) => d.spend), 1);
  const ys = data.map((d) => padTop + innerH - (d.spend / max) * innerH);

  const linePath = data.map((_, i) => `${i === 0 ? "M" : "L"} ${xs[i]} ${ys[i]}`).join(" ");
  const areaPath = `${linePath} L ${xs[xs.length - 1]} ${padTop + innerH} L ${xs[0]} ${padTop + innerH} Z`;

  return (
    <View>
      <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
        <Defs>
          <LinearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.accent} stopOpacity={0.35} />
            <Stop offset="1" stopColor={colors.accent} stopOpacity={0} />
          </LinearGradient>
        </Defs>

        {/* Light horizontal guides at 0%, 50%, 100%. */}
        {[0, 0.5, 1].map((p) => {
          const y = padTop + innerH * p;
          return (
            <Line
              key={p}
              x1={padX}
              x2={W - padX}
              y1={y}
              y2={y}
              stroke={colors.line}
              strokeWidth={1}
              strokeDasharray="3 4"
            />
          );
        })}

        <Path d={areaPath} fill="url(#trendGrad)" />
        <Path d={linePath} stroke={colors.accent} strokeWidth={2.5} fill="none" />

        {data.map((_, i) => (
          <Circle key={i} cx={xs[i]} cy={ys[i]} r={3} fill={colors.accent} />
        ))}
      </Svg>

      <View style={styles.xLabels}>
        {data.map((d) => (
          <Text key={d.year} style={styles.xLabel}>
            {String(d.year).slice(2)}
          </Text>
        ))}
      </View>

      <View style={styles.yLabels}>
        <Text style={styles.yLabel}>{formatCurrency(max)}</Text>
        <Text style={styles.yLabel}>$0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { color: colors.ink3, fontSize: 12, textAlign: "center", paddingVertical: 24 },
  xLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    marginTop: -18,
  },
  xLabel: { fontSize: 10, color: colors.ink4, fontVariant: ["tabular-nums"] },
  yLabels: {
    position: "absolute",
    left: 0,
    top: 8,
    bottom: 24,
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  yLabel: { fontSize: 9, color: colors.ink4, fontVariant: ["tabular-nums"] },
});
