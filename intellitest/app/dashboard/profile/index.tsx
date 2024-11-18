import { View, FlatList, Animated, Easing } from "react-native";
import { Text } from "@/components/ui/text";
import { useLoadingContext } from "@/components/Providers/LoaderSpinnerContext";
import { Button } from "@/components/ui/button";
import { Image } from "expo-image";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { ExamItem } from "@/components/IntelliTest/Dashboard/exam-item";
import React from "react";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { getSession, signOut } from "@/utils/auth";

import {Loader2, Search} from "lucide-react-native";

// Define the Session type
type Session = {
  email: string;
  created_at ?: string;
};

import { dummy, ItemData } from "@/lib/dummy_data";

export default function Index() {
  const router = useRouter();

  const [isDisabled, setIsDisabled] = React.useState(false);
  // Create a reference to the animated value
  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  //store the session details in a state
  const [session, setSession] = React.useState<Session | null>(null);

  // get the current session, print details
  React.useEffect(() => {
    async function checkSession() {
      const session = await getSession();
      if (!session.data) {
        router.navigate("/");
      } else {
        setSession({
          email: session.data.session?.user.email || '',
          created_at: String(session.data.session?.user.created_at) || ''
        });
        console.log(session.data.session?.user.email);
        console.log(session.data.session?.user.created_at);
      }
    }
    checkSession();
  }, [router]);



  // Function to start the rotation animation
  const startRotation = () => {
    rotateAnim.setValue(0);
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 500, // One full rotation every 1 second
        easing: Easing.linear,
        useNativeDriver: true, // Use native driver for better performance
      })
    ).start();
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'], // Full rotation
  });

  const onLogOut = (): void => {
    setIsDisabled(true);
    startRotation();

    console.log("Log Out");
    //TODO: Add log out logic
      // Add your logic for the button action here (e.g., logging out)
      
      setTimeout(() => {
        rotateAnim.stopAnimation();
        setIsDisabled(false); // Reset the button after action (for example, after a log out request)
        signOut();
        router.replace("/");
        

      }, 2000);  // Simulating a 2-second delay for demonstration
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
      }}

      className = "p-4"
    >
      <Text className="w-full text-start text-4xl pt-4">Profile</Text>

      <View style={{ height: 20 }} />

      <View className="flex-row items-center justify-between border-2 border-black rounded-lg p-2 w-full mb-4">
        <Text className="text-lg font-semibold">Email</Text>
        <Text className="text-lg">{session?.email}</Text>
      </View>
      <View className="flex-row items-center justify-between border-2 border-black rounded-lg p-2 w-full">
        <Text className="text-lg font-semibold">Account Creation Date</Text>
        <Text className="text-lg">{session?.created_at ? session.created_at.split("T")[0] : ''}</Text>
      </View>


      <View className="border-black border-2 rounded-lg w-36 absolute bottom-5 right-5 ">
        <Button className="bg-gray-300 w-full h-full flex flex-row" size={'default'} disabled={isDisabled} onPress={onLogOut}>
          {isDisabled && 
            <Animated.View style={{ transform: [{ rotate }] }}>
              <Loader2 size={24} color={"black"} />
            </Animated.View>
          }
          <Text className="text-black ">Log Out</Text>
        </Button> 
      </View>
    </View>
  );
}
