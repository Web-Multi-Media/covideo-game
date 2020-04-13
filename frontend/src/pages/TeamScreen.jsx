import React from 'react';
import './TeamScreen.css'

function TeamScreen(props) {
  const team = props.team;
  const teamMembers = team.map(player => {
    return (<React.Fragment key={0}>
      <div>
        <p className="">{player}</p>
      </div>
    </React.Fragment>);
  });
  return (<div className="TeamBorder">
    <p>Team {props.teamNumber}</p>
    <p>Score : {
        props.teamNumber === 1
          ? props.gameState.team1Score
          : props.gameState.team2Score
      }</p>
    <div className="teamMembers">
      {teamMembers}
    </div>
  </div>);
}

export default TeamScreen;
