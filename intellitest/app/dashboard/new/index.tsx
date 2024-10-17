// import { View } from "react-native";
// import { Text } from "@/components/ui/text";
// import { useLoadingContext } from "@/components/Providers/LoaderSpinnerContext";
// import { Button } from "@/components/ui/button";
// import { Image } from "lucide-react-native";
// import { useRouter } from "expo-router";
// import React from "react";
// import { ScrollView } from "react-native";
// import { NotebookText } from "lucide-react-native";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";


// interface Document {
//     fileName: string;
//     fileType: string;
//     isRemoved: boolean;
// }

// // make 5 fake documents for testing

// const document1: Document = {
//     fileName: "notes1",
//     fileType: "text",
//     isRemoved: false
// }

// const document2: Document = {
//     fileName: "notes2",
//     fileType: "text",
//     isRemoved: false
// }

// const document3: Document = {
//     fileName: "notes3",
//     fileType: "text",
//     isRemoved: false
// }

// const document4: Document = {
//     fileName: "notes4",
//     fileType: "text",
//     isRemoved: false
// }

// const document5: Document = {
//     fileName: "notes5",
//     fileType: "text",
//     isRemoved: false
// }

// const documents: Document[] = [document1, document2, document3, document4, document5];

// export default function Index() {
//     const router = useRouter();

//     const { setLoading, setText } = useLoadingContext();

//     return (
//         <View
//         style={{
//           flex: 1,
//         }}
//         >
//         <View className="p-4">
//         <Text className="text-3xl font-bold">Generate a Mock Test</Text>

//         <Text className="flex w-full justify-left text-left pb-2 text-xl">
//             You can paste your notes, upload documents, or take pictures.
//         </Text>
//         <Textarea className="w-full mb-2" />
        
//         <Button variant="secondary" className="w-1/2">
//             <Text className="text-2xl">Upload Documents</Text>
//         </Button>
//         </View>
        
//         <View
//         className="w-full"
//         style={{
//           bottom: 0,
//             position: 'absolute',
//             padding:10
//         }}
//       >
//         <Button>
//           <Text className="text-2xl">Generate Test</Text>
//         </Button>
//       </View>
 
//         </View>
//     )
// }

import { View, Text } from "react-native";
import { useLoadingContext } from "@/components/Providers/LoaderSpinnerContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView } from "react-native";
import { Textarea } from "@/components/ui/textarea";

interface Document {
  fileName: string;
  fileType: string;
  isRemoved: boolean;
}

// Create 5 fake documents for testing
const document1: Document = {
  fileName: "notes1",
  fileType: "text",
  isRemoved: false,
};

const document2: Document = {
  fileName: "notes2",
  fileType: "text",
  isRemoved: false,
};

const document3: Document = {
  fileName: "notes3",
  fileType: "text",
  isRemoved: false,
};

const document4: Document = {
  fileName: "notes4",
  fileType: "text",
  isRemoved: false,
};

const document5: Document = {
  fileName: "notes5",
  fileType: "text",
  isRemoved: false,
};

const documents: Document[] = [document1, document2, document3, document4, document5];

export default function Index() {
  const router = useRouter();
  const { setLoading, setText } = useLoadingContext();

  const [showDocuments, setShowDocuments] = useState(false); // State to toggle document visibility

  // Function to handle uploading documents (toggle visibility)
  const handleUploadClick = () => {
    setShowDocuments(!showDocuments); // Toggle showing the document list
  };

  return (
    <View style={{ flex: 1 }}>
      <View className="p-4">
        <Text className="text-3xl font-bold">Generate a Mock Test</Text>

        <Text className="flex w-full justify-left text-left pb-2 text-xl">
          You can paste your notes, upload documents, or take pictures.
        </Text>

        <Textarea className="w-full mb-2" />

        {/* Upload Documents Button */}
        <Button variant="secondary" className="w-1/2">
            <Text>Upload Documents</Text>
       </Button>

        {/* Show list of uploaded documents when button is clicked */}
        {showDocuments && (
          <View className="mt-4">
            <Text className="text-xl font-bold mb-2">Uploaded Documents:</Text>
            {documents.map((doc, index) => (
              <View key={index} className="border p-2 mb-2 rounded">
                <Text className="text-lg">{doc.fileName}</Text>
                <Text className="text-sm text-gray-600">Type: {doc.fileType}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Button that stays at the bottom */}
      <View
        className="w-full"
         style={{
           bottom: 0,
             position: 'absolute',
             padding:10
         }}
       >
         <Button>
           <Text>Generate Test</Text>
         </Button>
    </View>
    </View>
  );
}
