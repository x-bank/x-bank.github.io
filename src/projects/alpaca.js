
import { useEffect, useState } from "react";
import { initContract, providerFromChain, batchCall, ZERO, formatFixed } from "../executor"
import { getTokensByLp, getTokenValue } from "../executor/helpers"
import { PrimaryButton, CommandBarButton } from "@fluentui/react";
import { useCustomContractWrite } from "../connectors"
import { erc20ABI } from "wagmi";

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

const loadAsset = async (address) => {
    const provider = providerFromChain("bsc");
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
        let underlyingContract = initContract(underlying, erc20ABI, provider);
        let [tokenSymbol, underlyingDec] = await batchCall(
            [
                [underlying, erc20ABI, "symbol", []],
                [underlying, erc20ABI, "decimals", []],
            ],
            provider
        )
        let pendingUSD = formatFixed(await getTokenValue(rawPending, [Alpaca, USDT], cakeRouter, provider), 18, 2)
        assets.push([i, tokenSymbol, formatFixed(tokenAmount, underlyingDec, 2), formatFixed(rawPending, 18, 2), pendingUSD]);

    }
    return assets
}

function View({ address, assets }) {
    let harvest = useCustomContractWrite({
        addressOrName: chefAddress,
        contractInterface: chefAbi,
        functionName: "harvest",
        chainId: chainId,
    })

    return <div>
        <div className="flex font-semibold mb-2 bg-slate-200 py-1">
            <div className="w-1/2">Assets</div>
            <div>Rewards</div>
        </div>
        <div>
            {assets.map((asset) => {
                return <div key={asset[0]}>
                    <div className="flex items-center">
                        <div className="w-1/2">
                            <div>{asset[1]} {asset[2]}</div>
                        </div>
                        <div className="flex items-center">
                            <div>{asset[3]} Alpaca ({asset[4]}USD)</div>
                            <PrimaryButton text="Harvest" primary className="ml-2 bg-sky-500"
                                onClick={() => { harvest([asset[0]]) }}
                            ></PrimaryButton>
                        </div>
                    </div>
                </div>
            })}
        </div>
    </div>
}

export default {
    name: "Alpaca",
    chainId: chainId,
    url: "https://app.alpacafinance.org/lend",
    loadAsset,
    View,
}