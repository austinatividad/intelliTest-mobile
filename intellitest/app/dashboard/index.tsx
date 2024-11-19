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

// Dummy user
// const user: User = {
//   firstName: "Josh",
//   lastName: "Natividad",
//   email: "josh@gmail.com",
// };

// Create dummy tests with unique ids
const userTests: Test[] = [
  { id: "1", testName: "Dummy Display for lists", userScore: -1, testScore: 100 },
  { id: "2", testName: "To open an intelliTest", userScore: -1, testScore: 10 },
  { id: "3", testName: "Go to My Exam and open", userScore: -1, testScore: 10 },
  { id: "4", testName: "MOBDEVE - Recycler Views and Intents", userScore: -1, testScore: 30 },
];

const userScores: Test[] = [
  { id: "5", testName: "STINTSY Backpropagation Exam", userScore: 30, testScore: 30 },
  { id: "6", testName: "CSOPESY Exam", userScore: 30, testScore: 30 },
  { id: "7", testName: "Top 10 Japanese Food", userScore: 80, testScore: 100 },
];

const userData: UserData = {
  recentTests: userTests,
  recentScores: userScores,
};

export default function Index() {
  const router = useRouter();
  const { setLoading, setText } = useLoadingContext();
  const [profile, setProfile] = React.useState<Profile | null>(null);

  //get the current session, print details
  React.useEffect(() => {
    async function checkSession() {
      const session = await getSession();
      if (!session.data) {
        router.navigate("/");
      } else {
        // get the profile details
        const profile = await getProfile(session.data.session?.user.email || '');
        console.log(profile.data);
        setProfile(profile.data);
      }
    }
    checkSession();
  }, [router]);

  // const [firstName, setFirstName] = React.useState("");

  //debug - openaiClient and promptList
  // TODO: Remove this code after testing.
  // React.useEffect(() => {
  //   console.log("is this working?")
  //   async function testOpenaiClient() {
  //     const response = await generateOutputWithReplacements("evaluateNotes", { notes:  pythonSyntaxExamples });
  //     console.log(response);
  //   }
  //   testOpenaiClient();
  // }, []);




  const handleExamPress = (id: string) => {
    console.log("Test pressed with id:", id);
    // Add logic to handle test press event
  };

  const sections = [
    {
      title: "Latest Tests",
      data: userData.recentTests,
      renderItem: ({ item }: { item: Test }) => (
        <ExamItem
          examName={item.testName}
          examStatus={item.userScore === -1 ? "NEW" : `${item.userScore}/${item.testScore}`}
          id={item.id}
          onPress={handleExamPress}
        />
      ),
    },
    {
      title: "Latest Scores",
      data: userData.recentScores,
      renderItem: ({ item }: { item: Test }) => (
        <ExamItem
          examName={item.testName}
          examStatus={`${item.userScore}/${item.testScore}`}
          id={item.id}
          onPress={handleExamPress}
        />
      ),
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <View className="p-10 pt-36 text-center items-center">
        <Text className="text-3xl font-bold">Hi, {profile?.username}! 👋</Text>
        <Text className="text-2xl text-gray-600">Let's get ready for our next test!</Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center" }} className="w-full align-center pb-3">
        <View style={{ flex: 1, height: 1, backgroundColor: "black" }} />
        <GenerateButton />
        <View style={{ flex: 1, height: 1, backgroundColor: "black" }} />
      </View>

      <SectionList
        className="w-full p-4"
        sections={sections}
        keyExtractor={(item, index) => item.id + index}
        renderSectionHeader={({ section }) => (
          <Text className="pt-4 font-bold text-xl mb-4">{section.title}</Text>
        )}
        contentContainerStyle={{ paddingBottom: 56 }}
      />
    </View>
  );
}
