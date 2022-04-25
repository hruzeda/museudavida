

// public class Node
Node.prototype = new createjs.Point();
Node.prototype.constructor = Node;
function Node(col, row) {
   this.x = col * Constants.TILE_SIZE;
   this.y = row * Constants.TILE_SIZE;

   this.interactable = null;
   this.bodyIndex = -1;
   this.groundIndex = -1;
   this.access = -1;
   this.coord = new createjs.Point();
   
   this.col = col;
   this.row = row;
   this.center = new createjs.Point(this.x + (Constants.HALF_TILE), this.y + (Constants.HALF_TILE));

   this.toggleVisibility = function toggleVisibility(value) {
      if(this.interactable) this.interactable.toggleVisibility(value);
   };

   this.toString = function toString() {
      return "(" + this.col + ", " + this.row + /*" - " + this.coord.toString() + */")";
   };
}