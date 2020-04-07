import { combineReducers } from "redux";
import { ethReducer } from "./eth";
import { uniswapReducer } from "./uniswap";
import { loadingsReducer } from "./loadings";

export const reducers = combineReducers({
    eth: ethReducer,
    uniswap: uniswapReducer,
    loadings: loadingsReducer,
});
