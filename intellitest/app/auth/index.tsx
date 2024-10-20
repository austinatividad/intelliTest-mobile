import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { useLoadingContext } from "@/components/Providers/LoaderSpinnerContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Image } from "lucide-react-native";
import { useRouter } from "expo-router";
import { Input } from "@/components/ui/input";
import React from "react";

export default function Index() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');  // Using state to store email input

  function handleAuth() {
    // setLoading(true);
    //TODO: Add actual authentication logic and pass email to the next page
    if (email == "email@gmail.com") {
      router.push({
        pathname: "/auth/signin",
        params: {email: email}
      });
    } else {
      router.push({
        pathname: "/auth/signup",
        params: {email: email}
      });
      };
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

        <Button>
          <Text className="text-2xl">Continue with Google</Text>
        </Button>
    </View>
  );
}
