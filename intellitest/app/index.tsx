import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { useLoadingContext } from "@/components/Providers/LoaderSpinnerContext";
import { Button } from "@/components/ui/button";
import { Image } from "expo-image";
import { useRouter } from "expo-router";



export default function Index() {
  const router = useRouter();

  const { setLoading, setText } = useLoadingContext();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
    <View className="flex-col gap-32 pb-8 p-2">
      <View>
        {/* TODO: Change to a carousel */}
        <View className="flex flex-row justify-center">
          <Image
            source={require("../assets/images/splash_1.png")}
            style={{ width: 300, height: 300 }}
          />
        </View> 
        
        <Text className="text-4xl font-bold">Ready to <Text className="text-green-400 text-4xl font-bold">ace</Text> your next test?</Text>
        <Text className="text-2xl font-bold ">We're going to do greate</Text>
      </View>
      

      <View className="">
        <Button onPress={() => {
          router.push("./auth");
        }}>
          <Text className="text-2xl">Continue</Text>
        </Button>
      </View>

      {/* <View className="">
        <Button onPress={() => {
          router.push("./dashboard/exams");
        }}>
          <Text className="text-2xl">[TEST] My Exams Page</Text>
        </Button>
      </View> */}
    </View>
      
    </View>
  );
}
