import { gql } from "@apollo/client";


export const GET_MY_ENTITIES = gql`
  query {
    erc20TokenDeployeds(first: 5) {
      id
      erc20Contract
      name
      symbol
    }
    erc721TokenDeployeds(first: 5) {
      id
      erc721Contract
      name
      symbol
    }
  }
`;
