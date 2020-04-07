import React from "react";
import PropTypes from "prop-types";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

const commonItemStyles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
};

const commonItemTitleStyles = {
    fontFamily: "Inter",
    fontSize: 16,
};

const styles = StyleSheet.create({
    outerContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        width: "100%",
        height: 40,
        borderRadius: 32,
        backgroundColor: "rgb(41, 44, 47)",
    },
    selectedItem: {
        borderRadius: 32,
        borderWidth: 1,
        borderColor: "rgb(51, 51, 51)",
        backgroundColor: "rgb(32, 33, 36)",
        ...commonItemStyles,
    },
    unselectedItem: {
        ...commonItemStyles,
    },
    selectedItemTitle: {
        ...commonItemTitleStyles,
        color: "#dc6be5",
    },
    unselectedItemTitle: {
        ...commonItemTitleStyles,
        color: "rgb(196, 196, 196)",
    },
    disabledItemTitle: {
        ...commonItemTitleStyles,
        color: "rgb(96, 96, 96)",
    },
});

export const BottomTabs = ({ items, index, onChange }) => {
    const getItemPresshandler = (itemIndex) => () => {
        onChange(itemIndex);
    };

    const getItemTextStyles = (itemIndex, disabled) => {
        if (disabled) {
            return styles.disabledItemTitle;
        }
        if (index === itemIndex) {
            return styles.selectedItemTitle;
        }
        return styles.unselectedItemTitle;
    };

    return (
        <View style={styles.outerContainer}>
            {items.map((item, itemIndex) => (
                <TouchableOpacity
                    key={item.key}
                    disabled={item.disabled}
                    onPress={getItemPresshandler(itemIndex)}
                    style={{
                        width: `${100 / items.length}%`,
                        ...(index === itemIndex
                            ? styles.selectedItem
                            : styles.unselectedItem),
                    }}
                >
                    <Text style={getItemTextStyles(itemIndex, item.disabled)}>
                        {item.title}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

BottomTabs.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
        }).isRequired
    ).isRequired,
    index: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
};
