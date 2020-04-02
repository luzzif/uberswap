import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import {
    Text,
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
} from "react-native";
import PinkChevronDown from "../../../../assets/images/chevron-down-pink.svg";
import PinkChevronUp from "../../../../assets/images/chevron-up-pink.svg";
import { Chip } from "../../chip";
import { Input } from "../../input";
import Web3 from "web3";
import BigNumber from "bignumber.js";
import { SUPPORTED_TOKENS } from "../../../commons/supported-tokens";
import { NETWORK_ID } from "../../../env";
const {
    utils: { fromWei },
} = Web3;

const commonTradeDetailsContainerStyles = {
    width: "100%",
    borderRadius: 20,
};

const styles = StyleSheet.create({
    outerContainer: {
        display: "flex",
        alignItems: "center",
    },
    advancedDetailsText: {
        color: "#dc6be5",
        marginRight: 8,
    },
    advancedDetailsTextContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    tradeDetailsOuterContainer: {
        ...commonTradeDetailsContainerStyles,
        backgroundColor: "rgb(41, 44, 47)",
        marginTop: 16,
    },
    tradeDetailsInnerContainer: {
        ...commonTradeDetailsContainerStyles,
        backgroundColor: "rgb(31, 34, 36)",
    },
    textContainer: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    text: {
        fontFamily: "Inter",
        color: "#fff",
        fontSize: 12,
    },
    bottomSpacer: {
        marginBottom: 4,
    },
    highlightedText: {
        color: "#dc6be5",
    },
    chipsContainer: {
        display: "flex",
        flexDirection: "row",
        marginTop: 8,
    },
    rightSpacer: {
        marginRight: 8,
    },
    deadlineInputContainer: {
        marginTop: 4,
    },
});

export const TradeDetails = ({
    details,
    additionalSlippage,
    onAdditionalSlippageChange,
    deadline,
    onDeadlineChange,
}) => {
    const [show, setShow] = useState(false);
    const [originToken, setOriginToken] = useState("0");
    const [originAmount, setOriginAmount] = useState("0");
    const [destinationToken, setDestinationToken] = useState("");
    const [destinationAmount, setDestinationAmount] = useState("");
    const [expectedSlippage, setExpectedSlippage] = useState("");

    useEffect(() => {
        if (!details) {
            return;
        }
        const { inputAmount, outputAmount, executionRateSlippage } = details;
        setOriginToken(
            SUPPORTED_TOKENS[NETWORK_ID][inputAmount.token.address].symbol
        );
        setOriginAmount(
            new BigNumber(fromWei(inputAmount.amount.toFixed())).decimalPlaces(
                4
            )
        );

        setDestinationToken(
            SUPPORTED_TOKENS[NETWORK_ID][outputAmount.token.address].symbol
        );
        setDestinationAmount(
            new BigNumber(fromWei(outputAmount.amount.toFixed())).decimalPlaces(
                4
            )
        );

        setExpectedSlippage(
            executionRateSlippage.dividedBy("100").decimalPlaces(2).toString()
        );
    }, [details]);

    const handleTextPress = useCallback(() => {
        setShow(!show);
    }, [show]);

    const getAdditionalSlippageChipPressHandler = (slippage) => () => {
        onAdditionalSlippageChange(slippage);
    };

    const handleDeadlineChange = (newAmount) => {
        const parsedAmount = parseInt(newAmount);
        if (isNaN(parsedAmount)) {
            onDeadlineChange("");
        } else {
            onDeadlineChange(parsedAmount);
        }
    };

    return (
        <View style={styles.outerContainer}>
            <TouchableWithoutFeedback onPress={handleTextPress}>
                <View style={styles.advancedDetailsTextContainer}>
                    <Text style={styles.advancedDetailsText}>
                        {show ? "Hide details" : "Advanced details"}
                    </Text>
                    {show ? (
                        <PinkChevronUp width={12} height={12} />
                    ) : (
                        <PinkChevronDown width={12} height={12} />
                    )}
                </View>
            </TouchableWithoutFeedback>
            <View
                style={{
                    display: show ? "flex" : "none",
                    ...styles.tradeDetailsOuterContainer,
                }}
            >
                <View style={styles.textContainer}>
                    <Text style={{ ...styles.text, ...styles.bottomSpacer }}>
                        You are selling{" "}
                        <Text
                            style={styles.highlightedText}
                        >{`${originAmount} ${originToken}`}</Text>{" "}
                        for at least{" "}
                        <Text
                            style={styles.highlightedText}
                        >{`${destinationAmount} ${destinationToken}`}</Text>
                    </Text>
                    <Text style={styles.text}>
                        Expected price slippage:{" "}
                        <Text style={styles.highlightedText}>
                            {expectedSlippage}%
                        </Text>
                    </Text>
                </View>
                <View
                    style={{
                        display: show ? "flex" : "none",
                        ...styles.tradeDetailsInnerContainer,
                    }}
                >
                    <View style={styles.textContainer}>
                        <Text
                            style={{ ...styles.text, ...styles.bottomSpacer }}
                        >
                            Limit additional price slippage.
                        </Text>
                        <View
                            style={{
                                ...styles.chipsContainer,
                                ...styles.bottomSpacer,
                            }}
                        >
                            <View style={styles.rightSpacer}>
                                <Chip
                                    text="0.1%"
                                    active={additionalSlippage === 0.1}
                                    onPress={getAdditionalSlippageChipPressHandler(
                                        0.1
                                    )}
                                />
                            </View>
                            <View style={styles.rightSpacer}>
                                <Chip
                                    text="0.5% (suggested)"
                                    active={additionalSlippage === 0.5}
                                    onPress={getAdditionalSlippageChipPressHandler(
                                        0.5
                                    )}
                                />
                            </View>
                            <Chip
                                text="1%"
                                active={additionalSlippage === 1}
                                onPress={getAdditionalSlippageChipPressHandler(
                                    1
                                )}
                            />
                        </View>
                        <KeyboardAvoidingView
                            behavior="padding"
                            style={styles.deadlineInputContainer}
                        >
                            <Input
                                label="Set swap deadline (minutes from now)"
                                keyboardType="numeric"
                                placeholder="Deadline"
                                value={deadline}
                                onChangeText={handleDeadlineChange}
                            />
                        </KeyboardAvoidingView>
                    </View>
                </View>
            </View>
        </View>
    );
};

TradeDetails.propTypes = {
    details: PropTypes.object.isRequired,
    additionalSlippage: PropTypes.number.isRequired,
    onAdditionalSlippageChange: PropTypes.func.isRequired,
    deadline: PropTypes.string.isRequired,
    onDeadlineChange: PropTypes.func.isRequired,
};
