import { useEffect, useState } from "react";
import { initContract, providerFromChain, batchCall, ZERO, formatFixed } from "../executor"
import { getTokensByLp, getTokenValue } from "../executor/helpers"
import { usePrepareContractWrite, useContractWrite, useProvider, useSigner } from 'wagmi'
import { PrimaryButton, CommandBarButton } from "@fluentui/react";

const chefAbi = [
    "function userInfo(uint256, address) view returns (uint256, uint256)",
    "function poolLength() view returns (uint256)",
    "function pendingBSW(uint256, address) view returns (uint256)",
    "function poolInfo(uint256) view returns (address, uint256, uint256, uint256)",
    "function deposit(uint256, uint256)"
]

const chefAddress = "0xDbc1A13490deeF9c3C12b44FE77b503c1B061739"
const biswapRouter = "0x3a6d8cA21D1CF76F653A67577FA0D27453350dD8"
const BSW = "0x965F527D9159dCe6288a2219DB51fc6Eef120dD1"
const USDT = "0x55d398326f99059fF775485246999027B3197955"
const chainId = 56

const check = async (address) => {
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
        let rawPending = await contract.pendingBSW(i, address)
        let pending = formatFixed(rawPending, 18, 2);
        let [, , , , token0Symbol, token1Symbol, token0Amount, token1Amount] = await getTokensByLp(lpAddr, amount, provider);
        let pendingUSD = formatFixed(await getTokenValue(rawPending, [BSW, USDT], biswapRouter, provider), 18, 2)
        assets.push([i, token0Symbol, token0Amount, token1Symbol, token1Amount, pending, pendingUSD]);
    }
    return assets;
}

export function BiswapCard({ address }) {
    const provider = useProvider();
    let [assets, setAssets] = useState([]);
    useEffect(() => {
        if (address.length === "") {
            return;
        }
        let run = async () => {
            let val = await check(address);
            console.log(val);
            setAssets(val);
        }
        run();
    }, [address])

    useEffect(() => {
        console.log(provider);
        console.log(provider.chainId);
    }, [provider])

    let [harvestPoolId, setHarvestPoolId] = useState(-1)

    const { config } = usePrepareContractWrite({
        addressOrName: chefAddress,
        contractInterface: chefAbi,
        functionName: "deposit",
        chainId: chainId,
        args: [harvestPoolId, 0],
        enabled: harvestPoolId >= 0
    })
    const { write } = useContractWrite(config)

    useEffect(() => {
        if (harvestPoolId >= 0 && write) {
            write();
        }
        return () => {
            setHarvestPoolId(-2);
        }
    }, [harvestPoolId])

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
                            <div>{asset[3]} {asset[4]}</div>
                        </div>
                        <div className="flex items-center">
                            <div>{asset[5]} BSW ({asset[6]}USD)</div>
                            <PrimaryButton text="Harvest" primary className="ml-2 bg-sky-500"
                                onClick={() => { setHarvestPoolId(asset[0]) }}
                            ></PrimaryButton>
                        </div>
                    </div>
                </div>
            })}
        </div>
    </div>
}