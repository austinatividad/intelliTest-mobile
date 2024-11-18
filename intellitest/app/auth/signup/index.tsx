import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { useLoadingContext } from "@/components/Providers/LoaderSpinnerContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Image } from "lucide-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { Input } from "@/components/ui/input";
import React from "react";
import { supabase } from "@/lib/supabase";
import { getSession, signUp } from "@/utils/auth";

export default function Index() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordConfirm, setPasswordConfirm] = React.useState('');

  const { email: emailParam } = useLocalSearchParams() as { email: string | undefined };


  React.useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [emailParam]);

  function handleAuth() {
    if (password !== passwordConfirm) {
      alert("Passwords do not match");
      return;
    }

    signUp(email, password).then(({ data, error }) => {
      if (error) {
        console.error(error.name);
        // You can put how to handle different errors here
        alert(error.message);
        return;
      }

      getSession().then(({ data, error }) => {
        if (error) {
          console.error(error.name);
          // You can put how to handle different errors here
          alert(error.message);
          return;
        }
        console.log(data);
        router.replace("/dashboard");
      });
      // router.navigate("/dashboard");
    });
  }

  const { setLoading, setText } = useLoadingContext();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        // alignItems: "center",
      }}

      className="flex-col px-4"
    >
      {/* TODO: Add client-side validation */}
      <Text className="text-4xl pb-5 font-bold">Sign Up</Text>
      <Text className="text-3xl pb-5">Welcome to intelli<Text className="text-3xl font-semibold text-green-400">Test</Text></Text>


      <Label nativeID="email" className="flex w-full justify-left text-left pb-2">Email</Label>

      <View className="pb-7">
        <Input className="w-full" nativeID="email" onChangeText={(text) => setEmail(text)} value={email} />
      </View>



      <Label nativeID="password" className="flex w-full justify-left text-left pb-2">Password</Label>

      <View className="pb-7">
        <Input className="w-full" nativeID="password" secureTextEntry={true} onChangeText={(text) => setPassword(text)} value={password} />
      </View>

      <Label nativeID="passwordConfirm" className="flex w-full justify-left text-left pb-2">Confirm Password</Label>

      <View className="pb-7">
        <Input className="w-full" nativeID="passwordConfirm" secureTextEntry={true} onChangeText={(text) => setPasswordConfirm(text)} value={passwordConfirm} />
      </View>

      <Button onPress={handleAuth}>
        <Text className="text-2xl">Sign Up</Text>
      </Button>
    </View>
  );
}
