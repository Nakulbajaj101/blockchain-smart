const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const provider = ganache.provider()
const web3 = new Web3(provider);

const compiledFactory = require('../blockchain/build/CampaignFactory');
const compiledCampaign = require('../blockchain/build/Campaign');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  console.log(accounts);

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory['interface']))
  .deploy({data: compiledFactory['bytecode']})
  .send({from: accounts[0], gas: '1000000'});

  await factory.methods.deployCampaign('100').send({
    from: accounts[0],
    gas: '1000000'
  });

  const addresses = await factory.methods.getDeployedCampaigns().call();
  campaignAddress = addresses[0];
  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );
});

describe('Campaigns', () => {
  it('deploys a factory and a campaign', () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it('marks caller as the campaign manager', async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it('allows people to contribute money and mark them as approver', async () => {
    await campaign.methods.contribute().send({
      value: '101',
      from: accounts[1],
      gas: '1000000'
    });
    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributor);
  });

  it('requires a minimum contribution' , async () => {
    try{
      await campaign.methods.contribute().send({
        value: '5',
        from: accounts[1],
        gas: '1000000'
      });
      assert(false);
    }catch (err){
      assert(err);
    }
  });

  it('allows a manager to make a payment request', async () => {
    await campaign.methods.createRequest(
      'Buy batteries', '100', accounts[1])
      .send({
        from: accounts[0],
        gas: '1000000'
      });
    const request = await campaign.methods.requests(0).call();
    assert.equal(request.recipient, accounts[1]);
    assert.equal(request.description, 'Buy batteries');
  });

  it('processes requests',  async () => {
    await campaign.methods.contribute().send({
      value: web3.utils.toWei('6','ether'),
      from: accounts[1],
      gas: 1000000,
    });

    await campaign.methods.createRequest(
      'Buy electrical parts', web3.utils.toWei('5','ether'), accounts[1])
      .send({
        from: accounts[0],
        gas: '1000000'
      });

    await campaign.methods.approveRequest(0).send({
      from: accounts[1],
      gas: '1000000'
    });

    await campaign.methods.finaliseRequest(0).send({
      from: accounts[0],
      gas: '1000000'
    });

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance,'ether');
    balance = parseFloat(balance);
    console.log(balance);
    assert(balance > 97);
  });

});
