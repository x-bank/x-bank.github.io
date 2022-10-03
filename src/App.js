import { useEffect, useState, createElement } from 'react'
import { WagmiConfig } from "wagmi"
import { client, Profile } from "./connectors"
import { Routes, Route, Outlet, useParams, Link } from "react-router-dom";

import { useSnapshot } from 'valtio'

import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import { Label } from '@fluentui/react/lib/Label';

import { ProjectCard } from "./widgets/projectCard"

import biswap from "./projects/biswap";
import pancake from "./projects/pancake";
import alpaca from "./projects/alpaca";
import venus from "./projects/venus"
import curvefi from "./projects/curvefi"

import { addressStore } from "./store"

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
        className='flex justify-center items-center w-full bg-slate-300 rounded-md p-10 uppercase text-base font-bold'
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

function Project() {
  const params = useParams();
  let addressStoreView = useSnapshot(addressStore);

  if (!projects[params.chainId]) {
    return <div>x</div>
  }
  if (!projects[params.chainId][params.name]) {
    return <div>y</div>
  }
  return <div>
    {createElement(projects[params.chainId][params.name].View, { address: addressStoreView.address })}
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