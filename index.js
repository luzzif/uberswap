import "./shim";
import React from "react";
import { AppRegistry } from "react-native";
import { App } from "./src/containers/app";
import { name as appName } from "./app.json";
import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { reducers } from "./src/reducers";
import { Provider } from "react-redux";

// eslint-disable-next-line no-undef
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)));

const Root = () => (
    <Provider store={store}>
        <App />
    </Provider>
);

AppRegistry.registerComponent(appName, () => Root);
