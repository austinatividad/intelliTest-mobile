import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { useLoadingContext } from "@/components/Providers/LoaderSpinnerContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Image } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from 'expo-router';
import { Input } from "@/components/ui/input";
import React from "react";
import { signIn } from "@/utils/auth";
import { getSession } from "@/utils/auth";

export default function Index() {
  const router = useRouter();
  const { setLoading, setText } = useLoadingContext();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  
  React.useEffect(() => {
    async function checkSession() {
      const session = await getSession();
      if (session.data.session != null) {
        console.log(session.data.session);
        router.replace("/dashboard");
      } else {
        setLoading(false); // Only stop loading if no session
      }
    }
    checkSession();
  }, [router]);

  const { email: emailParam } = useLocalSearchParams() as { email: string | undefined };
  

  React.useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [emailParam]);


  function handleAuth() {
    //TODO: Add actual authentication logic and pass email to the next page
    //TODO: Replace this with the page
    signIn(email, password).then(({data, error}) => {
      if (error) {
        console.error(error.name);
        // You can put how to handle different errors here
        alert(error.message);
        return;
      }
      router.replace("/dashboard");
    });
  }

  
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        // alignItems: "center",
      }}
      
      className="flex-col px-4"
    >

      <Text className="text-3xl pb-5">Sign in to intelli<Text className="text-3xl font-semibold text-green-400">Test</Text></Text>

      <Label nativeID="email" className="flex w-full justify-left text-left pb-2">Email</Label>
        
        <View className="pb-7">
          <Input className="w-full" nativeID="email" onChangeText={(text) => setEmail(text)} value={email}/>
        </View>

        <Label nativeID="password" className="flex w-full justify-left text-left pb-2">Password</Label>

        <View className="pb-7">
          <Input className="w-full" nativeID="password" secureTextEntry={true} onChangeText={(text) => setPassword(text)} value={password}/>
        </View>

        <Button onPress={handleAuth}>
          <Text className="text-2xl">Sign In</Text>
        </Button>  
    </View>
  );
}
