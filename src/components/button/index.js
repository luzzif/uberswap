import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const commonContainerStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 32,
    height: 52,
    paddingHorizontal: 20,
};

const commonTextStyles = {
    fontFamily: "Inter",
    fontSize: 16,
};

const styles = StyleSheet.create({
    primaryContainer: {
        ...commonContainerStyles,
        backgroundColor: "#dc6be5",
    },
    secondaryContainer: {
        ...commonContainerStyles,
        borderWidth: 1,
        borderColor: "#dc6be5",
    },
    primaryText: {
        ...commonTextStyles,
        color: "#fff",
    },
    secondaryText: {
        ...commonTextStyles,
        color: "#dc6be5",
    },
});

export const Button = ({ title, onPress, disabled, secondary }) => (
    <TouchableOpacity
        disabled={disabled}
        onPress={onPress}
        style={secondary ? styles.secondaryContainer : styles.primaryContainer}
    >
        <Text
            style={secondary ? styles.secondaryText : styles.primaryText}
            numberOfLines={1}
        >
            {title}
        </Text>
    </TouchableOpacity>
);

Button.propTypes = {
    title: PropTypes.string.isRequired,
    onPress: PropTypes.func,
    disabled: PropTypes.bool,
    secondary: PropTypes.bool,
};
