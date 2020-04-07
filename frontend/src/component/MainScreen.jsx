import React from 'react';
import Round from "./Round";
import TeamScreen from "./TeamScreen";
import "./MainScreen.css";
import WordInput from "./WordInput";
import Timer from "./Timer";


function MainScreen(props) {

    const teamScreens = props.gameState.teams.map(team => {
        return (
            <TeamScreen
                team ={team}
            />);
        });

    return (
        <React.Fragment>
            <p>GAMESTATE {JSON.stringify(props.gameState)}</p>
            <div className="topBar">
                <div className="roundGrid">
                    <Round/>
                </div>
                <div className="timerGrid">
                    <Timer/>
                </div>
            </div>
            <div className="teamScreens">
                {teamScreens}
            </div>
            <div>
                <WordInput/>
            </div>
        </React.Fragment>
    );
}

export default MainScreen;
