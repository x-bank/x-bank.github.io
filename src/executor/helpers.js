import {abiUniV2Pair, abiErc20, abiUniV2Router} from "./abis";
import {batchCall, formatFixed, initContract} from "../executor"

export const getTokensByLp = async (lpAddr, lpAmount, provider) => {
    var calls = [
        [lpAddr, abiUniV2Pair, "getReserves", []],
        [lpAddr, abiUniV2Pair, "token0", []],
        [lpAddr, abiUniV2Pair, "token1", []],
        [lpAddr, abiUniV2Pair, "totalSupply", []],
    ]
    const [reserves, token0, token1, totalSupply] = await batchCall(calls, provider);
    const token0Amount = lpAmount.mul(reserves[0]).div(totalSupply);
    const token1Amount = lpAmount.mul(reserves[1]).div(totalSupply);
    calls = [
        [token0, abiErc20, "symbol", []],
        [token0, abiErc20, "decimals", []],
        [token1, abiErc20, "symbol", []],
        [token1, abiErc20, "decimals", []],
    ]
    const [token0Symbol, token0Dec, token1Symbol, token1Dec] = await batchCall(calls, provider);
    return [
        token0, token1, 
        token0Amount, token1Amount, 
        token0Symbol, token1Symbol, 
        formatFixed(token0Amount, token0Dec, 2),
        formatFixed(token1Amount, token1Dec, 2)
    ];
}

export const getTokenValue = async (amt, path, router, provider) => {
    const routerContract = initContract(router, abiUniV2Router, provider);
    let results = await routerContract.getAmountsOut(amt, path)
    return results[results.length - 1];
}