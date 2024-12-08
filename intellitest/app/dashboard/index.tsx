import { View, SectionList } from "react-native";
import { Text } from "@/components/ui/text";
import { useLoadingContext } from "@/components/Providers/LoaderSpinnerContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";
import React from "react";
import { NotebookText } from "lucide-react-native";
import { ExamItem } from "@/components/IntelliTest/Dashboard/exam-item"; // Import ExamItem component
import { GenerateButton } from "@/components/IntelliTest/Buttons/generateButton"; // Import generateButton component
import { getSession, getProfile } from "@/utils/auth";

//openaiClient and promptList debug
// TODO: Remove this code after testing.
// import { promptList } from "@/utils/promptList";
// import { generateOutput, testPromptWithReplacements, imageTestPrompt, generateOutputWithReplacements } from "@/utils/openaiClient";


interface Test {
  id: string;
  testName: string;
  userScore: number;
  testScore: number;
}

interface UserData {
  recentTests: Test[];
  recentScores: Test[];
}

type Profile = {
  username: string;
  profile_pic_path: string;
  email: string;
}



export default function Index() {
  const router = useRouter();
  const { setLoading, setText } = useLoadingContext();
  const [profile, setProfile] = React.useState<Profile | null>(null);

  //get the current session, print details
  React.useEffect(() => {
    
    async function checkSession() {
      setLoading(true);
      setText(`Hello! Please be patient while we prepare 😊`);
      const session = await getSession();
      if (!session.data) {
        router.navigate("/");
      } else {
        
        // get the profile details
        const profile = await getProfile(session.data.session?.user.email || '');
        console.log(profile.data);
        setProfile(profile.data);
      }

      // setLoading(false);
    }
    checkSession();
  }, [router]);

  React.useEffect(() => {
    if(profile == null) {
      setLoading(true);
      setText(`Hello! Please be patient while we prepare 😊`);
    } else {
      setLoading(false);
    }

  }, [profile])

  const handleExamPress = (id: string) => {
    console.log("Test pressed with id:", id);
    // Add logic to handle test press event
  };

  return (
    <View style={{ flex: 1 }}>
      {profile && (
        <>
          <View className="px-10 pt-36 text-center items-center bg-green-400 mb-20">
            <Text className="text-3xl font-bold text-white">Hi, {profile.username}! 👋</Text>
            <Text className="text-2xl text-white">Let's get ready for our next test!</Text>
            <View style={{ transform: [{ translateY: 50 }] }}>
              <GenerateButton />
            </View>
          </View>
  

        </>
      )}
    </View>
  );
  
}
