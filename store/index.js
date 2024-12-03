import { configureStore, combineReducers } from "@reduxjs/toolkit"
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist"
import storage from "redux-persist/lib/storage"
import userReducer from "./user"
import cartReducer from "./cart"
import themeReducer from "./theme"

const persistConfig = {
  key: "root",
  storage,
}

const reducers = combineReducers({
  user: userReducer,
  cart: cartReducer,
  theme: themeReducer,
})
const persistedReducer = persistReducer(persistConfig, reducers)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
})

export default store
export const persistor = persistStore(store)