let waitingPlayers = {};

let call = {};

export function handleConnection(ws, req) {
    const query = new URL(req.url, 'ws://localhost:8080').searchParams;
    const username = query.get('username');
    const opponentName = query.get('opponent');

    const opponentsWS = waitingPlayers?.[opponentName];

    if (waitingPlayers[username]) {
        waitingPlayers[username].close();
        delete waitingPlayers[username];
    }

    call[username] = (call[username] || 0) + 1;

    ws.username = username;

    console.log("======== CONNECTION =============");
    console.log(`Czy wszedł do któregoś z ifów ${!ws.opponent}`);
    console.log(`Before the call #${call[username]} of ${username}`);
    console.log(`${username} Opponent exists ${!!ws.opponent}`);
    console.log(`${opponentName} Opponent exists ${!!opponentsWS}`);

    if(opponentsWS && !ws.opponent && !opponentsWS.opponent) {
        ws.opponent = opponentsWS;
        opponentsWS.opponent = ws;

        delete waitingPlayers[opponentName];
    } else if(!ws.opponent) {
        waitingPlayers[username] = ws;
    }

    console.log(`Po callu`);
    console.log(`${username} Opponent exists ${!!ws.opponent}`);
    console.log(`${opponentName} Opponent exists ${!!opponentsWS}`);
    console.log('\n');

    // Add disconnect handler
    ws.on('close', () => {
        delete waitingPlayers[username];
        if(ws.opponent) {
            ws.opponent.opponent = null;
        }
    });

    // When message is sent
    ws.on('message', (bufferMessage) => {
        if(ws.opponent) {
            try {
                ws.opponent.send(bufferMessage);
            } catch(error) {
                console.log("Send failed:", error);
            }
        }
    });

    // Add connection event handler
    ws.on('open', () => {
        console.log("New connection opened for:", username);
    });

    ws.on('close', () => {
        console.log("Connection closed for:", username);
    });

    const interval = setInterval(() => {
        ws.ping(JSON.stringify({type: 'ping', timestamp: Date.now()}));
    });

    ws.on('ping', (message) => {
        const oldTimestamp = JSON.parse(message).timestamp;
        const newTimestamp = Date.now();
        const delay = (newTimestamp - oldTimestamp) / 2;
        console.log(`Incoming delay of ${delay}`)
    });
};