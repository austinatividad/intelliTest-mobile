import { ScrollView, View, Text, FlatList } from "react-native";
import { useLoadingContext } from "@/components/Providers/LoaderSpinnerContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";
import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { DocumentItem } from "@/components/IntelliTest/Dashboard/document-item"; // Import ExamItem
import { X } from "lucide-react-native";

enum fileTypes {
  'text',
  'image',
  // Add other file types as needed
}

interface Document {
  id: string;
  fileName: string;
  fileType: fileTypes;
  uri: string;
  isRemoved: boolean;
}

// the interface for the exam input content, will be used to store the content of the exam input and pass it to the next page
interface ExamInputContent {
  inputText: string;
  documents: Document[];
}

export default function Index() {
  const router = useRouter();
  const { setLoading, setText } = useLoadingContext();
  const [documents, setDocuments] = useState<Document[]>([]); // State to store uploaded documents
  const [showDocuments, setShowDocuments] = useState(false); // State to toggle document visibility
  const [inputText, setInputText] = useState(""); // State to track textarea content

  // Function to handle uploading documents (toggle visibility)
  const handleUploadClick = () => {
    setShowDocuments(!showDocuments); // Toggle showing the document list
  };

  // Function to handle exam item press (removes the document from the list)
  const handleExamPress = (id: string) => {
    console.log("deleted!")
    const updatedDocuments = documents.filter((doc) => doc.id !== id);
    setDocuments(updatedDocuments); // Update the state with the modified documents
  };

  const handleContinue = () => {
    // setup the exam input content
    const examInputContent: ExamInputContent = {
      inputText,
      documents,
    };
    console.log(examInputContent);
    router.push({
      pathname: "/dashboard/new/options",
      params: { examInputContent: JSON.stringify(examInputContent) },
    });
  };

  
  const handleDocumentSelection = async () => {
    // alert that the user can only upload 5 documents
    if (documents.length >= 5) {
      alert("You can only upload 5 documents. Remove a document to upload a new one.");
      return;
    }
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // Allow all file types; adjust as needed
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        console.log('Document selection canceled');
      } else {
        console.log(result);
        result.assets.map((asset) => {
          const newDocument: Document = {
            id: Date.now().toString(),
            fileName: asset.name,
            fileType: determineFileType(asset.name), // Implement this function based on your fileTypes enum
            uri: asset.uri,
            isRemoved: false,
          };
          setDocuments((prevDocuments) => [...prevDocuments, newDocument]);
          setShowDocuments(true);
        });
      }
    } catch (error) {
      console.error('Error selecting document:', error);
    }
  };

  // Filter out removed documents
  const visibleDocuments = documents.filter(doc => !doc.isRemoved);

  // Check if the Generate Test button should be visible
  const isButtonVisible = inputText.trim().length > 0 || showDocuments;

  return (
    <View style={{ flex: 1 }}>
      <View className="p-4 pt-12">
        <Text className="text-3xl font-bold">Generate a Mock Test</Text>

        <Text className="flex w-full justify-left text-left pb-2 text-xl">
          You can paste your notes, upload documents, or take pictures.
        </Text>

        <Textarea
          className="w-full mb-2"
          value={inputText}
          onChangeText={setInputText}
          numberOfLines={8}
        />

        {/* Upload Documents Button */}
        <Button variant="secondary" className="w-1/2" onPress={handleDocumentSelection}>
          <Text>Upload Documents</Text>
        </Button>
        <Text className="font-light text-gray-500">Max number of uploads: 5</Text>

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
function determineFileType(name: string): fileTypes {
  const extension = name.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'txt':
    case 'doc':
    case 'docx':
    case 'pdf':
      return fileTypes.text;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return fileTypes.image;
    default:
      throw new Error(`Unsupported file type: ${extension}`);
  }
}

