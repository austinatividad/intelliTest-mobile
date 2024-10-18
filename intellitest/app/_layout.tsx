import "@/globals.css";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme, ThemeProvider } from "@react-navigation/native";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform, View } from "react-native";
import { NAV_THEME } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PortalHost } from "@rn-primitives/portal";
import { useFonts } from "expo-font";
import { setAndroidNavigationBar } from "@/lib/android-navigation-bar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Text } from "@/components/ui/text";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LoadingProvider } from "@/components/Providers/LoaderSpinnerContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import ReactQueryProvider from "@/components/Providers/ReactQueryProvider";
import { House, NotepadText, CircleUserRound } from "lucide-react-native";
import { useRouter, useSegments } from 'expo-router';
const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  dark: true,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const segments = useSegments();  // Gets the route segments
  const router = useRouter();

  // Check if the current route is "/dashboard" or any of its sub-routes
  const isDashboardRoute = segments[0] === 'dashboard';
  console.log(segments);

  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState("home");
  const [loaded, error] = useFonts({
    //add custom fonts here
    //example
    // DMSans: require("../assets/fonts/DMSans.ttf"),
  });

  React.useEffect(() => {
    (async () => {
      if ((loaded || error) && isColorSchemeLoaded) {
        await SplashScreen.hideAsync();
      }
      const theme = await AsyncStorage.getItem("theme");
      if (Platform.OS === "web") {
        document.documentElement.classList.add("bg-background");
      }
      if (!theme) {
        await setAndroidNavigationBar(colorScheme);
        await AsyncStorage.setItem("theme", colorScheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      const colorTheme = theme === "dark" ? "dark" : "light";
      await setAndroidNavigationBar(colorTheme);
      if (colorTheme !== colorScheme) {
        setColorScheme(colorTheme);

        setIsColorSchemeLoaded(true);
        return;
      }
      setIsColorSchemeLoaded(true);
    })();
  }, [loaded, isColorSchemeLoaded]);

  if (!isColorSchemeLoaded || !(loaded || error)) {
    return null;
  }

  return (
    <ReactQueryProvider>
      <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
        <SafeAreaProvider>
          <LoadingProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <Stack
                screenOptions={{
                  headerBackTitle: "Back",
                  headerTitleAlign: "center",
                  headerTitle(props) {
                    return (
                      <Text className="text-3xl font-semibold">
                        intelli<Text className="text-3xl font-semibold text-green-400">Test</Text>
                      </Text>
                    );
                  },
                  headerRight: () => <ThemeToggle />,
                }}
              >
                <Stack.Screen name="index" />
              </Stack>

              {/* Footer */}
              { isDashboardRoute && (
                <View
                style={{
                  flex: 0,
                  justifyContent: "center", // Centers the content in the footer
                  backgroundColor: isDarkColorScheme ? "#333" : "#f9f9f9",
                }}
                className="w-full h-16"
              >
                <ToggleGroup
                  type="single"
                  value={selectedValue}
                  onValueChange={(value) => {
                    if (typeof value === "string") {
                      setSelectedValue(value);
                      router.navigate("/dashboard/" + value);
                    }
                    console.log(value);
                  }}
                  className="w-full h-full"
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly', // Distributes items evenly
                    alignItems: 'center', // Vertically align the items
                    backgroundColor: 'white', // Ensure background is transparent
                  }}
                >
                <ToggleGroupItem value=" " className="flex-1" style={{ flex: 1, alignItems: 'center', backgroundColor: 'transparent' }}>
                  <House color={selectedValue === 'home' ? "green" : (isDarkColorScheme ? "#FFF" : "#000000")} />
                  <Text style={{ color: selectedValue === 'home' ? "green" : (isDarkColorScheme ? "#FFF" : "#000000") }}>Home</Text>
                </ToggleGroupItem>
                <ToggleGroupItem value="exams" style={{ flex: 1, alignItems: 'center', backgroundColor: 'transparent'}}>
                  <NotepadText color={selectedValue === 'exams' ? "green" : (isDarkColorScheme ? "#FFF" : "#000000")} />
                  <Text style={{ color: selectedValue === 'exams' ? "green" : (isDarkColorScheme ? "#FFF" : "#000000") }}>My Exams</Text>
                </ToggleGroupItem>
                <ToggleGroupItem value="profile" style={{ flex: 1, alignItems: 'center', backgroundColor: 'transparent' }}>
                  <CircleUserRound color={selectedValue === 'profile' ? "green" : (isDarkColorScheme ? "#FFF" : "#000000")} />
                  <Text style={{ color: selectedValue === 'profile' ? "green" : (isDarkColorScheme ? "#FFF" : "#000000") }}>Profile</Text>
                </ToggleGroupItem>
              </ToggleGroup>
              </View>

              )}

              <LoadingSpinner />
              <PortalHost />
            </GestureHandlerRootView>
          </LoadingProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </ReactQueryProvider>
  );
}

function toOptions(name: string) {
  return name
    .split("-")
    .map(function (str: string) {
      return str.replace(/\b\w/g, function (char) {
        return char.toUpperCase();
      });
    })
    .join(" ");
}
