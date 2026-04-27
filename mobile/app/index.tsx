import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useSession } from "@/lib/session";

// Root route: send to login if signed out, dashboard if signed in.
// We keep the auth gate at the routing layer so individual screens
// don't have to repeat the loading/redirect dance.
export default function Index() {
  const { session, loading } = useSession();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return <Redirect href={session ? "/dashboard" : "/login"} />;
}
