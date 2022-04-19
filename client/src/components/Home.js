import React, {useState}  from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Dashboard from './Dashboard'
import Voters from './Voters'
import Proposals from './Proposals'
import HomeContent from './Homecontent'
import Web3 from "web3";
import {Link, NavLink} from 'react-router-dom';
import Toast from 'react-bootstrap/Toast';
import VotingContract from "../contracts/Voting.json";

function Home() {

  const [error, setError] = useState('');
  const [connectedAccount, setConnectedAccount] = useState('');
  const [state, setState] = useState({web3:null, accounts:null, contract:null})

  let web3;
  const handleConnect = async () => {
    console.log('****** Connnection : ' + connectedAccount)
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({method: "eth_requestAccounts"})
        web3 = new Web3(window.ethereum)
        window.ethereum.enable();
        console.log('Connected')
        //Get the list of accounts
        let accounts = await web3.eth.getAccounts();
        let connectedAccount = accounts[0];
        

        //Get the contract instance
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = VotingContract.networks[networkId];
        const instance = new web3.eth.Contract(
          VotingContract.abi,
          deployedNetwork && deployedNetwork.address,
        );

        //Set the state
        setState({web3: web3, accounts: accounts, contract:instance})
        setConnectedAccount(connectedAccount);  


        // detect Metamask account change
        window.ethereum.on('accountsChanged', function (accounts) {
          console.log('accountsChanges',accounts);
          connectedAccount = accounts[0];
          //Set the state
          setConnectedAccount(connectedAccount);
          setState({web3: web3, accounts: accounts, contract:instance})
        });

        // detect Network account change
        window.ethereum.on('networkChanged', function(networkId){
          console.log('networkChanged',networkId);
        });

      }
      catch(err) {
        setError(err.message)
      }
      
    } 
    else {
      //Metamask not installed
      console.log('Please install Metamask');
    } 
  }

  const disconnect = (event) => {
    event.preventDefault()
    web3.etethereumh.currentProvider.disconnect();

  }

  const connection = (connectedAccount === '' || connectedAccount === undefined)
    ?<li className='navbar-right me-2 connect'><button className='btn btn-primary connect' onClick={handleConnect}>Connect</button></li>
    :<li className="nav-item connected-account"><a href="" id="connectedAccountLink" onClick={disconnect}>Connected Account : {connectedAccount}</a></li>

  return (
    <BrowserRouter>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                  <NavLink className="nav-link" to="/dashboard">Dashboard</NavLink>
              </li>
              <li className="nav-item">
                  <NavLink className="nav-link" to="/voters">Voters</NavLink>
              </li>
              <li className="nav-item">
                  <NavLink className="nav-link" to="/proposals">Proposals</NavLink>
              </li>
              <li className="nav-item">
                  <NavLink className="nav-link" to="/results">Results</NavLink>
              </li>
              {connection}
          </ul>
          <div className="toast align-items-center text-white bg-primary border-0" id="test" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="d-flex" id="test2">
              <div className="toast-body">
                Metamask Connection Error : {error}
              </div>
              <button type="button" id="connectError" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
          </div>
        </div>
    </div>
    </nav>
        <Routes>
            <Route path="/dashboard" element={<Dashboard/>}/>  
            <Route path="/" element={<HomeContent/>}/>  
            <Route path="/voters" element={<Voters connectedAccount={connectedAccount} stateProps={state}/>}/>  
            <Route path="/proposals" element={<Proposals connectedAccount={connectedAccount}/>}/>  
        </Routes>
    </BrowserRouter>
  )  
}

export default Home