import {
    getTokenReserves,
    getTradeDetails as getUniswapTradeDetails,
    getMarketDetails as getUniswapMarketDetails,
    TRADE_EXACT,
} from "@uniswap/sdk";
import { postLoading, deleteLoading } from "../loadings";

export const GET_ORIGIN_TOKEN_RESERVES_SUCCESS =
    "GET_ORIGIN_TOKEN_RESERVES_SUCCESS";
export const GET_DESTINATION_TOKEN_RESERVES_SUCCESS =
    "GET_DESTINATION_TOKEN_RESERVES_SUCCESS";
export const GET_TRADE_DETAILS_SUCCESS = "GET_TRADE_DETAILS_SUCCESS";
export const RESET_TRADE_DETAILS_SUCCESS = "RESET_TRADE_DETAILS_SUCCESS";

const getOriginTokenReservesSuccess = (reserves) => ({
    type: GET_ORIGIN_TOKEN_RESERVES_SUCCESS,
    reserves,
});

const getDestinationTokenReservesSuccess = (reserves) => ({
    type: GET_DESTINATION_TOKEN_RESERVES_SUCCESS,
    reserves,
});

const getTradeDetailsSuccess = (details) => ({
    type: GET_TRADE_DETAILS_SUCCESS,
    details,
});

export const resetTradeDetails = () => ({ type: RESET_TRADE_DETAILS_SUCCESS });

export const getOriginTokenReserves = (token) => async (dispatch, getState) => {
    dispatch(postLoading());
    try {
        const { eth } = getState();
        const { web3Instance } = eth;
        let reserves = "ETH";
        if (token.address !== "ETH") {
            reserves = await getTokenReserves(
                token.address,
                web3Instance.currentProvider
            );
        }
        dispatch(getOriginTokenReservesSuccess(reserves));
    } catch (error) {
        console.error(error);
    }
    dispatch(deleteLoading());
};

export const getDestinationTokenReserves = (token) => async (
    dispatch,
    getState
) => {
    dispatch(postLoading());
    try {
        const { eth } = getState();
        const { web3Instance } = eth;
        let reserves = "ETH";
        if (token.address !== "ETH") {
            reserves = await getTokenReserves(
                token.address,
                web3Instance.currentProvider
            );
        }
        dispatch(getDestinationTokenReservesSuccess(reserves));
    } catch (error) {
        console.error(error);
    }
    dispatch(deleteLoading());
};

export const getTradeDetails = (
    originReserves,
    originAmount,
    destinationReserves
) => async (dispatch) => {
    dispatch(postLoading());
    try {
        if (!originReserves || !destinationReserves) {
            console.warn("tried to get market details with falsy reserves");
            return;
        }
        const marketDetails = await getUniswapMarketDetails(
            originReserves === "ETH" ? undefined : originReserves,
            destinationReserves === "ETH" ? undefined : destinationReserves
        );
        const details = await getUniswapTradeDetails(
            TRADE_EXACT.INPUT,
            originAmount,
            marketDetails
        );
        dispatch(getTradeDetailsSuccess(details));
    } catch (error) {
        console.error(error);
    }
    dispatch(deleteLoading());
};
