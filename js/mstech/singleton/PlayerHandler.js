

// public class PlayerHandler
function PlayerHandler() {
   this.TILE_SIZE = Constants.TILE_SIZE;
   this.HORIZONTAL = (TileGame.instance.canvas.width / this.TILE_SIZE) | 0;
   this.VERTICAL = (TileGame.instance.canvas.height / this.TILE_SIZE) | 0;
   this.SPEED = Constants.SPEED;
   this.HERO_HOR_LIMIT = TileGame.instance.canvas.width >> 1;
   this.HERO_VER_LIMIT = TileGame.instance.canvas.height >> 1;
   this.mapped = TileGame.instance.mapped;
   this.player = TileGame.instance.player;
   this.moveCode = 0;

   this.input = function input(keys) {
      this.ver = 0;
      this.hor = 0;
      this.moveCode = 0;

      if(keys[38] || keys[87]) { // up
         this.player.step(0, -1);
         this.employUp();
      } else if(keys[40] || keys[83]) { // down
         this.player.step(0, 1);
         this.employDown();
      } else if(keys[37] || keys[65]) { // left
         this.player.step(-1, 0);
         this.employLeft();
      } else if(keys[39] || keys[68]) { // right
         this.player.step(1, 0);
         this.employRight();
      }

      if(this.moveCode === 2) {
         this.mapped.loaded.x -= this.hor * this.SPEED;
         this.player.sprite.x += this.hor * this.SPEED;

         this.mapped.loaded.y -= this.ver * this.SPEED;
         this.player.sprite.y += this.ver * this.SPEED;

         this.node = this.mapped.loaded.getNode(this.player.sprite.x / this.TILE_SIZE, this.player.sprite.y / this.TILE_SIZE);
         if(this.node !== this.player._currentNode) this.player.setCurrentNode(this.node);
      } else if(this.moveCode === 1) {
         this.player.sprite.x += this.hor * this.SPEED;
         this.player.sprite.y += this.ver * this.SPEED;

         this.node = this.mapped.loaded.getNode(this.player.sprite.x / this.TILE_SIZE, this.player.sprite.y / this.TILE_SIZE);
         if(this.node !== this.player._currentNode) this.player.setCurrentNode(this.node);
      } else if(this.player.mc.currentAnimation.length <= 5) {
         this.player.updateState('still');
      }
   };

   this.employLeft = function employLeft() {
      this.testOne = this.player.sprite.x >= this.player._currentNode.center.x;
      if((this.player.surrounds[3] && this.player.surrounds[3].access !== 1) || this.testOne) {
         if(!this.player.surrounds[5] || this.player.surrounds[5].access !== 1 || this.testOne || this.player.sprite.y <= this.player._currentNode.center.y) {
            this.hor = -1;
            this.moveCode++;
            if(this.mapped.loaded.x < 0 && (this.player.sprite.x + this.mapped.loaded.x) <= this.HERO_HOR_LIMIT) this.moveCode++;
         }
      }
   };

   this.employRight = function employRight() {
      this.testOne = this.player.sprite.x <= this.player._currentNode.center.x;
      if((this.player.surrounds[4] && this.player.surrounds[4].access !== 1) || this.testOne) {
         if(!this.player.surrounds[7] || this.player.surrounds[7].access !== 1 || this.testOne || this.player.sprite.y <= this.player._currentNode.center.y) {
            this.hor = 1;
            this.moveCode++;
            if(this.mapped.loaded.x > this.mapped.loaded.horizontalEdge && this.player.sprite.x >= this.HERO_HOR_LIMIT) this.moveCode++;
         }
      }
   };

   this.employUp = function employUp() {
      if((this.player.surrounds[1] && this.player.surrounds[1].access !== 1) || this.player.sprite.y >= this.player._currentNode.center.y - (this.SPEED * 3)) {
         if(this.player.surrounds[0] && this.player.surrounds[2] && this.player.surrounds[0].access !== 1 && this.player.surrounds[0].access === this.player.surrounds[2].access) {
            this.ver = -1;
            this.moveCode++;
            if(this.mapped.loaded.y < 0 && (this.player.sprite.y + this.mapped.loaded.y) <= this.HERO_VER_LIMIT) this.moveCode++;
         } else {
            this.testOne = this.player.surrounds[0] && (this.player.surrounds[0].access !== 1 || this.player.sprite.x >= (this.player._currentNode.center.x - this.SPEED));
            this.testTwo = this.player.surrounds[2] && (this.player.surrounds[2].access !== 1 || this.player.sprite.x <= (this.player._currentNode.center.x + this.SPEED));

            if(this.testTwo && this.testOne) {
               this.ver = -1;
               this.moveCode++;
               if(this.mapped.loaded.y < 0 && (this.player.sprite.y + this.mapped.loaded.y) <= this.HERO_VER_LIMIT) this.moveCode++;
            } else if(this.player.sprite.y >= this.player._currentNode.center.y - (this.SPEED * 3) || !this.player.surrounds[0]) {
               this.ver = -1;
               this.moveCode++;
               if(this.mapped.loaded.y < 0 && (this.player.sprite.y + this.mapped.loaded.y) <= this.HERO_VER_LIMIT) this.moveCode++;
            }
         }
      }
   };

   this.employDown = function employDown() {
      if((this.player.surrounds[6] && this.player.surrounds[6].access !== 1) || this.player.sprite.y < this.player._currentNode.center.y) {
         if(this.player.surrounds[5] && this.player.surrounds[7] && this.player.surrounds[5].access !== 1 && this.player.surrounds[5].access === this.player.surrounds[7].access) {
            this.ver = 1;
            this.moveCode++;
            if(this.mapped.loaded.y > this.mapped.loaded.verticalEdge && this.player.sprite.y >= this.HERO_VER_LIMIT) this.moveCode++;
         } else {
            this.testOne = this.player.surrounds[5] && (this.player.surrounds[5].access !== 1 || this.player.sprite.x >= (this.player._currentNode.center.x - this.SPEED));
            this.testTwo = this.player.surrounds[7] && (this.player.surrounds[7].access !== 1 || this.player.sprite.x <= (this.player._currentNode.center.x + this.SPEED));

            if(this.testOne && this.testTwo) {
               this.ver = 1;
               this.moveCode++;
               if(this.mapped.loaded.y > this.mapped.loaded.verticalEdge && this.player.sprite.y >= this.HERO_VER_LIMIT) this.moveCode++;
            } else if(this.player.sprite.y < this.player._currentNode.center.y || !this.player.surrounds[5]) {
               this.ver = 1;
               this.moveCode++;
               if(this.mapped.loaded.y > this.mapped.loaded.verticalEdge && this.player.sprite.y >= this.HERO_VER_LIMIT) this.moveCode++;
            }
         }
      }
   };

   this.toggleTiles = function toggleTiles(value, centerNode) {
      this.initialH = centerNode.col - (this.HORIZONTAL >> 1);
      this.initialH--;
      
      if(this.initialH < 0) this.initialH = 0;
      
      this.finalH = this.initialH + this.HORIZONTAL;
      this.finalH++;
      
      if(this.finalH > this.mapped.loaded.cols - 1) {
         this.finalH = this.mapped.loaded.cols - 1;
         this.initialH = this.finalH - this.HORIZONTAL;
      }

      this.initialV = centerNode.row - (this.VERTICAL >> 1);
      this.initialV--;
      
      if(this.initialV < 0) this.initialV = 0;
      
      this.finalV = this.initialV + this.VERTICAL;
      this.finalV++;
      
      if(this.finalV > this.mapped.loaded.rows - 1) {
         this.finalV = this.mapped.loaded.rows - 1;
         this.initialV = this.finalV - this.VERTICAL;
      }

      for(this.x = this.finalH; this.x >= this.initialH; this.x--)
         for(this.y = this.finalV; this.y >= this.initialV; this.y--)
            this.mapped.loaded.toggleTile(value, this.x, this.y);
   };

   this.reposition = function reposition() {
      if(this.player.previousNode) this.toggleTiles(false, this.player.previousNode);
      this.node = this.player._currentNode;

      this.initialH = this.node.col - (this.HORIZONTAL >> 1);
      if(this.initialH < 0) {
         this.initialH = 0;
         this.finalH = this.initialH + this.HORIZONTAL;
         this.x = 0;
      } else {
         this.finalH = this.node.col + (this.HORIZONTAL >> 1);
         if(this.finalH >= this.mapped.loaded.cols - 1) {
            this.finalH = this.mapped.loaded.cols - 1;
            this.initialH = this.finalH - this.HORIZONTAL;
         }

         this.x = (this.initialH * this.TILE_SIZE) * -1;
         this.x -= Constants.HALF_TILE;
      }

      this.initialV = this.node.row - (this.VERTICAL >> 1);
      if(this.initialV < 0) {
         this.initialV = 0;
         this.finalV = this.initialV + this.VERTICAL;
         this.y = 0;
      } else {
         this.finalV = this.node.row + (this.VERTICAL >> 1);
         this.finalV++;
         
         if(this.finalV >= this.mapped.loaded.rows - 1) {
            this.finalV = this.mapped.loaded.rows - 1;
         }

         this.y = (this.initialV * this.TILE_SIZE) * -1;
         this.y -= Constants.HALF_TILE;
      }

      this.mapped.loaded.x = this.x;
      this.mapped.loaded.y = this.y;

      for(this.x = this.finalH; this.x >= this.initialH; this.x--)
         for(this.y = this.finalV; this.y >= this.initialV; this.y--)
            this.mapped.loaded.toggleTile(true, this.x, this.y);
   };
}