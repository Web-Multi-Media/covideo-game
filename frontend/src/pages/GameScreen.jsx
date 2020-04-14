import React from 'react';
import GuesserScreen from "../component/GuesserScreen/GuesserScreen";
import GifScreen from "../component/Gif/GifScreen";
import Round from "../component/Round/Round";
import Timer from "../component/Timer/Timer";
import WordInput from "../component/WordInput/WordInput";
import TeamScreen from "./TeamScreen";
import "./GameScreen.css";

function MainScreen(props) {
  const teamScreens1 = <TeamScreen gameState={props.gameState} team={props.gameState.teams[0]} teamNumber={1}/>;
  const teamScreens2 = <TeamScreen gameState={props.gameState} team={props.gameState.teams[1]} teamNumber={2}/>;

  return (<React.Fragment>
    <p>ACTIVE PLAYER : {props.gameState.activePlayer}</p>
    <div className="topBar">
      <div className="roundGrid">
        <Round set={props.gameState.set}/>
      </div>
      <div className="timerGrid">
        <Timer startTimer={props.gameState.startTimer} duration={props.gameState.roomSettings.timesToGuessPerSet[props.gameState.set-1]}/>
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
        {props.gameState.player !== props.gameState.activePlayer && <GuesserScreen gifUrl={props.gameState.gifUrl}/>}
      </div>
      {teamScreens2}
    </div>
    {
      props.gameState.player === props.gameState.activePlayer && <div>
          <WordInput startTimer={props.gameState.startTimer} wordToGuess={props.gameState.words[0]} startRound={props.startRound} validation={props.validateWord} next={props.nextWord}/>
        </div>
    }
  </React.Fragment>);
}

export default MainScreen;
