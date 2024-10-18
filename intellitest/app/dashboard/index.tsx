import { View, SectionList } from "react-native";
import { Text } from "@/components/ui/text";
import { useLoadingContext } from "@/components/Providers/LoaderSpinnerContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";
import React from "react";
import { NotebookText } from "lucide-react-native";
import { ExamItem } from "@/components/IntelliTest/Dashboard/exam-item"; // Import ExamItem component
import { GenerateButton } from "@/components/IntelliTest/Buttons/generateButton"; // Import generateButton component

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

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

// Dummy user
const user: User = {
  firstName: "Josh",
  lastName: "Natividad",
  email: "josh@gmail.com",
};

// Create dummy tests with unique ids
const userTests: Test[] = [
  { id: "1", testName: "Mister Donut Facts", userScore: -1, testScore: 100 },
  { id: "2", testName: "Pickup Coffee Test", userScore: -1, testScore: 10 },
  { id: "3", testName: "Top 10 food of all time", userScore: -1, testScore: 10 },
  { id: "4", testName: "MOBDEVE Android Concepts", userScore: -1, testScore: 30 },
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
  const [firstName, setFirstName] = React.useState("");

  React.useEffect(() => {
    if (user.firstName) {
      setFirstName(user.firstName);
    }
  }, [user.firstName]);


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
        <Text className="text-3xl font-bold">Hi, {firstName}! 👋</Text>
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
