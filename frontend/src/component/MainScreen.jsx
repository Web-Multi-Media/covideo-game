import React from 'react';
import Round from "./Round";
import TeamScreen from "./TeamScreen";
import "./MainScreen.css";
import WordInput from "./WordInput";
import Timer from "./Timer";


function MainScreen() {

    return (
        <React.Fragment>
            <div className="topBar">
                <div className="roundGrid">
                    <Round/>
                </div>
                <div className="timerGrid">
                    <Timer/>
                </div>
            </div>
            <div className="teamScreens">
                <TeamScreen/>
                <TeamScreen/>
            </div>
            <div>
                <WordInput/>
            </div>
        </React.Fragment>
    );
}

export default MainScreen;
