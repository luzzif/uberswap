import React from "react";
import PropTypes from "prop-types";
import ReactNativeModal from "react-native-modal";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Chip } from "../../../chip";
import { Input } from "../../../input";
import Close from "../../../../../assets/images/close.svg";

const styles = StyleSheet.create({
    outerContainer: {
        backgroundColor: "rgb(41, 44, 47)",
        borderWidth: 1,
        borderColor: "#292c2f",
        borderRadius: 20,
        maxHeight: "50%",
    },
    header: {
        height: 60,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
    },
    closeIcon: {
        color: "#fff",
    },
    title: {
        fontSize: 16,
        fontFamily: "inter",
        color: "#fff",
    },
    tradeDetailsInnerContainer: {
        paddingTop: 20,
        width: "100%",
        borderRadius: 20,
        backgroundColor: "rgb(31, 34, 36)",
    },
    textContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    text: {
        fontFamily: "Inter",
        color: "#fff",
        fontSize: 12,
    },
    bottomSpacer: {
        marginBottom: 8,
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

export const Modal = ({
    open,
    onClose,
    originToken,
    originAmount,
    destinationToken,
    destinationAmount,
    expectedSlippage,
    additionalSlippage,
    onAdditionalSlippageChange,
    deadline,
    onDeadlineChange,
}) => {
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
        <ReactNativeModal
            isVisible={open}
            hasBackdrop
            onBackButtonPress={onClose}
            onBackdropPress={onClose}
            backdropColor="rgba(0, 0, 0, 0.4)"
            animationIn="fadeIn"
            animationOut="fadeOut"
            backdropTransitionOutTiming={0}
        >
            <View style={styles.outerContainer}>
                <View style={styles.header}>
                    <Text style={styles.title}>Trade details</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Close style={styles.closeIcon} size={20} />
                    </TouchableOpacity>
                </View>
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
                <View style={styles.tradeDetailsInnerContainer}>
                    <View style={styles.textContainer}>
                        <Text
                            style={{
                                ...styles.text,
                                ...styles.bottomSpacer,
                            }}
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
                        <View style={styles.deadlineInputContainer}>
                            <Input
                                label="Set swap deadline (minutes from now)"
                                keyboardType="numeric"
                                placeholder="Deadline"
                                value={deadline}
                                onChangeText={handleDeadlineChange}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </ReactNativeModal>
    );
};

Modal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    originToken: PropTypes.string.isRequired,
    originAmount: PropTypes.string.isRequired,
    destinationToken: PropTypes.string.isRequired,
    destinationAmount: PropTypes.string.isRequired,
    expectedSlippage: PropTypes.string.isRequired,
    additionalSlippage: PropTypes.number.isRequired,
    onAdditionalSlippageChange: PropTypes.func.isRequired,
    deadline: PropTypes.string.isRequired,
    onDeadlineChange: PropTypes.func.isRequired,
};
