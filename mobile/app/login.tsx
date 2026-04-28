import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { supabase, tenantForEmail } from "@/lib/supabase";

const QUICK_LOGIN_URL = "https://argus.bz/api/auth/quick-login";

// Domain-trust sign-in: type your work email, the web's quick-login
// endpoint validates the domain and mints a Supabase session token,
// we apply it locally. No OTP, no email round-trip.
export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function signIn() {
    setError(null);
    const trimmed = email.trim().toLowerCase();
    if (!tenantForEmail(trimmed)) {
      setError("That email isn't tied to an Argus account yet. Use your work email.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(QUICK_LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error || "Couldn't sign in. Try again.");
        setLoading(false);
        return;
      }
      const { token_hash } = (await res.json()) as { token_hash: string };
      const { error: verifyErr } = await supabase.auth.verifyOtp({
        token_hash,
        type: "magiclink",
      });
      if (verifyErr) {
        setError(verifyErr.message || "Couldn't sign in. Try again.");
        setLoading(false);
        return;
      }
      router.replace("/(tabs)/dashboard");
    } catch {
      setError("Network error — try again.");
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <View style={styles.container}>
          <Text style={styles.eyebrow}>Sign in</Text>
          <Text style={styles.title}>Log in to Argus</Text>
          <Text style={styles.subtitle}>
            Enter your work email. We&apos;ll sign you straight in.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="you@company.com"
            placeholderTextColor="#9A958A"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            keyboardType="email-address"
            inputMode="email"
            editable={!loading}
            autoFocus
            onSubmitEditing={signIn}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            onPress={signIn}
            disabled={loading}
            style={({ pressed }) => [
              styles.button,
              (loading || pressed) && styles.buttonPressed,
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign in</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F2EBDD" },
  flex: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.6,
    textTransform: "uppercase",
    color: "#4A7A67",
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1B1B14",
    marginBottom: 8,
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 14,
    color: "#5C5A52",
    marginBottom: 24,
    lineHeight: 20,
  },
  input: {
    fontSize: 16,
    color: "#1B1B14",
    borderWidth: 1,
    borderColor: "#D9D2C0",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#FBF8EE",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#1B1B14",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  buttonPressed: { opacity: 0.7 },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  error: {
    color: "#A0341E",
    fontSize: 13,
    marginBottom: 12,
  },
});
