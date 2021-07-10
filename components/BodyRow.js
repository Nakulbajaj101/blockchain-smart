import React, {Component} from 'react';
import {Table, Button, Message} from 'semantic-ui-react';
import web3 from '../blockchain/web3';
import Campaign from '../blockchain/campaign';

class BodyRow extends Component{

  state = {
    loadingApprove:false,
    loadingFinalize:false,
    errorMessage:'',
  }

  onApprove = async() => {
    this.setState({loadingApprove:true,errorMessage:""});
    try{
      const campaign = Campaign(this.props.address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.approveRequest(this.props.id).send({from:accounts[0]});
    }
    catch(err){
      this.setState({errorMessage:err.message});

    }
    this.setState({loadingApprove:false});
  }

  onFinalize = async() => {
    this.setState({loadingFinalize:true,errorMessage:""});
    try{
      const campaign = Campaign(this.props.address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.finaliseRequest(this.props.id).send({from:accounts[0]});
    }
    catch(err){
      this.setState({errorMessage:err.message});

    }
    this.setState({loadingFinalize:false});
  }
  render(){
    const {Row, Cell} = Table;
    const readyToFinalize = this.props.request.approvalCount > this.props.approversCount/2;

    return (
      <Row disabled = {this.props.request.complete} positive = {!this.props.request.complete && readyToFinalize}>
      <Cell>{this.props.id + 1}</Cell>
      <Cell>{this.props.request.description}</Cell>
      <Cell>{web3.utils.fromWei(this.props.request.value, 'ether')}</Cell>
      <Cell>{this.props.request.recipient}</Cell>
      <Cell>{this.props.request.approvalCount}/{this.props.approversCount}</Cell>
      <Cell>
      {this.props.request.complete  ? null :
      (<Button color = "green" basic onClick = {this.onApprove} loading = {this.state.loadingApprove}>Approve</Button>)
      }
      </Cell>
      <Cell>
      {(this.props.request.complete && this.state.errorMessage.length < 1 ) ? null :
        this.state.errorMessage.length > 0 ?
        (
          <div><Button color = "blue" basic onClick = {this.onFinalize} loading = {this.state.loadingFinalize}>Finalize</Button>
          <Message error header="Oops!" content ={this.state.errorMessage} /></div>
        )
        :
      (<Button color = "blue" basic onClick = {this.onFinalize} loading = {this.state.loadingFinalize}>Finalize</Button>)
      }
      </Cell>
      </Row>

    )
  }
}

export default BodyRow;
