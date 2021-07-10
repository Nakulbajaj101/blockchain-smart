import React, {Component} from 'react';
import {Form, Input, Message, Button} from 'semantic-ui-react';
import Campaign from '../blockchain/campaign';
import web3 from '../blockchain/web3';
import {Router} from '../routes';

class ContributeForm extends Component{
  state = {
    value: '',
    errorMessage: "",
    loading: false

  }

  onSubmit = async event => {
    this.setState({loading:true, errorMessage:""});
    event.preventDefault();
    const campaign = Campaign(this.props.address);

    try{
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, 'ether')
      });
      Router.replaceRoute(`/campaigns/${this.props.address}`)
    }

    catch(err){
      this.setState({errorMessage:err.message});
    }
    this.setState({loading: false, value: ""});
  }
  render(){
    return (
      <Form onSubmit={this.onSubmit} error={this.state.errorMessage.length > 0}>
      <Form.Field>
      <label>Amount to Contribute</label>
      <Input
      label='ether'
      value = {this.state.value}
      labelPosition="right"
      onChange={event => this.setState({value: event.target.value})}
      />
      </Form.Field>
      <Button primary loading={this.state.loading}>
      Contribute!
      </Button>
      <Message error header="Oops!" content ={this.state.errorMessage} />
      </Form>
    );
  }
}

export default ContributeForm;
