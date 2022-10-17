import {
    useNetwork,
    usePrepareContractWrite,
    useContractWrite,
    useSwitchNetwork,
    chain,
} from 'wagmi'

import { useContext, useEffect, useState } from "react"

function shortAddr(addr) {
    return addr.substring(0, 6) + "..." + addr.substring(addr.length - 4);
}

export const CHAIN_BSC = {
    id: 56,
    name: 'Binance',
    network: 'bsc',
    iconUrl: "https://bscscan.com/images/svg/brands/bnb.svg",
    nativeCurrency: {
        decimals: 18,
        name: 'BNB',
        symbol: 'BNB',
    },
    rpcUrls: {
        default: 'https://bsc-dataseed3.ninicoin.io',
    },
    blockExplorers: {
        default: { name: 'BSC', url: 'https://bscscan.com' },
    },
    testnet: false,
}

export function useCustomContractWrite(params) {
    let [args, execute] = useState(null);

    const { config } = usePrepareContractWrite({
        ...params,
        args: args,
        enabled: args !== null
    })
    const { write } = useContractWrite(config)

    const { chain } = useNetwork()

    const { switchNetwork } = useSwitchNetwork({
        throwForSwitchChainNotSupported: true,
        onSettled(data, err) {
            execute(null)
        }
    })

    useEffect(() => {
        console.log(args);
        if (args !== null && chain.id) {
            if (chain.id !== params.chainId) {
                switchNetwork(params.chainId)
            } else if (write) {
                write();
            }
        }
        return () => {
            execute(null);
        }
    }, [args])
    return execute;
}
