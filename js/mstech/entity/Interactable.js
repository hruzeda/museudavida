

// public class Interactable
function Interactable(type) {
   this.type = type;
   this.state = '';
   this.direction = 'D';
   this._currentNode = null;
   this.sprite = new createjs.Container();

   this.load = function load(url, callback) {
      TileGame.instance.loadingInteractable.callback = callback;

      $.getJSON(url, function(json) {
         var spriteSheet = new createjs.SpriteSheet(json);
         TileGame.instance.loadingInteractable.mc = new createjs.BitmapAnimation(spriteSheet);
         TileGame.instance.loadingInteractable.sprite.addChild(TileGame.instance.loadingInteractable.mc);
         TileGame.instance.loadingInteractable.mc.x -= Constants.HALF_TILE;
         TileGame.instance.loadingInteractable.mc.y -= Constants.HALF_TILE;
         TileGame.instance.loadingInteractable.sprite.visible = false;
         TileGame.instance.loadingInteractable.updateState('');
         TileGame.instance.loadingInteractable.callback();
      });
   };

   this.trigger = function trigger() {
      return true;
   };

   this.nextPath = function nextPath() {

   };

   this.toggleVisibility = function toggleVisibility(value) {
      this.sprite.visible = value;
   };

   this.updateState = function updateState(newState, persist) {
      if(persist || newState === '') {
         if(newState === '') this.state = '';
         else this.state = '_' + newState;
         newState = 'still';
      }

      switch(this.direction){
         case 'U':
            this.mc.gotoAndPlay('up_' + newState + this.state);
            this.mc.setTransform();
            this.mc.x = -Constants.HALF_TILE;
            this.mc.y = -Constants.HALF_TILE;
            break;

         case 'D':
            this.mc.gotoAndPlay('down_' + newState + this.state);
            this.mc.setTransform();
            this.mc.x = -Constants.HALF_TILE;
            this.mc.y = -Constants.HALF_TILE;
            break;

         case 'L':
         case 'R':
            this.mc.gotoAndPlay('horiz_' + newState + this.state);
            this.flip(this.direction);
            break;
      }
   };

   this.step = function step(hValue, vValue) {
      if(hValue > 0) {
         if(this.mc.currentAnimation !== 'horiz' || this.direction === 'L') {
            this.mc.gotoAndPlay('horiz' + this.state);
            this.flip('R');
         }
      } else if(hValue < 0) {
         if(this.mc.currentAnimation !== 'horiz' || this.direction === 'R') {
            this.mc.gotoAndPlay('horiz' + this.state);
            this.flip('L');
         }
      } else {
         if(vValue > 0) {
            if(this.mc.currentAnimation !== 'down') {
               this.mc.gotoAndPlay('down' + this.state);
               this.direction = 'D';
            }
         } else if(vValue < 0) {
            if(this.mc.currentAnimation !== 'up') {
               this.mc.gotoAndPlay('up' + this.state);
               this.direction = 'U';
            }
         }
         
         this.mc.setTransform();
         this.mc.x = -Constants.HALF_TILE;
         this.mc.y = -Constants.HALF_TILE;
      }
   };

   this.flip = function flip(char) {
      if(this.direction !== char) {
         if(char === 'L') {
            this.mc.setTransform(0, 0, -1);
            this.mc.x = Constants.HALF_TILE;
         } else {
            this.mc.setTransform();
            this.mc.x = -Constants.HALF_TILE;
         }

         this.mc.y = -Constants.HALF_TILE;
         this.direction = char;
      }
   };
   
   this.place = function place(col, row){
      var node = TileGame.instance.mapped.loaded.getNode(col, row);
      this.updateState('still');
      this.sprite.x = node.center.x;
      this.sprite.y = node.center.y;
      this.setCurrentNode(node);
   };
   
   this.setCurrentNode = function setCurrentNode(node){
      if(this._currentNode) this._currentNode.interactable = null;
      this._currentNode = node;
      this._currentNode.interactable = this;
   };
}

