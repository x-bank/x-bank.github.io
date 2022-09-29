export const abiErc20 = [
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function name() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address, uint256) returns (bool)",
  "function allowance(address, address) view returns (uint256)",
  "function approve(address, uint256) returns (bool)",
  "function transferFrom(address, address, uint256) returns (bool)"
]

export const abiUniV2Factory = [
  "function getPair(address, address) view returns (address)",
]

export const abiUniV2Pair = [
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint)",
  "function balanceOf(address) view returns (uint)",
  "function allowance(address, address) view returns (uint)",
  "function factory() view returns (address)",
  "function token0() view returns (address)",
  "function token1() view returns (address)",
  "function getReserves() view returns (uint112, uint112, uint32)",
]

export const abiUniV2Router = [
  "function getAmountOut(uint, uint, uint) view returns (uint)",
  "function getAmountIn(uint, uint, uint) view returns (uint)",
  'function getAmountsIn(uint, address[] memory) view returns (uint[] memory)',
  'function getAmountsOut(uint, address[]) view returns (uint256[])',
];