import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";

const commonContainerStyles = {
    display: "flex",
    justifyContent: "center",
    paddingHorizontal: 12,
    borderRadius: 24,
    borderWidth: 1,
    height: 36,
};

const styles = StyleSheet.create({
    selectedCcontainer: {
        ...commonContainerStyles,
        display: "flex",
        justifyContent: "center",
        backgroundColor: "#dc6be5",
        borderColor: "#dc6be5",
    },
    unselectedContainer: {
        ...commonContainerStyles,
        borderColor: "rgb(51, 51, 51)",
    },
    titleContainer: {
        fontFamily: "Inter",
        fontSize: 12,
        color: "#fff",
    },
});

export const Chip = ({ text, active, onPress }) => (
    <TouchableOpacity
        onPress={onPress}
        style={active ? styles.selectedCcontainer : styles.unselectedContainer}
    >
        <Text style={styles.titleContainer}>{text}</Text>
    </TouchableOpacity>
);

Chip.propTypes = {
    text: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    onPress: PropTypes.func.isRequired,
};
