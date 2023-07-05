import {FLUSH, PAUSE, PERSIST, persistReducer, PURGE, REGISTER, REHYDRATE} from "redux-persist";
import {combineReducers, configureStore} from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage'
import {layoutReducer} from "./pages/layout/store/layout-reducer";
import {timelineReducer} from "./pages/layout/store/timeline-reducer";

const persistConfig = {
    key: 'root',
    storage
}

const rootReducer = combineReducers({
    layout: layoutReducer,
    timeline: timelineReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export default store