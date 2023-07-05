import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {persistStore} from "redux-persist";
import store from "./store";
import { PersistGate } from 'redux-persist/integration/react'
import {Provider} from "react-redux";
import './i18n';
import 'bootstrap/dist/css/bootstrap-grid.min.css'

const root = ReactDOM.createRoot(document.getElementById("root"));

const persistor = persistStore(store)

root.render(
  <React.StrictMode>
      <BrowserRouter>
          <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                  <App />
              </PersistGate>
          </Provider>
      </BrowserRouter>
  </React.StrictMode>
);
