import React, {useState, useEffect, useRef} from 'react'
import { View, Text, ActivityIndicator, TextInput, Alert, Image, AsyncStorage } from 'react-native'
// Redux
import {useDispatch, useSelector} from "react-redux"
import * as actionTypes from "../redux/actions/actionTypes"
// Progress
import * as Progress from 'react-native-progress';

const QuestionScreen = ({navigation}) => {
    // React State
    const [answer, setAnswer] = useState(null)
    const [progress, setProgress] = useState(null)
    const [lastQuestion, setLastQuestion] = useState(null)
    const scrollRef = useRef(); 


    // Redux State
    const dispatch = useDispatch()
    const currentQuestionId = useSelector(state => state.question.currentQuestionId)
    const question = useSelector(state => state.question.question)
    const isLoaded = useSelector(state => state.question.isLoaded)
    const totalQuestion = useSelector(state => state.question.totalQuestion)
    const trueQuestion = useSelector(state => state.question.trueQuestion)
    const quizId = useSelector(state => state.question.quizId)
    const score = useSelector(state => state.question.score)

    // Refresh When Question Change
    useEffect(() => {
        // Getting Information About Quiz from AsyncStorage (Cal getData Function)
        getData()
        // Sett Progress
        setProgress((currentQuestionId + 1) / 10)
        // If Last Question
        if(currentQuestionId + 1 == totalQuestion){
            // Set Last Question True
            setLastQuestion(true)
        }
    }, [currentQuestionId])
    
    // Getting Data Function
    const getData = async () => {
       let lastQuestionId = await AsyncStorage.getItem("quiz" + quizId)
       let trueQuestion = await AsyncStorage.getItem("quiz" + quizId + "Dogru")
       let score = await AsyncStorage.getItem("quiz" + quizId + "Puan")
       // Dispatch Action
       dispatch({type: actionTypes.SET_LAST_QUESTION, payload: {lastQuestionId, trueQuestion, score}})
    }
    
    // Set Answer User Entered
    const handleAnswerChange = (text) => {
        setAnswer(text)
    }

    // Send Answer When Clicked Button
    const handleSendAnswer = async () => {
        // If Answer is True
        if(answer == question.trueanswer){
            // Get Quiz Name (quiz1, quiz2)
            let name = "quiz" + quizId
            // Set AsyncStorage to Last Question
            AsyncStorage.setItem(name, `${currentQuestionId +2}`)
            // Get Last Score
            let score = await AsyncStorage.getItem(name + "Puan")
            // Count New Score
            let newScore = score ? parseInt(score) + 10 : 10
            // Dispatch Actions
            dispatch({type: actionTypes.SEND_TRUE_ANSWER}) 
            dispatch({type: actionTypes.SEND_ANSWER_SUCCESS})
            // Alert 
            Alert.alert("Doğru Cevap", "Puanınız: " + newScore, [
                {text: "Devam Et"}
            ])
            // Setting New Score and True Question Count to AsyncStorage
            await AsyncStorage.setItem(name + "Puan", `${newScore}`)
            await AsyncStorage.setItem(name + "Dogru", `${(trueQuestion +1 )}`)
        }
        // Answer is false
        else{
            Alert.alert("Yanlış Cevap", "Puanınız: " + score, [
                {text: "Tekrar deneyin"}
            ])
        }
        setAnswer(null)
    }

    // Sending Quiz
    const handleSendQuiz = async () => {
        // If Last Question is True
        if(answer == question.trueanswer){
            // Create Name of Quiz
            let name = "quiz" + quizId
            // Dispatch Action
            dispatch({type: actionTypes.SEND_TRUE_ANSWER}) 
            // Get Last Score
            let score = await AsyncStorage.getItem(name + "Puan")
            // Count New Score
            let newScore = score ? parseInt(score) + 10 : 10
            // Set Quiz to AsyncStorage
            AsyncStorage.setItem(name, `finished`)
            await AsyncStorage.setItem(name + "Puan", `${String(newScore)}`)
            await AsyncStorage.setItem(name + "Dogru", `10`)
            // Go to Result Page
            navigation.navigate("Sonuç", {trueQuestion: 10, falseQuestion: 0, quizResult: newScore})
        }
        // Wrong Answer
        else{
            Alert.alert("Yanlış Cevap", "Puanınız: " + score, [
                {text: "Tekrar deneyin"}
            ])
        }
               
        
    }
    
    if(isLoaded){
        return (
            // Container
            <View ref={scrollRef} style={{ flex: 1, justifyContent:"center", alignItems: "center", backgroundColor: "white"}}>
                {/* Inner */}
                <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                    <View >
                        {/* Score Text */}
                        <Text style={{paddingTop: 15, textAlign: "center", fontSize: 20, fontWeight: "bold", }}>Puanınız: {score ? score : 0}</Text>
                    </View>
                    
                    <View style={{flex: 1, maxHeight: 100, padding: 10, height: 50, margin: 5, }}>
                        {/* Question Count Text */}
                        <Text style={{padding: 5, textAlign: "center", fontSize: 20, fontWeight: "bold", }}>Soru {currentQuestionId +1}</Text>
                        {/* Quiz Progress  */}
                        <Progress.Bar progress={progress} width={300} color={"#F4A460"}/>
                    </View>
                    

                    <View style={{width: 200, hegiht: 200}}>
                        {/* If Question is not Image */}
                        {!question.question.image ? 
                            // Question Text
                            <Text style={{fontSize: 20, color: "black", margin: 20, textAlign: "center"}}>{question.question} = ?</Text> 
                            // Else
                            : 
                                // If Image Value == 1
                                question.question.image ==  1 ?
                                    <Image source={require("../assets/quiz2/quiz2_1.png")} style={{ width: 200, height: 200, borderRadius: 10}}></Image> 
                                    // Else ( Value is 4)
                                    :
                                    <Image source={require("../assets/quiz2/quiz2_4.png")} style={{ width: 200, height: 200, borderRadius: 10}}></Image>     
                        }
                    </View>

                    <View style={{marginTop: 5}}>
                        {/* Answer Input */}
                        <TextInput
                            style={{height: 40, width:100, borderColor: 'gray', borderWidth: 1, padding: 10, margin: 10}}
                            onChangeText={text => handleAnswerChange(text)}
                            value={answer}
                            keyboardType="numeric"
                        />
                    </View>
                    
                    
                    {/* If Question is not the last question of quiz */}
                    {!lastQuestion ? 
                    <Text onPress={() => handleSendAnswer()} style={{marginTop: 10, fontSize: 16, borderWidth: 1, borderColor: "white", padding: 10, borderRadius: 5, backgroundColor: "#dc3545", color: "white", fontWeight: "bold"}}>Cevabı Gönder</Text>
                    // Else
                    :  <Text onPress={() => handleSendQuiz()} style={{marginTop: 10, fontSize: 16, borderWidth: 1, borderColor: "white", padding: 10, borderRadius: 5, backgroundColor: "#dc3545", color: "white", fontWeight: "bold"}}>Quizi Bitir</Text>}
                    

                    {/* If Question is not image */}
                    {!question.question.image ?
                        // Text View
                        <View style={{ padding: 10, margin: 10}}>
                            <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: "center"}}>İpuçları</Text>
                            {/* Hints View */}
                            {Object.values(question.hints).map(hint => 
                                <Text key={Object.values(question.hints).indexOf(hint)} style={{fontSize: 16, textAlign: "center", paddingTop: 5, marginTop: 5}}>{hint}</Text>
                            )}  
                        </View> 
                    
                    // Else ( Question is Image)
                    :
                    // Image View
                    <View style={{minWidth: 100}}>
                        <Text style={{fontSize: 20, padding:5, fontWeight: 'bold', justifyContent: "center", textAlign: "center"}}>İpuçları</Text>
                            <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5, }}>
                                {/* Hints View */}
                                {Object.values(question.hints).map(hint => 
                                    <Text key={Object.values(question.hints).indexOf(hint)} style={{fontSize: 15, textAlign: "center", paddingTop: 5}}>{hint}</Text>
                                )}  
                            </View>
                    </View> }
                </View>
            </View>
        )}               
    else {
        // Loading
        return (
            <View>
                <ActivityIndicator style={{width: "100%", height: "100%", flex: 1, justifyContent: "center", alignItems: "center",}}/>
            </View>
        )
    }

    
}

export default QuestionScreen
