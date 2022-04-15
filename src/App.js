// import logo from "./logo.svg";
import react from "react";
// import reactDom from "react-dom";
// import PromiseLoadingSpinner from "promise-loading-spinner";
import "./App.css";
import lottery from "./lottery";

import web3 from "./web3";
// const loader = new PromiseLoadingSpinner();
// const loaderDecorator = loader.decorator.bind(loader);
class App extends react.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = { manager: "" };
  // }
  state = {
    successMsg: "",
    manager: "",
    players: [],
    balance: "",
    value: "",
    message: "",
  };
  async componentDidMount() {
    this.setState({ manager: "  Loading...." });
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ manager, players, balance });
    // loader.loader(manager);
  }

  async onSubmit(e) {
    e.preventDefault();
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "Waiting for the transaction success..." });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether"),
    });

    this.setState({ message: "Transaction Succeeded.." });
  }

  async pickAWinner() {
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "Waiting for the transaction success... " });
    await lottery.methods.pickWinner().send({ from: accounts[0] });
    this.setState({ message: "Transaction Succeeded.." });
  }

  render() {
    console.log(web3.version);
    return (
      <div className="App">
        <h1>Lottery Contract</h1>
        <p>
          Managed by <strong>{this.state.manager}</strong>
          <br />
          There are currently <strong> {this.state.players.length} </strong>
          players inside the pool.
          <br />
          Competing to win
          <strong>
            {" "}
            {web3.utils.fromWei(this.state.balance, "ether")} ether{" "}
          </strong>
        </p>

        <br />
        <form onSubmit={this.onSubmit.bind(this)}>
          <div>
            <label> Amount of ether to enter </label>
            <input
              value={this.state.value}
              onChange={(e) => this.setState({ value: e.target.value })}
            />
          </div>
          <br />
          <button>Enter</button>
        </form>

        <h4> Pick a Winner</h4>
        <button onClick={this.pickAWinner.bind(this)}>Click</button>

        <br />
        <h2>{this.state.message}</h2>

        {/* <p>This contract is managed by {this.state.manager}</p> */}
      </div>
    );
  }
}

export default App;
