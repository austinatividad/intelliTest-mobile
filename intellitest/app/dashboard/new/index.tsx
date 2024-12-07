import { ScrollView, View, Text, FlatList } from "react-native";
import { useLoadingContext } from "@/components/Providers/LoaderSpinnerContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { DocumentItem } from "@/components/IntelliTest/Dashboard/document-item"; // Import ExamItem
import { X } from "lucide-react-native";
import { Document, ExamInputContent, fileTypes } from "@/utils/types";
import { convertImageToBase64, convertImageToBase64WithPrefix } from "@/utils/imageUtil";
import * as Clipboard from 'expo-clipboard';

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

  const mapResults = (results: DocumentPicker.DocumentPickerResult | ImagePicker.ImagePickerResult ) => {
    if (results.canceled) {
      return;
    }
    
    results.assets.map( async (asset: DocumentPicker.DocumentPickerAsset | ImagePicker.ImagePickerAsset) => {
      const fileName = "name" in asset ? asset.name : asset.fileName ? asset.fileName : null
      const isImageAsset = asset.mimeType?.startsWith("image/") || /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(fileName || "");

      // If the asset is an image, check if it already has a base64 property or process it
      let base64Value: string | null = null;

      if (isImageAsset) {
        // Use type assertion to check for a custom base64 property
        const imageAsset = asset as ImagePicker.ImagePickerAsset & { base64?: string };
        if (imageAsset.base64 && imageAsset.base64.trim() !== "") {
          base64Value = imageAsset.base64; // Use existing base64 if available
        } else {
          // Call your function to convert the image to base64
          base64Value = await convertImageToBase64WithPrefix(asset.uri, asset.mimeType); // Ensure this function is implemented correctly
        }
      }
    


      const newDocument: Document = {
        id: Date.now().toString(),
        fileName: fileName || "No file name provided",
        fileType: determineFileType(fileName), // Implement this function based on your fileTypes enum
        uri: asset.uri,
        isRemoved: false,
        base64: base64Value,
      };
      setDocuments((prevDocuments) => [...prevDocuments, newDocument]);
      setShowDocuments(true);
    });
  }
  const handleDocumentSelection = async () => {
    // alert that the user can only upload 5 documents
    if (documents.length >= 5) {
      alert("You can only upload 5 documents. Remove a document to upload a new one.");
      return;
    }
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*', // Allow all file types; adjust as needed
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        console.log('Document selection canceled');
      } else {
        console.log(result);
        mapResults(result);
      }
    } catch (error) {
      console.error('Error selecting document:', error);
    }
  };

  const handleCamera = async () => {
    try {

      if (documents.length >= 5) {
        alert("You can only upload 5 documents. Remove a document to upload a new one.");
        return;
      }

      const cameraPermission = await ImagePicker.getCameraPermissionsAsync();
      const mediaLibraryPermission = await ImagePicker.getMediaLibraryPermissionsAsync();
    
      if (!cameraPermission.granted || !mediaLibraryPermission.granted) {
        alert('Camera and Media Library permissions are required.');
        return false;
      }
      let result = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.back,
        allowsEditing: true,
        quality: 1,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true
      });
  
      if (result.canceled) {
        console.log("Image Selection Cancelled");
        return;
      }
      console.log(result);
      mapResults(result);

    } catch (error) {
      console.error('Error selecting document:', error);
    }
  }

  const handlePaste = async () => {
    setInputText(await Clipboard.getStringAsync());
  }
  // Filter out removed documents
  const visibleDocuments = documents.filter(doc => !doc.isRemoved);

  // Check if the Generate Test button should be visible
  const isButtonVisible = inputText.trim().length > 0 || showDocuments;

  return (
    <>
    <ScrollView style={{ flex: 1 }}>
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
          maxLength={10000}
        />
        {/* TODO: ADD an easily accessible "paste from clipboard" */}

        {/* Upload Documents Button */}
        <Button variant="secondary" className="w-1/2" onPress={handleDocumentSelection}>
          <Text>Upload Documents</Text>
        </Button>
        <Button variant="secondary" className="w-1/2 my-0.5" onPress={handlePaste}>
          <Text>Paste Clipboard</Text>
        </Button>
        <Button variant="secondary" className="w-1/2 my-0.5" onPress={handleCamera}>
          <Text>Camera</Text>
        </Button>
        <Text className="font-light text-gray-500">Max number of uploads: 5</Text>

        {/* Show list of uploaded documents when button is clicked */}
        {showDocuments && visibleDocuments.length > 0 && (
            <View className="mt-4">
            <Text className="text-xl font-bold mb-1">Uploaded Documents:</Text>
            {visibleDocuments.map((item) => (
              <DocumentItem
              key={item.id}
              fileName={item.fileName}
              fileType={item.fileType}
              id={item.id}
              isRemoved={item.isRemoved}
              onPress={handleExamPress}
              />
            ))}
            </View>
        )}

      </View>

      
    </ScrollView>
    {/* Conditionally render the Generate Test button */}
    {isButtonVisible && (
        <View
          className="w-full"
          style={{
            bottom: 0,
            position: "absolute",
            padding: 10,
            backgroundColor: "#fff"
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
    </>
  );
}
function determineFileType(name: string | null): fileTypes {
  if (!name) throw new Error(`Unknown File Type for file: ${name}.`)
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

