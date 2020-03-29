import React from "react";
import PropTypes from "prop-types";
import { Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

const styles = StyleSheet.create({
    text: {
        fontFamily: "Inter",
        fontSize: 12,
        color: "rgb(196, 196, 196)",
    },
});

export const ExchangeRate = ({ originToken, destinationToken }) => {
    const tradeRate = useSelector((state) => {
        const { trade } = state.uniswap;
        if (!trade) {
            return null;
        }
        const { rate } = trade.executionRate;
        return trade.executionRate.rate.isNaN()
            ? null
            : trade.executionRate.rate;
    });

    return (
        <Text style={styles.text}>
            {originToken && tradeRate && destinationToken
                ? `1 ${originToken.symbol} = ${tradeRate
                      .toFixed(6)
                      .toString()} ${destinationToken.symbol}`
                : "-"}
        </Text>
    );
};

ExchangeRate.propTypes = {
    originToken: PropTypes.object,
    destinationToken: PropTypes.object,
};
