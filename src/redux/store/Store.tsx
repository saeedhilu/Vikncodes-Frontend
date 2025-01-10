import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import authReducer from '@/redux/slice/AuthSlice';
import { encryptTransform } from 'redux-persist-transform-encrypt';

// Type for root state
export interface RootState {
  auth: ReturnType<typeof authReducer>;
}

// Get the secret key from the environment variables
const secretKey = import.meta.env.VITE_PERSIST_SECRET_KEY;

const persistConfig = {
  key: 'root',
  storage,
  transforms: [
    encryptTransform({
      secretKey,
      onError: (error) => {
        throw Error()
      },
    }),
  ],
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
});

type RootReducer = ReturnType<typeof rootReducer>;
// Persisted reducer with encryption
const persistedReducer = persistReducer<RootReducer>(persistConfig, rootReducer);

// Create the Redux store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializableCheck for redux-persist
    }),
});

// Type the persistor
export const persistor = persistStore(store);

// Type the store itself
export type AppDispatch = typeof store.dispatch;

export default store;
