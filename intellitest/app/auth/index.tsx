import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { useLoadingContext } from "@/components/Providers/LoaderSpinnerContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Image } from "lucide-react-native";
import { useRouter } from "expo-router";
import { Input } from "@/components/ui/input";
import React from "react";
import { supabase } from "@/lib/supabase";
import { getSession, doesEmailExist } from "@/utils/auth";
// import { signInGoogle } from "@/utils/auth";
// import { SignInGoogleButton } from "@/components/IntelliTest/Buttons/signInWithGoogleButton";

export default function Index() {
  const router = useRouter();
  const [email, setEmail] = React.useState(''); // State to store email input
  const [loading, setLoading] = React.useState(true); // Manage loading state

  // Check session on component mount
  React.useEffect(() => {
    async function checkSession() {
      const session = await getSession();
      if (session.data) {
        router.push("/dashboard");
      } else {
        setLoading(false); // Only stop loading if no session
      }
    }
    checkSession();
  }, [router]);
  async function handleAuth() {
    // setLoading(true);

    if (await doesEmailExist(email)) {
      router.push({
        pathname: "/auth/signin",
        params: {email: email}
      });
    } else {
      router.push({
        pathname: "/auth/signup",
        params: {email: email}
      });
    }
  }

  async function handleGoogleAuth() {
    // setLoading(true);
    console.log("Google Auth");
    // const { data, error } = await signInGoogle();
    // console.log(data, error);
  }

  // function emailChangeHandler(text: string) {
  //   setEmail(text);
  // }

  // Optionally, to see the updated email after it changes:
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        // alignItems: "center",
      }}
      
      className="flex-col px-4"
    >
        <Text nativeID="test" className="text-2xl font-bold text-center py-5">Let's get started!</Text>
  
        <Label nativeID="email" className="flex w-full justify-left text-left pb-2">Email</Label>
        
        <View className="pb-7">
          <Input className="w-full" nativeID="email" onChangeText={(text) => setEmail(text)} value={email}/>
        </View>

        <View className="pb-3">
          <Button 
            onPress={handleAuth}>
            <Text className="text-2xl">Continue</Text>
          </Button>  
        </View>
        
        
        <View style={{flexDirection: 'row', alignItems: 'center'}} className="w-full align-center pb-3">
          <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
          <View>
            <Text style={{width: 50, textAlign: 'center'}}>OR</Text>
          </View>
          <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
        </View>

        {/* <Button 
          onPress={handleGoogleAuth}>
          <Text className="text-2xl">Continue with Google</Text>
        </Button> */}
        {/* <SignInGoogleButton /> */}
    </View>
  );
}
