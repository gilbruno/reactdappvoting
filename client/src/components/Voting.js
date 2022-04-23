import React, {useState, useEffect} from 'react'
import { Toast, Button } from 'react-bootstrap'

function Voting(props) {

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
    const [votingId, setVotingId] = useState(null)
    const [view, initView] = useState(false)
    const [displayWarningHasVoted, setDisplayWarningHasVoted] = useState('')
 
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
            let owner          = await contract.methods.owner().call({from: connectedAccount});
            //Set isOwner
            if (connectedAccount.toLowerCase() === owner.toLowerCase()) {
              setIsOwner(true)
            }
            else {
              setIsOwner(false)
            }
            //Set isVoter
            let voter = await contract.methods.getVoter(connectedAccount).call({from: connectedAccount})
            let isVoterBool = (voter.isRegistered) ? true : false
            setIsVoter(isVoterBool)
            console.log('isVoterBool : ' + isVoterBool)
          }  
        })()
      }, [accounts])
    
        
    const getWorkflowStatusName = (workflow) => {
        let wfStatusName
        switch (workflow) {
          case '0':
            wfStatusName = 'RegisteringVoters'
            break
          case '1':
            wfStatusName = 'ProposalsRegistrationStarted'
            break
          case '2':
            wfStatusName = 'ProposalsRegistrationEnded'
            break
          case '3':
            wfStatusName = 'VotingSessionStarted'
            break  
          case '4':
            wfStatusName = 'VotingSessionEnded'
            break   
          case '5':
            wfStatusName = 'VotesTallied'
            break         
    
        }  
        return wfStatusName
      }
    
    let displayVotingForm = ''

    const setVote = async (votindId) => {
      if (votingId != '') {
        try {
          await contract.methods.setVote(votingId).send({from: connectedAccount})
        }
        catch (err) {
          if (err.message.includes('Proposal not found')) {
            initView(true)
            setDisplayWarningHasVoted("Proposal does not exist")
            setVotingId('')
            return
          }
        }
      }
    }

    const hasVoted = async() => {
      try {
        let voter = await contract.methods.getVoter(connectedAccount).call({from:connectedAccount})
        if (voter.hasVoted) {
          alert("You can vote only ONCE !")
        }
      }
      catch(err) {
        console.log(err.message);
      }
    }

    const handleSubmitVote = async (event) => {
      event.preventDefault()  
      try {
        let voter = await contract.methods.getVoter(connectedAccount).call({from:connectedAccount})
        if (voter.hasVoted) {
          initView(true)
          setDisplayWarningHasVoted("You can vote only ONCE !")
          return
        }
        else {
          setVote(votingId)
          setVotingId('')
        }
      }
      catch(err) {
        console.log(err.message);
      }
    }
  
    const handleOnChangeSetVote = (event) => {
      setVotingId(event.target.value)
    }

    let workflowStatusName = getWorkflowStatusName(workflowStatus)

    //workflowStatusName = 'VotingSessionStarted'
    if (isVoter && workflowStatusName == 'VotingSessionStarted') {
        displayVotingForm = 
        <form>
        <div className="mb-3 form-group">
          <label for="votingInput" className="form-label">Proposal ID</label>
          <input type="text" className="form-control" id="votingInput" aria-describedby="votingInputHelp" value={votingId} onChange={handleOnChangeSetVote}/>
          <div id="votingInputHelp" className="form-text">Submit an ID proposal to vote. (You can see the list of proposals in the navbar item "Proposals")</div>
        </div>
         <Toast className="mb-2 warningHasVotedLightRed" onClose={() => initView(false)} show={view} delay={5000} autohide>
            <Toast.Header className="warningHasVoted">
            <strong className="mr-auto"></strong>
            <small></small>
            </Toast.Header>
            <Toast.Body className="warningHasVoted">{displayWarningHasVoted}</Toast.Body>
        </Toast>
        <Button onClick={handleSubmitVote}>Vote</Button>

      </form>
    }
    else if (!isVoter) {
        displayVotingForm = <div className="card"><div className="card-body text-danger bg-dark">You cannot submit your vote as you're not registered in the white list.</div></div>
    }
    else if (workflowStatusName != 'VotingSessionStarted') {
        displayVotingForm = <div className="card"><div className="card-body text-danger bg-dark">You cannot submit your vote as you're not granted to vote due to bad workflow status.</div></div>
    }
    

    return (
        <div className="container">
            <div className="divider mt-5"><span></span><span>Submit your vote</span><span></span></div>
            <br/>
            <br/>
            {displayVotingForm}
        </div>
    )
}

export default Voting