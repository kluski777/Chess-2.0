import http from 'http';
import { handleRequest } from './core/net/httpserver.mjs';
import { WebSocketServer } from 'ws';
import { handleConnection } from './core/net/wsBackLogic.mjs';
import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = "mongodb+srv://kluski777:reltiHflodA5491@cluster0.ebxq6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

let client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    tls: true,
});

async function initializeDb() {
    try {
        await client.connect();
        console.log("The db has been initialized");
    } catch(error) {
        console.error(`Database not initialized due to ${error}`);
    }
};

initializeDb().then(() => {
    const serverTemp = http.createServer((req, res) => handleRequest(client, req, res));

    const wss = new WebSocketServer({server: serverTemp});

    wss.on('connection', handleConnection);

    const PORT = 5500;
    serverTemp.listen(PORT);

    process.on('SIGINT', () => {
        serverTemp.close(async () => {
            await client.close();
            process.exit(0);
        });
    });
}).catch(err => console.error('Failed to start server:', err));