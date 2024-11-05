import {useState, useEffect} from 'react';

// Simple hook
const useChessWebSocket = (userObject) => {
    const [ws, setWs] = useState(null);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:5500');
        
        socket.onopen = () => {
            // Connect with username
            socket.send(JSON.stringify({
                type: 'connect',
                userObject,
            }));
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            // Handle received moves
            if (data.type === 'move') {
                console.log('Received move:', data.move);
            }
        };

        setWs(socket);

        return () => socket.close();
    }, [userObject]);

    // Function to send moves
    const sendMove = (opponentUsername, move) => {
        if (ws) {
            ws.send(JSON.stringify({
                type: 'move',
                to: opponentUsername,
                move
            }));
        }
    };

    return { sendMove };
};