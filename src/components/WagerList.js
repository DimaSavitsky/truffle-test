import React, { Component } from 'react'
import { Button } from 'react-bootstrap';

class WagerList extends Component {
  constructor(props) {
    super(props)
    this.processCreation = this.processCreation.bind(this);
    this.processContractTest = this.processContractTest.bind(this);
    this.state = {
      wagerCountString: 'Yet unknown',
      testValue: 'Yet unknown'
    }
  }

  componentWillMount() {
   this.props.factoryInstance.getWagersCount().then((result) => {
     this.setState({ wagerCountString: result.toString() })
    });

    this.props.factoryInstance.testValue().then((result) => {
      this.setState({ testValue: result.toString() })
     });
  }

  processContractTest() {
    this.props.factoryInstance.incrementTestValue({
      from: window.web3.eth.defaultAccount,
      gas: 5000000
    }).then((result) => {
      console.log(result);
    });
  }

  processCreation() {
    // 1 Finney value , 10 GWei gas
    this.props.factoryInstance.offerWager({
      value: 1000000000000000,
      from: window.web3.eth.defaultAccount,
      gas: 5000000,
      gas_price: 5
    }).then((error, result) => {
      console.log('Transaction Sent')
      console.log(result)
    })
  }

  render() {
    return(
      <div>
        <h1>Total Wagers count: {this.state.wagerCountString}</h1>
        <p>Test value: {this.state.testValue}</p>
        <div>
          <Button bsStyle="warning" onClick={this.processContractTest}>Just increment test value</Button>
          <Button bsStyle="success" onClick={this.processCreation}>Make a Wager of 1 Finney</Button>
        </div>
      </div>
    )
  }
}

export default WagerList
