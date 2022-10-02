import { useEffect, useState } from "react";
import { initContract, providerFromChain, batchCall, ZERO, formatFixed } from "../executor"
import { getTokensByLp, getTokenValue } from "../executor/helpers"
import { PrimaryButton } from "@fluentui/react";
import { useCustomContractWrite } from "../connectors"

const chainId = 56
const chefAbi = [
    "function userInfo(uint256, address) view returns (uint256, uint256, uint256)",
    "function poolLength() view returns (uint256)",
    "function pendingCake(uint256, address) view returns (uint256)",
    "function lpToken(uint256) view returns (address)",
    "function deposit(uint256, uint256)"
]

const chefAddress = "0xa5f8C5Dbd5F286960b9d90548680aE5ebFf07652";
const cakeRouter = "0x10ED43C718714eb63d5aA57B78B54704E256024E"
const Cake = "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82"
const BUSD = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"

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
        let lpAddr = await contract.lpToken(i);
        let rawPending = await contract.pendingCake(i, address)
        let pending = formatFixed(rawPending, 18, 2);
        let [, , , , token0Symbol, token1Symbol, token0Amount, token1Amount] = await getTokensByLp(lpAddr, amount, provider);
        let pendingUSD = formatFixed(await getTokenValue(rawPending, [Cake, BUSD], cakeRouter, provider), 18, 2)
        assets.push([i, token0Symbol, token0Amount, token1Symbol, token1Amount, pending, pendingUSD]);
    }
    return assets;
}

export function View({ address, assets }) {
    let harvest = useCustomContractWrite({
        addressOrName: chefAddress,
        contractInterface: chefAbi,
        functionName: "deposit",
        chainId: chainId,
    })

    return <div>
        <div className="flex font-semibold mb-2 bg-slate-200 py-1">
            <div className="w-1/2">Assets</div>
            <div>Rewards</div>
        </div>
        <div style={{ fontSize: "0.9em" }} className="flex flex-col space-y-4">
            {assets.map((asset) => {
                return <div key={asset[0]}>
                    <div className="flex items-center">
                        <div className="w-1/2">
                            <div>{asset[1]} {asset[2]}</div>
                            <div>{asset[3]} {asset[4]}</div>
                        </div>
                        <div className="flex items-center">
                            <div>{asset[5]} Cake (${asset[6]})</div>
                            <PrimaryButton text="Harvest" className="ml-2 bg-sky-500"
                                onClick={() => { harvest([asset[0], 0]) }}
                            ></PrimaryButton>
                        </div>
                    </div>
                </div>
            })}
        </div>
    </div>
}

export default {
    name: "Pancake",
    chainId: chainId,
    url: "https://pancakeswap.finance/swap",
    loadAsset,
    View,
}