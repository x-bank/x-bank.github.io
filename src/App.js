import { useEffect, useState, createElement } from 'react'
import { WagmiConfig } from "wagmi"
import { client, Profile } from "./connectors"

import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import { Label } from '@fluentui/react/lib/Label';

import { ProjectCard } from "./widgets/projectCard"

import biswap from "./projects/biswap";
import pancake from "./projects/pancake";
import alpaca from "./projects/alpaca";

import { assetStore } from "./store"
import { useSnapshot } from 'valtio'

const projects = [pancake, biswap, alpaca]

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  let assetStoreView = useSnapshot(assetStore);

  useEffect(() => {
    if (address.length === 0) {
      return;
    }
    let run = async () => {
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
    run();
  }, [address])

  const renderProjects = () => {
    if (address.length === 0) {
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

  return (
    <WagmiConfig client={client}>
      <div>
        <div>
          <div className='ml-auto mr-auto w-11/12 '>
            <div className='flex flex-row-reverse mb-4 mt-4'>
              <Profile className="w-10"
                setIsConnected={setIsConnected}
                setAddress={setAddress}
              ></Profile>
            </div>
            {
              isLoading ? <div className='w-full flex items-center justify-center'>
                <div className='mt-10'>
                  <Label>Fetching datas</Label>
                  <Spinner size={SpinnerSize.large} />
                </div>
              </div> : renderProjects()
            }
          </div>
        </div>
      </div>
    </WagmiConfig>
  );
}

export default App;
