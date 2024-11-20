import { View, FlatList } from "react-native";
import { Text } from "@/components/ui/text";
import { useLoadingContext } from "@/components/Providers/LoaderSpinnerContext";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import * as sq from "@/utils/supabaseQueries";
import { Search } from "lucide-react-native";
import React from "react";
import { useRouter } from "expo-router";
import { ExamItem } from "@/components/IntelliTest/Dashboard/exam-item";

export default function Index() {
  const router = useRouter();
  const { setLoading } = useLoadingContext();
  const [searchText, setSearchText] = React.useState("");
  const [selectedId, setSelectedId] = React.useState<string>();
  const [exams, setExams] = React.useState<sq.Exam[] | null>(null);
  const [filteredExams, setFilteredExams] = React.useState<sq.Exam[] | null>(null);

  React.useEffect(() => {
    async function getExams() {
      setLoading(true);
      const exams = await sq.getExams();
      setExams(exams ?? []);
      setFilteredExams(exams ?? []);
      setLoading(false);
      console.log(exams);
    }
    getExams();
  }, [router]);

  // Filter exams based on search text
  React.useEffect(() => {
    if (exams) {
      const filtered = exams.filter((exam) =>
        exam.examName.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredExams(filtered);
    }
  }, [searchText, exams]);

  const renderItem = ({ item }: { item: sq.Exam }) => (
    <View style={{ alignItems: "center" }} className="w-full">
      <ExamItem
        examName={item.examName}
        examStatus={item.examStatus}
        id={item.id}
        score={item.score}
        totalScore={item.totalScore}
        onPress={handlePress}
      />
    </View>
  );

  function handlePress(id: string) {
    console.log(id);
    router.push({
      pathname: "/dashboard/exam",
      params: { examId: id },
    });
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      <View className="w-full px-4 pt-12 mb-5 ">
        <Text className="text-3xl font-semibold mb-5">My Exams</Text>
        <InputWithIcon
          nativeID="search"
          icon={<Search size={20} color={"black"} />} // Pass your icon as a prop
          onChangeText={(text) => setSearchText(text)}
          value={searchText}
          placeholder="What are you looking for?"
        />
      </View>
      {/* Filtered Data */}
      <FlatList
        data={filteredExams}
        renderItem={renderItem}
        className="w-full px-4"
        keyExtractor={(item) => item.id}
        extraData={selectedId}
      />
    </View>
  );
}
