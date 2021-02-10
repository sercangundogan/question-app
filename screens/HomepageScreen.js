import React, {useState, useEffect} from 'react'
import { View, Text, ActivityIndicator, Image, TouchableOpacity, AsyncStorage, Alert } from 'react-native'
// Redux
import {useDispatch, useSelector} from "react-redux"
import * as actionTypes from "../redux/actions/actionTypes"
// Questions
import * as questions from "../questions.json"
// Progress
import * as Progress from 'react-native-progress';
// React Navigation
import { useFocusEffect  } from '@react-navigation/native';

const HomepageScreen = ({navigation}) => {

    // React
    const [quizList, setQuizList] = useState(null)
    const [progress1, setProgress1] = useState(0)
    const [progress2, setProgress2] = useState(0)
    const [finished1, setFinished1] = useState(null)
    const [finished2, setFinished2] = useState(null)
    // Redux
    const dispatch = useDispatch()
    const currentQuestionId = useSelector(state => state.question.currentQuestionId)
    const trueQuestion = useSelector(state => state.question.trueQuestion)

    // Refreshing in Every Screen Focus
    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;
            
            // Getting All Quizes and Set
            let newQuizList = []
            let questionJSON = questions
            Object.values(questionJSON.quiz).map(quiz => newQuizList.push(quiz))
            setQuizList(newQuizList)

            // Set Progress
            setProgress(newQuizList)
      
            return () => {
              isActive = false;
            };
        }, [])
    );
    
    const setProgress = async (quizList2) => {
        
        // For Every Quiz in Quiz List
        quizList2.map(async (quiz) => {
            // Creating name (quiz1 or quiz2)
            let name = "quiz" + (quizList2.indexOf(quiz) + 1)
            // Checking Started Before 
            let isStartedBefore = await AsyncStorage.getItem(name)

            // If The Quiz Finished Earlier
            if(isStartedBefore=="finished"){

                // Control Quiz Name
                if(quizList2.indexOf(quiz) +1 == 1){
                    // Set Quiz 1 Finished
                    setFinished1(true)
                    // Set Progress 100%
                    setProgress1(1)
                }
                
                else {
                    // Set Finished Quiz
                    setFinished2(true)
                    // Set Progress 100%
                    setProgress2(1)
                }
            }

            // If Quiz Didn't Finish but Started Earlier
            if(isStartedBefore!="finished" && isStartedBefore){
                // Control Quiz Name
                if(quizList2.indexOf(quiz) +1 == 1){
                    // Get Last Question ID from AsyncStorage
                    let lastQuestionId = await AsyncStorage.getItem(name)
                    // Set Quiz1 Not Finished
                    setFinished1(null)
                    // Set Progress for Progress Bar
                    setProgress1((parseInt(lastQuestionId)) / 10)
                }
                else {
                    // Get Last Question ID from AsyncStorage
                    let lastQuestionId = await AsyncStorage.getItem(name)
                    // Set Quiz2 Not Finished
                    setFinished2(null)
                    // Set Progress for Progress Bar
                    setProgress2((parseInt(lastQuestionId)) / 10)
                }
            }
        })
    }

    // Starting Quiz When Clicked The Quiz
    const startQuiz = async (quiz) => {
        // Getting Questions of the Quiz
        let newQuestionList = []
        Object.values(quiz).map(question => newQuestionList.push(question))
        // Creating Name of Quiz
        let name = `quiz${quizList.indexOf(quiz) +1 }`
        // Getting Information about Quiz from AsyncStorage
        let startBefore = await AsyncStorage.getItem(name)


        // If Quiz Finished Before
        if(startBefore=="finished"){
            // Getting Score of Quiz
            let score = await AsyncStorage.getItem(name + "Puan")

            // Alert That Quiz Has Been Already Finished and Alert Score of the Quiz
            Alert.alert("Bu sınavı daha önce yaptınız", `Puanınız: ${score}`, [
                {text: "Geri dön", onPress: () => navigation.navigate("Anasayfa")}
            ])
        }

        // If Quiz Not Finished but Started Earlier
        else if (startBefore){
            // Getting Information about Quiz ( Last Question ID, True Question Counter, Score)
            let lastQuestionId = await AsyncStorage.getItem(name)
            let trueQuestion = await AsyncStorage.getItem(name+ "Dogru")
            let score = await AsyncStorage.getItem(name + "Puan")
            
            // Dispatching Action
            dispatch({type: actionTypes.SET_LAST_QUESTION2, payload: {newQuestionList, lastQuestionId, trueQuestion, score, quizId: quizList.indexOf(quiz) +1}})

            // Go to Quiz Screen (Question Screen)
            navigation.navigate("Quiz")
        }
        // First Looking at Quiz
        else {
            // Setting Quiz Information to AsyncStorage
            await AsyncStorage.setItem(name, newQuestionList[0].id)
            // Dispatch Action
            dispatch({type: actionTypes.SET_DEFAULT_QUESTIONS, payload: {newQuestionList, quizId: quizList.indexOf(quiz) +1, score: 0 }})
            // Go to Quiz Screen (Question Screen) 
            navigation.navigate("Quiz")
        }
        }

    const handleClearAll = async () => {
        // Clear All History 
        await AsyncStorage.removeItem("quiz1")
        await AsyncStorage.removeItem("quiz1Dogru")
        await AsyncStorage.removeItem("quiz1Puan")
        await AsyncStorage.removeItem("quiz2")
        await AsyncStorage.removeItem("quiz2Dogru")
        await AsyncStorage.removeItem("quiz2Puan")

        setProgress1(0)
        setProgress2(0)
        setFinished1(null)
        setFinished2(null)
    }

    // If Quiz List is Loaded
    if(quizList)
        return (
            // Container View
            <View style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#EC6F66"}}>
                {/* For Every Quiz */}
                {quizList.map(quiz => 
                    // Touchable for Quiz 
                    <TouchableOpacity key={quizList.indexOf(quiz)}  onPress={() => startQuiz(quiz)} style={{marginVertical: 20}}>
                        <Text style={{fontSize: 20, color: "black", marginVertical: 1, fontWeight: "bold", padding: 10, color: "white"}}>{quizList.indexOf(quiz) +1}. Quize Başla</Text>
                        <View>
                            {/* Quiz Icon */}
                            <Image style={{width: 120, height: 120}} source={require("../assets/quiz_icon.png")}></Image>
                            {/* If Quiz1 */}
                            {quizList.indexOf(quiz) +1  == 1 ? 
                                // If Quiz1 Finished
                                finished1 ? 
                                    <Text style={{color: "yellow", fontWeight: "bold", textAlign: "center", fontSize: 16}}>Tamamlandı</Text> 
                                // If Quiz1 Didn't Finish Show Progress Bar
                                : <Progress.Bar style={{padding: 5, margin: 20, }} progress={progress1} width={120} color="yellow"/> 
                            
                            // Else -> Quiz 2
                            : 
                                // If Quiz 2 Finished
                                finished2 ? 
                                    <Text style={{color: "yellow", fontWeight: "bold", textAlign: "center", fontSize: 16}}>Tamamlandı</Text> 
                                // If Quiz2 Didn't Finish Show Progress Bar
                                : <Progress.Bar style={{padding: 5, margin: 20, }} progress={progress2} width={120} color="yellow"/> }
                        </View>
                    </TouchableOpacity>
                    
                )}
                {/* Clear History Button */}
             <Text onPress={() => handleClearAll()} style={{ fontSize: 16, borderWidth: 1, borderColor: "white", padding: 10, borderRadius: 5, backgroundColor: "#dc3545", color: "white", fontWeight: "bold"}}>İlerlemeyi Sıfırla</Text>
            </View>
        )
    // Loading Screen
    else {
        return (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <ActivityIndicator />
            </View>
        )
    }
}

export default HomepageScreen
