import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Image } from "expo-image";
import React from "react";
import { useRouter } from "expo-router";
import { getSession } from "@/utils/auth";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useLoadingContext } from "@/components/Providers/LoaderSpinnerContext";

export default function Index() {
  const router = useRouter();
  const { setLoading, setText } = useLoadingContext();


  React.useEffect(() => {
    // setLoading(true);
    // setText(`Welcome! Please be patient while we prepare things for you! 😊`);
    async function checkSession() {
      const session = await getSession();
      setLoading(false)
      if (session.data.session != null) {
        router.replace("/dashboard");
      }
    }
    checkSession();
    
  }, [router]);

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
