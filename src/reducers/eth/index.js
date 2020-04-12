import {
    POST_SELECTED_ADDRESS,
    POST_WEB3_INSTANCE,
    POST_TOKEN_CLIENT,
    POST_TRANSACTION_HASH,
    DELETE_TRANSACTION_HASH,
    POST_TOKEN_BALANCE,
} from "../../actions/eth";

const initialState = {
    selectedAddress: null,
    web3Instance: null,
    tokenBalances: {},
};

export const ethReducer = (state = initialState, action) => {
    const { type } = action;
    switch (type) {
        case POST_SELECTED_ADDRESS: {
            const { selectedAddress } = action;
            return { ...state, selectedAddress };
        }
        case POST_TOKEN_CLIENT: {
            const { tokenClient } = action;
            return { ...state, tokenClient };
        }
        case POST_WEB3_INSTANCE: {
            const { web3Instance } = action;
            return { ...state, web3Instance };
        }
        case POST_TRANSACTION_HASH: {
            const { hash } = action;
            const { transactionHashes } = state;
            transactionHashes.push(hash);
            return { ...state, transactionHashes: [...transactionHashes] };
        }
        case DELETE_TRANSACTION_HASH: {
            const { hash } = action;
            const { transactionHashes } = state;
            return {
                ...state,
                transactionHashes: transactionHashes.filter(
                    (transactionHash) => transactionHash !== hash
                ),
            };
        }
        case POST_TOKEN_BALANCE: {
            const { address, balance } = action;
            return {
                ...state,
                tokenBalances: {
                    ...state.tokenBalances,
                    [address]: balance,
                },
            };
        }
        default: {
            return state;
        }
    }
};
