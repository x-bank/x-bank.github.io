import { useEffect, useState } from 'react'
import { WagmiConfig } from "wagmi"
import { client, Profile } from "./connectors"

import { ProjectCard } from "./widgets/projectCard"
import { BiswapCard } from "./projects/biswap";
import { PancakeCard } from "./projects/pancake";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState("");

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
              address.length > 0 ?
                <div className='w-full flex flex-col space-y-4 text-sm font-mono'>
                  <ProjectCard name="Biswap" url="https://exchange.biswap.org/#/swap">
                    <BiswapCard address={address}></BiswapCard>
                  </ProjectCard>
                  <ProjectCard name="Pancake" url="https://pancakeswap.finance/swap">
                    <PancakeCard address={address}></PancakeCard>
                  </ProjectCard>
                </div>
                : null
            }
          </div>
        </div>
      </div>
    </WagmiConfig>
  );
}

export default App;
