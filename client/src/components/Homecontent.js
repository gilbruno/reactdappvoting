import React from 'react'
import {Link} from 'react-router-dom';
import CardIcon from './CardIcon';

function HomeContent() {


  return (
    <div className="container-sm">
        <div className="mt-2">
            <h1 className="homepage">Welcome to Voting Dapp</h1>
        </div>
        <div>

        <div className="mt-5">&nbsp;</div>    
        <div className="section_our_solution mt-5">

  <div className="row">
    <div className="col-lg-12 col-md-12 col-sm-12">
      <div className="our_solution_category">
        <div className="solution_cards_box">
          <div className="solution_card">
            <div className="hover_color_bubble"></div>
            <CardIcon type="Vote"/>
            <div className="solu_title">
              <h3>Voters</h3>
            </div>
            <div className="solu_description">
              <p>
                Register voters and see voters of the app.
              </p>
              
              <button type="button" className="read_more_btn">
                <Link className="nav-link" to="/voters">Voters</Link>
              </button>
            </div>
          </div>
          <div className="solution_card">
            <div className="hover_color_bubble"></div>
            <CardIcon/>
            <div className="solu_title">
              <h3>Proposals</h3>
            </div>
            <div className="solu_description">
              <p>
                You can add your proposal or see others proposals.
              </p>
              <button type="button" className="read_more_btn">
                <Link className="nav-link" to="/proposals">Proposals</Link>
              </button>
            </div>
          </div>
        </div>
        
        <div className="solution_cards_box sol_card_top_3">
          <div className="solution_card">
            <div className="hover_color_bubble"></div>
            <CardIcon/>
            <div className="solu_title">
              <h3>Demo 3</h3>
            </div>
            <div className="solu_description">
              <p>
                It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
              </p>
              <button type="button" className="read_more_btn">Read More</button>
            </div>
          </div>
          <div className="solution_card">
            <div className="hover_color_bubble"></div>
            
            <CardIcon/>
            <div className="solu_title">
              <h3>Demo 4</h3>
            </div>
            <div className="solu_description">
              <p>
                It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
              </p>
              <button type="button" className="read_more_btn">Read More</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

        </div>
    </div>
  )
}

export default HomeContent