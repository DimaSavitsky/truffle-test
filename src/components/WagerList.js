import React, { Component } from 'react'
import { Button } from 'react-bootstrap';
import WagerItem from './WagerItem';
import WagerContract from '../../build/contracts/Wager.json'

class WagerList extends Component {
  constructor(props) {
    super(props);
    this.processCreation = this.processCreation.bind(this);
    this.processContractTest = this.processContractTest.bind(this);
    this.state = {
      wagerCountString: 'Yet unknown',
      wagers: [],
      testValue: 'Yet unknown'
    }
  }

  componentWillMount() {
    this.updateWagers();
    this.updateTestNumber();
  }

  updateWagers() {
    let factory = this.props.factoryInstance;
    factory.getWagersCount().then((result) => {
      this.setState({ wagerCountString: result.toString() });

      let wagerCount = result.toNumber(); // toInteger
      if (wagerCount > this.state.wagers.length) {
        for(var index = this.state.wagers.length; index < wagerCount; index++) {
          factory.wagers(index).then((result) => {
            this.setState(previousState => ({
              wagers: [...previousState.wagers, result ]
            }));
          });
        }
      }
    });
  }

  updateTestNumber() {
    this.props.factoryInstance.testValue().then((result) => {
      this.setState({ testValue: result.toString() })
    });
  }

  processContractTest() {
    this.props.factoryInstance.incrementTestValue({
      from: window.web3.eth.defaultAccount,
      gas: 5000000
    }).then((result) => {
      if (result.tx) {
        this.updateTestNumber();
      }
    });
  }

  processCreation() {
    // 1 Finney value , 10 GWei gas
    this.props.factoryInstance.offerWager({
      value: 1000000000000000,
      from: window.web3.eth.defaultAccount,
      gas: 5000000,
      gas_price: 5
    }).then((result) => {
      if (result.tx) {
        this.updateWagers()
      }
    })
  }

  render() {
    const contract = require('truffle-contract');
    const wager = contract(WagerContract);
    wager.setProvider(window.web3.currentProvider);

    let wagerListItems = this.state.wagers.map((wagerAddress) =>
      <li key={wagerAddress}><WagerItem instance={wager.at(wagerAddress)} /></li>
    );

    return(
      <div>
        <div>
          <p>Test value: {this.state.testValue}</p>
          <Button bsStyle="warning" onClick={this.processContractTest}>Just increment test value</Button>
        </div>

        <h1>Total Wagers count: {this.state.wagerCountString}</h1>
        <ul>
          { wagerListItems }
        </ul>
        <div>
          <Button bsStyle="success" onClick={this.processCreation}>Make a Wager of 1 Finney</Button>
        </div>
      </div>
    )
  }
}

export default WagerList
