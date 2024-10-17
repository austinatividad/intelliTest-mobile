import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { useLoadingContext } from "@/components/Providers/LoaderSpinnerContext";
import { Button } from "@/components/ui/button";
import { Image } from "lucide-react-native";
import { useRouter } from "expo-router";



export default function Index() {
  const router = useRouter();

  const { setLoading, setText } = useLoadingContext();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
    <View className="flex-col gap-48 pb-8">
      <View>
        {/* TODO: Change to a carousel */}
        <View className="flex flex-row justify-center">
          <Image name="Test" size={300} />
        </View> 
        
        <Text className="text-4xl font-bold">Ready to <Text className="text-green-400 text-4xl font-bold">ace</Text> your next test?</Text>
        <Text className="text-2xl font-bold ">Let's get started!</Text>
      </View>
      

      <View className="">
        <Button onPress={() => {
          router.push("./auth");
        }}>
          <Text className="text-2xl">Continue</Text>
        </Button>
      </View>
    </View>
      
    </View>
  );
}
