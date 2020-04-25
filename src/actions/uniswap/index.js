import {
    getTokenReserves,
    getTradeDetails as getUniswapTradeDetails,
    getMarketDetails as getUniswapMarketDetails,
    getExecutionDetails,
    TRADE_EXACT,
    BigNumber,
} from "@uniswap/sdk";
import { postLoading, deleteLoading } from "../loadings";
import exchangeAbi from "./abi/exchange.json";
import PushNotification from "react-native-push-notification";
import { NETWORK_ID } from "../../env";
import Web3 from "web3";
import { SUPPORTED_TOKENS } from "../../commons/supported-tokens";

const {
    utils: { fromWei },
} = Web3;

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
        console.error("error getting origin token reserve", error);
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
        console.error("error getting destination token reserve", error);
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
        console.error("error getting trade details", error);
    }
    dispatch(deleteLoading());
};

export const postSwap = (
    trade,
    maxSlippage,
    deadline,
    recipient,
    txSpeed
) => async (dispatch, getState) => {
    if (!trade) {
        console.warn("tried to swap without a trade object");
        return;
    }
    dispatch(postLoading());
    try {
        const { eth } = getState();
        const { web3Instance, selectedAddress } = eth;
        const {
            exchangeAddress,
            methodArguments,
            methodName,
        } = await getExecutionDetails(trade, maxSlippage, deadline, recipient);
        const uniswapExchangeContract = new web3Instance.eth.Contract(
            exchangeAbi,
            exchangeAddress
        );
        const response = await fetch(
            "http://ethgasstation.info/json/ethgasAPI.json"
        );
        if (!response.status) {
            throw new Error("could not get gas price estimate");
        }
        const { [txSpeed]: gasPrice } = await response.json();
        const weiGasPrice = new BigNumber(gasPrice).multipliedBy("100000000");
        const method = uniswapExchangeContract.methods[methodName](
            ...methodArguments
        );
        const { inputAmount, outputAmount } = trade;
        const originTokenSymbol =
            SUPPORTED_TOKENS[NETWORK_ID][inputAmount.token.address].symbol;
        const originWeiAmount = inputAmount.amount;
        const destinationTokenSymbol =
            SUPPORTED_TOKENS[NETWORK_ID][outputAmount.token.address].symbol;
        const destinationWeiAmount = outputAmount.amount;
        const originAmount = new BigNumber(
            fromWei(originWeiAmount.toFixed())
        ).decimalPlaces(4);
        const destinationAmount = new BigNumber(
            fromWei(destinationWeiAmount.toFixed())
        ).decimalPlaces(4);
        dispatch(postLoading());
        try {
            await method.send({
                from: selectedAddress,
                gasPrice: weiGasPrice.toFixed(),
                gas: 300000,
            });
            PushNotification.localNotification({
                title: "Successful swap",
                message: `Swapped ${originAmount} ${originTokenSymbol} for ${destinationAmount} ${destinationTokenSymbol}`,
            });
        } catch (error) {
            PushNotification.localNotification({
                title: "Failed swap",
                message: `Could not swap ${originAmount} ${originTokenSymbol} for ${destinationAmount} ${destinationTokenSymbol}`,
            });
        } finally {
            dispatch(deleteLoading());
        }
    } catch (error) {
        console.error("error swapping", error);
    }
    dispatch(deleteLoading());
};
