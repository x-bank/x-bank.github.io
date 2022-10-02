import { useEffect, useState, createElement } from 'react'
import { WagmiConfig } from "wagmi"
import { client, Profile } from "./connectors"
import { Routes, Route, Outlet, useParams } from "react-router-dom";

import { useSnapshot } from 'valtio'

import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import { Label } from '@fluentui/react/lib/Label';

import { ProjectCard } from "./widgets/projectCard"

import biswap from "./projects/biswap";
import pancake from "./projects/pancake";
import alpaca from "./projects/alpaca";

import { assetStore, addressStore } from "./store"

const projects = [pancake, biswap, alpaca]

function Home() {
  const [isLoading, setIsLoading] = useState(false);

  let assetStoreView = useSnapshot(assetStore);
  let addressStoreView = useSnapshot(addressStore);

  useEffect(() => {
    let run = async (address) => {
      if (!address) {
        return;
      }
      const loadAssetCalls = projects.map((p) => p.loadAsset(address))
      setIsLoading(true)
      let results = await Promise.all(loadAssetCalls);
      for (var i = 0; i < results.length; i++) {
        let project = projects[i]
        let key = project.chainId + "_" + project.name
        assetStore[key] = results[i]
      }
      setIsLoading(false)
    }
    run(addressStoreView.address);
  }, [addressStoreView.address])

  const renderProjects = (address) => {
    if (!address || address.length === 0) {
      return null;
    }

    let cards = []
    for (let project of projects) {
      let key = project.chainId + "_" + project.name
      if (assetStoreView[key] && assetStoreView[key].length > 0) {
        cards.push(
          <ProjectCard name={project.name} url={project.url} key={key}>
            {createElement(project.View, { address: address, assets: assetStoreView[key] })}
          </ProjectCard>
        )
      }
    }
    if (cards.length === 0) {
      cards.push(<div className='flex items-center justify-center'>
        <div>No Project Found!</div>
      </div>)
    }

    return <div className='w-full flex flex-col space-y-4 text-sm font-mono'>
      {cards}
    </div>
  }

  if (isLoading) {
    return <div className='w-full flex items-center justify-center'>
      <div className='mt-10'>
        <Label>Fetching datas</Label>
        <Spinner size={SpinnerSize.large} />
      </div>
    </div>
  } else {
    return renderProjects(addressStoreView.address)
  }
}

function Layout() {
  return (
    <WagmiConfig client={client}>
      <div>
        <div>
          <div className='ml-auto mr-auto w-11/12 '>
            <div className='flex flex-row-reverse mb-4 mt-4'>
              <Profile className="w-10"></Profile>
            </div>
            <Outlet />
          </div>
        </div>
      </div>
    </WagmiConfig>
  );
}

function About() {
  const params = useParams();
  return <div>{params.chainId} {params.name}</div>
}

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path="projects/:chainId/:name"
            element={<About />}
          />

          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </div>
  );
}