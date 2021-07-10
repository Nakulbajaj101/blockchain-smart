import Web3 from 'web3';


let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined'){
  //We are in browser and metamask is running or our server can render metamask
  web3 = new Web3(window.web3.currentProvider);
} else {
  const provider = new Web3.providers.HttpProvider(
    'https://rinkeby.infura.io/v3/e3d893c690024e3083610a4fd0927dd8',
  );
  web3 = new Web3(provider);
}

export default web3;
