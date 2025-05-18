import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import authReducer from "./slices/authSlice.js"
import videoReducer from "./slices/videoSlice.js"

const persistConfig = {
    key: 'boom-root',
    storage
}

const rootReducer = combineReducers({
    auth: authReducer,
    videos: videoReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})

export const persistor = persistStore(store);
export default store;