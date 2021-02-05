import {rootReducer} from "../reducers/rootReducer"
import {createStore, applyMiddleware} from "redux"
// import thunk from "redux-thunk"

// const store = createStore(rootReducer, applyMiddleware(thunk))
const store = createStore(rootReducer)

export default store

