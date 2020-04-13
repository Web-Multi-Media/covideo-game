import React from 'react';
import Round from "./Round";
import TeamScreen from "./TeamScreen";
import "./MainScreen.css";
import WordInput from "./WordInput";
import Timer from "./Timer";
import GifScreen from "./Gif/GifScreen";
import GuessScreen from "./GuessScreen";
import GuesserScreen from "./GuesserScreen";

function MainScreen(props) {

  const teamScreens = props.gameState.teams.map((team, index) => {
    return (<TeamScreen gameState={props.gameState} team={team} teamNumber={index + 1}/>);
  });

  const teamScreens1 = <TeamScreen gameState={props.gameState} team="team" ={props.gameState.teams[0]} teamNumber={1}/>;
  const teamScreens2 = <TeamScreen gameState={props.gameState} team="team" ={props.gameState.teams[1]} teamNumber={2}/>;

  return (<React.Fragment>
    <p>ACTIVE PLAYER : {props.gameState.activePlayer}</p>
    <div className="topBar">
      <div className="roundGrid">
        <Round set={props.gameState.set}/>
      </div>
      <div className="timerGrid">
        <Timer startTimer={props.gameState.startTimer} duration={props.gameState.duration}/>
      </div>
    </div>
    <div className="teamScreens">
      {teamScreens1}
      <div className="gifGrid">
        {
          props.gameState.player === props.gameState.activePlayer && <React.Fragment>
              {
                (props.gameState.set >= 3 && props.gameState.gifUrl === '')
                  ? <GifScreen sendGif={props.sendGif} startTimer={props.gameState.startTimer}/>
                  : <GuesserScreen gifUrl={props.gameState.gifUrl}/>
              }
            </React.Fragment>
        }
        {props.gameState.player !== props.gameState.activePlayer && <GuessScreen gifUrl={props.gameState.gifUrl}/>}
      </div>
      {teamScreens2}
    </div>
    {
      props.gameState.player === props.gameState.activePlayer && <div>
          <WordInput startTimer={props.gameState.startTimer} wordToGuess={props.gameState.words[0]} startRound={props.startSet} validation={props.validateWord} next={props.nextWord}/>
        </div>
    }
  </React.Fragment>);
}

export default MainScreen;
