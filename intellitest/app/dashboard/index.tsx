import { View, SectionList } from "react-native";
import { Text } from "@/components/ui/text";
import { useLoadingContext } from "@/components/Providers/LoaderSpinnerContext";
import { Button } from "@/components/ui/button";
import { useFocusEffect, useRouter } from "expo-router";
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
  id: string;
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
    if (profile) {
      const exams = await sq.getLatestExams(profile.id);
      if (exams) {
        setExams(exams);
      }
    }
  }

  //get the latest exams
  useFocusEffect(
    React.useCallback(() => {
        setExams([]);
        getExams();
    }, [])
  );

  //get suggestion for new exam
  React.useEffect(() => {
    async function getSuggestion() {
      if (!isCalled) {
        setIsCalled(true);
        const suggestion = await suggestNewExam(exams);
        setSuggestionTitle(suggestion.suggestion_title);
        setSuggestionContent(suggestion.suggestion_content);
      }
    }

    getSuggestion();
  }, [exams]);

  //get the current session, print details
  React.useEffect(() => {
    async function initialize() {
      setLoading(true);
      setText(`Hello! Please be patient while we prepare 😊`);
      
      // Fetch session
      const session = await getSession();
      if (!session.data) {
        router.navigate("/");
        return;
      }
  
      // Fetch profile
      const profileData = await getProfile(session.data.session?.user.email || "");
      if (profileData.data) {
        setProfile(profileData.data);
      }
  
      setLoading(false);
    }
  
    initialize();
  }, [router]);
  
  React.useEffect(() => {
    async function fetchExams() {
      if (profile) {
        setExams([]); // Clear exams before fetching new ones
        const exams = await sq.getLatestExams(profile.id);
        if (exams) {
          setExams(exams);
        }
      }
    }
  
    fetchExams();
  }, [profile]); // Fetch exams only when `profile` is set

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
              </>
            )}
            <Text className="text-xl font-bold text-black pb-2">
                {exams.length > 0 ? "You might like:" : "Hello, new intelliTester!\nHere's a cool suggestion to get you started!"}
                </Text>
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
