import { Component, } from "react";
import "../piece.css"
import { GameContext } from "../gameContext";
import { boardSize } from "../../HandyComponents/LogContext";

export class Piece extends Component {
    static contextType = GameContext; 
    
    state = {
        clicked: false
    }

    constructor({i, j, isPlayer}) {
        super();
        this.x = i;
        this.y = j;
        this.isPlayer = isPlayer;
    }

    isAtCheck(moveX, moveY) {
        const {playerPieces} = this.context;

        // temporary change of figure placement
        [this.x, this.y] = [this.x + moveX, this.y + moveY];
        
        const alliedKing = playerPieces.current[this.isPlayer ? 'allyPieces' : 'enemyPieces'].find(p => p.current.type === 'King').current;
        
        const toRet = playerPieces.current[this.isPlayer ? 'enemyPieces' : 'allyPieces'].some(p => 
            p.current.attack().some(([x, y]) => alliedKing.x === x && alliedKing.y === y) &&
            (this.x !== p.current.x || this.y !== p.current.y) // kiedy figura jest bita pod szachem
        );
        
        // back to previous position
        [this.x, this.y] = [this.x - moveX, this.y - moveY];
        return toRet;
    }

    validateMove(moveX, moveY, isNotKnight = true) {
        const { playerPieces} = this.context;
        const [newX, newY] = [this.x + moveX, this.y + moveY];
        const [dx, dy] = [Math.sign(moveX), Math.sign(moveY)];

        // Early returns for basic validations
        if (newX < 0 || newY < 0 || newX >= boardSize || newY >= boardSize) return false;
        if (playerPieces.current[this.isPlayer ? 'allyPieces' : 'enemyPieces']
            .some(p => p.current.x === newX && p.current.y === newY)) return false;
    
        // Check path collision for non-knight pieces
        if (isNotKnight) {
            let [x, y] = [this.x + dx, this.y + dy];
            const allPieces = [...playerPieces.current.allyPieces, ...playerPieces.current.enemyPieces]
            while (x !== newX || y !== newY) {
                if (allPieces.some(p => p.current.x === x && p.current.y === y)) return false;
                x += dx;
                y += dy;
            }
        }

        return !this.isAtCheck(moveX, moveY);
    }

    clicked() {
        this.setState({
            backgroundStyle: this.isPlayer ? 'clicked-ally' : 'clicked-enemy',
        });
    }

    unclicked() {
        this.setState({
            backgroundStyle: '',
        });
    }

    render() {
        return (
            <div>
                {this.props.children}
            </div>
        )
    }   
}