import {useSound} from 'use-sound'
import React from 'react'

import gameStart from './../Assets/Sounds/gameStart.mp3';
import justMove from './../Assets/Sounds/gameStart.mp3';
import confidentMoveSound from './../Assets/Sounds/ConfidentMove.mp3';
import castle from './../Assets/Sounds/castle.mp3';
import check from './../Assets/Sounds/check.mp3'

const arrayOfSounds = {
  startOfTheGame: gameStart, 
  move: justMove,
  confidentMove: confidentMoveSound,
  castle: castle,
  check: check
}; // bicia brakuje

export const useMoveSound = (string = 'move') => {
  const [play] = useSound(arrayOfSounds[string]);
  // potem tutaj wejdzie dodatkowa logika itp.

  return play;
}