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

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;
            
            let newQuizList = []
            let questionJSON = questions
            Object.values(questionJSON.quiz).map(quiz => newQuizList.push(quiz))
            setQuizList(newQuizList)
            // Progress
            setProgress(newQuizList)
      
            return () => {
              isActive = false;
            };
        }, [])
    );
    
    const setProgress = async (quizList2) => {
        
        quizList2.map(async (quiz) => {
            let name = "quiz" + (quizList2.indexOf(quiz) + 1)
            let isStartedBefore = await AsyncStorage.getItem(name)
            if(isStartedBefore=="finished"){
                if(quizList2.indexOf(quiz) +1 == 1){
                    setFinished1(true)
                }
                else {
                    setFinished2(true)
                }
            }


            if(isStartedBefore!="finished" && isStartedBefore){
                if(quizList2.indexOf(quiz) +1 == 1){
                    let lastQuestionId = await AsyncStorage.getItem(name)
                    setFinished1(null)
                    setProgress1((parseInt(lastQuestionId)) / 10)
                }
                else {
                    let lastQuestionId = await AsyncStorage.getItem(name)
                    setFinished2(null)
                    setProgress2((parseInt(lastQuestionId)) / 10)
                }
            }
            else if(isStartedBefore == "finished"){
                if(quizList2.indexOf(quiz) +1 == 1){
                    let lastQuestionId = await AsyncStorage.getItem(name)
                    setProgress1(1)
                    setFinished1(true)
                }
                else {
                    let lastQuestionId = await AsyncStorage.getItem(name)
                    setProgress2(1)
                    setFinished2(true)
                }
            }
        })
    }

    const startQuiz = async (quiz) => {
        let newQuestionList = []
        Object.values(quiz).map(question => newQuestionList.push(question))
        let name = `quiz${quizList.indexOf(quiz) +1 }`
        let object = {"questions": newQuestionList, "question": newQuestionList[0]}
        let startBefore = await AsyncStorage.getItem(name)

        if(startBefore=="finished"){
            let score = await AsyncStorage.getItem(name + "Puan")
            Alert.alert("Bu sınavı daha önce yaptınız", `Puanınız: ${score}`, [
                {text: "Geri dön", onPress: () => navigation.navigate("Anasayfa")}
            ])
        }
        else if (startBefore){
            let lastQuestionId = await AsyncStorage.getItem(name)
            let trueQuestion = await AsyncStorage.getItem(name+ "Dogru")
            let score = await AsyncStorage.getItem(name + "Puan")
            dispatch({type: actionTypes.SET_LAST_QUESTION2, payload: {newQuestionList, lastQuestionId, trueQuestion, score, quizId: quizList.indexOf(quiz) +1}})
            navigation.navigate("Quiz")
        }
        else {
            await AsyncStorage.setItem(name, newQuestionList[0].id)
            dispatch({type: actionTypes.SET_DEFAULT_QUESTIONS, payload: {newQuestionList, quizId: quizList.indexOf(quiz) +1, score: 0 }})
            navigation.navigate("Quiz")
        }
        }

    const handleClearAll = async () => {
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

    if(quizList)
        return (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#EC6F66"}}>
            {quizList.map(quiz => 
                <TouchableOpacity key={quizList.indexOf(quiz)}  onPress={() => startQuiz(quiz)} style={{marginVertical: 20}}>
                    <Text style={{fontSize: 20, color: "black", marginVertical: 1, fontWeight: "bold", padding: 10, color: "white"}}>{quizList.indexOf(quiz) +1}. Quize Başla</Text>
                    <View style={{}}>
                        <Image style={{width: 120, height: 120}} source={{uri: "https://image.flaticon.com/icons/png/512/1754/1754445.png"}}></Image>
                        {quizList.indexOf(quiz) +1  == 1 ? 
                        
                        finished1 ? <Text style={{color: "yellow", fontWeight: "bold", textAlign: "center", fontSize: 16}}>Tamamlandı</Text> : 
                        
                        <Progress.Bar style={{padding: 5, margin: 20, }} progress={progress1} width={120} color="yellow"/> :

                        finished2 ? <Text style={{color: "yellow", fontWeight: "bold", textAlign: "center", fontSize: 16}}>Tamamlandı</Text> : 
                        <Progress.Bar style={{padding: 5, margin: 20, }} progress={progress2} width={120} color="yellow"/> }
                    </View>
                   
                </TouchableOpacity>
                
            )}
             <Text onPress={() => handleClearAll()} style={{ fontSize: 16, borderWidth: 1, borderColor: "white", padding: 10, borderRadius: 5, backgroundColor: "#dc3545", color: "white", fontWeight: "bold"}}>İlerlemeyi Sıfırla</Text>
            </View>
        )
    else {
        return (
            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <ActivityIndicator />
            </View>
        )
    }
}

export default HomepageScreen
