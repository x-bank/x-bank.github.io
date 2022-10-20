import { useEffect, useState } from "react";
import { initContract, providerFromChain, batchCall, ZERO, formatFixed, batchCallWithCache  } from "../executor"
import { getTokensByLp, getTokenValue } from "../executor/helpers"
import { useCustomContractWrite } from "../connectors"
import { DataTable, TableCell } from "../widgets/table"
import { Button } from 'semantic-ui-react'

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

const provider = providerFromChain("bsc");

const loadAsset = async (address) => {
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

function HintView() {
    const coreInfos = [
        ["Cake", Cake],
        ["Router", cakeRouter],
        ["Chef", chefAddress],
    ]
    return <div>
        <DataTable items={coreInfos}></DataTable>
    </div>
}

function View({ address }) {
    let [assets, setAssets] = useState([])
    let [isLoading, setIsLoading] = useState(false)


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
                    <div className="mr-2">{asset[5]} Cake (${asset[6]})</div>
                    <Button primary size="mini"
                        onClick={() => { harvest([asset[0], 0]) }}
                    >Harvest</Button>
                </div>
            </TableCell>
        </>
    }

    return <DataTable
        headers={["Balance", "Rewards"]}
        items={assets}
        itemRenderer={renderLp}
        loading={isLoading}
    ></DataTable>
}

export default {
    url: "https://pancakeswap.finance/swap",
    View,
    HintView
}