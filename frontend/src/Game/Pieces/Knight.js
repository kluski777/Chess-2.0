import React from 'react';
import { Piece } from './Piece';
import "../piece.css"

import blackKnight from '../../Assets/blackPieces/knight.png';
import whiteKnight from '../../Assets/whitePieces/knight.png';

export class Knight extends Piece {
    type = 'Knight';

    constructor({isWhite, i, j, isPlayer}){
        super({i, j, isPlayer});
        this.graphic = isWhite ? whiteKnight : blackKnight;
        this.possibleMoves = () => this.attack(true);
    }

    attack(checkCheck = false) { // jak to dodać?
        return [-2, -1, 1, 2].flatMap(i => [-2,-1,1,2]
            .filter(j => Math.abs(i) + Math.abs(j) === 3 && (!checkCheck || this.validateMove(i, j, false)) )
            .map(j => [i + this.x, j + this.y]));
    }

    canMove(moveX, moveY, premove = false) {
        return Math.abs(moveX * moveY) === 2 && (premove || this.validateMove(moveX, moveY, false));
            // Only knight moves multiplied give 
            // nie jest poza planszą
            // sprawdzenie czy król nie będzie szachowany
    }

    getPosition(){
        return `Skoczek-${this.x}-${this.y}`;
    }

    render(){
        return (
            <>
                <img 
                    className={`piece ${this.state.backgroundStyle}`}
                    ref={this.props.pointer}
                    src={this.graphic}
                    alt={`${this.props.isWhite ? 'white' : 'black'} knight`}
                />
            </>
        );
    }
}