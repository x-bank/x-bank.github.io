import { useEffect, useState, createElement } from 'react'
import { Routes, Route, Outlet, useParams, Link } from "react-router-dom";

import { CHAIN_BSC } from "./connectors"

import biswap from "./projects/biswap";
import pancake from "./projects/pancake";
import alpaca from "./projects/alpaca";
import venus from "./projects/venus"
import curvefi from "./projects/curvefi"

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ProjectCard } from "./widgets/projectCard"

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
  appName: 'XBank',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})


const _projects = {
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

const projects = [
  {
    name: "Pancake",
    view: pancake.View
  }
]

function Home() {
  const { address } = useAccount()

  const renderProjects = () => {
    let items = []
    for (const project of projects) {
      items.push(
        <ProjectCard
          name={project.name}
        >
          {createElement(project.view, { address: address })}
        </ProjectCard>
      )
    }
    return <div className='w-full'>
      {items}
    </div>
  }

  return <div>{renderProjects()}</div>
}

function Layout() {
  return <WagmiConfig client={wagmiClient}>
    <RainbowKitProvider chains={chains}
      theme={lightTheme({
        accentColor: "#2185d0",
        // accentColorForeground: "#25292E",
        borderRadius: "medium",
        fontStack: "system"
      })}>
      <div>
        <div>
          <div className='ml-auto mr-auto w-11/12 '>
            <div className='flex flex-row-reverse mb-6 mt-4'>
              <ConnectButton accountStatus="address" />
            </div>
            <Outlet />
          </div>
        </div>
      </div>
    </RainbowKitProvider>
  </WagmiConfig>
}

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </div>
  );
}