import { useEffect, useState } from "react";
import { initContract, providerFromChain, batchCall, ZERO, formatFixed } from "../executor"
import { getTokensByLp, getTokenValue } from "../executor/helpers"
import { PrimaryButton } from "@fluentui/react";
import { useCustomContractWrite } from "../connectors"
import { Table, TableCell } from "../widgets/table"

const chainId = 56

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

const provider = providerFromChain("bsc");

const loadAsset = async (address) => {
    const contract = initContract(chefAddress, chefAbi, provider);
    const l = (await contract.poolLength()).toNumber();
    let calls = [];
    for (let i = 0; i < l; i++) {
        calls.push([chefAddress, chefAbi, "userInfo", [i, address]]);
    }
    let results = await batchCall(calls, provider);
    let assets = [];
    for (let i = 0; i < results.length; i++) {
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

const View = ({ address }) => {
    let [assets, setAssets] = useState([])
    let [isLoading, setIsLoading] = useState(false)

    const coreInfos = [
        ["BSW", BSW],
        ["Router", biswapRouter],
        ["Chef", biswapRouter],
    ]

    let harvest = useCustomContractWrite({
        addressOrName: chefAddress,
        contractInterface: chefAbi,
        functionName: "deposit",
        chainId: chainId,
    })

    useEffect(() => {
        let run = async () => {
            if (address) {
                setIsLoading(true)
                setAssets([])
                setAssets(await loadAsset(address))
                setIsLoading(false)
            }
        }
        run();
    }, [address])

    const renderLp = (asset) => {
        return <>
            <TableCell>
                <div>{asset[1]} {asset[2]}</div>
                <div>{asset[3]} {asset[4]}</div>
            </TableCell>
            <TableCell>
                <div className="flex items-center">
                    <div>{asset[5]} BSW (${asset[6]})</div>
                    <PrimaryButton text="Harvest" className="ml-2 bg-sky-500"
                        onClick={() => { harvest([asset[0], 0]) }}
                    ></PrimaryButton>
                </div>
            </TableCell>
        </>
    }

    return <div className="flex justify-between">
        <div className="w-7/12">
            <Table
                title={"Hold Lps"}
                headers={["Balance", "Rewards"]}
                items={assets}
                itemRenderer={renderLp}
                loading={isLoading}
            ></Table>
        </div>
        <div className="w-4/12">
            <Table title={"Core Infos"} items={coreInfos}></Table>
        </div>
    </div>
}

export default {
    url: "https://exchange.biswap.org/#/swap",
    View,
}