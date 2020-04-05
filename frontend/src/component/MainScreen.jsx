import React from 'react';
import Round from "./Round";
import TeamScreen from "./TeamScreen";
import "./MainScreen.css";
import WordInput from "./WordInput";


function MainScreen() {

    return (
        <React.Fragment>
            <div className="topBar">
            <Round/>
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
