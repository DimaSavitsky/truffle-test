import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

class WagerItem extends Component {
    constructor(props) {
        super(props);

        this.processAccepting = this.processAccepting.bind(this);
        this.processResolving = this.processResolving.bind(this);

        this.state = {
            amount: 'Yet Unknown',
            judgeAddress: 'Yet Unknown',
            initiatorAddress: 'Yet Unknown',
            acceptorAddress: 'Yet Unknown',
            winnerAddress: 'Yet unknown',
            pending: true,
            resolved: false
        };
    }

    componentWillMount() {
        this.props.instance.initiator().then((result) => {
            this.setState({ initiatorAddress: result })
        });

        this.props.instance.judge().then((result) => {
            this.setState({ judgeAddress: result.toString() })
        });

        this.props.instance.amount().then((result) => {
            this.setState({ amount: result.toString() })
        });

        this.updateStatus();
    }

    updateStatus() {
        this.props.instance.acceptor().then((result) => {
            if ( result !== '0x0000000000000000000000000000000000000000') {
                this.setState({ acceptorAddress: result })
            }
        });

        this.props.instance.winner().then((result) => {
            if ( result !== '0x0000000000000000000000000000000000000000') {
                this.setState({ winnerAddress: result })
            }
        });

        this.props.instance.pending().then((result) => {
            this.setState({ pending: result })
        });

        this.props.instance.resolved().then((result) => {
            this.setState({ resolved: result })
        });
    }

    processAccepting() {
        this.props.instance.takeWager({
            value: this.state.amount,
            from: window.web3.eth.defaultAccount,
            gas: 5000000,
            gas_price: 5
        }).then((result) => {
            if (result.tx) {
                this.updateStatus()
            }
        })
    }

    processResolving() {
        this.props.instance.pickWinner({
            value: 200000,
            from: window.web3.eth.defaultAccount,
            gas: 5000000,
            gas_price: 5
        }).then((result) => {
            if (result.tx) {
               setTimeout(this.updateStatus(), 20000);
            }
        })
    }

    render() {
        var actionToRender;
        if (this.state.resolved) {
            actionToRender = <div><p>Wager Resolved</p><p>Winner: {this.state.winnerAddress}</p></div>
        } else {
            if (this.state.pending) {
                actionToRender = <Button bsStyle="success" onClick={this.processAccepting}>Accept</Button>
            } else {
                actionToRender = <Button bsStyle="warning" onClick={this.processResolving}>Resolve</Button>
            }
        }

        return(
            <div>
                <table className="pure-table">
                    <thead>
                        <tr>
                            <th>Contract Address</th>
                            <th>Amount</th>
                            <th>Judge Address</th>
                            <th>Initiator Address</th>
                            <th>Acceptor Address</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{ this.props.instance.address }</td>
                            <td>{ this.state.amount }</td>
                            <td>{ this.state.judgeAddress }</td>
                            <td>{ this.state.initiatorAddress }</td>
                            <td>{ this.state.acceptorAddress }</td>
                            <td>{ actionToRender }</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

export default WagerItem
