import React from 'react'
import {Link} from 'react-router-dom';
import CardIcon from './CardIcon';

function HomeContent() {


  return (
    <div className="container-sm mt-5">
      <div class="card w-50">
        <img src="images/voting.jpeg" class="card-img-top" alt=""/>
        <div class="card-body mb-5">
          <h5 class="card-title">Card title</h5>
          <p class="card-text text-center">VOTING DAPP</p>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">Voters : Admin can add voters in a white list. <br/>Voters can read infos of other voter</li>
          <li class="list-group-item">Proposals : Registered Voters can submit a proposal and read infos about proposals</li>
          <li class="list-group-item">Dashboard : See general infos about the voting like workflow status, results of voting, etc ...</li>
        </ul>
        <div class="card-body">
          <a href="voters" class="card-link">Voters</a>
          <a href="#" class="card-link">Proposals</a>
          <a href="#" class="card-link">Dashboard</a>
        </div>
      </div>
    </div>
  )
}

export default HomeContent