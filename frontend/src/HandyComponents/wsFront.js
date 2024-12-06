import { moveFunctions } from "../Game/PieceContainer";
import { boardSize } from "./LogContext";

export class WebSocketClient { // najpierw dajmy tak żeby user grał tylko jedną partię na raz potem się zmieni
    constructor(url) {
        this.url = url;
        this.ws = null;
        this.isConnecting = false;
    }

    connect() {
        if(this.isConnecting) {
            console.log("Connection already exists.");
            return
        }

        this.ws = new WebSocket(this.url);
        this.isConnecting = true;

        this.ws.onmessage = async (message) => {
            try {
                const data = await message.data.text(); // from blob to JSON
                const object = JSON.parse(data);
                if(object.type === 'move') {
                    const [move] = Object.values(JSON.parse(data).body); // parse for object, get out first element.
                    const squares = { // pola przed ruchem
                        x: move.finalSquares.x - move.move.x,
                        y: boardSize - move.finalSquares.y + move.move.y - 1,
                    };
                    const key = `${squares.x}-${squares.y}`;
        
                    await moveFunctions.functions[key](move.move.x, -move.move.y);
                } else if(object.type === 'ping') {
                    console.log(message);
                    this.send(message);
                }
            } catch(error) {
                console.log("Error caught in wsClass.js")
                console.log(error);
            }
        };

        this.ws.onopen = () => {
            this.isConnecting = false;
        }

        this.ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
  
        this.ws.onclose = () => { // automatic reconnection after delay
            setTimeout(() => this.connect(), 1000); // such delay doesn't scale up, consumes a lot of resources in the backend
        };
    }

    send(data) {
        if (this.ws?.readyState === this.ws.OPEN) {
            this.ws.send( data ); // data is already a JSON / string which indicates it's JSON
        }
    }
}