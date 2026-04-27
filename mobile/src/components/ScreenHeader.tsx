import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";
import { colors } from "@/lib/theme";

interface ScreenHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
}

export default function ScreenHeader({ eyebrow, title, subtitle }: ScreenHeaderProps) {
  async function onSignOut() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.brandRow}>
        <View style={styles.brandSquare}>
          <View style={styles.brandInner} />
        </View>
        <Text style={styles.brandName}>Argus</Text>
        <Pressable onPress={onSignOut} style={styles.signOutBtn} hitSlop={8}>
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>
      </View>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 18 },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 22,
  },
  brandSquare: {
    width: 28,
    height: 28,
    backgroundColor: colors.accent,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  brandInner: { width: 14, height: 14, backgroundColor: colors.bg, borderRadius: 3 },
  brandName: { fontSize: 16, fontWeight: "600", color: colors.ink, flex: 1 },
  signOutBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
  },
  signOutText: { color: colors.ink3, fontSize: 12, fontWeight: "600" },
  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.6,
    textTransform: "uppercase",
    color: colors.accent,
    marginBottom: 6,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.ink,
    letterSpacing: -0.6,
  },
  subtitle: { fontSize: 13, color: colors.ink3, marginTop: 4 },
});
