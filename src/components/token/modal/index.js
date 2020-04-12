import React, { useState, useEffect, useCallback } from "react";
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
import Web3 from "web3";
import BigNumber from "bignumber.js";
const {
    utils: { fromWei },
} = Web3;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#202124",
        borderWidth: 1,
        borderColor: "#292c2f",
        borderRadius: 10,
        minHeight: "50%",
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
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flex: 1,
        marginHorizontal: 16,
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
    tokenBalance: {
        fontFamily: "Inter",
        fontSize: 16,
        color: "#fff",
    },
    noTokenViewContainer: {
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    noTokenText: {
        color: "#fff",
        fontSize: 16,
    },
});

const DEFAULT_TOKEN_DATASET = Object.entries(SUPPORTED_TOKENS[NETWORK_ID]);

export const Modal = ({ open, onClose, onChange, balances }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [tokenDataset, setTokenDataset] = useState(DEFAULT_TOKEN_DATASET);
    const [balancesInEther, setBalancesInEther] = useState({});

    useEffect(() => {
        let dataset = DEFAULT_TOKEN_DATASET;
        if (searchTerm) {
            dataset = dataset.filter(([address, { symbol, name }]) => {
                const lowerCasedSearchTerm = searchTerm.toLowerCase();
                return (
                    symbol.toLowerCase().includes(lowerCasedSearchTerm) ||
                    name.toLowerCase().includes(lowerCasedSearchTerm) ||
                    address.toLowerCase().includes(lowerCasedSearchTerm)
                );
            });
        }
        if (balancesInEther) {
            dataset = dataset.sort(([firstAddress], [secondAddress]) => {
                const firstTokenBalance = balancesInEther[firstAddress];
                const secondTokenBalance = balancesInEther[secondAddress];
                return firstTokenBalance && secondTokenBalance
                    ? secondTokenBalance.minus(firstTokenBalance).toNumber()
                    : 0;
            });
        }
        setTokenDataset(dataset);
    }, [searchTerm, balancesInEther]);

    useEffect(() => {
        if (!balances) {
            return;
        }
        const balancesInEther = Object.entries(balances).reduce(
            (balancesInEther, [address, balanceInWei]) => {
                balancesInEther[address] = new BigNumber(fromWei(balanceInWei));
                return balancesInEther;
            },
            {}
        );
        setBalancesInEther(balancesInEther);
    }, [balances]);

    const getPressHandler = (token) => () => {
        onChange(token);
        onClose();
    };

    const handleLocalClose = useCallback(() => {
        onClose();
        setTokenDataset(DEFAULT_TOKEN_DATASET);
        setSearchTerm("");
    }, [onClose]);

    return (
        <View>
            <ReactNativeModal
                isVisible={open}
                hasBackdrop
                onBackButtonPress={handleLocalClose}
                onBackdropPress={handleLocalClose}
                backdropColor="rgba(0, 0, 0, 0.4)"
                animationIn="fadeIn"
                animationOut="fadeOut"
                backdropTransitionOutTiming={0}
            >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Select a token</Text>
                        <TouchableOpacity onPress={handleLocalClose}>
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
                        renderItem={({ item: [rawAddress, info] }) => {
                            const address = rawAddress || "ETH";
                            return (
                                <TouchableOpacity
                                    onPress={getPressHandler({
                                        address,
                                        ...info,
                                    })}
                                >
                                    <View style={styles.tokenListItem}>
                                        <TokenImage
                                            address={address}
                                            size={32}
                                        />
                                        <View style={styles.tokenInfoContainer}>
                                            <View>
                                                <Text
                                                    style={styles.tokenSymbol}
                                                >
                                                    {info.symbol}
                                                </Text>
                                                <Text style={styles.tokenName}>
                                                    {info.name}
                                                </Text>
                                            </View>
                                            <View>
                                                <Text
                                                    style={styles.tokenBalance}
                                                >
                                                    {balancesInEther &&
                                                    balancesInEther[address] &&
                                                    balancesInEther[
                                                        address
                                                    ].isGreaterThan("0.0001")
                                                        ? balancesInEther[
                                                              address
                                                          ]
                                                              .decimalPlaces(4)
                                                              .toString()
                                                        : "-"}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        }}
                        ListEmptyComponent={
                            <View style={styles.noTokenViewContainer}>
                                <Text style={styles.noTokenText}>
                                    No token found
                                </Text>
                            </View>
                        }
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
    balances: PropTypes.array.isRequired,
};
