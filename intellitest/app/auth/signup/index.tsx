import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { useLoadingContext } from "@/components/Providers/LoaderSpinnerContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';

import { Input } from "@/components/ui/input";
import React from "react";
import { supabase } from "@/lib/supabase";
import { getSession, signUp } from "@/utils/auth";

export default function Index() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [profile_pic_path, setProfilePicPath] = React.useState('');
  const [passwordConfirm, setPasswordConfirm] = React.useState('');

  const { email: emailParam } = useLocalSearchParams() as { email: string | undefined };


  React.useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [emailParam]);

  function handleAuth() {
    //error checking
    if (password !== passwordConfirm) {
      alert("Passwords do not match");
      return;
    }

    if (email === "" || password === "" || username === "") {
      alert("Please fill out all fields");
      return;
    }

    signUp(email, password, username, profile_pic_path).then(({ data, error }) => {
      if (error) {
        // console.error(error.name);
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
      
      <Text className="text-4xl pb-5 font-bold">Sign Up</Text>
      <Text className="text-3xl pb-5">Welcome to intelli<Text className="text-3xl font-semibold text-green-400">Test</Text></Text>


      <Label nativeID="username" className="flex w-full justify-left text-left pb-2">Username</Label>

      <View className="pb-7">
        <Input className="w-full" nativeID="username" onChangeText={(text) => setUsername(text)} value={username} />
      </View>

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

      {profile_pic_path ? (
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Image
            source={{ uri: profile_pic_path }}
            style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 10 }}
          />
          <Button onPress={() => setProfilePicPath('')}>
            <Text className="text-2xl">Remove Profile Picture</Text>
          </Button>
        </View>
      ) : (
        <Button className="mb-5" onPress={async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return;
          }

          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });

          if (!result.canceled) {
            setProfilePicPath(result.assets[0].uri);
          }
        }}>
          <Text className="text-2xl">Choose a Profile Picture</Text>
        </Button>
      )}

      <Button onPress={handleAuth}>
        <Text className="text-2xl">Sign Up</Text>
      </Button>
    </View>
  );
}
