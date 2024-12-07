import { View, FlatList, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import { useLoadingContext } from "@/components/Providers/LoaderSpinnerContext";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { GenerateButton } from "@/components/IntelliTest/Buttons/generateButton";
import * as sq from "@/utils/supabaseQueries";
import { Search } from "lucide-react-native";
import React from "react";
import { useRouter } from "expo-router";
import { ExamItem } from "@/components/IntelliTest/Dashboard/exam-item";

export default function Index() {
  const router = useRouter();
  const { setLoading, setText } = useLoadingContext();
  const [searchText, setSearchText] = React.useState("");
  const [selectedId, setSelectedId] = React.useState<string>();
  const [exams, setExams] = React.useState<sq.ExamListItem[] | null>(null);
  const [filteredExams, setFilteredExams] = React.useState<sq.ExamListItem[] | null>(null);
  const [loadingError, setLoadingError] = React.useState(false);
  const [isRetrying, setIsRetrying] = React.useState(false);

  const fetchExams = async () => {
    setLoadingError(false);
    setLoading(true);
    setText('Fetching Exams 😊');
    const timeout = setTimeout(() => {
      setLoading(false);
      setLoadingError(true); // Set error if request times out
    }, 15000); // 15-second timeout

    try {
      const exams = await sq.getExams();
      clearTimeout(timeout); // Clear timeout if request succeeds
      setExams(exams ?? []);
      setFilteredExams(exams ?? []);
    } catch (error) {
      console.error("Error fetching exams:", error);
      setLoadingError(true);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchExams();
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

  const renderItem = ({ item }: { item: sq.ExamListItem }) => (
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
      <View className="w-full px-4 pt-10 mb-7">
        <Text className="text-3xl font-semibold mb-5">My Tests</Text>
        <InputWithIcon
          nativeID="search"
          icon={<Search size={20} color={"black"} />} // Pass your icon as a prop
          onChangeText={(text) => setSearchText(text)}
          value={searchText}
          placeholder="What are you looking for?"
        />
      </View>

      {loadingError ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-red-500">Request timed out. Please try again.</Text>
          <TouchableOpacity
            onPress={() => {
              setIsRetrying(true);
              fetchExams();
              setIsRetrying(false);
            }}
            className="mt-4 px-4 py-2 bg-blue-500 rounded"
          >
            <Text className="text-white">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredExams}
          renderItem={renderItem}
          className="w-full px-4"
          keyExtractor={(item) => item.id}
          extraData={selectedId}
          ListEmptyComponent={
            !loadingError &&
            exams &&
            exams.length === 0 && (
              <View className="px-4 h-full align-middle items-center">
                <View className="p-4">
                  <Text className="text-2xl text-gray-500 text-center">
                    You haven't made a mock test, yet!
                  </Text>
                </View>
                <GenerateButton />
              </View>
            )
          }
        />
      )}
    </View>
  );
}
