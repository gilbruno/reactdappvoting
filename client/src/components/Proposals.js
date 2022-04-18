import React, {useState} from 'react'
import { v4 as uuidv4 } from 'uuid'

function Proposals(props) {

  const {connectedAccount} = props;  

  console.log('Page des Voters ')

  const [addProposal, setAddProposal] = useState('')
  const [proposals, setProposals] = useState([{id: '', name:''}])
  const [warning, setWarning] = useState(false)

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

  return (
    <div className="container">
      {warningMsg}
      <h1>Proposals</h1>

      <br/>
      <br/>
      <br/>
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
        <ul className="list-group">
            {myProposals}
        </ul>
      </form>
    </div>
  )
}

export default Proposals