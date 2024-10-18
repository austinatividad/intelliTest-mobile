import { ScrollView, View, Text, FlatList } from "react-native";
import { useLoadingContext } from "@/components/Providers/LoaderSpinnerContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { DocumentItem } from "@/components/IntelliTest/Dashboard/document-item"; // Import ExamItem
import { X } from "lucide-react-native";

enum fileTypes {
  "text",
  "image"
}

interface Document {
  id: string;
  fileName: string;
  fileType: fileTypes;
  isRemoved: boolean;
}

// Create 5 fake documents for testing
const initialDocuments: Document[] = [
  { id: "1", fileName: "My MOBDEVE Notes.txt", fileType: fileTypes.text, isRemoved: false },
  { id: "2", fileName: "How to do Inheritance.pdf", fileType: fileTypes.image, isRemoved: false },
  { id: "3", fileName: "Top 10 Animes of all Time.txt", fileType: fileTypes.text, isRemoved: false },
  { id: "4", fileName: "notes4", fileType: fileTypes.text, isRemoved: false },
  { id: "5", fileName: "Hooray.png", fileType: fileTypes.image, isRemoved: false },
  { id: "6", fileName: "notes6", fileType: fileTypes.text, isRemoved: false },
];

export default function Index() {
  const router = useRouter();
  const { setLoading, setText } = useLoadingContext();
  const [documents, setDocuments] = useState<Document[]>(initialDocuments); // State to store uploaded documents
  const [showDocuments, setShowDocuments] = useState(false); // State to toggle document visibility
  const [inputText, setInputText] = useState(""); // State to track textarea content

  // Function to handle uploading documents (toggle visibility)
  const handleUploadClick = () => {
    setShowDocuments(!showDocuments); // Toggle showing the document list
  };

  // Function to handle exam item press (removes the document from the list)
  const handleExamPress = (id: string) => {
    const updatedDocuments = documents.map((doc) => 
      doc.id === id ? { ...doc, isRemoved: true } : doc
    );
    setDocuments(updatedDocuments); // Update the state with the modified documents
  };

  const handleContinue = () => {
    router.push({
      pathname: "/dashboard/new/options",
      params: { examId: "10" },
    });
  };

  // Filter out removed documents
  const visibleDocuments = documents.filter(doc => !doc.isRemoved);

  // Check if the Generate Test button should be visible
  const isButtonVisible = inputText.trim().length > 0 || showDocuments;

  return (
    <View style={{ flex: 1 }}>
      <View className="p-4">
        <Text className="text-3xl font-bold">Generate a Mock Test</Text>

        <Text className="flex w-full justify-left text-left pb-2 text-xl">
          You can paste your notes, upload documents, or take pictures.
        </Text>

        {/* Textarea to capture input */}
        <Textarea
          className="w-full mb-2"
          value={inputText}
          onChangeText={setInputText}
        />

        {/* Upload Documents Button */}
        <Button variant="secondary" className="w-1/2" onPress={handleUploadClick}>
          <Text>Upload Documents</Text>
        </Button>
        <Text className="font-light text-gray-300">Max number of uploads: 5</Text>

        {/* Show list of uploaded documents when button is clicked */}
        {showDocuments && visibleDocuments.length > 0 && (
          <View className="mt-4">
            <Text className="text-xl font-bold mb-1">Uploaded Documents:</Text>
            <FlatList
              data={visibleDocuments}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <DocumentItem
                  fileName={item.fileName}
                  fileType={item.fileType}
                  id={item.id}
                  isRemoved={item.isRemoved}
                  onPress={handleExamPress}
                />
              )}
            />
          </View>
        )}
      </View>

      {/* Conditionally render the Generate Test button */}
      {isButtonVisible && (
        <View
          className="w-full"
          style={{
            bottom: 0,
            position: "absolute",
            padding: 10,
          }}
        >
          <Button variant={null} className="bg-black" onPress={handleContinue}>
            <Text className="text-white">Continue</Text>
          </Button>
        </View>
      )}
      {!isButtonVisible && (
        <View
          className="w-full"
          style={{
            bottom: 0,
            position: "absolute",
            padding: 10,
          }}
        >
          <Button variant="ghost" className="bg-gray-200">
            <Text className="text-white">Continue</Text>
          </Button>
        </View>
      )}
    </View>
  );
}
