import React, {useState, useEffect} from 'react';
import { eventBus } from '../PieceContainer';
import { Piece } from './Piece';
import { waitForCondition } from '../../HandyComponents/HandyComponents';
import { boardSize } from '../../HandyComponents/LogContext';
import "../piece.css"

import whitePawn from '../../Assets/whitePieces/pawn.png';
import blackPawn from '../../Assets/blackPieces/pawn.png';

// to promote
import whiteQueen from '../../Assets/whitePieces/queen.png';
import whiteRook from '../../Assets/whitePieces/rook.png';
import whiteBishop from '../../Assets/whitePieces/bishop.png';
import whiteKnight from '../../Assets/whitePieces/knight.png';

import blackQueen from '../../Assets/blackPieces/queen.png';
import blackRook from '../../Assets/blackPieces/rook.png';
import blackBishop from '../../Assets/blackPieces/bishop.png';
import blackKnight from '../../Assets/blackPieces/knight.png';

export class Pawn extends Piece {
    type = 'Pawn';

    constructor({isWhite, i, j, isPlayer}){
        super({i, j, isPlayer});
        this.graphic = isWhite ? whitePawn : blackPawn;
        this.direction = isPlayer ? -1 : 1;
        this.state = {
            promotes: 'pawn',
            shift: 0,
        }
    }

    async possibleMoves() {
        const allPossibleMoves = [
            [-1, this.direction],
            [ 1, this.direction],
            [ 0, this.direction],
            [ 0, 2*this.direction],
        ];
        const movesAllowed = await Promise.all(
            allPossibleMoves.map(async ([x, y]) => ({
                move: [x, y],
                valid: await this.canMove(x, y),
            }))
        );
        return movesAllowed.filter(({valid}) => valid).map(val => val.move);
    }

    attack() { // squares pawn can attack
        return [-1, 1].map(x => [this.x + x, this.y + this.direction]);
    }

    async canMove(moveX, moveY) {
        const {playerPieces, gameEvents, moveHistory} = this.context;
        const enemyPieces = playerPieces.current[this.isPlayer ? 'enemyPieces' : 'allyPieces']
        const isValid = (
            ((moveY === this.direction && !moveX && enemyPieces.every(p => p.current.x !== this.x + moveX || p.current.y !== this.y + moveY)) || 
            (moveY === 2*this.direction && !moveX && this.y%(boardSize - 3) === 1 && enemyPieces.every(p => p.current.x !== this.x + moveX || p.current.y !== this.y + moveY)) ||
            (Math.abs(moveX) * moveY === this.direction && enemyPieces.some(p => p.current.x === this.x + moveX && p.current.y === this.y + moveY))) &&
            this.validateMove(moveX, moveY)
        );
        if(isValid && (this.y === boardSize - 1 || this.y === 0)){ // promotion
            this.setState({promotes: 'promotes',  shift: moveX});
            await waitForCondition(() => this.state.promotes !== 'promotes', 20); // waiting state to change
            await waitForCondition(() => this.state.promotes === 'promotes', 100); // waiting for user to choose the piece

            if(this.state.promotes === 'Pawn') // no new piece chosen
                return false; // invalid move

            eventBus.emit(`setStates-${this.props.i}-${this.props.j}`, {
                type: this.state.promotes,
                isPieceWhite: this.props.isWhite,
            }); // changes piece type
        }
        
        const lastMove = moveHistory.current.at(-1)?.Pawn;
        const secondLastMove = moveHistory.current.at(-2)?.Pawn?.finalSquares;
    
        if( 
            Math.abs(moveX) * moveY === this.direction && // diagonal move
            secondLastMove?.x === this.x && secondLastMove?.y === this.y && // previous ally move was with this pawn
            lastMove?.finalSquares?.x === this.x + moveX && lastMove?.finalSquares?.y === this.y && // previous enemy move was to allow enpassant
            lastMove?.move?.y === -2*this.direction && 
            !this.isAtCheck(moveX, moveY)
        ) {
            document.querySelector(`#square-${this.x + moveX}-${this.y}`).replaceChildren();
            playerPieces.current[this.isPlayer ? 'enemyPieces' : 'allyPieces'] = enemyPieces.filter(p => p.current.x !== this.x + moveX || p.current.y !== this.y);
        
            return true; // pawn takes enPassant allowed
        }

        return isValid;
    }

    getPosition(){
        return `Pionek-${this.x}-${this.y}`;
    }

    render(){
        const {Background} = this;
        return (
            <>
                {this.state.promotes === 'promotes' ?
                    <>
                        <Background/>
                        <div
                            className='to-choose-container' 
                            style={{transform: `translate(${this.state.shift*100}%,${this.isPlayer ? '12.5%' : '-12.5%'})`}}
                        >
                            <img
                                className={`piece-to-choose`}
                                alt='queen-to-choose'
                                onClick={() => this.setState({promotes: 'Queen'})}
                                src={this.props.isWhite ? whiteQueen : blackQueen}
                            />
                            <img
                                className={`piece-to-choose`}
                                alt='rook-to-choose'
                                onClick={() => this.setState({promotes: 'Rook'})}
                                src={this.props.isWhite ? whiteRook : blackRook}
                            />
                            <img
                                className={`piece-to-choose`}
                                alt='bishop-to-choose'
                                onClick={() => this.setState({promotes: 'Bishop'})}
                                src={this.props.isWhite ? whiteBishop : blackBishop}
                            />
                            <img
                                className={`piece-to-choose`}
                                alt='knight-to-choose'
                                onClick={() => this.setState({promotes: 'Knight'})}
                                src={this.props.isWhite ? whiteKnight : blackKnight}
                            />
                        </div>
                    </> :
                    <img 
                        className={`piece ${this.state.backgroundStyle}`}
                        ref={this.props.pointer}
                        src={this.graphic}
                        alt={`${this.props.isWhite ? 'white' : 'black'} pawn`}
                    />
                }
            </>
        );
    }

    Background = () => {
        const [width, setWidth] = useState(window.innerWidth);
        const [height, setHeight] = useState(window.innerHeight);

        useEffect(() => {
            const handleResize = () => {
                setWidth(window.innerWidth);
                setHeight(window.innerHeight);
            };
            handleResize();
            window.addEventListener('resize', handleResize);
        
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }, []);
        
        return <div
                className='background'
                style={{
                    position: 'fixed',
                    width: `${width}px`,
                    height: `${height}px`,
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -45%)',
                }}
                onClick={() => {
                    this.setState({promotes: 'Pawn'});
                }}
            />
    }
}