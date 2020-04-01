import React from "react";
import PropTypes from "prop-types";
import { Image } from "react-native";
import EthereumLogo from "../../../../assets/images/ethereum-logo.svg";

export const TokenImage = ({ address, size, ...rest }) =>
    address !== "ETH" ? (
        <Image
            {...rest}
            alt={address}
            source={{
                uri: `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`,
                width: size,
                height: size,
            }}
        />
    ) : (
        <EthereumLogo width={size} height={size} />
    );

TokenImage.propTypes = {
    address: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
};
