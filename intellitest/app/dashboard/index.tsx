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
import { ScrollView } from "react-native-reanimated/lib/typescript/Animated";
import { Item } from "@rn-primitives/toggle-group";
import * as sq from "@/utils/supabaseQueries";
import { suggestNewExam } from "@/utils/promptList";
interface Exam {
  id: string;
  exam_name: string;
  status: string;
  score: number;
  total_score: number;
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
  const [exams, setExams] = React.useState<Exam[]>([]);
  const [suggestionTitle, setSuggestionTitle] = React.useState("Thinking...");
  const [suggestionContent, setSuggestionContent] = React.useState("");
  const [isCalled, setIsCalled] = React.useState(false);


  //supabase query for getting latest exams
  const getExams = async () => {
    const exams = await sq.getLatestExams();
    console.log(JSON.stringify(exams, null ,2));
    if (exams) {
      setExams(exams);
    }
  }

  //get the latest exams
  React.useEffect(() => {
    getExams();
  }, []);

  //get suggestion for new exam
  React.useEffect(() => {
    async function getSuggestion() {
      if (!isCalled) {
        setIsCalled(true);
        const suggestion = await suggestNewExam(exams);
        console.log(suggestion);
        setSuggestionTitle(suggestion.suggestion_title);
        setSuggestionContent(suggestion.suggestion_content);
      }
    }

    getSuggestion();
  }, [exams]);

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

  function handleExamPress(id: string) {
    router.push({
      pathname: "/dashboard/exam",
      params: { examId: id },
    });
  }

  function handleSuggestionPress() {
    router.push({
      pathname: "/dashboard/new",
      params: { title: suggestionTitle, content: suggestionContent },
    });
  }

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

          <View className="px-10 w-full">
            {exams.length > 0 && (
              <>
              <Text className="text-2xl font-bold text-black pb-4">My Latest Exams</Text>
              {exams.map((exam) => (
                <ExamItem
                key={exam.id}
                id={exam.id}
                examName={exam.exam_name} // Map `exam_name` to `examName`
                examStatus={exam.status} // Map `exam_status` to `examStatus`
                score={exam.score} // Direct mapping
                totalScore={exam.total_score} // Map `total_score` to `totalScore`
                onPress={handleExamPress} // Pass the handler directly
                />
              ))}
                <Text className="text-xl font-bold text-black pb-2">
                {exams.length > 0 ? "You might like:" : "Hello, new intelliTester! Here's a cool suggestion to get you started :)"}
                </Text>
              </>
            )}
            <ExamItem
              id="1"
              examName={suggestionTitle}
              examStatus="AI Suggestion!"
              score={10}
              totalScore={10}
              onPress={handleSuggestionPress}
            />
          </View>



        </>
      )}
    </View>
  );
  
}
