import { useEffect, useState } from "react"
import { batchCall, formatFixed, providerFromChain } from "../executor"
import { abiErc20 } from "../executor/abis"
import { Table } from "../widgets/table"

let coins = [
    "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "0xdAC17F958D2ee523a2206206994597C13D831ec7",
]

let pool3Address = "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7"


const provider = providerFromChain("eth")

const getStEthInfo = async () => {
    let poolStEth = "0xDC24316b9AE028F1497c275EB9192a3Ea0f67022"
    let stEthAddress = "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
    let ethBal = await provider.getBalance(poolStEth);
    let [bal, dec] = await batchCall([
        [stEthAddress, abiErc20, "balanceOf", [poolStEth]],
        [stEthAddress, abiErc20, "decimals", []],
    ], provider)
    return [
        ["ETH", "", formatFixed(ethBal, 18)],
        ["stETH", stEthAddress, formatFixed(bal, dec)]
    ]
}

const View = ({ address }) => {
    let [pool3Assets, setPool3Assets] = useState([])
    let [stEth, setStEth] = useState([])
    let [loading, setLoading] = useState(false)
    useEffect(() => {
        let run = async () => {
            setLoading(true)
            let bals = await batchCall(coins.map((coin) => {
                return [coin, abiErc20, "balanceOf", [pool3Address]]
            }), provider)
            let decs = await batchCall(coins.map((coin) => {
                return [coin, abiErc20, "decimals", []]
            }), provider)
            let symbols = await batchCall(coins.map((coin) => {
                return [coin, abiErc20, "symbol", []]
            }), provider)
            let result = []
            for (let i = 0; i < bals.length; i++) {
                result.push([symbols[i], coins[i], formatFixed(bals[i], decs[i], 2)])
            }
            setPool3Assets(result)
            setStEth(await getStEthInfo())
            setLoading(false)
        }
        run()
    }, [])
    return <div className="flex flex-row justify-around">
        <div className="w-5/12">
            <Table
                title={"3pool"}
                headers={["coin", "address", "balance"]}
                items={pool3Assets}
                loading={loading}
            >
            </Table>
        </div>
        <div className="w-5/12">
            <Table
                title={"stEth"}
                headers={["coin", "address", "balance"]}
                items={stEth}
                loading={loading}
            >
            </Table>
        </div>
    </div>
}

export default {
    View
}