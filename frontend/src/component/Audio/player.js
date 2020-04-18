import {soundPlayers} from './sounds'


const playSound = (type) => {
  let sound_player = soundPlayers[type];
  if (sound_player !== undefined) {
    sound_player.play(0.5);
  }
}

export default playSound;
