import React from 'react';
import { Piece } from './Piece';
import { boardSize } from '../../HandyComponents/LogContext';
import "../piece.css"

import blackRook from '../../Assets/blackPieces/rook.png';
import whiteRook from '../../Assets/whitePieces/rook.png'

export class Rook extends Piece {
    type = 'Rook';

    constructor({isWhite, i, j, isPlayer}){
        super({i, j, isPlayer});
        this.graphic = isWhite ? whiteRook : blackRook;
        this.possibleMoves = () => this.attack(true);
    }

    attack(checkCheck = false) {
        const {playerPieces : {current}} = this.context;
        const pieces = [...current.allyPieces, ...current.enemyPieces];
        const alliedPieces = current[this.isPlayer ? 'allyPieces' : 'enemyPieces'];

        let iterContinue = {left: true, right: true, up: true, down: true};
        let moves = [];

        for(let i = 1; i < boardSize; i++) {
            let newX = this.x - i;
            if(iterContinue.left && newX >= 0 && (!checkCheck || this.validateMove(-i, 0))) { // to daje włącznie z biciem moich bierek
                iterContinue.left = !pieces.some(p => p.current.x === newX && p.current.y === this.y);
                moves.push([newX, this.y]);
            }
            newX = this.x + i;
            if(iterContinue.right && newX < boardSize && (!checkCheck || this.validateMove(i, 0))) {
                iterContinue.right = !pieces.some(p => p.current.x === newX && p.current.y === this.y);
                moves.push([newX, this.y]);
            }
            let newY = this.y + i;
            if(iterContinue.up && newY < boardSize && (!checkCheck || this.validateMove(0, i))) {
                iterContinue.up = !pieces.some(p => (p.current.x === this.x && p.current.y === newY));
                moves.push([this.x, newY]);
            }
            newY = this.y - i;
            if(iterContinue.down && newY >= 0 && (!checkCheck || this.validateMove(0, -i))) {
                iterContinue.down = !pieces.some(p => (p.current.x === this.x && p.current.y === newY));
                moves.push([this.x, newY]);
            }
        }

        return moves;
    }

    canMove(moveX, moveY) {
        return moveX * moveY === 0 && this.validateMove(moveX, moveY);
    }

    getPosition(){
        return `Wieza-${this.x}-${this.y}`;
    }

    render(){
        return (
            <img 
                className={`piece ${this.state.backgroundStyle}`}
                ref={this.props.pointer}
                src={this.graphic}
                alt={`${this.props.isWhite ? 'white' : 'black'} rook`}
            />
        );
    }
}