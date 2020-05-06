var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 200 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

let otherPlayer;
let floor;
let cursors;
const vitesse = 200;

function preload() {
    this.load.image('bg', '/assets/background.jpg');
    this.load.image('player', '/assets/sprites/idle.gif');
}

function create() {

    var self = this;
    this.socket = io();

    this.add.image(0, 0, 'bg').setOrigin(0, 0);

    this.otherPlayers = this.physics.add.group();

    floor = this.add.rectangle(512, 560, 1024, 50);
    this.physics.add.existing(floor);
    floor.body.allowGravity = false;
    floor.body.immovable = true;

    this.socket.on('currentPlayers', function (players) {
        Object.keys(players).forEach(function (id) {
            if (players[id].playerId === self.socket.id) {
                addPlayer(self, players[id]);
            } else {
                addOtherPlayers(self, players[id]);
            }
        });
    });
    this.socket.on('newPlayer', function (playerInfo) {
        addOtherPlayers(self, playerInfo);
    });
    this.socket.on('disconnect', function (playerId) {
        self.otherPlayers.getChildren().forEach(function (otherPlayer) {
            if (playerId === otherPlayer.playerId) {
                otherPlayer.destroy();
            }
        });
    });

    cursors = this.input.keyboard.createCursorKeys();

    this.socket.on('playerMoved', function (playerInfo) {
        self.otherPlayers.getChildren().forEach(function (otherPlayer) {
            if (playerInfo.playerId === otherPlayer.playerId) {
                otherPlayer.setPosition(playerInfo.x, playerInfo.y);
                otherPlayer.flipX = playerInfo.flipX;
            }
        });
    });

}

function update() {
    if (this.player) {
        player_gameplay(this);

        var x = this.player.x;
        var y = this.player.y;
        var flipX = this.player.flipX;
        if (this.player.oldPosition && (x !== this.player.oldPosition.x || y !== this.player.oldPosition.y || flipX !== this.player.oldPosition.flipX)) {
            this.socket.emit('playerMovement', { x: this.player.x, y: this.player.y, flipX: this.player.flipX });
        }

        // save old position data
        this.player.oldPosition = {
            x: this.player.x,
            y: this.player.y,
            flipX: this.player.flipX
        };
    }
}