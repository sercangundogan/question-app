import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, ActivityIndicator, AsyncStorage } from 'react-native';
// Screens
import HomepageScreen from "./screens/HomepageScreen"
import QuestionScreen from "./screens/QuestionScreen"
import ResultScreen from "./screens/ResultScreen"

// Redux
import {Provider} from "react-redux"
import store from "./redux/store"
import {useDispatch, useSelector} from "react-redux"

// React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// React Navigation Stacks
const RootStack = createStackNavigator();
const ResultStack = createStackNavigator();


export default function App() {  
  return (
    <Provider store={store}>
      <AppWrapper /> 
    </Provider>
    
  );
}

const AppWrapper = () => {
    return(
          <NavigationContainer>
            <RootStack.Navigator initialRouteName="Anasayfa">
              {/* Screens */}
              <RootStack.Screen name="Anasayfa" component={HomepageScreen}/>
              <RootStack.Screen name="Quiz" component={QuestionScreen}/>
              <ResultStack.Screen name="Sonuç" component={ResultScreen}/>
            </RootStack.Navigator>
        </NavigationContainer>
    )
  
}
