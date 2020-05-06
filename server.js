var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var players = {};

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

server.listen(8081, function () {
  console.log(`Listening on ${server.address().port}`);
});

io.on('connection', function (socket) {
    // Connection
    console.log('a user connected');

    // Crée un nouvel objet Joueur avec ses données
    players[socket.id] = {
        x: Math.floor(Math.random() * 700) + 50,
        y: Math.floor(Math.random() * 500) + 50,
        playerId: socket.id,
        team: (Math.floor(Math.random() * 2) == 0) ? 'red' : 'blue'
    };
    // Envoie tout les objets Joueur au client local
    socket.emit('currentPlayers', players);
    // Envoie le nouveau Joueur aux autres clients
    socket.broadcast.emit('newPlayer', players[socket.id]);

    // Déconnection
    socket.on('disconnect', function () {
        console.log('user disconnected');
        // Supprime le joueur déconnecté de la liste de joueurs
        delete players[socket.id];
        // Envoie a tous les joueurs que le joueur s'est déconnecté
        io.emit('disconnect', socket.id);
    });

    // when a player moves, update the player data
    socket.on('playerMovement', function (movementData) {
        players[socket.id].x = movementData.x;
        players[socket.id].y = movementData.y;
        players[socket.id].flipX = movementData.flipX;
        // emit a message to all players about the player that moved
        socket.broadcast.emit('playerMoved', players[socket.id]);
    });
});