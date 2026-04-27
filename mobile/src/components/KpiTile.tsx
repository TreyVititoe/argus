import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/lib/theme";

interface KpiTileProps {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: "positive" | "neutral" | "negative";
}

const TONE_COLOR: Record<NonNullable<KpiTileProps["deltaTone"]>, string> = {
  positive: colors.accent,
  neutral: colors.ink3,
  negative: colors.warning,
};

export default function KpiTile({ label, value, delta, deltaTone = "neutral" }: KpiTileProps) {
  return (
    <View style={styles.tile}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {delta ? (
        <Text style={[styles.delta, { color: TONE_COLOR[deltaTone] }]}>{delta}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flexBasis: "48%",
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    padding: 14,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: colors.ink4,
    marginBottom: 6,
  },
  value: { fontSize: 22, fontWeight: "800", color: colors.ink, letterSpacing: -0.5 },
  delta: { fontSize: 12, fontWeight: "600", marginTop: 4 },
});
