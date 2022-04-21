import React from 'react'
import {Link} from 'react-router-dom';
import BootToast from './BootToast';
import CardIcon from './CardIcon';

function HomeContent() {


  return (
    <div className="container-sm mt-5">
      <div className="w-50 mb-5">
      <svg baseProfile="tiny" id="Layer_1" xmlns="http://www.w3.org/2000/svg" 
	 x="0px" y="0px" viewBox="0 0 256 256">
<path id="XMLID_1_" d="M155.1,132.8c3.2,0,5.6-2.6,5.5-6l-0.9-85.6l-53.8,0.9l0.2,7.6l-17.5,18c-2.5,2.1-5.9,4.8-5.7,8.3
	c0,0.7,0.4,21.4,0.4,21.4h13.3l-0.2-4.2c0-1.4,0.9-2.3,2.3-2.5c1.4,0,2.5,1.1,2.5,2.3l-0.1,48.2c0,3,2.5,5.6,5.6,5.5
	c3,0,5.6-2.5,5.5-5.6l0.3-33.4c0-1.4,1.1-2.5,2.3-2.5c1.4,0,2.5,1.1,2.5,2.3V148c0,3,2.5,5.6,5.6,5.5c3,0,5.6-2.5,5.5-5.6v-40.6
	c0,0,0.9-2.5,2.3-2.5s2.5,1.1,2.5,2.3v30.2c0,3,2.5,5.6,5.6,5.5c3,0,5.6-2.5,5.5-5.6v-30.2c0-1.4,1.1-2.5,2.3-2.5
	c1.4,0,2.5,1.1,2.5,2.3l-0.2,19.8C149.3,130.2,151.8,132.8,155.1,132.8z M181.2,34.5l-0.7-25.8l-15.7,0.7L164.5,0h-63.4l0.9,34.5
	v1.2L181.2,34.5z M170.3,17.1c0.4-0.2,0.7-0.2,0.9-0.2c2.3-0.2,4.2,1.4,4.4,3.7c0.4,2.1-1.2,4.1-3.5,4.4c-0.5,0-1.1,0-1.6-0.2
	c-1.6-0.5-2.6-1.8-2.8-3.5C167.5,19.4,168.7,17.8,170.3,17.1z M245,176v80H15v-80h56v-74h25v8H79v109h-8v-21H53v27h157v-27h-17v21
	h-8V110h-21v-8h29v74H245z"/>
</svg>
      </div>
      


      <div class="card w-50">
        <img src="images/voting.jpeg" class="card-img-top" alt=""/>
        <div class="card-body mb-5">
          <h5 class="card-title">Card title</h5>
          <p class="card-text text-center">VOTING DAPP</p>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">Voters : Admin can add voters in a white list. <br/>Voters can read infos of other voter</li>
          <li class="list-group-item">Proposals : Registered Voters can submit a proposal and read infos about proposals</li>
          <li class="list-group-item">Voting : Registered Voters can submit a unique vote </li>
          <li class="list-group-item">Dashboard : See general infos about the voting like workflow status, results of voting, etc ...</li>
        </ul>
        <div class="card-body">
          <a href="voters" class="card-link">Voters</a>
          <a href="proposals" class="card-link">Proposals</a>
          <a href="voting" class="card-link">Voting</a>
          <a href="dashboard" class="card-link">Dashboard</a>
        </div>
      </div>

      <BootToast buttonName="toto" toastMessage="OKIIII"/>
    </div>
  )
}

export default HomeContent