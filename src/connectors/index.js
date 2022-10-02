import {
    WagmiConfig,
    createClient,
    defaultChains,
    configureChains,
    useAccount,
    useConnect,
    useDisconnect,
    useNetwork,
    usePrepareContractWrite,
    useContractWrite,
    useSwitchNetwork,
} from 'wagmi'

import { useContext, useEffect, useState } from "react"

import { InjectedConnector } from 'wagmi/connectors/injected'
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { getDefaultProvider } from 'ethers'

import { useSnapshot } from 'valtio'
import { addressStore } from "../store"

function shortAddr(addr) {
    return addr.substring(0, 6) + "..." + addr.substring(addr.length - 4);
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
        onSuccess(data) {
            if (write && data.id === params.chainId) {
                write();
            }
        }
    })

    useEffect(() => {
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

export const client = createClient({
    autoConnect: true,
    provider: getDefaultProvider(),
})

export function Profile() {
    const { address, isConnected } = useAccount()
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    })

    useEffect(() => {
        console.log(isConnected, address)
        if (address) {
            addressStore.address = address
        }
    }, [address])

    const { disconnect } = useDisconnect()

    if (isConnected) {
        return (
            <div className='flex'>
                <PrimaryButton className='bg-sky-500' onClick={disconnect} text={shortAddr(address)} checked={true}></PrimaryButton>
            </div>
        )
    }

    return (
        <div>
            <PrimaryButton
                allowDisabledFocus
                className='bg-sky-500'
                onClick={() => connect()}
            >
                Connect
            </PrimaryButton>
        </div>
    )
}
