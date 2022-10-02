import { useEffect, useState } from "react";
import { initContract, providerFromChain, batchCall, ZERO, formatFixed } from "../executor"
import { getTokensByLp, getTokenValue } from "../executor/helpers"
import { PrimaryButton } from "@fluentui/react";
import { useCustomContractWrite } from "../connectors"
import { abiErc20 } from "../executor/abis";

import {Table} from "../widgets/table"

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

const listTokens = async () => {
    const ctrlContract = initContract(ctrlAddress, ctrlAbi, provider);
    let [markets, oracle] = await batchCall([
        [ctrlAddress, ctrlAbi, "getAllMarkets", []],
        [ctrlAddress, ctrlAbi, "oracle", []],
    ], provider)
    let priceCalls = markets.map((ctoken) => {
        return [oracle, oracleAbi, "getUnderlyingPrice", [ctoken]]
    })
    let prices = await batchCall(priceCalls, provider)

    let underlyings = await batchCall(markets.map((ctoken) => {
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

    let decs = await batchCall(underlyings.map((token) => {
        return [token, abiErc20, "decimals", []]
    }), provider)
    let names = await batchCall(underlyings.map((token) => {
        return [token, abiErc20, "symbol", []]
    }), provider)

    let result = []
    for (var i = 0; i < prices.length; i++) {
        result.push([names[i], markets[i], formatFixed(prices[i], 18), formatFixed(cashs[i], decs[i], 2)])
    }
    let infos = [
        ['Controller:', ctrlAddress],
        ['Oracle:', oracle],
    ]
    return [result, infos]
}

function View() {
    let [isLoading, setIsLoading] = useState(false)
    let [tokens, setTokens] = useState([])
    let [infos, setInfos] = useState([])

    useEffect(() => {
        let run = async () => {
            setIsLoading(true)
            let [a, b] = await listTokens()
            setTokens(a)
            setInfos(b)
            setIsLoading(false)
        }
        run()
    }, [])
    return <div className="flex justify-between">
        <div className="w-7/12">
            <Table
                title={"Assets"}
                headers={["Name", "Address", "Price", "Liquidation"]}
                items={tokens}
                loading={isLoading}
            ></Table>
        </div>
        <div className="w-4/12">
            <Table
                title={"Core Infos"}
                headers={["Name", "Address"]}
                items={infos}
                loading={isLoading}
            ></Table>
        </div>
    </div>
}

export default {
    View,
}