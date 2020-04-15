import React, { useState, useCallback, useLayoutEffect } from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { Select } from "./select";
import { Modal } from "./modal";
import Web3 from "web3";
import { useSelector } from "react-redux";
import { BigNumber } from "@uniswap/sdk";
const {
    utils: { toWei, fromWei },
} = Web3;

const commonContainerStyles = {
    backgroundColor: "#202124",
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    width: "100%",
};

const styles = StyleSheet.create({
    standardContainer: {
        ...commonContainerStyles,
        borderColor: "#333333",
    },
    errorContainer: {
        ...commonContainerStyles,
        borderColor: "red",
    },
    labelContainer: {
        paddingVertical: 8,
    },
    label: {
        fontSize: 12,
        color: "#c4c4c4",
        fontFamily: "Inter",
    },
    amountContainer: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
    },
    amount: {
        flex: 1,
        fontSize: 24,
        lineHeight: 32,
        color: "#c4c4c4",
        fontFamily: "Inter",
        paddingRight: 12,
        fontWeight: "normal",
    },
});

export const Token = ({
    input,
    token,
    onTokenChange,
    amount,
    onAmountChange,
}) => {
    const { tokenBalances, reserves } = useSelector((state) => {
        const specificReserve =
            state.uniswap.reserves[input ? "origin" : "destination"];
        return {
            tokenBalances: state.eth.tokenBalances,
            reserves:
                specificReserve && specificReserve !== "ETH"
                    ? specificReserve.tokenReserve.amount
                    : new BigNumber("0"),
        };
    });

    const [modalOpen, setModalOpen] = useState(false);
    const [stringAmount, setStringAmount] = useState("");
    const [amountError, setAmountError] = useState(false);

    useLayoutEffect(() => {
        if (!stringAmount.endsWith(".")) {
            setStringAmount(
                new BigNumber(fromWei(amount)).decimalPlaces(5).toString()
            );
        }
    }, [amount]);

    const handleModalClose = useCallback(() => {
        setModalOpen(false);
    });

    const handleModalOpen = useCallback(() => {
        setModalOpen(true);
    });

    const handleAmountChange = useCallback(
        (newAmount) => {
            let numericAmount = parseFloat(newAmount);
            if (
                !newAmount ||
                newAmount.indexOf(",") >= 0 ||
                newAmount.indexOf(" ") >= 0 ||
                newAmount.indexOf("-") >= 0
            ) {
                setAmountError(newAmount);
                onAmountChange("0");
                return;
            }
            if (newAmount.endsWith(".")) {
                setAmountError(true);
            } else {
                setAmountError(false);
            }
            if (/\.{2,}/.test(newAmount) || newAmount.split(".").length > 2) {
                return;
            }
            setStringAmount(newAmount);
            let properNumericValue = isNaN(numericAmount)
                ? "0"
                : numericAmount.toString();
            if (!reserves.isZero() && reserves.isLessThan(properNumericValue)) {
                properNumericValue = reserves.toFixed();
            }
            onAmountChange(toWei(properNumericValue));
        },
        [reserves]
    );

    return (
        <View>
            <View
                style={
                    amountError
                        ? styles.errorContainer
                        : styles.standardContainer
                }
            >
                <View style={styles.labelContainer}>
                    <Text style={styles.label} numberOfLines={1}>
                        {input ? "Input" : "Output"}
                    </Text>
                </View>
                <View style={styles.amountContainer}>
                    <TextInput
                        keyboardType="numeric"
                        placeholder="0.0"
                        style={styles.amount}
                        numberOfLines={1}
                        value={
                            stringAmount && stringAmount !== "0"
                                ? stringAmount
                                : ""
                        }
                        placeholderTextColor="#808080"
                        onChangeText={handleAmountChange}
                    />
                    <Select token={token} onPress={handleModalOpen} />
                </View>
            </View>
            <Modal
                open={modalOpen}
                onClose={handleModalClose}
                onChange={onTokenChange}
                balances={tokenBalances}
            />
        </View>
    );
};

Token.propTypes = {
    input: PropTypes.bool,
    token: PropTypes.shape({
        address: PropTypes.string,
        symbol: PropTypes.string.isRequired,
    }),
    onTokenChange: PropTypes.func.isRequired,
    amount: PropTypes.string.isRequired,
    onAmountChange: PropTypes.func.isRequired,
};
