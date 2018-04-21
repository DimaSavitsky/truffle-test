import React, { Component } from 'react'
import WagerList from './WagerList'

class Deployed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      owner: 'Unknown',
    }
  }

  componentWillMount() {
    this.props.factoryInstance.factoryOwner().then((result) => {
      this.setState({ owner: result })
    });
  }

  render() {
    return(
      <div>
        <h1>Good to Go!</h1>
        <p>The currently deployed wager factory instance is: {this.props.factoryInstance.address}</p>
        <p>A trusted owner and judge for the contract is: {this.state.owner}</p>
        <div className='wager-list'>
          <WagerList factoryInstance={this.props.factoryInstance}/>
        </div>
      </div>
    )
  }
}

export default Deployed
