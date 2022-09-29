import { useEffect, useState } from "react";
import { initContract, providerFromChain, batchCall, ZERO, formatFixed } from "../executor"
import { getTokensByLp } from "../executor/helpers"
import { PrimaryButton, CommandBarButton } from "@fluentui/react";
import { usePrepareContractWrite, useContractWrite } from 'wagmi'

const chefAbi = [
    "function userInfo(uint256, address) view returns (uint256, uint256, uint256)",
    "function poolLength() view returns (uint256)",
    "function pendingCake(uint256, address) view returns (uint256)",
    "function lpToken(uint256) view returns (address)",
    "function deposit(uint256, uint256)"
]

const chefAddress = "0xa5f8C5Dbd5F286960b9d90548680aE5ebFf07652";

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
        let lpAddr = await contract.lpToken(i);
        let pending = formatFixed(await contract.pendingCake(i, address), 18, 2);
        let [, , , , token0Symbol, token1Symbol, token0Amount, token1Amount] = await getTokensByLp(lpAddr, amount, provider);
        assets.push([token0Symbol, token0Amount, token1Symbol, token1Amount, pending, i]);
    }
    return assets;
}

export function PancakeCard({ address }) {
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

    let [harvestPoolId, setHarvestPoolId] = useState(-1)

    const { config } = usePrepareContractWrite({
        addressOrName: chefAddress,
        contractInterface: chefAbi,
        functionName: "deposit",
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

    return <div className="w-full bg-slate-200 text-sm font-mono p-2">
        <div className="flex font-semibold mb-2">
            <div className="w-1/2">Assets</div>
            <div>Rewards</div>
        </div>
        {assets.map((asset) => {
            return <div key={asset[5]}>
                <div className="flex items-center">
                    <div className="w-1/2">
                        <div>{asset[0]} {asset[1]}</div>
                        <div>{asset[2]} {asset[3]}</div>
                    </div>
                    <div className="flex items-center">
                        <div>{asset[4]} Cake</div>
                        <PrimaryButton text="Harvest" primary className="ml-2 bg-sky-500"
                            onClick={() => { setHarvestPoolId(asset[5]) }}
                        ></PrimaryButton>
                    </div>
                </div>
            </div>
        })}
    </div>
}