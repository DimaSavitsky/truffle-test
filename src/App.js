import React, { Component } from 'react'
import WagerFactoryContract from '../build/contracts/WagerFactory.json'
import getWeb3 from './utils/getWeb3'

import Empty from './components/Empty'
import Deployed from './components/Deployed'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      wagerFactoryInstance: null,
      web3: null
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    const contract = require('truffle-contract')
    const wagerFactory = contract(WagerFactoryContract)
    wagerFactory.setProvider(this.state.web3.currentProvider)

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      //console.log(accounts)
      wagerFactory.deployed().then((instance) => {
        this.setState({ wagerFactoryInstance: instance })
      })
    })
  }

  render() {
    var stuffToRender
    if (this.state.wagerFactoryInstance) {
      stuffToRender = <Deployed factoryInstance={this.state.wagerFactoryInstance}/>
    } else {
      stuffToRender = <Empty />
    }

    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Truffle Box</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              { stuffToRender }
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
