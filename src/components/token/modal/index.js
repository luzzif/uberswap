import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ReactNativeModal from "react-native-modal";
import {
    Text,
    StyleSheet,
    View,
    FlatList,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { SUPPORTED_TOKENS } from "../../../commons/supported-tokens";
import { TokenImage } from "../image";
import Close from "../../../../assets/images/close.svg";
import { NETWORK_ID } from "../../../env";

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#202124",
        borderWidth: 1,
        borderColor: "#292c2f",
        borderRadius: 10,
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
    title: {
        fontSize: 16,
        fontFamily: "inter",
        color: "#fff",
    },
    closeIcon: {
        color: "#fff",
    },
    searchContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        height: 60,
        backgroundColor: "rgb(41, 44, 47)",
    },
    searchIconContainer: {
        width: 60,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    searchText: {
        fontFamily: "Inter",
        color: "#fff",
        width: "100%",
    },
    tokenListItem: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
    },
    tokenInfoContainer: {
        display: "flex",
        marginLeft: 16,
    },
    tokenSymbol: {
        fontFamily: "Inter",
        fontSize: 16,
        color: "#fff",
    },
    tokenName: {
        fontFamily: "Inter",
        fontSize: 16,
        color: "rgb(123, 123, 123)",
        marginBottom: 4,
    },
});

const DEFAULT_TOKEN_DATASET = Object.entries(SUPPORTED_TOKENS[NETWORK_ID]);

export const Modal = ({ open, onClose, onChange }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [tokenDataset, setTokenDataset] = useState(DEFAULT_TOKEN_DATASET);

    useEffect(() => {
        if (!searchTerm) {
            setTokenDataset(DEFAULT_TOKEN_DATASET);
        } else {
            setTokenDataset(
                DEFAULT_TOKEN_DATASET.filter(
                    ([address, { symbol, name }]) =>
                        symbol.includes(searchTerm) ||
                        name.includes(searchTerm) ||
                        address.includes(searchTerm)
                )
            );
        }
    }, [searchTerm]);

    const getPressHandler = (token) => () => {
        onChange(token);
        onClose();
    };

    return (
        <View>
            <ReactNativeModal
                isVisible={open}
                hasBackdrop
                onBackButtonPress={onClose}
                onBackdropPress={onClose}
                backdropColor="rgba(0, 0, 0, 0.7)"
                animationIn="fadeIn"
                animationOut="fadeOut"
                backdropTransitionOutTiming={0}
            >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Select a token</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Close style={styles.closeIcon} size={20} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.searchContainer}>
                        <View style={styles.searchIconContainer}>
                            <Text>🔎</Text>
                        </View>
                        <TextInput
                            placeholderTextColor="#808080"
                            style={styles.searchText}
                            numberOfLines={1}
                            onChangeText={setSearchTerm}
                            placeholder="Name, symbol or address"
                        />
                    </View>
                    {/* TODO: use proper network */}
                    <FlatList
                        data={tokenDataset}
                        keyExtractor={([address]) => address || "ETH"}
                        renderItem={({ item: [address, info] }) => (
                            <TouchableOpacity
                                onPress={getPressHandler({
                                    address,
                                    ...info,
                                })}
                            >
                                <View style={styles.tokenListItem}>
                                    <TokenImage address={address} size={32} />
                                    <View style={styles.tokenInfoContainer}>
                                        <Text style={styles.tokenSymbol}>
                                            {info.symbol}
                                        </Text>
                                        <Text style={styles.tokenName}>
                                            {info.name}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </ReactNativeModal>
        </View>
    );
};

Modal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
};
