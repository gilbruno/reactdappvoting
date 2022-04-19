import React, {useState} from 'react'
import { v4 as uuidv4 } from 'uuid'

const Voters = (props) => {

  const {connectedAccount} = props;  

  console.log('Page des Voters ')

  const [addVoter, setAddVoter] = useState('')
  const [voters, setVoters] = useState([])
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
    return isVoter
  }
 
  const myVoters = voters.map(voter => {
    return (
        <li className="list-group-item" key={voter.id}>{voter.address}</li>
    )
    }
  )

  const warningMsg = warning && <div class="alert alert-danger mt-4" role="alert"> Veuillez indiquer un Voter </div>

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

  const myVotersList = (myVoters.length != 0) ? <ul className="list-group">{myVoters}</ul>: ''

  const displayAddVoterForm = (isOwner)? 
    <form onSubmit={handleSubmitAddVoter}>
      <h2>Add Voter (only admin)</h2>
      <div className="mb-3 form-group">
        <label for="addVoterAddressInput" class="form-label">Voter address</label>
        <input type="text" class="form-control" id="addVoterAddressInput" aria-describedby="addVoterAddressHelp" value={addVoter} onChange={handleOnChangeAddVoter}/>
        <div id="addVoterAddressHelp" class="form-text">Add a voter by giving a new ETH address</div>
      </div>
      <button type="submit" class="btn btn-primary">Add Voter</button>
      <br/>
      <br/>
      <br/>
      {myVotersList}  
    </form>
    : <div class="card"><div class="card-body text-danger bg-dark">You cannot add voters in the white list as you're not the owner.</div></div>

  const displayReadVoterForm = (isVoter) ?
    <form>
    <h2>Read Voter (only voters)</h2>
    <div className="mb-3 form-group">
      <label for="getVoterAddressInput" class="form-label">Voter address</label>
      <input type="text" class="form-control" id="voterAddressInput" aria-describedby="getVoterAddressHelp"/>
      <div id="getVoterAddressHelp" class="form-text">Read infos about a voter address by giving an existing ETH voter address</div>
    </div>
    <button type="submit" class="btn btn-primary">Read Voter</button>
    </form> 
    : <div class="card"><div class="card-body text-danger bg-dark">You cannot get infos of voters as you're not registered in the white list.</div></div>

  console.log(myVoters.length)
  console.log(connectedAccount)
  return (
    <div className="container">
      {warningMsg}
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