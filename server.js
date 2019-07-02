require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const POKEDEX = require('./pokedex.json');

const app = express();

app.use(morgan('common'));
app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get('Authorization');

    console.log('validateBearerToken middleware...');

    if(!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({error: 'Unauthorized request'});
    }

    // move to the next middleware
    next();
});

const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`];

app.get('/pokemon', handleGetPokemon);

app.get('/types', handleGetTypes);

function handleGetTypes(req, res) {
    res.json(validTypes);
}

function handleGetPokemon(req, res) {
    let {name, type} = req.query;
    
    // If name isn't provided, set it to an empty string to match everything
    if(!name) {
        name = '';
    }

    // make sure that the type parameter is valid if provided
    if(type) {
        //if(validTypes.filter(t => t.toLowerCase() === type.toLowerCase()) == false) {
        if(!validTypes.includes(type)) {
            return res.status(400).json({error: 'type parameter must be a valid type'});
        }
    }
    
    // find matching names
    let results = POKEDEX.pokemon.filter(p => p.name.toLowerCase().includes(name.toLowerCase()));

    // if provided, filter the results by type
    if(type) {
        //results = results.filter(p => p.type.filter(pt => pt.toLowerCase() === type.toLowerCase()) == true);
        results = results.filter(p => p.type.includes(type));
    }

    res.json(results);
}

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}/`);
});
