import React, {useState, useEffect, useRef} from 'react'
import { v4 as uuidv4 } from 'uuid'
import getWeb3 from "../getWeb3";
import { Toast, Button } from 'react-bootstrap'


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
  const [displayVoterInformations, setDisplayVoterInformations] = useState('')
  const [view, initView] = useState(false)


  const readVoterInput = useRef('')

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
        try {
          let voter = await contract.methods.getVoter(connectedAccount).call()
          let isVoterBool = (voter.isRegistered) ? true : false
          setIsVoter(isVoterBool)
          console.log('isVoterBool : ' + isVoterBool)
        }
        catch(err) {
          setIsVoter(false)
        } 
        
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

  const workflowStatusNok = (workflowStatus != '0') ? <div className="alert alert-danger mt-4" role="alert">You can't add voter anymore because workflow status is not "REGISTERINGVOTERS"</div> : ''
  
  const addNewVoter = async (newVoter) => {
    if (newVoter !== "") {
        console.log('Send transaction to metamask to add new voter')
        await contract.methods.addVoter(newVoter).send({from: connectedAccount})
        let voters = await contract.methods.getVoter(newVoter).call()
        console.log(voters)
        setWarning(warning ? !warning : warning);
        setAddVoter('')
        if (connectedAccount.toLowerCase() === newVoter) {
          setIsVoter(true)
        }

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

  const displayAddVoterForm = (isOwner && connectedAccount != '')? 
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
    </form>
    : <div className="card"><div className="card-body text-danger bg-dark">You cannot add voters in the white list as you're not the owner.</div></div>

  let displayVoterInfos = ''

  const handleClick = async (event) => {
    initView(true)
    event.preventDefault()
    console.log('readVoterInput')
    console.log(readVoterInput.current.value)
    try {
      let voter = await contract.methods.getVoter(readVoterInput.current.value).call({from:connectedAccount})
      console.log(voter)
      //displayVoterInfos = <div><ul><li>IS VOTER REGISTERED : {voter} </li><li>HAS VOTER VOTED : {voter.hasVoted} </li><li> PROPOSAL ID VOTED : {voter.votedProposalId}</li></ul></div>
      displayVoterInfos = "IS REGISTERED : " + voter.isRegistered +" -- HAS VOTED : " + voter.hasVoted +  " - PROPOSAL ID VOTED : " + voter.votedProposalId
      setDisplayVoterInformations(displayVoterInfos)
    }
    catch(err) {
      displayVoterInfos = "Bad ETH Address !"
      setDisplayVoterInformations(displayVoterInfos)
    }  
  }  

  const displayReadVoterForm = (isVoter) ?
    <form>
    <h2>Read Voter (only voters)</h2>
    <div className="mb-3 form-group">
      <label for="getVoterAddressInput" className="form-label">Voter address</label>
      <input type="text" className="form-control" id="voterAddressInput" ref={readVoterInput} aria-describedby="getVoterAddressHelp"/>
      <div id="getVoterAddressHelp" className="form-text">Read infos about a voter address by giving an existing ETH voter address</div>
    </div>
    
    <Toast className="w-50" onClose={() => initView(false)} show={view} delay={10000} autohide>
        <Toast.Header>
        <strong className="mr-auto"></strong>
        </Toast.Header>
        <Toast.Body>{displayVoterInformations}</Toast.Body>
    </Toast>
    <Button className="mt-4" onClick={handleClick}>Read Voter</Button>
    
    <br/>
    <br/>
    
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