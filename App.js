import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, ActivityIndicator, AsyncStorage } from 'react-native';
// Screens
import HomepageScreen from "./screens/HomepageScreen"
import QuestionScreen from "./screens/QuestionScreen"
import ResultScreen from "./screens/ResultScreen"

// Questions
import * as questions from "./questions.json"
// Redux
import {Provider} from "react-redux"
import store from "./redux/store"
import {useDispatch, useSelector} from "react-redux"
import * as actionTypes from "./redux/actions/actionTypes"

// React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


const RootStack = createStackNavigator();
const ResultStack = createStackNavigator();

// function QuizStackScreen(){
//     return (
//       <QuizStack.Navigator headerMode={"screen"}>
//         <QuizStack.Screen name="Sonuç" component={ResultScreen}/>
//       </QuizStack.Navigator>
//     )
// }


export default function App() {  
  return (
    <Provider store={store}>
      <AppWrapper /> 
    </Provider>
    
  );
}

const AppWrapper = () => {

  // Redux
  const isLoaded = useSelector(state => state.question.isLoaded)
  const dispatch = useDispatch()
  const currentQuestionId = useSelector(state => state.question.currentQuestionId)
  const questionList = useSelector(state => state.question.questions)
  const question = useSelector(state => state.question.question)

  
    return(
          <NavigationContainer>
            <RootStack.Navigator initialRouteName="Anasayfa">
              <RootStack.Screen name="Anasayfa" component={HomepageScreen}/>
              <RootStack.Screen name="Quiz" component={QuestionScreen}/>
              <ResultStack.Screen name="Sonuç" component={ResultScreen}/>
            </RootStack.Navigator>
        </NavigationContainer>
    )
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
