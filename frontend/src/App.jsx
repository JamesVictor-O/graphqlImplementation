import React from "react";
import { RouterProvider } from "react-router-dom";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { createBrowserRouter, createRoutesFromElements,Route } from "react-router-dom";
import LandingPage from "./page/LandingPage";
import { sepolia} from 'wagmi/chains';
import { WagmiProvider} from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

function App() {
    const client = new ApolloClient({
      uri: 'https://api.studio.thegraph.com/query/106833/tokenluncher/version/latest',
      cache: new InMemoryCache(),
    });
  const queryClient = new QueryClient();
  const config = getDefaultConfig({
    appName: "My RainbowKit App", 
    projectId: "YOUR_PROJECT_ID",
    chains: [sepolia],
  });

  const router=createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<LandingPage/>}>
            <Route index element={<LandingPage/>}/>
        </Route>
    )
)
  return (
    <>
      
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            < ApolloProvider client={client}>
            <RouterProvider router={router} />
            </ ApolloProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  );
}

export default App;