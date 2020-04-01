import React, { useState, useCallback, useEffect } from "react";
import { Button } from "../../components/button";
import { View, StyleSheet, Text } from "react-native";
import { Token } from "../../components/token";
import { SUPPORTED_TOKENS } from "../../commons/supported-tokens";
import { useSelector, useDispatch } from "react-redux";
import { initializeLedgerListener, initializeWeb3 } from "../../actions/eth";
import { WarningMessage } from "../../components/warning-message";
import { ExchangeRate } from "../../components/exchange-rate";
import {
    getTradeDetails,
    getDestinationTokenReserves,
    getOriginTokenReserves,
} from "../../actions/uniswap";
import { NETWORK_ID } from "../../env";
import ArrowDown from "../../../assets/images/arrow-down.svg";

const styles = StyleSheet.create({
    outerContainer: {
        width: "100%",
        height: "100%",
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
        marginBottom: 32,
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
        marginBottom: 32,
    },
    buttonContainer: {
        width: "70%",
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
    } = useSelector((state) => ({
        web3Instance: state.eth.web3Instance,
        selectedAddress: state.eth.selectedAddress,
        originReserves: state.uniswap.reserves.origin,
        destinationReserves: state.uniswap.reserves.destination,
        tradeDetails: state.uniswap.trade,
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
        }
    }, [tradeDetails]);

    useEffect(() => {
        if (
            !web3Instance ||
            !originReserves ||
            !destinationReserves ||
            (!originAmountChanged && !destinationAmountChanged)
        ) {
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
        },
        [web3Instance]
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
        },
        [web3Instance]
    );

    const handleButtonPress = useCallback(() => {
        if (web3Instance) {
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
                <WarningMessage
                    originToken={originToken}
                    destinationToken={destinationToken}
                    originAmount={originAmount}
                    destinationAmount={destinationAmount}
                />
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    title={selectedAddress ? "Swap" : "Connect to a wallet"}
                    onPress={handleButtonPress}
                />
            </View>
        </View>
    );
};
