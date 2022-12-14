const express = require('express');
const { ApolloServer } =  require('apollo-server-express');
// const { authMiddleware } = require( )

const db = require('./config/connection'); 

const app = express(); 
const PORT = process.env.PORT || 3001; 

const server = new ApolloServer({
    typeDefs, 
    resolvers,
    // context: authMiddleware 
})


app.use(express.urlencoded({ extended: false })); 
app.use(express.json()); 

// if in production. serve client build as static assets 
if (process.env.NODE_ENV === 'production') { 
    app.use(express.static(path.join(__dirname, '../client/build/index.html')));
}

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
}); 

app.use(function(err, req, res, next) {
    res.send('uncaught error in production');
})

const startApolloServer = async (typeDefs, resolvers) => {
    await server.start(); 

    server.applyMiddleware({ app }); 

    db.once('open', () => {
        app.listen(PORT, () => {
            console.log(`API server running on port ${PORT}`);
            console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
        });
    });
}

startApolloServer(typeDefs, resolvers);