import {
    GET_ORIGIN_TOKEN_RESERVES_SUCCESS,
    GET_DESTINATION_TOKEN_RESERVES_SUCCESS,
    GET_TRADE_DETAILS_SUCCESS,
} from "../../actions/uniswap";

const initialState = {
    reserves: {
        origin: "ETH",
        destination: null,
    },
    trade: null,
};

export const uniswapReducer = (state = initialState, action) => {
    const { type } = action;
    switch (type) {
        case GET_ORIGIN_TOKEN_RESERVES_SUCCESS: {
            const { reserves } = action;
            return {
                ...state,
                reserves: {
                    ...state.reserves,
                    origin: reserves,
                },
            };
        }
        case GET_DESTINATION_TOKEN_RESERVES_SUCCESS: {
            const { reserves } = action;
            return {
                ...state,
                reserves: {
                    ...state.reserves,
                    destination: reserves,
                },
            };
        }
        case GET_TRADE_DETAILS_SUCCESS: {
            const { details } = action;
            return { ...state, trade: details };
        }
        default: {
            return state;
        }
    }
};
