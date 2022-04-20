import React, {useState, useEffect} from 'react'
import { v4 as uuidv4 } from 'uuid'
import getWeb3 from "../getWeb3";

const Voters = (props) => {
  const {connectedAccount, stateProps} = props;  
  const web3 = stateProps.web3
  const contract = stateProps.contract
  const accounts = stateProps.accounts
  //console.log('Page des Voters ')

  const [addVoter, setAddVoter] = useState('')
  const [voters, setVoters]                 = useState([])
  const [warning, setWarning]               = useState(false)
  const [isOwner, setIsOwner]               = useState(true)
  const [isVoter, setIsVoter]               = useState(false)
  const [workflowStatus, setWorkflowStatus] = useState(0)

  useEffect(() => {
    (async function() {
      console.log('1')
      if (contract !== null) {
        let workflowstatus = await contract.methods.workflowStatus().call();
        let owner          = await contract.methods.owner().call();
        if (connectedAccount.toLowerCase() === owner.toLowerCase()) {
          setIsOwner(true)
        }
        else {
          setIsOwner(false)
        }
        setWorkflowStatus(workflowstatus)
        setIsVoter(false)

      }
    })()
  }, [contract])

  //useEffect on "accounts" state value change
  useEffect(() => {
    (async function() {
      console.log('2')
      if (contract !== null) {
        let owner          = await contract.methods.owner().call();
        //Set isOwner
        if (connectedAccount.toLowerCase() === owner.toLowerCase()) {
          setIsOwner(true)
        }
        else {
          setIsOwner(false)
        }
        //Set isVoter
        let voter = await contract.methods.getVoter(connectedAccount).call()
        let isVoterBool = (voter.isRegistered) ? true : false
        setIsVoter(isVoterBool)
        console.log('isVoterBool : ' + isVoterBool)
      }  
    })()
  }, [accounts])

  const myVoters = voters.map(voter => {
    return (
        <li className="list-group-item" key={voter.id}>{voter.address}</li>
    )
    }
  )

  const warningMsg = warning && <div className="alert alert-danger mt-4" role="alert"> Veuillez indiquer un Voter </div>

  const workflowStatusNok = (workflowStatus != '0') ? <div className="alert alert-danger mt-4" role="alert"> Impossible d'ajouter un votant à cause du statut de workflow </div> : ''
  
  const addNewVoter = async (newVoter) => {
    if (newVoter !== "") {
        setVoters([...voters, {
            id: uuidv4(),
            address:newVoter
            }
        ])
        console.log(voters)
        console.log('Send transaction to metamask to add new voter')
        // await contract.methods.addVoter(newVoter).send({from: connectedAccount})
        // let voters = await contract.methods.getVoter(newVoter).call()
        setWarning(warning ? !warning : warning);
        setAddVoter('')

    }  
    else {
        setWarning(true);
    }    
  }

  const handleSubmitAddVoter = (event) => {
    event.preventDefault()  
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

  //console.log(myVoters.length)
  //console.log(connectedAccount)
  return (
    <div className="container">
      <div className="divider mt-5"><span></span><span>Add Voters (only admin)</span><span></span></div>
      {warningMsg}
      {workflowStatusNok}
      <br/>
      <br/>
      {displayAddVoterForm}        
        <br/>
        <br/>
        <div className="divider mt-5"><span></span><span>Read Voter</span><span></span></div>  
      {displayReadVoterForm}        
    </div>
  )
}

export default Voters