import { useEffect, useState, createElement } from 'react'
import { Routes, Route, Outlet, useParams, Link } from "react-router-dom";
import { useSnapshot } from 'valtio'

import { Loader } from 'semantic-ui-react'

import { useInterval } from 'react-use';
import { assetStore } from "./store"

import { CHAIN_BSC } from "./connectors"

import biswap from "./projects/biswap";
import pancake from "./projects/pancake";
import alpaca from "./projects/alpaca";
import wombat from "./projects/wombat";
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


const projects = [
  pancake,
  biswap,
  alpaca,
  wombat,
]

function _keyOfProject(p) {
  return p.chainId + "|" + p.name
}

function Home() {
  const { address } = useAccount()
  const snap = useSnapshot(assetStore)

  const [refreshTicker, setRefreshTicker] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  useInterval(() => {
    setRefreshTicker(refreshTicker + 1)
  }, 30000)

  useEffect(() => {
    let run = async () => {
      if (address) {
        await refreshAll(address)
      }
    }
    run();
  }, [refreshTicker])

  const refreshAll = async (addr) => {
    let promises = projects.map((p) => {
      return p.refreshState(addr)
    })
    let results = await Promise.all(promises)
    for (let i = 0; i < projects.length; i++) {
      let key = _keyOfProject(projects[i])
      assetStore[key] = results[i]
    }
  }

  useEffect(() => {
    let run = async () => {
      if (address) {
        for (let project of projects) {
          let key = _keyOfProject(project)
          assetStore[key] = undefined
        }
        setRefreshing(true)
        await refreshAll(address)
        setRefreshing(false)
      }
    }
    run();
  }, [address])

  const renderProjects = () => {
    let items = []
    for (const project of projects) {
      let key = _keyOfProject(project)
      if (snap[key] && snap[key].length > 0) {
        items.push(
          <ProjectCard
            key={key}
            name={project.name}
            hintView={createElement(project.HintView)}
          >
            {createElement(project.View, { address, state: snap[key] })}
          </ProjectCard>
        )
      }
    }
    return <div className='w-full'>
      <div className='flex flex-row-reverse mb-2 mr-1'>
        <Loader active={refreshing} inline size='mini'></Loader>
      </div>
      {items}
    </div>
  }

  return <div>{renderProjects()}</div>
}

function Layout() {
  return <WagmiConfig client={wagmiClient}>
    <RainbowKitProvider chains={chains}
      theme={lightTheme({
        accentColor: "rgb(134 239 172)",
        accentColorForeground: "black",
        borderRadius: "medium",
        fontStack: "system"
      })}>
      <div>
        <div>
          <div className='mt-1 ml-auto mr-auto w-11/12 lg:w-9/12'>
            <div className='flex flex-row-reverse mb-6 mt-3'>
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