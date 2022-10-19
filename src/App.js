import { useEffect, useState, createElement } from 'react'
import { Routes, Route, Outlet, useParams, Link } from "react-router-dom";

import {CHAIN_BSC} from "./connectors"

import biswap from "./projects/biswap";
import pancake from "./projects/pancake";
import alpaca from "./projects/alpaca";
import venus from "./projects/venus"
import curvefi from "./projects/curvefi"

import { ConnectButton } from '@rainbow-me/rainbowkit';

import {
  WagmiConfig,
  createClient,
  defaultChains,
  configureChains,
  chain,
  useAccount,
} from 'wagmi'

import { publicProvider } from 'wagmi/providers/public';


import {
  getDefaultWallets,
  RainbowKitProvider,
  lightTheme,
} from '@rainbow-me/rainbowkit';

const { chains, provider } = configureChains(
  [chain.mainnet, CHAIN_BSC, chain.polygon, chain.optimism, chain.arbitrum],
  [publicProvider()])

const { connectors } = getDefaultWallets({
  appName: 'Uli Bank',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})


const projects = {
  "56": {
    "venus": venus,
    "pancake": pancake,
    "biswap": biswap,
    "alpaca": alpaca,
  },
  "1": {
    "curve": curvefi
  }
}

function Home() {
  const renderSubProjects = (chainId, ps) => {
    let cards = []
    for (const name in ps) {
      cards.push(<div
        className='flex justify-center items-center w-full bg-slate-300 text-black rounded-md p-10 uppercase text-base font-bold'
      >
        <Link to={"projects/" + chainId + "/" + name}>{name}</Link>
      </div>)
    }
    return cards
  }

  const renderProjects = () => {
    let items = []
    for (const chainId in projects) {
      items.push(<div className='grid grid-cols-6 gap-4 mb-10'>
        {renderSubProjects(chainId, projects[chainId])}
      </div>)
    }
    return <div className='w-full'>
      {items}
    </div>
  }

  return <div>{renderProjects()}</div>
}

function Layout() {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}
        theme={lightTheme({
          accentColor: "#eee",
          accentColorForeground: "#25292E"
        })}>
        <div>
          <div>
            <div className='ml-auto mr-auto w-11/12 '>
              <div className='flex flex-row-reverse mb-6 mt-4'>
                <ConnectButton />
              </div>
              <Outlet />
            </div>
          </div>
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

function Project() {
  const params = useParams();
  const {address} = useAccount()

  if (!projects[params.chainId]) {
    return null
  }
  if (!projects[params.chainId][params.name]) {
    return null
  }
  return <div>
    {createElement(projects[params.chainId][params.name].View, { address: address })}
  </div>
}

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path="projects/:chainId/:name"
            element={<Project />}
          />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </div>
  );
}