import { ScrollView, View, Modal, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { dummy } from "@/lib/dummy_data";
import ExplanationModal from "@/components/explanationModal";
import FeedbackModal from "@/components/ui/feedbackModal";
export default function summaryPage() {
    const router = useRouter();
    const { examID } = useLocalSearchParams();
    const [modalVisible, setModalVisible] = useState(false);
    const [feedbackVisible, setFeedbackVisible] = useState(false);
    const [explanationText, setExplanationText] = useState("");
    const [feedbackText, setFeedbackText] = useState("");

    // Function to retake the exam, redirects to the first question
    const handleRetakeButton = () => {
        router.navigate({
            pathname: `/dashboard/exam/${examID}`, // Navigate to the first question
            params: { questionNumber: 1 },
        });
    };

    // Function to go back to the "My Exams" dashboard
    const handleDashboardButton = () => {
        router.navigate({
            pathname: `/dashboard/exams`, // Navigate back to "My Exams" page
        });
    };

    // Function to show the modal with a specific explanation
    const viewModal = (text: string) => {
        setExplanationText(text);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };


    const viewFeedback = (text: string) => {
        setFeedbackText(text);
        setFeedbackVisible(true);
    }

    const closeFeedback = () => {
        setFeedbackVisible(false);
    }

    

    return (
        <ScrollView
            className="p-4"
            style={{
                flex: 1,
            }}
        >
            <ExplanationModal 
                visible={modalVisible} 
                onClose={closeModal} 
                explanationText={explanationText}
            />

            <FeedbackModal
                visible={feedbackVisible}
                onClose={closeFeedback}
                feedbackText={feedbackText}
            />

            <Text className="justify-center text-center mt-5 text-2xl text-gray-600"> Good Job! </Text>  
            <Text className="justify-center text-center text-6xl font-bold">45 out of 50</Text>
            <Text className="justify-center text-center mb-10">25 out of 25 items answered</Text>  

            <View className="rounded-3xl bg-gray-100 p-6 gap-4 mb-10">
                <Text className="font-bold">Part 1: Recycler Views</Text>
                <View className="flex flex-col pl-2 py-4  bg-white rounded-2xl border-green-400 border">
                    <Text className="px-4 text-gray-500">Question 1</Text>
                    <Text className="px-4">What is a RecyclerView?</Text>

                    <Text className="px-4 text-gray-500">Your Answer</Text>
                    <Text className="px-4">A: A view that recycles views</Text>

                    <Text className="px-4 text-gray-500">Correct Answer</Text>
                    <Text className="px-4">A: A view that recycles views</Text>

                    <Button className="absolute right-4 bottom-4" variant="secondary" onPress={() => viewModal("RecyclerView is a UI component for handling large data sets by recycling views.")}>
                        <Text>Explain</Text>
                    </Button> 
                </View>

                <View className="flex flex-col pl-2 py-4  bg-white rounded-2xl border-red-400 border">
                    <Text className="px-4 text-gray-500">Question 2</Text>
                    <Text className="px-4">Is RecyclerView a layout?</Text>

                    <Text className="px-4 text-gray-500">Your Answer</Text>
                    <Text className="px-4">false</Text>

                    <Text className="px-4 text-gray-500">Correct Answer</Text>
                    <Text className="px-4">true</Text>

                    <Button className="absolute right-4 bottom-4" variant="secondary" onPress={() => viewModal("The RecyclerView is technically not a standalone layout, but it does play a similar role as a container for views. It extends the ViewGroup class, which is a type of layout in Android, and is used to organize and manage the child views. The RecyclerView is designed to efficiently display large sets of data by recycling views, making it more memory-efficient. So while RecyclerView is not a layout in the same sense as LinearLayout or RelativeLayout, it acts as a layout manager for the data displayed in the child views.")}>
                        <Text>Explain</Text>
                    </Button> 
                </View>

                <Text className="font-bold">Part 2: Intents</Text>

                <View className="flex flex-col pl-2 py-4  bg-white rounded-2xl border-green-400 border">
                    <Text className="px-4 text-gray-500">Question 3</Text>
                    <Text className="px-4">What is the purpose of an intent?</Text>

                    <Text className="px-4 text-gray-500">Your Answer</Text>
                    <Text className="px-4">To start activities</Text>

                    <Text className="px-4 text-gray-500">Correct Answer</Text>
                    <Text className="px-4">To start activities</Text>

                    <Button className="absolute right-4 bottom-4" variant="secondary" onPress={() => viewModal("Correct")} >
                        <Text>Explain</Text>
                    </Button> 
                </View>

                <View className="flex flex-col pl-2 py-4 bg-white rounded-2xl">
                    <Text className="px-4 text-gray-500">Question 4</Text>
                    <Text className="px-4">Explain the usage of fragments.</Text>

                    <Text className="px-4 text-gray-500">Your Answer</Text>
                    <Text className="px-4">A RecyclerView is a UI component in Android that displays large sets of data efficiently by reusing a small pool of views. It's a ViewGroup that contains views that correspond to data, and it can be added to a layout like any other UI element. </Text>
                
                    <Text className="px-4 text-gray-500 pt-4">Your Score</Text>
                    <Text className="px-4">0 out of 5</Text>
                    <Button className="absolute right-4 bottom-4" variant="secondary" onPress={() => viewFeedback("You are talking about something else!")}>
                        <Text>Feedback</Text>
                    </Button>
                
                </View>


                
                <View className="flex flex-col pl-2 py-4 bg-white rounded-2xl">
                    <Text className="px-4 text-gray-500">Question 5</Text>
                    <Text className="px-4">Why do we need to test long text lengths?</Text>

                    <Text className="px-4 text-gray-500">Your Answer</Text>
                    <Text className="px-4">Testing long text lengths is a crucial aspect of software development, particularly in user interface (UI) and user experience (UX) design. It ensures that applications maintain their functionality and visual integrity when faced with unusually long inputs, preventing various problems that could arise due to inadequate handling of extended text.

First, long text testing is essential for maintaining UI/UX integrity. In any application, the layout is typically designed to accommodate a range of text lengths, but long text can disrupt this design if not properly accounted for. For example, text that is too long can overflow its container, pushing other elements out of alignment, or causing the layout to break altogether. This leads to a poor user experience, as users might encounter elements that overlap or are not properly visible. Additionally, ensuring that long text wraps appropriately within its designated area is crucial for maintaining readability. Text that extends beyond the viewport, or worse, becomes cut off without an indication of continuation, can confuse users and hinder their experience.

Responsive design also plays a major role when dealing with long text. Mobile devices or smaller screen sizes often exhibit limitations in terms of display space, so testing long text ensures that responsive layouts adapt properly. When testing long text, developers can identify whether the text scales down, wraps, or truncates as necessary. Moreover, font scaling can present another challenge. Some users may adjust their font size for accessibility reasons, and long text can exacerbate layout issues if not properly handled in such cases.

Another reason long text testing is important is to prevent content overflow issues. Long text can extend beyond the intended display container, hiding behind other elements or extending outside the viewable area, which often breaks the visual flow of a webpage or app screen. Overflow prevention ensures that all content stays within its bounds, either by allowing for scrolling, resizing, or truncating content in a user-friendly way. Implementing solutions like ellipsis (`...`) when text exceeds container limits is a common technique, but even this approach needs testing to ensure that users clearly understand the content being truncated and that the ellipsis appears at appropriate points.

Performance considerations are also crucial when handling long text. Rendering long pieces of text may introduce performance bottlenecks, especially on mobile devices or lower-end platforms where resources are constrained. By testing long text, developers can ensure that applications continue to perform smoothly, even when handling large amounts of text. This type of testing is vital for ensuring that interactions like scrolling, input handling, and rendering are not noticeably slowed down by excessive text content.

Additionally, the behavior of user inputs is unpredictable. In many scenarios, users will input text of varying lengths into fields such as forms, comments, or search bars. Failing to account for extremely long inputs can cause issues such as breaking the design, slowing down performance, or even triggering backend errors. Therefore, testing long text is essential for ensuring robustness and reliability in applications. Moreover, it is also necessary to validate inputs, especially when there are technical limits such as database field length constraints or API payload size restrictions. Testing these edge cases allows developers to provide clear error messages or enforce reasonable input limits, thereby maintaining data consistency and preventing unintended behavior.

Another major factor in testing long text is multilingual content. Applications designed for global audiences must account for text length variations across languages. For example, some languages, like German, tend to have longer words, while others, like Chinese, use characters that take up less space. Testing long text helps ensure that UI elements can accommodate such variations, especially when applications are localized for different regions.

Accessibility is another key area where testing long text becomes necessary. Many users rely on assistive technologies such as screen readers to navigate applications. Long text content must be properly structured to ensure that screen readers can interpret and relay the content without confusion. Additionally, users with visual impairments may zoom into text, and long text can cause UI issues when zoomed in. Testing these scenarios ensures that the application remains accessible to all users, regardless of their specific needs.

Lastly, testing long text helps ensure that the application can handle edge cases gracefully. These edge cases might not occur frequently in everyday usage, but when they do arise, they can introduce bugs or usability issues that could compromise the overall stability of the app. By accounting for edge cases, developers can preemptively resolve issues that may otherwise only surface during real-world usage.

In conclusion, testing long text lengths is an important process for ensuring that applications handle unpredictable input without compromising UI design, performance, or accessibility. Whether addressing content overflow, responsive design, multilingual content, or performance challenges, long text testing contributes to the overall robustness and user-friendliness of a system. Through this form of testing, developers can ensure that applications remain functional and visually consistent, even in scenarios that fall outside the typical range of expected inputs.</Text>
                
                    <Text className="px-4 text-gray-500 pt-4">Your Score</Text>
                    <Text className="px-4">20 out of 20</Text>
                    <Button className="absolute right-4 bottom-4" variant="secondary" onPress={() => viewFeedback("Great work!")}>
                        <Text>Feedback</Text>
                    </Button> 

                       
                
                </View>
                
                
            </View> 

            {/* Retake Test Button */}
            <Button onPress={handleRetakeButton} className="mb-4">
                <Text>Retake Test</Text>
            </Button>

            {/* Back to My Exams Button */}
            <Button variant="secondary" onPress={handleDashboardButton} className="mb-8">
                <Text>Back to My Exams</Text>
            </Button>
        </ScrollView>
    );
}

