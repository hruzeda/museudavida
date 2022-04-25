

// public class Map
Map.prototype = new createjs.Container();
Map.prototype.constructor = Tile;
function Map(cols, rows, tileSize) {
   this.nodes = null;
   this.groundAssets = null;
   this.groundLayer = new createjs.Container();
   this.bodyAssets = null;
   this.bodyLayer = new createjs.Container();
   this.ceilLayer = new createjs.Container();
   this.node = null;

   this.cols = cols;
   this.rows = rows;
   this.horizontalEdge = ((cols * tileSize) * -1) + TileGame.instance.canvas.width;
   this.verticalEdge = ((rows * tileSize) * -1) + TileGame.instance.canvas.height;

   this.TILE_SIZE = tileSize;
   this.HALF_TILE = tileSize >> 1;
   Constants.TILE_SIZE = tileSize;
   Constants.HALF_TILE = tileSize >> 1;
   Constants.SPEED = tileSize >> 3;

   this.groundLayer.name = 'ground';
   this.addChild(this.groundLayer);

   this.bodyLayer.name = 'body';
   this.addChild(this.bodyLayer);

   this.ceilLayer.name = 'ceil';
   this.addChild(this.ceilLayer);

   this.fillTileList = function fillTileList() {
      var array = TileGame.instance.mapped.rows[4].split('|');
      var numCols = (TileGame.instance.mapped.ground.width / this.TILE_SIZE) | 0;
      var numRows = (TileGame.instance.mapped.ground.height / this.TILE_SIZE) | 0;
      var col, row, point, tile;

      this.groundAssets = new Array(numCols * numRows);
      for(row = numRows - 1; row >= 0; row--){
         for(col = numCols - 1; col >= 0; col--){
            point = new createjs.Point((col * this.TILE_SIZE), (row * this.TILE_SIZE));
            tile = new Tile(array[((row * numCols) + col) + 1], point);
            this.groundAssets[(row * numCols) + col] = tile;
         }
      }

      array = TileGame.instance.mapped.rows[6].split('|');
      numCols = (TileGame.instance.mapped.body.width / this.TILE_SIZE) | 0;
      numRows = (TileGame.instance.mapped.body.height / this.TILE_SIZE) | 0;
      this.bodyAssets = new Array(numCols * numRows);
      for(row = (numRows - 1); row >= 0; row--){
         for(col = (numCols - 1); col >= 0; col--){
            point = new createjs.Point((col * this.TILE_SIZE), (row * this.TILE_SIZE));
            tile = new Tile(array[((row * numCols) + col) + 1], null, point);
            this.bodyAssets[(row * numCols) + col] = tile;
         }
      }

      this.loadTiles();
   };

   this.loadTiles = function loadTiles() {
      var auxArray = TileGame.instance.mapped.rows[1].split('|');
      var auxArray2, auxImage, i, col, row, assetIndex;
      this.nodes = new Array(cols);

      for(i = auxArray.length - 1; i >= 1; i--){
         auxArray2 = auxArray[i].split(',');
         col = parseInt(auxArray2[0]);
         row = parseInt(auxArray2[1]);
         assetIndex = parseInt(auxArray2[2]);

         auxImage = new createjs.Bitmap(TileGame.instance.mapped.ground);
         auxImage.sourceRect = new createjs.Rectangle(this.groundAssets[assetIndex].ground.x, this.groundAssets[assetIndex].ground.y, this.TILE_SIZE, this.TILE_SIZE);
         if(!this.nodes[col]) this.nodes[col] = new Array(rows);
         this.nodes[col][row] = new Node(col, row);
         this.nodes[col][row].access = this.groundAssets[assetIndex].access;
         this.nodes[col][row].groundIndex = this.groundLayer.children.length;
         this.groundLayer.addChild(auxImage);
         auxImage.visible = false;
         auxImage.x = col * this.TILE_SIZE;
         auxImage.y = row * this.TILE_SIZE;
      }

      auxArray = TileGame.instance.mapped.rows[2].split('|');

      for(i = auxArray.length - 1; i >= 1; i--){
         auxArray2 = auxArray[i].split(',');
         col = auxArray2[0];
         row = auxArray2[1];
         assetIndex = auxArray2[2];

         auxImage = new createjs.Bitmap(TileGame.instance.mapped.body);
         auxImage.sourceRect = new createjs.Rectangle(this.bodyAssets[assetIndex].body.x, this.bodyAssets[assetIndex].body.y, this.TILE_SIZE, this.TILE_SIZE);
         if(!this.nodes[col]) this.nodes[col] = new Array(rows);
         if(!this.nodes[col][row]) this.nodes[col][row] = new Node(col, row);
         if(this.nodes[col][row].access < 1) this.nodes[col][row].access = this.bodyAssets[assetIndex].access;

         if(this.nodes[col][row].access < 2) {
            this.nodes[col][row].bodyIndex = this.bodyLayer.children.length;
            this.bodyLayer.addChild(auxImage);
         } else {
            this.nodes[col][row].bodyIndex = this.ceilLayer.children.length;
            this.ceilLayer.addChild(auxImage);
         }

         auxImage.visible = false;
         auxImage.x = col * this.TILE_SIZE;
         auxImage.y = row * this.TILE_SIZE;
      }

      TileGame.instance.mapped.clearBitmaps();
   };

   this.getNode = function getNode(col, row) {
      col = col | 0;
      row = row | 0;
      if(col >= 0 && col < this.nodes.length && row >= 0 && row < this.nodes[col].length) return this.nodes[col][row];
      else return null;
   };

   this.toggleTile = function toggleTile(value, hor, ver) {
      this.node = this.getNode(hor, ver);
      if(this.node) {
         this.node.toggleVisibility(value);
         this.getGTile().visible = value;
         if(this.getBTile()) this.getBTile().visible = value;
      }
   };

   this.getGTile = function getGTile() {
      if(this.node.groundIndex >= 0 && this.node.groundIndex < this.groundLayer.children.length)
         return this.groundLayer.getChildAt(this.node.groundIndex);
      else return null;
   };

   this.getBTile = function getBTile() {
      if(this.node.access === 2) {
         if(this.node.bodyIndex >= 0 && this.node.bodyIndex < this.ceilLayer.children.length)
            return this.ceilLayer.getChildAt(this.node.bodyIndex);
         else return null;
      } else {
         if(this.node.bodyIndex >= 0 && this.node.bodyIndex < this.bodyLayer.children.length)
            return this.bodyLayer.getChildAt(this.node.bodyIndex);
         else return null;
      }
   };
}