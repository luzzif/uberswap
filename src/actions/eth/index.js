import TransportHid from "@ledgerhq/react-native-hid";
import createLedgerSubprovider from "@ledgerhq/web3-subprovider";
import ZeroProvider from "web3-provider-engine/zero";
import Web3 from "web3";
import { PROVIDER_URL, NETWORK_ID } from "../../env";

export const POST_TOKEN_CLIENT = "POST_TOKEN_CLIENT";
export const POST_SELECTED_ADDRESS = "POST_SELECTED_ADDRESS";
export const POST_WEB3_INSTANCE = "POST_WEB3_INSTANCE";

const postWeb3Instance = (web3Instance) => ({
    type: POST_WEB3_INSTANCE,
    web3Instance,
});

const postSelectedAddress = (selectedAddress) => ({
    type: POST_SELECTED_ADDRESS,
    selectedAddress,
});

export const initializeWeb3 = () => async (dispatch) => {
    try {
        const startedEngine = new ZeroProvider({
            rpcUrl: PROVIDER_URL,
        });
        dispatch(postWeb3Instance(new Web3(startedEngine)));
    } catch (error) {
        console.error(error);
    }
};

export const initializeLedgerListener = () => async (dispatch) => {
    try {
        const subscription = TransportHid.listen({
            next: async (event) => {
                subscription.unsubscribe();
                if (event.type !== "add") {
                    return;
                }
                try {
                    const ledgerSubProvider = createLedgerSubprovider(
                        () => TransportHid.create(),
                        {
                            networkId: parseInt(NETWORK_ID),
                            accountsLength: 1,
                            paths: ["m/44'/60'/0'/0"],
                        }
                    );
                    const startedEngine = new ZeroProvider({
                        rpcUrl: PROVIDER_URL,
                        ...ledgerSubProvider,
                    });
                    const initializedWeb3 = new Web3(startedEngine);
                    initializedWeb3.eth
                        .getAccounts()
                        .then((accounts) => {
                            dispatch(postWeb3Instance(initializedWeb3));
                            dispatch(postSelectedAddress(accounts[0]));
                        })
                        .catch((error) => {
                            console.error(error);
                            dispatch(postWeb3Instance(null));
                        })
                        .finally(() => {
                            subscription.unsubscribe();
                        });
                } catch (error) {
                    console.error(error);
                    dispatch(postWeb3Instance(null));
                }
            },
            error: (error) => {
                subscription.unsubscribe();
                console.error(error);
            },
            complete: () => {
                subscription.unsubscribe();
            },
        });
    } catch (error) {
        console.error(error);
        dispatch(postWeb3Instance(null));
    }
};