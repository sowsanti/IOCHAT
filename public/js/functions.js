function addPlayer(self, playerInfo) {
    self.player = self.physics.add.image(playerInfo.x, playerInfo.y, 'player');
    //self.player.setGravityY(200);
    self.physics.add.collider(self.player, floor);
}

function addOtherPlayers(self, playerInfo) {
    otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'player');
    otherPlayer.playerId = playerInfo.playerId;
    //otherPlayer.setGravityY(200);
    self.physics.add.collider(otherPlayer, floor);
    self.otherPlayers.add(otherPlayer);
}

function player_gameplay (self) {
    if (cursors.left.isDown) {
        self.player.setVelocityX(vitesse * -1);
        self.player.flipX = true;
        self.player.walk = true;
    } else if (cursors.right.isDown) {
        self.player.setVelocityX(vitesse);
        self.player.flipX = false;
        self.player.walk = true;
    } else {
        self.player.setVelocityX(0);
        self.player.walk = false;
    }

    if (cursors.up.isDown && (self.player.body.blocked.down || self.player.body.touching.down)) {
        self.player.setVelocityY(-100); // 1350
    }

    if (self.player.body.velocity.y > 0 && !(self.player.body.blocked.down || self.player.body.touching.down)) {
        self.player_down = true;
    } else if (self.player.body.velocity.y < 0 && !(self.player.body.blocked.down || self.player.body.touching.down)) {
        self.player_down = true;
    }
}
