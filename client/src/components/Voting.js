import React, {useState, useEffect} from 'react'

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
    let workflowStatusName = getWorkflowStatusName(workflowStatus)
    console.log('Voting - isVoter : ' + isVoter)
    console.log('Voting - workflowStatusName : ' + workflowStatusName)
    //setIsVoter(true)
    //workflowStatusName = 'VotingSessionStarted'
    if (isVoter && workflowStatusName == 'VotingSessionStarted') {
        displayVotingForm = <form>
        <div className="mb-3 form-group">
          <label for="votingInput" className="form-label">Proposal</label>
          <input type="text" className="form-control" id="votingInput" aria-describedby="votingInputHelp"/>
          <div id="votingInputHelp" className="form-text">Read infos about a proposal address by giving an existing ID proposal</div>
        </div>
        <button type="submit" className="btn btn-primary">Read Proposal</button>
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