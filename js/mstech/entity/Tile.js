

// public class Tile
Tile.prototype = new createjs.Container();
Tile.prototype.constructor = Tile;
function Tile(accessValue, _ground, _body) {
   this.access = accessValue | 0;
   this.ground = _ground;
   this.body = _body;
}