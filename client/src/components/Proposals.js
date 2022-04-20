import React, {useState, useEffect} from 'react'
import { v4 as uuidv4 } from 'uuid'

function Proposals(props) {

  const {connectedAccount, stateProps} = props;  
  
  const web3 = stateProps.web3
  const contract = stateProps.contract
  const accounts = stateProps.accounts
  console.log('Page des Proposals')

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
        console.log("workflowstatus")
        console.log(workflowstatus)
        setWorkflowStatus(workflowstatus)

        //TEST
        setIsOwner(false)
        setIsVoter(false)

      }
    })()
  }, [contract])


  const myProposals = proposals.map(proposal => {
    return (
        <li className="list-group-item" key={proposal.id}>{proposal.name}</li>
    )
    }
  )

  const warningMsg = warning && <div className="alert alert-danger mt-4" role="alert"> Veuillez indiquer un Proposal </div>

  const addNewProposal = (newProposal) => {
    if (newProposal !== "") {
        setProposals([...proposals, {
            id: uuidv4(),
            name:newProposal
            }
        ])
        setWarning(warning ? !warning : warning);

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

  const displayAddProposalForm = isOwner 
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
      {myProposalsList}
    </form>
    : <div className="card"><div className="card-body text-danger bg-dark">You cannot add proposals as you're not the owner.</div></div>

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
      <br/>
      <br/>
      {displayAddProposalForm}
      <br/>
      <br/>
      <div className="divider mt-5"><span></span><span>Read Proposal</span><span></span></div>
      <br/>
      <br/>
      {displayReadProposalForm}
    </div>
  )
}

export default Proposals