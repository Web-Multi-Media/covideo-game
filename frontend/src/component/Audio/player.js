import {
  userConnect, 
  startRound, 
  startRoundActivePlayer, 
  guessWord, 
  timerEndSoon, 
  endRoundwellPlayed, 
  endRoundlooser
} from './sounds'


const playSound = (type) => {
  switch(type) {
    case 'userConnect':
      userConnect.play(0.5);
      break;
    case 'startRound':
      startRound.play(0.5);
      break;
    case 'startRoundActivePlayer':
      startRoundActivePlayer.play(0.5);
      break;    
    case 'guessWord':
      guessWord.play(0.5);
      break;       
    case 'timerEndSoon':
      timerEndSoon.play(0.5);
      break;
    case 'endRoundwellPlayed':
      endRoundwellPlayed.play(0.5);
      break;
    case 'endRoundlooser':
      endRoundlooser.play(0.5);
      break;
  } 
}


export default playSound;
