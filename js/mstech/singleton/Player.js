

// public class Player
Player.prototype = new Interactable('p');
Player.prototype.constructor = Player;
function Player() {
   this.surrounds = null;
   this.previousNode = null;
   this.checkpoint = null;
   this.horizontalEdge = -1;
   this.verticalEdge = -1;
   this.blinkCount = 0;
   this.direction = 'R';
   this.i = 0;

   this.hitArea = new createjs.Shape();
   this.hitArea.graphics.beginFill('#fff000').drawRect(0, 0, Constants.HALF_TILE / 1.5, Constants.HALF_TILE / 2);
   this.sprite.addChild(this.hitArea);
   this.hitArea.alpha = .05;
   this.hitArea.x = Constants.HALF_TILE / 1.5;
   this.hitArea.y = Constants.TILE_SIZE - (Constants.HALF_TILE / 2);

   horizontalEdge = TileGame.instance.canvas.width - Constants.TILE_SIZE;
   verticalEdge = TileGame.instance.canvas.height - Constants.TILE_SIZE;

   this.setCurrentNode = function setCurrentNode(node) {
      if(this._currentNode && this._currentNode !== node) {
         this.previousNode = this._currentNode;
         TileGame.instance.playerHandler.toggleTiles(false, this._currentNode);
      }
      this._currentNode = node;
      TileGame.instance.playerHandler.toggleTiles(true, node);

      this.surrounds = new Array(8);
      if(node.row > 0) {
         if(node.col > 0) this.surrounds[0] = TileGame.instance.mapped.loaded.nodes[node.col - 1][node.row - 1];
         this.surrounds[1] = TileGame.instance.mapped.loaded.nodes[node.col][node.row - 1];
         if(node.col < (TileGame.instance.mapped.loaded.cols - 1)) this.surrounds[2] = TileGame.instance.mapped.loaded.nodes[node.col + 1][node.row - 1];
      }

      if(node.col > 0) this.surrounds[3] = TileGame.instance.mapped.loaded.nodes[node.col - 1][node.row];
      if(node.col < (TileGame.instance.mapped.loaded.cols - 1)) this.surrounds[4] = TileGame.instance.mapped.loaded.nodes[node.col + 1][node.row];

      if(node.row < (TileGame.instance.mapped.loaded.rows - 1)) {
         if(node.col > 0) this.surrounds[5] = TileGame.instance.mapped.loaded.nodes[node.col - 1][node.row + 1];
         this.surrounds[6] = TileGame.instance.mapped.loaded.nodes[node.col][node.row + 1];
         if(node.col < (TileGame.instance.mapped.loaded.cols - 1)) this.surrounds[7] = TileGame.instance.mapped.loaded.nodes[node.col + 1][node.row + 1];
      }
   };

   this.checkSurrounds = function checkSurrounds() {
      if(this._currentNode.interactable)
         if(this.hitArea.hitTestObject(this._currentNode.interactable.sprite) && this._currentNode.interactable.trigger())
            this.hit(this._currentNode.interactable);

      for(this.i = this.surrounds.length - 1; this.i >= 0; this.i--)
         if(this.surrounds[this.i] && this.surrounds[this.i].interactable && this.surrounds[this.i].interactable.mc)
            if(this.hitArea.hitTestObject(this.surrounds[this.i].interactable.sprite) && this.surrounds[this.i].interactable.trigger())
               this.hit(surrounds[this.i].interactable);
   };

   this.hit = function hit(trap) {

   };
}