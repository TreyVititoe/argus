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

// Two-step OTP: email → 6-digit code. Mirrors the web magic-link flow but
// uses the verify-with-token path which is friendlier on mobile (no deep
// linking, no URL parsing on cold start).
export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [stage, setStage] = useState<"email" | "code">("email");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function sendCode() {
    setError(null);
    const trimmed = email.trim().toLowerCase();
    if (!tenantForEmail(trimmed)) {
      setError("That email isn't tied to an Argus account yet. Use your work email.");
      return;
    }
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: { shouldCreateUser: true },
    });
    setLoading(false);
    if (err) {
      setError(err.message || "Couldn't send code. Try again.");
      return;
    }
    setStage("code");
  }

  async function verifyCode() {
    setError(null);
    const trimmedCode = code.trim();
    if (trimmedCode.length < 6) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setLoading(true);
    const { error: err } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: trimmedCode,
      type: "email",
    });
    setLoading(false);
    if (err) {
      setError(err.message || "That code didn't work. Try again.");
      return;
    }
    router.replace("/(tabs)/dashboard");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <View style={styles.container}>
          <Text style={styles.eyebrow}>Sign in</Text>
          <Text style={styles.title}>
            {stage === "email" ? "Log in to Argus" : "Check your inbox"}
          </Text>
          <Text style={styles.subtitle}>
            {stage === "email"
              ? "Enter your work email. We'll send a 6-digit code."
              : `We sent a code to ${email}. Enter it below.`}
          </Text>

          {stage === "email" ? (
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
            />
          ) : (
            <TextInput
              style={[styles.input, styles.codeInput]}
              placeholder="123456"
              placeholderTextColor="#9A958A"
              value={code}
              onChangeText={(v) => setCode(v.replace(/\D/g, "").slice(0, 6))}
              keyboardType="number-pad"
              inputMode="numeric"
              maxLength={6}
              editable={!loading}
              autoFocus
            />
          )}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            onPress={stage === "email" ? sendCode : verifyCode}
            disabled={loading}
            style={({ pressed }) => [
              styles.button,
              (loading || pressed) && styles.buttonPressed,
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {stage === "email" ? "Send code" : "Verify and sign in"}
              </Text>
            )}
          </Pressable>

          {stage === "code" ? (
            <Pressable
              onPress={() => {
                setStage("email");
                setCode("");
                setError(null);
              }}
              style={styles.secondaryLink}
            >
              <Text style={styles.secondaryLinkText}>Use a different email</Text>
            </Pressable>
          ) : null}
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
  codeInput: {
    textAlign: "center",
    fontSize: 24,
    letterSpacing: 8,
    fontWeight: "600",
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
  secondaryLink: {
    marginTop: 16,
    alignItems: "center",
  },
  secondaryLinkText: {
    color: "#4A7A67",
    fontSize: 13,
    fontWeight: "500",
  },
});
