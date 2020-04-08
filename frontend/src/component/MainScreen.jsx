import React from 'react';
import Round from "./Round";
import TeamScreen from "./TeamScreen";
import "./MainScreen.css";
import WordInput from "./WordInput";
import Timer from "./Timer";


function MainScreen(props) {

    const teamScreens = props.gameState.teams.map((team, index) => {
        return (
            <TeamScreen
                gameState = {props.gameState}
                team ={team}
                teamNumber = {index + 1}
            />);
        });

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
                        timerDuration = {props.gameState.timerDuration}
                        timerEnd = {props.finishTimer}
                        startTimer = {props.gameState.startTimer}
                        setFinished = {props.gameState.setFinished}
                    />
                </div>
            </div>
            <div className="teamScreens">
                {teamScreens}
            </div>
            {props.gameState.player === props.gameState.activePlayer &&
            <div>
                <WordInput
                    displayWord = {props.gameState.startTimer}
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
