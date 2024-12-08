import { View, FlatList, Animated, Easing } from "react-native";
import { Text } from "@/components/ui/text";
import { useLoadingContext } from "@/components/Providers/LoaderSpinnerContext";
import { Button } from "@/components/ui/button";
import { Image } from "expo-image";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { ExamItem } from "@/components/IntelliTest/Dashboard/exam-item";
import React from "react";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { getSession, signOut, getProfile } from "@/utils/auth";

import {Loader2, Search} from "lucide-react-native";

// Define the Session type
type Profile = {
  username: string;
  profile_pic_path: string;
  email: string;
}


import { dummy, ItemData } from "@/lib/dummy_data";

export default function Index() {
  const router = useRouter();
  const { setLoading, setText } = useLoadingContext();
  const [isDisabled, setIsDisabled] = React.useState(false);
  // Create a reference to the animated value
  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  const [profile, setProfile] = React.useState<Profile | null>(null);

  // get the current session, print details
  React.useEffect(() => {
    async function checkSession() {
      setLoading(true); 
      setText("Getting your profile details, please be patient 😊");
      const session = await getSession();
      if (!session.data) {
        router.navigate("/");
      } else {
        // get the profile details
        const profile = await getProfile(session.data.session?.user.email || '');
        setProfile(profile.data);
        setLoading(false);
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

  const onLogOut = async (): Promise<void> => {
    setIsDisabled(true);
    setLoading(true);
    setText("Logging out, please wait 😊");
    await signOut();
    router.replace("/");
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
      }}

      className = "p-4 pt-9"
    >
      
      <Text className="text-3xl font-semibold mb-5 w-full text-start">My Profile</Text>
      <View className=" rounded-lg w-36 absolute bottom-12 right-3 ">
        <Button className="bg-gray-300 w-full h-full flex flex-row" size={'default'} disabled={isDisabled} onPress={onLogOut}>
          {isDisabled ? (
            <Animated.View style={{ transform: [{ rotate }] }}>
              <Loader2 size={24} color={"black"} />
            </Animated.View>
          ) : (
            <Text className="text-black">Log Out</Text>
          )}
        </Button>
      </View>
      

      <View style={{ height: 20 }} />

      <View className="flex-col items-center  p-2 w-full mb-4">
        
        <Image
          source={{ uri: "https://efhtpznenarzvbqbltuz.supabase.co/storage/v1/object/public/profile/" + profile?.profile_pic_path }}
          style={{ width: 200, height: 200, borderRadius: 200 }}
        />
      </View>

      {profile ? (
        <>
          <View className="flex-row items-center justify-between rounded-lg border-b border-gray-300 p-2 w-full mb-4">
        <Text className="text-lg font-semibold">Username</Text>
        <Text className="text-lg">{profile.username}</Text>
          </View>

          <View className="flex-row items-center justify-between rounded-lg p-2 w-full border-b border-gray-300 mb-4">
        <Text className="text-lg font-semibold">Email</Text>
        <Text className="text-lg">{profile.email}</Text>
          </View>
        </>
      ) : null}

      

      

      
    </View>
  );
}
