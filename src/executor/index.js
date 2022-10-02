import { ethers } from "ethers";
import { formatFixed as _formatFixed, parseFixed as _parseFixed } from '@ethersproject/bignumber'

export const formatFixed = (val, _decimals, rounds = -1) => {
  let x = _formatFixed(val, _decimals);
  if (rounds > 0) {
    return parseFloat(parseFloat(x).toFixed(rounds));
  } else {
    return parseFloat(x);
  }
}
export const parseFixed = _parseFixed;

const buildinChainUrl = {
  "eth": "https://eth-mainnet.gateway.pokt.network/v1/5f3453978e354ab992c4da79",
  "bsc": "https://bsc-dataseed.binance.org/",
  "polygon": "https://polygon-rpc.com/",
  "ftm": "https://rpc.ftm.tools/",
  "avax": "https://api.avax.network/ext/bc/C/rpc",
}

export const providerFromUrl = (url) => {
  return new ethers.providers.JsonRpcProvider(url);
}

export const providerFromChain = (chainName) => {
  return providerFromUrl(buildinChainUrl[chainName.toLowerCase()]);
}

export const providerFromStr = (s) => {
  let c = buildinChainUrl[s.toLowerCase()];
  if (c) {
    return providerFromUrl(c)
  } else {
    return providerFromUrl(s);
  }
}

export const initContract = (address, abi, provider) => {
  return new ethers.Contract(address, abi, provider);
}

export const E18 = ethers.BigNumber.from('1000000000000000000'); // 1e18
export const ZERO = ethers.BigNumber.from(0);

const multiCallAbi = new ethers.utils.Interface([
  'function aggregate3(tuple(address, bool, bytes)[] memory) public returns (tuple(bool, bytes)[] memory)',
]);

export const batchCall = async (calls, provider, aggrAddr="0xcA11bde05977b3631167028862bE2a173976CA11") => {
  let requests = calls.map((call) => {
    let [_address, _abiArray, _func, _params] = call;
    let _abi = new ethers.utils.Interface(_abiArray);
    return [_address, true, _abi.encodeFunctionData(_func, _params)];
  });
  let rawResultsHex = await provider.call({
    to: aggrAddr,
    data: multiCallAbi.encodeFunctionData("aggregate3", [requests])
  });
  let rawResults = ethers.utils.defaultAbiCoder.decode(["tuple(bool, bytes)[]"], rawResultsHex)[0];
  let results = [];
  for (var i = 0; i < calls.length; i++) {
    let [, _abiArray, _func, ] = calls[i];
    let _abi = new ethers.utils.Interface(_abiArray);
    let [_success, _rawResult] = rawResults[i];
    if (_success) {
      let outputs = _abi.getFunction(_func).outputs;
      try {
        let res = ethers.utils.defaultAbiCoder.decode(outputs, _rawResult);
        if (outputs.length === 1) {
          res = res[0];
        }
        results.push(res);
      } catch {
        results.push(null);
      }
    } else {
      results.push(null);
    }
  }
  return results;
}
