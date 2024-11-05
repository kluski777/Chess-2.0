import http from 'http';
import url from 'url';
import { MongoClient, ServerApiVersion } from 'mongodb';
import { WebSocketServer } from 'ws';

const uri = "mongodb+srv://kluski777:reltiHflodA5491@cluster0.ebxq6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
let client;

client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    tls: true,
});
  
async function initializeDb() {
    try { // tu trzeba sie będzie pobawić
        await client.connect();
        console.log("The db has been initialized");
    } catch(error) {
        console.error(`Database not initialized due to ${error}`);
    }
}

const handleRequest = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allow specific headers
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE'); 
    
    const urlRequest = url.parse(req.url, true);

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        return res.end();
    } else if (req.method === 'GET') {
        let user;

        
        if(urlRequest.path.startsWith('/get-user')) {
            try {
                user = await client.db('chess').collection('users').findOne({
                    $and: [
                        {
                            $or: [
                                {user: urlRequest.query?.user},
                                {email: urlRequest.query?.email}
                            ]
                        },
                        {password: urlRequest.query?.password}
                    ]
                })
            } catch(error) {
                res.writeHead(204, {'Content-Type': 'application/json'})
                res.end(JSON.stringify({message: 'Error getting the user from db'}))
                return ;
            }
            
            if( user !== null ) {
                const jsonResponse = JSON.stringify({
                    message: 'User found',
                    userInfo: {
                        user: user.user,
                        rating: user.rating,
                    }
                })
                res.writeHead(200, {'Content-Type': 'application/json'})
                res.end(jsonResponse)
            } else if(urlRequest.path.startsWith('/get-user')) {
                res.writeHead(200, {'Content-Type': 'application/json'})
                res.end(JSON.stringify({message: 'User not found or wrong password'}))
            }
        } else if(urlRequest.path.startsWith('/pairing')) {
            const opponent = await client.db('chess').collection(`queue-${urlRequest.query.format}`)
            .findOneAndDelete({$and: [{user: urlRequest.query.user}, {opponent: {$ne: ''}}]});
            
            if(opponent) {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({message: 'oponent info', opponent: opponent}));
            } else {
                res.writeHead(200);
                res.end(JSON.stringify({message: 'User not found'}));
            }
        } else {
            console.error(`GET method URL request not recognized the path was ${urlRequest.pathname}`);
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({message: 'Method not found'}));
        }
    } else if (req.method === 'POST') {
        if (urlRequest.pathname.startsWith('/set-user')) {         
            const usersCollection = client.db('chess').collection('users');
            let body = '';
            
            req.on('data', chunk => { // mozna uzyc body.push z tego pojdzie array
                body += chunk.toString();
            });
            
            req.on('end', async () => {
                try {
                    const gotInfo = JSON.parse(body);
                    
                    if (!gotInfo.email || !gotInfo.user || !gotInfo.password) {
                        res.writeHead(400, { 'Content-Type' : 'application/json' });
                        return res.end(JSON.stringify({ message: `Missing required fields` }));
                    }

                    const records = await usersCollection.findOne({ 
                        $or: [
                            {email: gotInfo.email},
                            {user: gotInfo.user},
                        ]
                    });

                    if (records !== null) { // Username or email already taken
                        res.writeHead(200, { 'Content-Type' : 'application/json' });
                        if( records.user === gotInfo.user )
                            return res.end(JSON.stringify({ message: `What belongs to you but is used by others? Your username ${records.user}! Try another.` }));
                        else 
                            return res.end(JSON.stringify({ message: `Your email '${records.email}' is having a typo party! Find the sneaky guest and try again!`}))
                    }
    
                    // Creating new user
                    await usersCollection.insertOne({
                        email: gotInfo.email,
                        user: gotInfo.user,
                        password: gotInfo.password,
                        rating: 1200,
                    });

                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'User created successfully' }));
                } catch (error) {
                    console.error('Error handling POST /set-user:', error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ message: 'Internal Server Error' }));
                }
            });
        } else if( urlRequest.pathname.startsWith('/pairing') ) {
            let body = '';
            const pairingCollection = client.db('chess').collection(`queue-${urlRequest.query.format}`);
  
            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', async () => {
                try {
                    let playerRequest = JSON.parse(body);
                    playerRequest.rating = Number(playerRequest.rating);

                    const isPresent = await pairingCollection.findOne({
                        user: playerRequest.user
                    });
                    const pair = await pairingCollection.findOneAndUpdate(
                        {$and: [
                            {rating: {$lte: playerRequest.rating + 100, $gte: playerRequest.rating - 100}},
                            {user: {$ne: playerRequest.user}},
                            {opponent: ''}
                        ]},
                        {$set: {opponent: playerRequest.user}},
                        {returnDocument: 'after'}
                    );

                    if(isPresent) {
                        // chyba nie powininem sie tego obawiac, ale tak na wszelki wypadek
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({message: 'Already present in the db'}));
                    } else if(pair) {
                        // znalezienie pary
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({opponent: pair}))
                    } else {
                        // add the pairing
                        await pairingCollection.insertOne({
                            user: playerRequest.user,
                            rating: playerRequest.rating,
                            opponent: '',
                        });

                        res.writeHead(201, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({messege: 'Added user request to the database'}));
                    }
                } catch(error) {
                    console.log("JSON sie wyjebal linijka 166");
                    console.log(error);
                    res.end(204);
                }
            });
        } else {
            console.error('Request Error:');
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Bad Request' }));
        } 
    } else if(req.method === 'DELETE') {
        if(urlRequest.pathname.startsWith('/pairing')) {
            try {
                let body = '';
    
                req.on('data', chunk => {
                    body += chunk.toString();
                });
    
                req.on('end', async () => {
                    const toDelete = JSON.parse(body);
                    const pairingColletion = client.db('chess').collection(`queue-${urlRequest.query.format}`);
                    const deleteResult = await pairingColletion.deleteOne({user: toDelete.user});
                    if( deleteResult.acknowledged ) {
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({message: 'Deleted pairing'}));
                    } else {
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({message: 'Deletion unsuccessful'}));
                    }
                });
            } catch(error) {
                console.log(error);
            }
        }
    } else {
        console.error('Method not recognized');
        res.writeHead(405, {'Content-Type': 'text/plain'});
        res.end('Method Not Allowed');
    }
};

const wsConnection = (socket) => {
    console.log("We have a new client");

    socket.on('message', (message) => {
        const messageObject = JSON.parse(message);
        console.log('Received ', messageObject);
    })

    socket.on('close', () => {
        console.log('User disconnected');
    })
}

initializeDb().then(() => {
    const server = http.createServer(handleRequest);

    const wss = new WebSocketServer( {server} );

    wss.on('connection', wsConnection);

    const PORT = 5500;
    server.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}/`);
    });

    const shutdown = () => {
        console.log('Closing server...');
        server.close(async () => {
            console.log('Server closed.');
            // Close the MongoDB connection here
            try {
                await client.close();
                console.log('MongoDB connection closed.');
            } catch (err) {
                console.error('Error closing MongoDB connection:', err);
            }
            process.exit(0); // Exit the process
        });
    };

    // Listen for termination signals (e.g., Ctrl+C in the terminal)
    process.on('SIGINT', shutdown); // On Ctrl+C
    process.on('SIGTERM', shutdown); // On system kill signals
}).catch(err => {
    console.error('Failed to start server:', err);
});