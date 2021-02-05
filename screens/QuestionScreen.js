import React, {useState, useEffect, useRef} from 'react'
import { View, Text, SafeAreaView, ActivityIndicator, TextInput, Alert, Image, ScrollView, AsyncStorage, KeyboardAvoidingView } from 'react-native'
// Redux
import {useDispatch, useSelector} from "react-redux"
import * as actionTypes from "../redux/actions/actionTypes"
// Progress
import * as Progress from 'react-native-progress';

const QuestionScreen = ({navigation}) => {
    // React
    const [answer, setAnswer] = useState(null)
    const [progress, setProgress] = useState(null)
    const [lastQuestion, setLastQuestion] = useState(null)
    const scrollRef = useRef(); 


    // Redux
    const dispatch = useDispatch()
    const currentQuestionId = useSelector(state => state.question.currentQuestionId)
    const question = useSelector(state => state.question.question)
    const questionFinished = useSelector(state => state.question.questionFinished)
    const isLoaded = useSelector(state => state.question.isLoaded)
    const leaveQuestions = useSelector(state => state.question.leaveQuestions)
    const totalQuestion = useSelector(state => state.question.totalQuestion)
    const trueQuestion = useSelector(state => state.question.trueQuestion)
    const falseQuestion = useSelector(state => state.question.falseQuestion)
    const quizId = useSelector(state => state.question.quizId)
    const score = useSelector(state => state.question.score)

    useEffect(() => {
        console.log(currentQuestionId)
       getData()
        setProgress((currentQuestionId + 1) / 10)
        if(currentQuestionId + 1 == totalQuestion){
            setLastQuestion(true)
        }
    }, [currentQuestionId])
    
    const getData = async () => {
       let lastQuestionId = await AsyncStorage.getItem("quiz" + quizId)
       let trueQuestion = await AsyncStorage.getItem("quiz" + quizId + "Dogru")
       let score = await AsyncStorage.getItem("quiz" + quizId + "Puan")
       dispatch({type: actionTypes.SET_LAST_QUESTION, payload: {lastQuestionId, trueQuestion, score}})
    }
    
    const handleAnswerChange = (text) => {
        setAnswer(text)
    }

    const handleSendAnswer = async () => {
        console.log("QuizId", quizId)
        if(answer == question.trueanswer){
            let name = "quiz" + quizId
            AsyncStorage.setItem(name, `${currentQuestionId +2}`)
            let score = await AsyncStorage.getItem(name + "Puan")
            let newScore = score ? parseInt(score) + 10 : 10
            dispatch({type: actionTypes.SEND_TRUE_ANSWER}) 
            dispatch({type: actionTypes.SEND_ANSWER_SUCCESS})
            Alert.alert("Doğru Cevap", "Puanınız: " + newScore, [
                {text: "Devam Et"}
            ])

            await AsyncStorage.setItem(name + "Puan", `${newScore}`)
            await AsyncStorage.setItem(name + "Dogru", `${(trueQuestion +1 )}`)
        }
        else{
            Alert.alert("Yanlış Cevap", "Puanınız: " + score, [
                {text: "Tekrar deneyin"}
            ])
            // dispatch({type: actionTypes.SEND_FALSE_ANSWER})
        }
        setAnswer(null)
    }

    const handleSendQuiz = async () => {
        let quizResult = 0
        if(answer == question.trueanswer){
            let name = "quiz" + quizId
            dispatch({type: actionTypes.SEND_TRUE_ANSWER}) 
            let score = await AsyncStorage.getItem(name + "Puan")
            let newScore = score ? parseInt(score) + 10 : 10
            AsyncStorage.setItem(name, `finished`)
            await AsyncStorage.setItem(name + "Puan", `${String(newScore)}`)
            await AsyncStorage.setItem(name + "Dogru", `10`)
            navigation.navigate("Sonuç", {trueQuestion: 10, falseQuestion: 0, quizResult: newScore})
        }
        else{
            Alert.alert("Yanlış Cevap", "Puanınız: " + score, [
                {text: "Tekrar deneyin"}
            ])
        }
               
        
    }
    
    const handleScroll = () => {
        console.log(scrollRef)
        scrollRef.scrollToEnd({animated: true})
    }
    
    const handleShowQuestionsAgain = () => {
        dispatch({type: actionTypes.SHOW_QUESTIONS_AGAIN_REQUEST})
        dispatch({type: actionTypes.SHOW_QUESTIONS_AGAIN_SUCCESS})
    }
    
    const handleLeaveQuestions = () => {
        dispatch({type: actionTypes.LEAVE_QUESTIONS})
    }
    
    if(isLoaded){
        return (
            <View ref={scrollRef} style={{ flex: 1, justifyContent:"center", alignItems: "center", backgroundColor: "white"}}>
                <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                    <View >
                        <Text style={{paddingTop: 15, textAlign: "center", fontSize: 20, fontWeight: "bold", }}>Puanınız: {score ? score : 0}</Text>
                    </View>
                    
                    <View style={{flex: 1, maxHeight: 100, padding: 10, height: 50, margin: 5, }}>
                        <Text style={{padding: 5, textAlign: "center", fontSize: 20, fontWeight: "bold", }}>Soru {currentQuestionId +1}</Text>
                        <Progress.Bar progress={progress} width={300} color={"#F4A460"}/>
                    </View>
                    

                    <View style={{width: 200, hegiht: 200}}>
                        {!question.question.image ? <Text style={{fontSize: 20, color: "black", margin: 20, textAlign: "center"}}>{question.question} = ?</Text> : 
                        question.question.image ==  1?
                        <Image source={require("../assets/quiz2/quiz2_1.png")} style={{ width: 200, height: 200, borderRadius: 10}}></Image> :
                        <Image source={require("../assets/quiz2/quiz2_4.png")} style={{ width: 200, height: 200, borderRadius: 10}}></Image>     
                        }

                    </View>

                    <View style={{marginTop: 5}}>
                        <TextInput
                            style={{height: 40, width:100, borderColor: 'gray', borderWidth: 1, padding: 10, margin: 10}}
                            onChangeText={text => handleAnswerChange(text)}
                            // onFocus={() => handleScroll()}
                            value={answer}
                            keyboardType="numeric"
                        />
                    </View>
                    
                    
                
                    {!lastQuestion ? 
                    <Text onPress={() => handleSendAnswer()} style={{marginTop: 10, fontSize: 16, borderWidth: 1, borderColor: "white", padding: 10, borderRadius: 5, backgroundColor: "#dc3545", color: "white", fontWeight: "bold"}}>Cevabı Gönder</Text>
                    
                    :  <Text onPress={() => handleSendQuiz()} style={{marginTop: 10, fontSize: 16, borderWidth: 1, borderColor: "white", padding: 10, borderRadius: 5, backgroundColor: "#dc3545", color: "white", fontWeight: "bold"}}>Quizi Bitir</Text>}
                    
                    {!question.question.image ?
                    
                    <View style={{ padding: 10, margin: 10}}>
                        <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: "center"}}>İpuçları</Text>
                        {Object.values(question.hints).map(hint => 
                            <Text key={Object.values(question.hints).indexOf(hint)} style={{fontSize: 16, textAlign: "center", paddingTop: 5, marginTop: 5}}>{hint}</Text>
                        )}  
                    </View> :

                    <View style={{minWidth: 100}}>
                        <Text style={{fontSize: 20, padding:5, fontWeight: 'bold', justifyContent: "center", textAlign: "center"}}>İpuçları</Text>
                            <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5, }}>
                                {Object.values(question.hints).map(hint => 
                                    <Text key={Object.values(question.hints).indexOf(hint)} style={{fontSize: 15, textAlign: "center", paddingTop: 5}}>{hint}</Text>
                                )}  
                            </View>
                    </View> }
                </View>
            </View>
        )}               
    else {
        return (
            <View>
                <ActivityIndicator style={{width: "100%", height: "100%", flex: 1, justifyContent: "center", alignItems: "center",}}/>
            </View>
        )
    }

    
}

export default QuestionScreen
