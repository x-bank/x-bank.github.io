import { useEffect, useState } from "react";
import { chainId } from "wagmi";
import { providerFromChain, batchCall, formatFixed, batchCallWithCache } from "../executor"
import { abiErc20 } from "../executor/abis";

import { DataTable } from "../widgets/table"

const WBNB = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"

const ctrlAddress = "0xfD36E2c2a6789Db23113685031d7F16329158384"
const ctrlAbi = [
    "function getAllMarkets() view returns (address[])",
    "function oracle() view returns (address)"
]

const oracleAbi = [
    "function getUnderlyingPrice(address) view returns (uint256)"
]

const ctokenAbi = [
    "function underlying() view returns (address)",
    "function getCash() view returns (uint256)",
    "function decimals() view returns (uint8)",
]

const provider = providerFromChain("bsc");

const refreshState = async () => {
    let [markets, oracle] = await batchCallWithCache([
        [ctrlAddress, ctrlAbi, "getAllMarkets", []],
        [ctrlAddress, ctrlAbi, "oracle", []],
    ], provider)
    let priceCalls = markets.map((ctoken) => {
        return [oracle, oracleAbi, "getUnderlyingPrice", [ctoken]]
    })
    let prices = await batchCall(priceCalls, provider)

    let underlyings = await batchCallWithCache(markets.map((ctoken) => {
        return [ctoken, ctokenAbi, "underlying", []]
    }), provider)

    for (var i = 0; i < prices.length; i++) {
        if (underlyings[i] === null) {
            underlyings[i] = WBNB
        }
    }

    let cashs = await batchCall(markets.map((ctoken) => {
        return [ctoken, ctokenAbi, "getCash", []]
    }), provider)

    let decs = await batchCallWithCache(underlyings.map((token) => {
        return [token, abiErc20, "decimals", []]
    }), provider)
    let names = await batchCallWithCache(underlyings.map((token) => {
        return [token, abiErc20, "symbol", []]
    }), provider)

    let result = []
    for (var i = 0; i < prices.length; i++) {
        result.push([names[i], markets[i], formatFixed(prices[i], 18 + (18 - decs[i])), formatFixed(cashs[i], decs[i], 2), underlyings[i]])
    }
    return result
}


function View({ state }) {
    return <div>
        <DataTable
            title={"Assets"}
            headers={["Name", "Address", "Price", "Liquidation", "Underlying"]}
            items={state}
        ></DataTable>
    </div>
}

export default {
    name: "venus",
    chainId: chainId,
    View,
    refreshState,
}