import http from 'http';
import url from 'url';
import { MongoClient, ServerApiVersion } from 'mongodb';

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
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); 
    
    const urlRequest = url.parse(req.url, true);

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        return res.end();
    } else if (req.method === 'GET') {
        let user;

        try {
            user = await client.db('chess').collection('users').findOne({$or: [
                {user: urlRequest.query?.user},
                {email: urlRequest.query?.email}
            ]})
        } catch(error) {
            res.writeHead(204, {'Content-Type': 'application/json'})
            res.end(JSON.stringify({message: 'Error getting the user from db'}))
            return ;
        }

        console.log(user)

        if(urlRequest.path.startsWith('/get-user') && user !== null) {
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
        } else {
            console.error(`GET method URL request not recognized the path was ${urlRequest.pathname}`);
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({message: 'Method not found'}));
        }
    } else if (req.method === 'POST') {
        if (urlRequest.pathname.startsWith('/set-user')) {
            let body = '';

            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', async () => {
                try {
                    const usersCollection = client.db('chess').collection('users');
                    const gotInfo = JSON.parse(body);
    
                    if (!gotInfo.email || !gotInfo.user || !gotInfo.password) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        return res.end(JSON.stringify({ message: `Missing required fields`}));
                    }

                    const records = await usersCollection.findOne({ 
                        $or: [
                            {email: gotInfo.email},
                            {user: gotInfo.user}
                        ]
                    });

                    if (records !== null) { // Sign up on an existing user
                        res.writeHead(200, { 'Content-Type': 'application/json' });
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
        } else {
            console.error('Request Error:', err);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Bad Request' }));
        } 
    } else {
        console.error('Method not recognized');
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method Not Allowed');
    }
};

initializeDb().then(() => {
    const server = http.createServer(handleRequest);

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