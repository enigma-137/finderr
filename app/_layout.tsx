import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { UserProvider, useUser } from "@/constants/UserContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { user, userProfile, loading } = useUser();

  if (loading) {
    return null; // Or a loading screen
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {user ? (
        userProfile?.approved ? (
          // User is authenticated and approved
          <>
            <Stack.Screen
              name="(tabs)"
              options={{ headerShown: false, title: "chats" }}
            />
            <Stack.Screen name="charscreenf" options={{ headerShown: false }} />
          </>
        ) : (
          // User is authenticated but not approved
          <Stack.Screen
            name="auth/pending-approval"
            options={{ headerShown: false }}
          />
        )
      ) : (
        // User is not authenticated
        <>
          <Stack.Screen name="auth/signin" options={{ headerShown: false }} />
          <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
        </>
      )}
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <UserProvider>
        <AppContent />
      </UserProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
