import { combineReducers } from "redux";
import { ethReducer } from "./eth";
import { uniswapReducer } from "./uniswap";

export const reducers = combineReducers({
    eth: ethReducer,
    uniswap: uniswapReducer,
});
