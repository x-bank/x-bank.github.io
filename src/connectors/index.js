import {
    WagmiConfig,
    createClient,
    defaultChains,
    configureChains,
    useAccount,
    useConnect,
    useDisconnect,
    useEnsAvatar,
    useEnsName,
} from 'wagmi'

import { useContext, useEffect } from "react"

import { InjectedConnector } from 'wagmi/connectors/injected'
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { getDefaultProvider } from 'ethers'

function shortAddr(addr) {
    return addr.substring(0, 6) + "..." + addr.substring(addr.length - 4);
}

export const client = createClient({
    autoConnect: true,
    provider: getDefaultProvider(),
})

export function Profile({setIsConnected, setAddress}) {
    const { address, isConnected } = useAccount({
        onConnect({ address, connector, isReconnected }) {
            setIsConnected(true);
            setAddress(address);
        },
        onDisconnect() {
            setIsConnected(false);
            setAddress("");
        }
    })
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    })
    const { disconnect } = useDisconnect()

    if (isConnected) {
        return (
            <div className='flex space-x-1'>
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
