import * as actionTypes from "../actions/actionTypes"

const initialState = {
    isLoaded: null,
    question: null,
    currentQuestionId: null,
    totalQuestion: null,
    questionFinished: false,
    questions: null,
    answer: null,
    showAgain: false,
    leaveQuestions: null,
    trueQuestion: 0,
    falseQuestion: 0,
    lastQuestion: null,
    quizId: null
}

export const questionReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_DEFAULT_QUESTIONS:
            return {...state, isLoaded: true, currentQuestionId: 0, trueQuestion:0, falseQuestion:0, questions: action.payload.newQuestionList, totalQuestion: action.payload.newQuestionList.length, question: action.payload.newQuestionList[0], quizId: action.payload.quizId}

        case actionTypes.SEND_ANSWER_REQUEST:
            return {...state, isLoaded: false}
            
        case actionTypes.SEND_ANSWER_SUCCESS:
            return state.currentQuestionId + 1 !=  state.totalQuestion ? {...state, error: null, isLoaded: true, currentQuestionId: state.currentQuestionId + 1, question: state.questions[state.currentQuestionId + 1]}
            : {...state, error: null, isLoaded: true, questionFinished: true}

        case actionTypes.SEND_ANSWER_FAILED:
            return {...state, isLoaded: true, error: action.payload}

        case actionTypes.SHOW_QUESTIONS_AGAIN_REQUEST:
            return {...state, isLoaded: false}
            
        case actionTypes.SHOW_QUESTIONS_AGAIN_SUCCESS:
            return {...state, error: null, isLoaded: true, currentQuestionId: 0, questionFinished: false}
            
        case actionTypes.SHOW_QUESTIONS_AGAIN_FAILED:
            return {...state, isLoaded: true, error: action.payload}
            
        case actionTypes.LEAVE_QUESTIONS:
            return {...state, error: null, isLoaded: true, currentQuestionId: 0, leaveQuestions: true}

        case actionTypes.ENTER_QUIZ:
            return {...state, error: null, isLoaded: true, currentQuestionId: 0, leaveQuestions: false, questionFinished: false, trueQuestion: 0, falseQuestion: 0, question: state.questions[0]}

        case actionTypes.SEND_TRUE_ANSWER:
            return {...state, error: null, isLoaded: true, trueQuestion: state.trueQuestion +1}

        case actionTypes.SEND_FALSE_ANSWER:
            return {...state, error: null, isLoaded: true, falseQuestion: state.falseQuestion +1}

        case actionTypes.SET_LAST_QUESTION:
            return {...state, isLoaded: true, currentQuestionId: action.payload.lastQuestionId -1, question: state.questions ? state.questions[action.payload.lastQuestionId - 1] : null, score: action.payload.score, }
        
            case actionTypes.SET_LAST_QUESTION2:
            return {...state, isLoaded: true, questions: action.payload.newQuestionList, currentQuestionId: action.payload.lastQuestionId -1, question: action.payload.newQuestionList[action.payload.lastQuestionId - 1], score: action.payload.score, quizId: action.payload.quizId, score: action.payload.score, totalQuestion:action.payload.newQuestionList.length  }
        default: 
            return state
    }
    

}