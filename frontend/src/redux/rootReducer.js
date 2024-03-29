import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import appReducer from "./slices/app.js";
import authReducer from "./slices/auth.js";
import conversationReducer from "./slices/conversation.js";

 
//Slices

const rootPeristConfig = {
  key: "root",
  storage,
  keyPrefix: "redux-",
  //WhiteList
  manualPersist: true, // Evita la rehidratación automática

  //BlackList
};

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  conversation: conversationReducer,
});

export { rootPeristConfig, rootReducer };