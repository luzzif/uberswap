import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { StyleSheet, View } from "react-native";
import Web3 from "web3";
import BigNumber from "bignumber.js";
import { SUPPORTED_TOKENS } from "../../../commons/supported-tokens";
import { NETWORK_ID } from "../../../env";
import { Modal } from "./modal";
import { Button } from "../../button";

const {
    utils: { fromWei },
} = Web3;

const styles = StyleSheet.create({
    outerContainer: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        paddingHorizontal: 16,
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
    touchableText: {
        display: "flex",
        alignItems: "center",
        marginBottom: 16,
    },
});

export const TradeDetails = ({
    details,
    additionalSlippage,
    onAdditionalSlippageChange,
    deadline,
    onDeadlineChange,
    txSpeed,
    onTxSpeedChange,
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
            new BigNumber(fromWei(inputAmount.amount.toFixed()))
                .decimalPlaces(4)
                .toString()
        );

        setDestinationToken(
            SUPPORTED_TOKENS[NETWORK_ID][outputAmount.token.address].symbol
        );
        setDestinationAmount(
            new BigNumber(fromWei(outputAmount.amount.toFixed()))
                .decimalPlaces(4)
                .toString()
        );

        setExpectedSlippage(
            executionRateSlippage.dividedBy("100").decimalPlaces(2).toString()
        );
    }, [details]);

    const handleModalOpen = useCallback(() => {
        setShow(true);
    }, [show]);

    const handleModalClose = useCallback(() => {
        setShow(false);
    }, [show]);

    return (
        <View style={styles.outerContainer}>
            <View style={styles.advancedDetailsTextContainer}>
                <Button
                    secondary
                    onPress={handleModalOpen}
                    title="Advanced details"
                />
            </View>
            <Modal
                open={show}
                onClose={handleModalClose}
                originToken={originToken}
                originAmount={originAmount}
                destinationToken={destinationToken}
                destinationAmount={destinationAmount}
                expectedSlippage={expectedSlippage}
                additionalSlippage={additionalSlippage}
                onAdditionalSlippageChange={onAdditionalSlippageChange}
                deadline={deadline}
                onDeadlineChange={onDeadlineChange}
                txSpeed={txSpeed}
                onTxSpeedChange={onTxSpeedChange}
            />
        </View>
    );
};

TradeDetails.propTypes = {
    details: PropTypes.object.isRequired,
    additionalSlippage: PropTypes.number.isRequired,
    onAdditionalSlippageChange: PropTypes.func.isRequired,
    deadline: PropTypes.string.isRequired,
    onDeadlineChange: PropTypes.func.isRequired,
    txSpeed: PropTypes.string.isRequired,
    onTxSpeedChange: PropTypes.func.isRequired,
};
