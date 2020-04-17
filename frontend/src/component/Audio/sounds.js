import UIfx from 'uifx';


const DEFAULT_SETTINGS = {
    volume: 0.9,
    throttleMs: 50
};

const create_player = (url) => {
  return  new UIfx(
    url,
    DEFAULT_SETTINGS
  )
}

export const userConnect = create_player(
  "//freesound.org/data/previews/377/377017_1172853-lq.mp3"
  );
export const startRound = create_player(
  "//freesound.org/data/previews/476/476175_6101353-lq.mp3"
);
export const startRoundActivePlayer = create_player(
  "//freesound.org/data/previews/446/446142_758593-lq.mp3"
);
export const guessWord = create_player(
  "//freesound.org/data/previews/341/341695_5858296-lq.mp3"
);
export const timerEndSoon = create_player(
  "//freesound.org/data/previews/197/197713_3676780-lq.mp3"
);
export const endRoundwellPlayed = create_player(
  "//freesound.org/data/previews/253/253172_4404552-lq.mp3"
);
export const endRoundlooser = create_player(
  "//freesound.org/data/previews/404/404767_140737-lq.mp3"
);
