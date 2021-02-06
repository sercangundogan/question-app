import React, {useState, useEffect} from 'react'
import { View, Text } from 'react-native'

const ResultScreen = ({route, navigation}) => {

    // React
    const [quizResult, setQuizresult] = useState()
    const [trueQuestion, setTrueQuestion] = useState()
    const [falseQuestion, setFalseQuestion] = useState()
    
    useEffect(() => {
        getData()
    }, [])


    const getData = () => {
        setQuizresult(route.params.quizResult)
        setTrueQuestion(route.params.trueQuestion)
        setFalseQuestion(route.params.falseQuestion)
    } 
    
    
    
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: "center", backgroundColor: "white"}}>
            <Text style={{fontSize: 20, padding: 10}}>Sınav Sonucunuz: <Text style={{fontWeight: 'bold'}}>{quizResult}</Text></Text>
            <Text style={{fontSize: 20, padding: 10}}>Doğru Cevap Sayısı: <Text style={{fontWeight: 'bold'}}>{trueQuestion}</Text></Text>
            <Text style={{fontSize: 20, padding: 10}}>Yanlış Cevap Sayısı: <Text style={{fontWeight: 'bold'}}>{falseQuestion}</Text></Text>

            <Text onPress={() => navigation.navigate("Anasayfa")} style={{marginTop: 20, fontSize: 16, borderWidth: 1, borderColor: "white", padding: 10, borderRadius: 5, backgroundColor: "#dc3545", color: "white", fontWeight: "bold"}}>Anasayfa'ya dön</Text>
            
        </View>
    )
}

export default ResultScreen
