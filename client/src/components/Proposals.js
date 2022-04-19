import React, {useState} from 'react'
import { v4 as uuidv4 } from 'uuid'

function Proposals(props) {

  const {connectedAccount} = props;  

  console.log('Page des Voters ')

  const [addProposal, setAddProposal] = useState('')
  const [proposals, setProposals] = useState([{id: '', name:''}])
  const [warning, setWarning] = useState(false)
  const [isOwner, setIsOwner] = useState(true)
  const [isVoter, setIsVoter] = useState(false)

  const isOwnerFunc = () => {
    if (connectedAccount == '0xdfg5454xdg654dgF') {
      return true
    }
    else {
      return false
    }
  
  }

  const isVoterFunc = () => {
    return true
  }

  const myProposals = proposals.map(proposal => {
    return (
        <li className="list-group-item" key={proposal.id}>{proposal.name}</li>
    )
    }
  )

  const warningMsg = warning && <div class="alert alert-danger mt-4" role="alert"> Veuillez indiquer un Proposal </div>

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
      <h2>Add proposals (only admin)</h2>
      <div className="mb-3">
        <label for="proposalInput" class="form-label">Proposal</label>
        <input type="text" class="form-control" id="proposalInput" aria-describedby="proposalHelp" value={addProposal} onChange={handleOnChangeAddProposal}/>
        <div id="proposalHelp" class="form-text">Add a proposal by giving a new proposal</div>
      </div>
      <button type="submit" class="btn btn-primary">Add Proposal</button>
      <br/>
      <br/>
      <br/>        
      {myProposalsList}
    </form>
    : <div class="card"><div class="card-body text-danger bg-dark">You cannot add proposals as you're not the owner.</div></div>

    const displayReadProposalForm = isVoter
    ? <form>
        <h2>Read Proposal (only voters)</h2>
        <div className="mb-3 form-group">
          <label for="getProposalInput" class="form-label">Voter address</label>
          <input type="text" class="form-control" id="proposalAddressInput" aria-describedby="getProposalAddressHelp"/>
          <div id="getProposalAddressHelp" class="form-text">Read infos about a proposal address by giving an existing ID proposal</div>
        </div>
        <button type="submit" class="btn btn-primary">Read Proposal</button>
      </form>
    :  <div class="card"><div class="card-body text-danger bg-dark">You cannot read infos about proposals as you're not registered in the white list.</div></div>

  return (
    <div className="container">
      {warningMsg}
      <h1>Proposals</h1>
      <br/>
      <br/>
      {displayAddProposalForm}
      <br/>
      <br/>
      <br/>
      <br/>
      {displayReadProposalForm}
    </div>
  )
}

export default Proposals