import React, {useState, useEffect} from 'react'

function Dashboard(props) {

  const {connectedAccount, stateProps} = props;  
  const web3 = stateProps.web3
  const contract = stateProps.contract
  const accounts = stateProps.accounts

  const [workflowStatus, setWorkflowStatus] = useState(0)
  const [isOwner, setIsOwner]               = useState(false)
  const [isVoter, setIsVoter]               = useState(false)
  const [winningProposalId, setWinningProposalID] = useState(null)
  const [winningProposalName, setWinningProposalName] = useState(null)
  const [winningProposalVoteCount, setWinningProposalVoteCount] = useState(null)

  useEffect(() => {
    (async function() {
      console.log('useEffect contract')
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
      console.log('useEffect accounts')
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
        }
        catch (err) {
          if (err.message.includes('not a voter')) {
            setIsVoter(false)
          }
        }
      }  
    })()
  }, [accounts])

    //useEffect on "workflowStatus" state value change
    useEffect(() => {
      (async function() {
        console.log('useEffect workflowStatus')
        if (contract !== null) {
          let workflowstatus = await contract.methods.workflowStatus().call({from : connectedAccount});
          setWorkflowStatus(workflowstatus)
          let winningProposalId = await contract.methods.winningProposalID().call({from : connectedAccount});
          setWinningProposalID(winningProposalId)
          let winningProp = await contract.methods.getOneProposal(winningProposalId).call({from: connectedAccount})
          setWinningProposalName(winningProp.description)
          setWinningProposalVoteCount(winningProp.voteCount)
        }  
      })()
    }, [workflowStatus])
  
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

  const getWorkflowStatusButtonName = (workflow) => {
    let wfStatusButtonName
    switch (workflow) {
      case '0':
        wfStatusButtonName = 'Start Proposals Registration'
        break
      case '1':
        wfStatusButtonName = 'End Proposals Registration'
        break
      case '2':
        wfStatusButtonName = 'Start Voting Session'
        break
      case '3':
        wfStatusButtonName = 'End Voting Session'
        break  
      case '4':
        wfStatusButtonName = 'Tally Votes'
        break   
      case '5':
        wfStatusButtonName = 'VOTING IS ENDED'
        break   
    }  

    return wfStatusButtonName
  }

  const changeWorkflowStatus = async (event) => {
    event.preventDefault();
    console.log(workflowStatus)
    
    if (workflowStatus == '0') {
      await contract.methods.startProposalsRegistering().send({from: connectedAccount})
    }
    else if (workflowStatus == '1') {
      await contract.methods.endProposalsRegistering().send({from: connectedAccount})
    }
    else if (workflowStatus == '2') {
      await contract.methods.startVotingSession().send({from: connectedAccount})
    }
    else if (workflowStatus == '3') {
      await contract.methods.endVotingSession().send({from: connectedAccount})
    }
    else if (workflowStatus == '4') {
      await contract.methods.tallyVotes().send({from: connectedAccount})
    }  
    let newWorkflowStatus = parseInt(workflowStatus)+1
    setWorkflowStatus(newWorkflowStatus)
  }


  const workflowStatusName       = getWorkflowStatusName(workflowStatus)
  const workflowStatusButtonName = getWorkflowStatusButtonName(workflowStatus)
  const warningIsNotOwner = !isOwner && <div className="alert alert-danger mt-4 w-50" role="alert">You can't modify the workflow Status because you are not the owner</div>
  
  const inputWorkflowStatus = (isOwner) && <div><label>Current workflow status :</label><input type="text" className="form-control w-50" id="workflowStatus" aria-describedby="workflowStatusHelp" value={workflowStatusName} disabled/></div>
  const buttonModifyStatus = (isOwner) 
    ? (workflowStatusButtonName=='VOTING IS ENDED') 
        ? <button type="" className="btn btn-primary" disabled onClick={changeWorkflowStatus}>{workflowStatusButtonName}</button>
        : <button type="" className="btn btn-primary" onClick={changeWorkflowStatus}>{workflowStatusButtonName}</button>
    : ''


  const displayResult = (workflowStatusName != 'VotesTallied')?<div className="alert alert-danger mt-4 w-50" role="alert">Results are not known yet</div>
    :<div className="mt-5">
      <label for="winnerIdInput" className="form-label">Winner ID : </label>
      <input type="text" className="form-control w-25" id="winnerId" aria-describedby="winnerIdHelp" disabled value={winningProposalId}/>
      <label for="winnerNameInput" className="form-label">Proposal Name : </label>
      <input type="text" className="form-control w-25" id="winnerName" aria-describedby="winnerNameHelp" disabled value={winningProposalName}/>
      <label for="winnerVoteCountInput" className="form-label">Vote Count : </label>
      <input type="text" className="form-control w-25" id="winnerVoteCount" aria-describedby="winnerVoteCountHelp" disabled value={winningProposalVoteCount}/>
    </div>

  const getPastEventsWorkflowStatusChange = async () => {
    if (connectedAccount != '') {
      let options = {
        fromBlock:0,
        toBlock: 'latest'
      }
      let proposals = []
      let proposalsEvents = await contract.getPastEvents('WorkflowStatusChange', options);
      for (let i = 0; i < proposalsEvents.length; i++) {
        let idProposal = proposalsEvents[i].returnValues.proposalId
        let proposal = await contract.methods.getOneProposal(idProposal).call({from: connectedAccount})
        proposals.push({id : idProposal, name: proposal.description})
      }
      
    }
  }

  return (
    <div className="container">
      <div className="divider mt-5"><span></span><span>Workflow Status</span><span></span></div>
      <div className="mt-5">
        <form className="">
          <div className="mb-3 form-group mt-4">
            {inputWorkflowStatus}
          </div>
          {buttonModifyStatus}
          {warningIsNotOwner}
        </form>
      </div>
      <br/>
      <br/>
      <div className="divider mt-5"><span></span><span>Results</span><span></span></div>
      {displayResult}
      
    </div>
  )
}

export default Dashboard