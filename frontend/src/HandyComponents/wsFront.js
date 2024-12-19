import { moveFunctions } from "../Game/PieceContainer";
import { boardSize } from "./LogContext";
import { gameStates } from "../Game/gameContext";
import { timeControl } from "../Game/InfoTab";

export class WebSocketClient { // najpierw dajmy tak żeby user grał tylko jedną partię na raz potem się zmieni
    constructor(url) {
        this.url = url;
        this.ws = null;
        this.isTransitioning = false;
        this.lastTimestamp = null;
    }

    async convert2JSON(message) {
        if(typeof message?.data === 'string') { // JSON
            return JSON.parse(message.data);
        } else { // Blob
            return JSON.parse(await message.data.text());
        }
    }

    connect() {
        if(this.isTransitioning) {
            console.log("Connection already exists.");
            return
        }

        this.ws = new WebSocket(this.url);
        this.isTransitioning = true; // connecting

        this.ws.onmessage = async (message) => {
            try {
                const messageJSON = await this.convert2JSON(message)
                if(messageJSON.type === 'delay') {
                    const { newTimestamp, oldTimestamp } = messageJSON;
                    timeControl(newTimestamp - oldTimestamp);
                } else if(messageJSON.type === 'move') {
                    const [content] = Object.values(messageJSON.body);
                    const key = `${content.finalSquares.x - content.move.x}-${boardSize - content.finalSquares.y + content.move.y - 1}`;
                    
                    gameStates.set(prev => ({...prev, isWhiteToMove: !prev.isWhiteToMove}));
                    timeControl(messageJSON.oldTimestamp - Date.now());
                    
                    await moveFunctions.functions[key](content.move.x, -content.move.y);
                }
            } catch(error) {
                console.log("Error caught in wsClass.js:", error);
            }
        };
        
        this.ws.onping = (message) => {
            this.ws.pong(message);
        }

        this.ws.onopen = () => {
            this.isConnecting = false;
        };

        this.ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
  
        this.ws.onclose = () => { // automatic reconnection after delay
            if(!this.isTransitioning) {
                setTimeout(() => this.connect(), 1000);
            }
        };
    }

    disconnect(closingReason) {
        if( this.ws ) {
            this.isTransitioning = true;
            this.ws.close(closingReason);
            this.ws = null;
        }
    }

    send(object) {
        if (this.ws?.readyState === this.ws.OPEN) {
            this.ws.send( JSON.stringify({...object, oldTimestamp: Date.now()}) ); // data is already a JSON / string which indicates it's JSON
        }
    }
}