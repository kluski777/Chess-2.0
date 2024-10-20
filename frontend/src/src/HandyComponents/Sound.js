import {useSound} from 'use-sound'

import gameStart from './../Assets/Sounds/gameStart.mp3';
import justMove from './../Assets/Sounds/justMove.mp3';
import confidentMoveSound from './../Assets/Sounds/ConfidentMove.mp3';
import castle from './../Assets/Sounds/castle.mp3';
import check from './../Assets/Sounds/check.mp3';
import taking from './../Assets/Sounds/taking.mp3';

const arrayOfSounds = {
  gameStart: gameStart, 
  move: justMove,
  confidentMove: confidentMoveSound,
  castle: castle,
  check: check,
  taking: taking
}; // bicia brakuje

export const useMoveSound = (string = 'move') => {
  const [play] = useSound(arrayOfSounds[string]);
  return play;
}