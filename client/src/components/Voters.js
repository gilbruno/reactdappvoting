import React, {useState, useEffect} from 'react'
import { v4 as uuidv4 } from 'uuid'
import getWeb3 from "../getWeb3";

const Voters = (props) => {
  const {connectedAccount, stateProps} = props;  
  const web3 = stateProps.web3
  const contract = stateProps.contract
  const accounts = stateProps.accounts
  console.log('Page des Voters ')

  const [addVoter, setAddVoter] = useState('')
  const [voters, setVoters]                 = useState([])
  const [warning, setWarning]               = useState(false)
  const [isOwner, setIsOwner]               = useState(true)
  const [isVoter, setIsVoter]               = useState(false)
  const [workflowStatus, setWorkflowStatus] = useState(0)

  useEffect(() => {
    (async function() {
      if (contract !== null) {
        let workflowstatus = await contract.methods.workflowStatus().call();
        console.log("workflowstatus")
        console.log(workflowstatus)
        setWorkflowStatus(1)
      }
    })()
  }, [contract])

  const isOwnerFunc = () => {
    if (connectedAccount == '0xdfg5454xdg654dgF') {
      return true
    }
    else {
      return false
    }
  }

  const isVoterFunc = () => {
    return isVoter
  }

  
  const myVoters = voters.map(voter => {
    return (
        <li className="list-group-item" key={voter.id}>{voter.address}</li>
    )
    }
  )

  const warningMsg = warning && <div className="alert alert-danger mt-4" role="alert"> Veuillez indiquer un Voter </div>

  const workflowStatusNok = (workflowStatus != 0) ? <div className="alert alert-danger mt-4" role="alert"> Impossible d'ajouter un votant à cause du statut de workflow </div> : ''
  
  const addNewVoter = (newVoter) => {
    console.log()
    if (newVoter !== "") {
        setVoters([...voters, {
            id: uuidv4(),
            address:newVoter
            }
        ])
        setWarning(warning ? !warning : warning);

    }  
    else {
        setWarning(true);
    }    
  }

  const handleSubmitAddVoter = (event) => {
    event.preventDefault()  
    console.log('addvoter' + addVoter)
    addNewVoter(addVoter)
  }

  const handleOnChangeAddVoter = (event) => {
    setAddVoter(event.target.value)
  }

  const addVoterInput = (workflowStatus != 0) ? <input type="text" className="form-control w-50" id="addVoterAddressInput" aria-describedby="addVoterAddressHelp" value={addVoter} onChange={handleOnChangeAddVoter} disabled/> 
    : <input type="text" className="form-control" id="addVoterAddressInput" aria-describedby="addVoterAddressHelp" value={addVoter} onChange={handleOnChangeAddVoter}/>

  const addVoterButton = (workflowStatus != 0) ? <button type="submit" className="btn btn-primary" disabled>Add Voter</button> : <button type="submit" className="btn btn-primary">Add Voter</button>

  const myVotersList = (myVoters.length != 0) ? <ul className="list-group">{myVoters}</ul>: ''

  const displayAddVoterForm = (isOwner)? 
    <form onSubmit={handleSubmitAddVoter}>
      <h2>Add Voter (only admin)</h2>
      <div className="mb-3 form-group">
        <label for="addVoterAddressInput" className="form-label">Voter address</label>
        {addVoterInput}
        <div id="addVoterAddressHelp" className="form-text">Add a voter by giving a new ETH address</div>
      </div>
      {addVoterButton}
      <br/>
      <br/>
      <br/>
      {myVotersList}  
    </form>
    : <div className="card"><div className="card-body text-danger bg-dark">You cannot add voters in the white list as you're not the owner.</div></div>

  const displayReadVoterForm = (isVoter) ?
    <form>
    <h2>Read Voter (only voters)</h2>
    <div className="mb-3 form-group">
      <label for="getVoterAddressInput" className="form-label">Voter address</label>
      <input type="text" className="form-control" id="voterAddressInput" aria-describedby="getVoterAddressHelp"/>
      <div id="getVoterAddressHelp" className="form-text">Read infos about a voter address by giving an existing ETH voter address</div>
    </div>
    <button type="submit" className="btn btn-primary">Read Voter</button>
    </form> 
    : <div className="card"><div className="card-body text-danger bg-dark">You cannot get infos of voters as you're not registered in the white list.</div></div>

  console.log(myVoters.length)
  console.log(connectedAccount)
  return (
    <div className="container">
      {warningMsg}
      {workflowStatusNok}
      <h1>Voters</h1>
      <br/>
      <br/>
      {displayAddVoterForm}        
        <br/>
        <br/>
      {displayReadVoterForm}        
    </div>
  )
}

export default Voters