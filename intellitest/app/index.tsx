import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Image } from "expo-image";
import React from "react";
import { useRouter } from "expo-router";
import { getSession } from "@/utils/auth";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function checkSession() {
      const session = await getSession();
      if (session.data.session != null) {
        router.replace("/dashboard");
      } else {
        setLoading(false); // Stop loading if no session
      }
    }
    checkSession();
  }, [router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      <View className="flex-col gap-48 pb-8 p-2">
        <View>
          <View className="flex flex-row justify-center">
            <Image
              source={require("../assets/images/splash_1.png")}
              style={{ width: 300, height: 300 }}
            />
          </View>
          <Text className="text-4xl font-bold">
            Ready to <Text className="text-green-400 text-4xl font-bold">ace</Text> your next big test?
          </Text>
          <Text className="text-2xl font-bold">Let's get started!</Text>
        </View>
        <View>
          <Button onPress={() => router.push("./auth")}>
            <Text className="text-2xl">Continue</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
