import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { TokenImage } from "../image";
import ChevronDown from "../../../../assets/images/chevron-down.svg";
import PinkChevronDown from "../../../../assets/images/chevron-down-pink.svg";

const commonContainerStyles = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#292c2f",
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
};

const commonLabelStyles = {
    fontSize: 16,
    color: "#fff",
    fontFamily: "Inter",
    marginRight: 8,
};

const styles = StyleSheet.create({
    standardContainer: {
        ...commonContainerStyles,
        borderColor: "#333333",
    },
    noTokenContainer: {
        ...commonContainerStyles,
        borderColor: "#dc6be5",
    },
    flexHorizontal: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    image: {
        marginRight: 8,
    },
    standardLabel: {
        ...commonLabelStyles,
        color: "#fff",
    },
    noTokenLabel: {
        ...commonLabelStyles,
        color: "#dc6be5",
    },
});

export const Select = ({ token, onPress }) => (
    <TouchableOpacity
        onPress={onPress}
        style={token ? styles.standardContainer : styles.noTokenContainer}
    >
        {token ? (
            <View style={styles.flexHorizontal}>
                <View style={styles.image}>
                    <TokenImage address={token.address || "ETH"} size={16} />
                </View>
                <Text style={styles.standardLabel}>{token.symbol}</Text>
            </View>
        ) : (
            <Text style={styles.noTokenLabel}>Select a token</Text>
        )}
        {token ? (
            <ChevronDown width={12} height={12} />
        ) : (
            <PinkChevronDown width={12} height={12} />
        )}
    </TouchableOpacity>
);

Select.propTypes = {
    token: PropTypes.shape({
        address: PropTypes.string,
        symbol: PropTypes.string.isRequired,
    }),
    onPress: PropTypes.func.isRequired,
};
