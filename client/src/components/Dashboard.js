import React, {useState, useEffect} from 'react'

function Dashboard(props) {

  const {connectedAccount, stateProps} = props;  
  const web3 = stateProps.web3
  const contract = stateProps.contract
  const accounts = stateProps.accounts
  console.log('Page du dashboard')

  const [workflowStatus, setWorkflowStatus] = useState(0)
  const [isOwner, setIsOwner]               = useState(false)
  const [isVoter, setIsVoter]               = useState(false)

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

  const getWorkflowStatusName = (workflow) => {
    let wfStatusName
    switch (workflow) {
      case 0:
        wfStatusName = 'RegisteringVoters'
        break
      case 1:
        wfStatusName = 'ProposalsRegistrationStarted'
        break
      case 2:
        wfStatusName = 'ProposalsRegistrationEnded'
        break
      case 3:
        wfStatusName = 'VotingSessionStarted'
        break  
      case 4:
        wfStatusName = 'VotingSessionEnded'
        break   
      case 5:
        wfStatusName = 'VotesTallied'
        break         

    }  
    return wfStatusName
  }

  const getWorkflowStatusButtonName = (workflow) => {
    console.log('workflow = ' + workflow)
    let wfStatusButtonName
    switch (workflow) {
      case '0':
        wfStatusButtonName = 'Start Proposals Registration'
        break
      case '1':
        wfStatusButtonName = 'Start Proposals Registration'
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
    }  

    return wfStatusButtonName
  }

  const changeWorkflowStatus = (event) => {
    event.preventDefault();
    
  }


  const workflowStatusName       = getWorkflowStatusName(workflowStatus)
  const workflowStatusButtonName = getWorkflowStatusButtonName(workflowStatus)
  const warningIsNotOwner = !isOwner && <div className="alert alert-danger mt-4 w-50" role="alert">You can't modify the workflow Status because you are not the owner</div>
  
  console.log(isOwner)

  const buttonModifyStatus = (isOwner) 
    ? <button type="" className="btn btn-primary" onClick={changeWorkflowStatus}>{workflowStatusButtonName}</button>
    : ''

  const displayResult = (workflowStatusName != 'VotesTallied')?<div className="alert alert-danger mt-4 w-50" role="alert">Results are not known yet</div>:''

  return (
    <div className="container">
      <div className="divider mt-5"><span></span><span>Current Workflow Status</span><span></span></div>
      <div className="mt-5">
        <form className="">
          <div className="mb-3 form-group mt-4">
            <input type="text" className="form-control w-25" id="workflowStatus" aria-describedby="workflowStatusHelp" value={workflowStatusName} disabled/>
            
          </div>
          {buttonModifyStatus}
          {warningIsNotOwner}
        </form>
      </div>
      <br/>
      <br/>
      <div className="divider mt-5"><span></span><span>Voters Count</span><span></span></div>
      <br/>
      <br/>
      <div className="divider mt-5"><span></span><span>Results</span><span></span></div>
      {displayResult}
      <div className="mt-5">
      <label for="winnerIdInput" className="form-label">Winner ID :</label>
      <input type="text" className="form-control w-25" id="winnerId" aria-describedby="winnerIdHelp" disabled/>

      </div>
    </div>
  )
}

export default Dashboard