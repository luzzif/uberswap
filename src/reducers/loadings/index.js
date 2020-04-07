import { POST_LOADING, DELETE_LOADING } from "../../actions/loadings";

export const loadingsReducer = (state = { amount: 0 }, action) => {
    switch (action.type) {
        case POST_LOADING: {
            return { amount: state.amount + 1 };
        }
        case DELETE_LOADING: {
            return { amount: state.amount > 0 ? state.amount - 1 : 0 };
        }
        default: {
            return state;
        }
    }
};
