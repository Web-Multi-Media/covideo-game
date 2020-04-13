import React from 'react';
import Round from "./Round";
import TeamScreen from "./TeamScreen";
import "./MainScreen.css";
import WordInput from "./WordInput";
import Timer from "./Timer";
import GifScreen from "./Gif/GifScreen";

function MainScreen(props) {

  const teamScreens = props.gameState.teams.map((team, index) => {
    return (<TeamScreen gameState={props.gameState} team={team} teamNumber={index + 1}/>);
  });

    const teamScreens1 =
        <TeamScreen
                gameState = {props.gameState}
                team ={props.gameState.teams[0]}
                teamNumber = {1}
            />;
    const teamScreens2 =
        <TeamScreen
            gameState = {props.gameState}
            team ={props.gameState.teams[1]}
            teamNumber = {2}
        />;

    return (
        <React.Fragment>
            <p>GAMESTATE {JSON.stringify(props.gameState)}</p>
            <p>ACTIVE PLAYER : {props.gameState.activePlayer}</p>
            <div className="topBar">
                <div className="roundGrid">
                    <Round
                    set = {props.gameState.set}
                    />
                </div>
                <div className="timerGrid">
                    <Timer
                        startTimer = {props.gameState.startTimer}
                        duration = {props.gameState.duration}
                    />
                </div>
            </div>
            <div className="teamScreens">
                {teamScreens1}
                <div className="gifGrid">
                    <GifScreen
                        sendGif = { props.sendGif }
                    />
                </div>
                {teamScreens2}
            </div>
            {props.gameState.player === props.gameState.activePlayer &&
            <div>
                <WordInput
                    startTimer = {props.gameState.startTimer}
                    wordToGuess = {props.gameState.words[0]}
                    startRound = {props.startSet}
                    validation = {props.validateWord}
                    next = {props.nextWord}
                />
            </div>
            }
        </React.Fragment>
    );
}

export default MainScreen;
