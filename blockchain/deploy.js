#// TODO: need to get secrets and infura project from computer or somewhere else. Should not be hardcoded 
const HdWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory');

const provider = new HdWalletProvider(
  'sponsor sock toe index happy minute forget sniff donate barely salute have',
  'https://rinkeby.infura.io/v3/e3d893c690024e3083610a4fd0927dd8'
);

const web3 = new Web3(provider);

const deploy = async() => {
  const accounts = await web3.eth.getAccounts();

  console.log('account that will be used is: ', accounts[0])

  const result = await new web3.eth.Contract(JSON.parse(compiledFactory['interface']))
  .deploy({data: compiledFactory['bytecode']})
  .send({from: accounts[0], gas: '1000000'});

  console.log('Contract deployed to ', result.options.address);
}

deploy();
