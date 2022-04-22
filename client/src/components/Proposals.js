import React, {useState, useEffect} from 'react'
import { v4 as uuidv4 } from 'uuid'

function Proposals(props) {

  const {connectedAccount, stateProps} = props;  
  
  const web3 = stateProps.web3
  const contract = stateProps.contract
  const accounts = stateProps.accounts
  //console.log('Page des Proposals')

  const [addProposal, setAddProposal] = useState('')
  const [proposals, setProposals] = useState([{id: '', name:''}])
  const [warning, setWarning] = useState(false)
  const [isOwner, setIsOwner] = useState(true)
  const [isVoter, setIsVoter] = useState(false)
  const [workflowStatus, setWorkflowStatus] = useState(0)
  
  useEffect(() => {
    (async function() {
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
      console.log('useEffect')  
    })()
  }, [accounts])

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

        //Set Proposals
        let proposalsFromcontract = await getPastEventsProposalsHistory()
        setProposals(proposalsFromcontract)
      }  
    })()
  }, [accounts])


  const myProposals = (proposals.length == 1 && proposals[0].id == '')
    ?<div className="alert alert-danger mt-4" role="alert"> No proposals yet </div>
    : proposals.map(proposal => {
    return (
        <li className="list-group-item" key={proposal.id}>ID : {proposal.id}  | NAME : {proposal.name}</li>
    )
    }
  )

  const warningMsg = warning && <div className="alert alert-danger mt-4" role="alert"> Veuillez indiquer un Proposal </div>

  const getPastEventsHistory = async () => {
    let options = {
      fromBlock:0,
      toBlock: 'latest'
    }
    let proposals = []
    let proposalsEvents = await contract.getPastEvents('ProposalRegistered', options);
    return proposalsEvents;
  }

  const getPastEventsProposalsHistory = async () => {
    let options = {
      fromBlock:0,
      toBlock: 'latest'
    }
    let proposals = []
    let proposalsEvents = await contract.getPastEvents('ProposalRegistered', options);
    //console.log('proposalsEvents')
    //console.log(proposalsEvents)
    for (let i = 0; i < proposalsEvents.length; i++) {
      let idProposal = proposalsEvents[i].returnValues.proposalId
      let proposal = await contract.methods.getOneProposal(idProposal).call({from: connectedAccount})
      proposals.push({id : idProposal, name: proposal.description})
    }
    return proposals
  }

  const getMaxIdProposal = async () => {
    let proposals = await getPastEventsProposalsHistory()
    return (proposals.length -1)
  }

  const isPRoposalsArrayEmpty = () => {
    return (proposals.length == 1 && proposals[0].id == '')
  }

  const addNewProposal = async (newProposal) => {
    if (newProposal !== "") {
        
        console.log('Send transaction to metamask to add new proposal')
        await contract.methods.addProposal(newProposal).send({from: connectedAccount})
        
        if (isPRoposalsArrayEmpty()) {
          setProposals([{
            id: 0,
            name:newProposal
            }
          ])
        }
        else {
          let maxIdProposal = await getMaxIdProposal()
          setProposals([...proposals, {
            id: maxIdProposal+1,
            name:newProposal
            }
          ])
        }
        console.log("proposal")
        //console.log(proposal)
        setWarning(warning ? !warning : warning);
        setAddProposal('')
    }  
    else {
        setWarning(true);
    }    
  }

  const handleSubmitAddProposal = (event) => {
    event.preventDefault()  
    console.log('addProposal : ' + addProposal)
    addNewProposal(addProposal)
  }

  const handleOnChangeAddProposal = (event) => {
    setAddProposal(event.target.value)
  }

  const myProposalsList = (myProposals.length != 0) ? <ul className="list-group">{myProposals}</ul>: ''

  const workflowStatusNok = (workflowStatus != '1') ? <div className="alert alert-danger mt-4" role="alert">You can't add proposal anymore because workflow status is not "ProposalsRegistrationStarted"</div> : ''

  const displayAddProposalForm = (isVoter && (workflowStatus == '1'))
    ? 
    <form onSubmit={handleSubmitAddProposal}>
      
      <div className="mb-3">
        <label for="proposalInput" className="form-label">Proposal : </label>
        <input type="text" className="form-control" id="proposalInput" aria-describedby="proposalHelp" value={addProposal} onChange={handleOnChangeAddProposal}/>
        <div id="proposalHelp" className="form-text">Add a proposal by giving a new proposal</div>
      </div>
      <button type="submit" className="btn btn-primary">Add Proposal</button>
      <br/>
      <br/>
      <br/>        
    </form>
    : <div className="card"><div className="card-body text-danger bg-dark">You cannot add proposals as you're not a voter (registered in the white list).</div></div>

    const displayReadProposalForm = isVoter
    ? <form>
        <h2>Read Proposal (only voters)</h2>
        <div className="mb-3 form-group">
          <label for="getProposalInput" className="form-label">Voter address</label>
          <input type="text" className="form-control" id="proposalAddressInput" aria-describedby="getProposalAddressHelp"/>
          <div id="getProposalAddressHelp" className="form-text">Read infos about a proposal address by giving an existing ID proposal</div>
        </div>
        <button type="submit" className="btn btn-primary">Read Proposal</button>
      </form>
    :  <div className="card"><div className="card-body text-danger bg-dark">You cannot read infos about proposals as you're not registered in the white list.</div></div>

  return (
    <div className="container">
      <div className="divider mt-5"><span></span><span>Add Proposal</span><span></span></div>
      {warningMsg}
      {workflowStatusNok}
      <br/>
      <br/>
      {displayAddProposalForm}
      <br/>
      <br/>
      <div className="divider mt-5"><span></span><span>List of Proposals</span><span></span></div>
      {myProposals}
      
      
    </div>
  )
}

export default Proposals