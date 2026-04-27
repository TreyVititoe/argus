import { useEffect } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { supabase, tenantForEmail } from "@/lib/supabase";
import { useSession } from "@/lib/session";

// Placeholder authenticated home. Once we port the web dashboard we'll
// replace this with KPI tiles + charts; for now it confirms the auth
// loop works end-to-end on a device.
export default function DashboardScreen() {
  const { session, loading } = useSession();
  const email = session?.user?.email ?? "";
  const tenant = email ? tenantForEmail(email) : null;

  useEffect(() => {
    if (!loading && !session) router.replace("/login");
  }, [loading, session]);

  async function onSignOut() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (loading || !session) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.brandSquare}>
              <View style={styles.brandInner} />
            </View>
            <Text style={styles.brandName}>Argus</Text>
          </View>
          <Pressable onPress={onSignOut} style={styles.signOutBtn}>
            <Text style={styles.signOutText}>Sign out</Text>
          </Pressable>
        </View>

        <Text style={styles.eyebrow}>Welcome back</Text>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>
          Signed in as {email}
          {tenant ? ` · ${tenant}` : ""}
        </Text>

        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderEyebrow}>Coming soon</Text>
          <Text style={styles.placeholderTitle}>Mobile dashboard</Text>
          <Text style={styles.placeholderBody}>
            KPIs, charts, and the renewal table are next. The auth shell is wired up so the rest
            is screen-by-screen porting from the web app.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F2EBDD" },
  scroll: { padding: 24, paddingBottom: 48 },
  loadingWrap: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#F2EBDD" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  brandSquare: {
    width: 28,
    height: 28,
    backgroundColor: "#4A7A67",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  brandInner: { width: 14, height: 14, backgroundColor: "#F2EBDD", borderRadius: 3 },
  brandName: { fontSize: 16, fontWeight: "600", color: "#1B1B14" },
  signOutBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D9D2C0",
  },
  signOutText: { color: "#5C5A52", fontSize: 12, fontWeight: "600" },
  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.6,
    textTransform: "uppercase",
    color: "#4A7A67",
    marginBottom: 6,
  },
  title: { fontSize: 36, fontWeight: "800", color: "#1B1B14", letterSpacing: -0.8 },
  subtitle: { fontSize: 14, color: "#5C5A52", marginTop: 6, marginBottom: 32 },
  placeholderCard: {
    backgroundColor: "#FBF8EE",
    borderWidth: 1,
    borderColor: "#D9D2C0",
    borderRadius: 14,
    padding: 20,
  },
  placeholderEyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: "#4A7A67",
    marginBottom: 4,
  },
  placeholderTitle: { fontSize: 20, fontWeight: "700", color: "#1B1B14", marginBottom: 8 },
  placeholderBody: { fontSize: 14, color: "#5C5A52", lineHeight: 20 },
});
