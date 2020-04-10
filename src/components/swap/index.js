import React, { useState, useCallback, useEffect } from "react";
import { Button } from "../../components/button";
import { View, StyleSheet, Text } from "react-native";
import { Token } from "../../components/token";
import { SUPPORTED_TOKENS } from "../../commons/supported-tokens";
import { useSelector, useDispatch } from "react-redux";
import { initializeLedgerListener, initializeWeb3 } from "../../actions/eth";
import { WarningMessage } from "./warning-message";
import { ExchangeRate } from "../../components/exchange-rate";
import {
    getTradeDetails,
    getDestinationTokenReserves,
    getOriginTokenReserves,
    resetTradeDetails,
} from "../../actions/uniswap";
import { NETWORK_ID } from "../../env";
import ArrowDown from "../../../assets/images/arrow-down.svg";
import { TradeDetails } from "./trade-details";
import Spinner from "react-native-spinkit";

const styles = StyleSheet.create({
    outerContainer: {
        width: "100%",
        display: "flex",
        alignItems: "center",
    },
    firstTokenContainer: {
        width: "100%",
    },
    middleView: {
        zIndex: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 32,
        width: "90%",
        backgroundColor: "rgb(41, 44, 47)",
    },
    arrowDownIcon: {
        color: "#7b7b7b",
    },
    secondTokenContainer: {
        width: "100%",
    },
    exchangeRateView: {
        marginBottom: 16,
        zIndex: 0,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 12,
        height: 32,
        width: "90%",
        backgroundColor: "rgb(41, 44, 47)",
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    warningTextContainer: {
        marginBottom: 16,
    },
    buttonContainer: {
        display: "flex",
        alignItems: "center",
    },
    exchangeRateText: {
        fontFamily: "Inter",
        fontSize: 12,
        color: "rgb(196, 196, 196)",
    },
});

export const Swap = () => {
    const {
        web3Instance,
        selectedAddress,
        originReserves,
        destinationReserves,
        tradeDetails,
        loading,
    } = useSelector((state) => ({
        web3Instance: state.eth.web3Instance,
        selectedAddress: state.eth.selectedAddress,
        originReserves: state.uniswap.reserves.origin,
        destinationReserves: state.uniswap.reserves.destination,
        tradeDetails: state.uniswap.trade,
        loading: !!state.loadings.amount,
    }));
    const dispatch = useDispatch();

    const [originToken, setOriginToken] = useState(
        SUPPORTED_TOKENS[NETWORK_ID]["ETH"]
    );
    const [originAmount, setOriginAmount] = useState("0");
    const [destinationToken, setDestinationToken] = useState(null);
    const [destinationAmount, setDestinationAmount] = useState("0");
    const [originAmountChanged, setOriginAmountChanged] = useState(false);
    const [destinationAmountChanged, setDestinationAmountChanged] = useState(
        false
    );
    const [additionalSlippage, setAdditionalSlippage] = useState(0.5);
    const [deadline, setDeadline] = useState("");

    useEffect(() => {
        dispatch(initializeWeb3());
    }, []);

    useEffect(() => {
        if (tradeDetails) {
            const amount = tradeDetails.outputAmount.amount
                .toFixed()
                .toString();
            if (originAmountChanged) {
                setDestinationAmount(amount);
            } else if (destinationAmountChanged) {
                setOriginAmount(amount);
            }
        } else {
            setOriginAmount("0");
            setDestinationAmount("0");
        }
    }, [tradeDetails]);

    useEffect(() => {
        if (
            !web3Instance ||
            !originReserves ||
            !destinationReserves ||
            (originReserves === "ETH" && destinationReserves === "ETH") ||
            (!originAmountChanged && !destinationAmountChanged) ||
            (originAmountChanged && originAmount === "0") ||
            (destinationAmountChanged && destinationAmount === "0")
        ) {
            dispatch(resetTradeDetails());
            return;
        }
        dispatch(
            getTradeDetails(
                originAmountChanged ? originReserves : destinationReserves,
                originAmountChanged ? originAmount : destinationAmount,
                originAmountChanged ? destinationReserves : originReserves
            )
        );
    }, [
        originReserves,
        destinationReserves,
        originAmount,
        destinationAmount,
        web3Instance,
    ]);

    const handleOriginAmountChange = useCallback((amount) => {
        setOriginAmount(amount);
        setOriginAmountChanged(true);
        setDestinationAmountChanged(false);
    });

    const handleOriginTokenChange = useCallback(
        (token) => {
            setOriginToken(token);
            if (web3Instance) {
                dispatch(getOriginTokenReserves(token));
            }
            if (
                destinationToken &&
                token.address === destinationToken.address
            ) {
                setDestinationToken(null);
            }
        },
        [web3Instance, destinationToken]
    );

    const handleDestinationAmountChange = useCallback((amount) => {
        setDestinationAmount(amount);
        setOriginAmountChanged(false);
        setDestinationAmountChanged(true);
    });

    const handleDestinationTokenChange = useCallback(
        (token) => {
            setDestinationToken(token);
            if (web3Instance) {
                dispatch(getDestinationTokenReserves(token));
            }
            if (originToken && token.address === originToken.address) {
                setOriginToken(null);
            }
        },
        [web3Instance, originToken]
    );

    const handleButtonPress = useCallback(() => {
        if (selectedAddress) {
            // TODO: implement swap call
        } else {
            dispatch(initializeLedgerListener());
        }
    });

    return (
        <View style={styles.outerContainer}>
            <View style={styles.firstTokenContainer}>
                <Token
                    input
                    token={originToken}
                    onTokenChange={handleOriginTokenChange}
                    onAmountChange={handleOriginAmountChange}
                    amount={originAmount}
                />
            </View>
            <View style={styles.middleView}>
                <ArrowDown
                    style={styles.arrowDownIcon}
                    width={12}
                    height={12}
                />
            </View>
            <View style={styles.secondTokenContainer}>
                <Token
                    token={destinationToken}
                    onTokenChange={handleDestinationTokenChange}
                    onAmountChange={handleDestinationAmountChange}
                    amount={destinationAmount}
                />
            </View>
            <View style={styles.exchangeRateView}>
                <Text style={styles.exchangeRateText}>Exchange rate</Text>
                <ExchangeRate
                    originToken={originToken}
                    destinationToken={destinationToken}
                />
            </View>
            <View style={styles.warningTextContainer}>
                {tradeDetails && !loading && selectedAddress ? (
                    <TradeDetails
                        details={tradeDetails}
                        additionalSlippage={additionalSlippage}
                        onAdditionalSlippageChange={setAdditionalSlippage}
                        deadline={deadline}
                        onDeadlineChange={setDeadline}
                    />
                ) : (
                    <WarningMessage
                        originToken={originToken}
                        destinationToken={destinationToken}
                        originAmount={originAmount}
                        destinationAmount={destinationAmount}
                    />
                )}
            </View>
            <View style={styles.buttonContainer}>
                {loading ? (
                    <Spinner type="Bounce" size={52} color="#808080" />
                ) : (
                    <Button
                        title={selectedAddress ? "Swap" : "Connect to a wallet"}
                        onPress={handleButtonPress}
                    />
                )}
            </View>
        </View>
    );
};
