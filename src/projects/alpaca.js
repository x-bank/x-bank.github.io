
import { useEffect, useState } from "react";
import { initContract, providerFromChain, batchCall, ZERO, formatFixed, batchCallWithCache } from "../executor"
import { getTokensByLp, getTokenValue } from "../executor/helpers"
import { useCustomContractWrite } from "../connectors"
import { abiErc20 } from "../executor/abis";
import { DataTable, TableCell } from "../widgets/table"
import { Button } from 'semantic-ui-react'

const chainId = 56

const chefAbi = [
    "function userInfo(uint256, address) view returns (uint256, uint256, uint256, address)",
    "function poolLength() view returns (uint256)",
    "function pendingAlpaca(uint256, address) view returns (uint256)",
    "function poolInfo(uint256) view returns (address, uint256, uint256, uint256, uint256)",
    "function deposit(address, uint256, uint256)",
    "function harvest(uint256)"
]

const IbtokenAbi = [
    "function totalSupply() view returns (uint256)",
    "function totalToken() view returns (uint256)",
    "function token() view returns (address)",
]

const chefAddress = "0xA625AB01B08ce023B2a342Dbb12a16f2C8489A8F"
const cakeRouter = "0x10ED43C718714eb63d5aA57B78B54704E256024E"
const Alpaca = "0x8F0528cE5eF7B51152A59745bEfDD91D97091d2F"
const USDT = "0x55d398326f99059fF775485246999027B3197955"

const provider = providerFromChain("bsc");

const refreshState = async (address) => {
    const contract = initContract(chefAddress, chefAbi, provider);
    const l = (await contract.poolLength()).toNumber();
    let calls = [];
    for (var i = 0; i < l; i++) {
        calls.push([chefAddress, chefAbi, "userInfo", [i, address]]);
    }
    let results = await batchCall(calls, provider);
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
        let rawPending = await contract.pendingAlpaca(i, address)
        let [totalSupply, totalToken, underlying] = await batchCall(
            [
                [lpAddr, IbtokenAbi, "totalSupply", []],
                [lpAddr, IbtokenAbi, "totalToken", []],
                [lpAddr, IbtokenAbi, "token", []],
            ],
            provider
        )
        let tokenAmount = amount.mul(totalToken).div(totalSupply)
        let [tokenSymbol, underlyingDec] = await batchCallWithCache(
            [
                [underlying, abiErc20, "symbol", []],
                [underlying, abiErc20, "decimals", []],
            ],
            provider
        )
        let pendingUSD = formatFixed(await getTokenValue(rawPending, [Alpaca, USDT], cakeRouter, provider), 18, 2)
        assets.push([i, tokenSymbol, formatFixed(tokenAmount, underlyingDec, 2), formatFixed(rawPending, 18, 2), pendingUSD]);
    }
    return assets
}

function HintView() {
    const coreInfos = [
        ["Alpaca", Alpaca],
        ["Chef", chefAddress],
    ]
    return <DataTable items={coreInfos}></DataTable>
}

function View({ state }) {
    let harvest = useCustomContractWrite({
        addressOrName: chefAddress,
        contractInterface: chefAbi,
        functionName: "harvest",
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
                    <Button primary size="mini"
                        onClick={() => { harvest([asset[0]]) }}
                    >Harvest</Button>
                </div>
            </TableCell>
        </>
    }

    return <div>
        <DataTable
            headers={["Balance", "Rewards"]}
            itemRenderer={renderLp}
            items={state}
        ></DataTable>
    </div>
}

export default {
    name: "alpaca",
    chainId: chainId,
    View,
    HintView,
    refreshState,
}    