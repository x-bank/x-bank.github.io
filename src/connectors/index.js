import {
    useNetwork,
    usePrepareContractWrite,
    useContractWrite,
    useSwitchNetwork,
    useWaitForTransaction,
} from 'wagmi'

import { useEffect, useState } from "react"

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
        // default: 'http://127.0.0.1:8545',
    },
    blockExplorers: {
        default: { name: 'BSC', url: 'https://bscscan.com' },
    },
    testnet: false,
}

export function useCustomContractWrite(params, onConfirmed = undefined) {
    let [args, execute] = useState(null)
    let [confirmed, setConfirmed] = useState(false)

    const { config } = usePrepareContractWrite({
        ...params,
        args: args,
        enabled: args !== null
    })
    const { write, data: writeData } = useContractWrite({
        ...config,
        onSettled(data, error) {
            execute(null)
        },
    })

    const { chain } = useNetwork()

    const { switchNetwork } = useSwitchNetwork({
        throwForSwitchChainNotSupported: true,
    })

    // const waitForTransaction = useWaitForTransaction({
    //     wait: writeData?.wait,
    //     confirmations: 1,
    //     onSuccess: function (data) {
    //         console.log(data)
    //         if (onConfirmed) {
    //             setConfirmed(true)
    //         }
    //     }
    // })

    useEffect(() => {
        if (args !== null && chain.id) {
            if (chain.id !== params.chainId) {
                execute(null)
                switchNetwork(params.chainId)
            } else if (write) {
                write();
            }
        }
    }, [args])

    useEffect(() => {
        if (!confirmed) {
            return
        }
        let runConfirmed = async () => {
            await onConfirmed()
        }
        runConfirmed()
    }, [confirmed])

    return execute;
}
