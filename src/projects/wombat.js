
import { useEffect, useState } from "react";
import { initContract, providerFromChain, batchCall, ZERO, formatFixed, batchCallWithCache } from "../executor"
import { getTokensByLp, getTokenValue } from "../executor/helpers"
import { useCustomContractWrite } from "../connectors"
import { abiErc20 } from "../executor/abis";
import { DataTable, TableCell } from "../widgets/table"
import { Button } from 'semantic-ui-react'

const chainId = 56

const chefAbi = [
    "function userInfo(uint256, address) view returns (uint128, uint128, uint128, uint128)",
    "function poolLength() view returns (uint256)",
    "function pendingAlpaca(uint256, address) view returns (uint256)",
    "function poolInfo(uint256) view returns (address, uint96, address, uint256, uint104, uint104, uint40)",
    "function deposit(address, uint256, uint256)",
    "function multiClaim(uint256[] memory) view returns (uint256, uint256[] memory, uint256[][] memory)",
    "function pendingTokens(uint256, address) view returns (uint256, address[] memory, string[] memory, uint256[] memory)",
]

const IbtokenAbi = [
    "function totalSupply() view returns (uint256)",
    "function underlyingToken() view returns (address)",
    "function underlyingTokenBalance() view returns (uint256)",
    "function underlyingTokenDecimals() view returns (uint8)",
]

const chefAddress = "0xE2C07d20AF0Fb50CAE6cDD615CA44AbaAA31F9c8"
const cakeRouter = "0x10ED43C718714eb63d5aA57B78B54704E256024E"
const Wom = "0xAD6742A35fB341A9Cc6ad674738Dd8da98b94Fb1"
const USDT = "0x55d398326f99059fF775485246999027B3197955"

const provider = providerFromChain("bsc");

const loadAsset = async (address) => {
    const contract = initContract(chefAddress, chefAbi, provider);
    const l = (await contract.poolLength()).toNumber();
    console.log("wom", l)
    let calls = [];
    for (var i = 0; i < l; i++) {
        calls.push([chefAddress, chefAbi, "userInfo", [i, address]]);
    }
    let results = await batchCall(calls, provider);
    console.log(results)
    let assets = [];
    for (var i = 0; i < results.length; i++) {
        if (results[i] === null) {
            continue;
        }
        let amount = results[i][0];
        if (amount.eq(ZERO)) {
            continue;
        }
        let lpAddr = (await contract.poolInfo(i))[0];
        let rawPending = (await contract.pendingTokens(i, address))[0]
        let [totalSupply, underlyingToken, underlyingTokenBalance] = await batchCall(
            [
                [lpAddr, IbtokenAbi, "totalSupply", []],
                [lpAddr, IbtokenAbi, "underlyingToken", []],
                [lpAddr, IbtokenAbi, "underlyingTokenBalance", []],
            ],
            provider
        )
        let tokenAmount = amount.mul(underlyingTokenBalance).div(totalSupply)
        let [tokenSymbol, underlyingDec] = await batchCallWithCache(
            [
                [underlyingToken, abiErc20, "symbol", []],
                [underlyingToken, abiErc20, "decimals", []],
            ],
            provider
        )
        let pendingUSD = formatFixed(await getTokenValue(rawPending, [Wom, USDT], cakeRouter, provider), 18, 2)
        assets.push([i, tokenSymbol, formatFixed(tokenAmount, underlyingDec, 2), formatFixed(rawPending, 18, 2), pendingUSD]);
    }
    return assets
}

function HintView() {
    const coreInfos = [
        ["Wom", Wom],
        ["Chef", chefAddress],
    ]
    return <DataTable items={coreInfos}></DataTable>
}

function View({ address, refreshTicker }) {
    let [assets, setAssets] = useState([])

    useEffect(() => {
        let run = async () => {
            if (address) {
                setAssets(await loadAsset(address))
            }
        }
        run();
    }, [address, refreshTicker])

    let harvest = useCustomContractWrite({
        addressOrName: chefAddress,
        contractInterface: chefAbi,
        functionName: "multiClaim",
        chainId: chainId,
    })

    const renderLp = (asset) => {
        return <>
            <TableCell>
                <div>{asset[1]} {asset[2]}</div>
            </TableCell>
            <TableCell>
                <div className="flex items-center">
                    <div className="mr-2">{asset[3]} Alpaca (${asset[4]})</div>
                </div>
            </TableCell>
        </>
    }

    return <div>
        <DataTable
            headers={["Balance", "Rewards"]}
            itemRenderer={renderLp}
            items={assets}
        ></DataTable>
        {
            assets.length > 0 ?
                <div className="flex justify-center items-center mb-2">
                    <Button primary size="mini"
                        onClick={() => { harvest([assets.map((x) => x[0])]) }}
                    >Harvest All</Button>
                </div>
                : null
        }
    </div>
}

export default {
    View,
    HintView,
}    