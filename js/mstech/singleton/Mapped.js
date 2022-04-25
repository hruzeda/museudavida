

// public class Mapped
function Mapped() {
   this.rows = null;
   this.ground = null;
   this.body = null;
   this.loaded = null;

   this.load = function load(mapName, pathToFolder, callback) {
      this.callback = callback;
      var url = pathToFolder + '/' + mapName + '.mapp';
      $.get(url, function(data) {
         TileGame.instance.mapped.rows = data.split('\n');
         var array = TileGame.instance.mapped.rows[0].split(',');
         TileGame.instance.mapped.loaded = new Map(parseInt(array[0]), parseInt(array[1]), parseInt(array[2]));
         TileGame.instance.mapped.loadTextures(mapName, pathToFolder);
      });
   };

   this.loadTextures = function loadTextures(mapName, pathToFolder) {
      this.ground = new Image();
      this.ground.onload = function() {
         if(TileGame.instance.mapped.rows[5].length > 0) {
            TileGame.instance.mapped.body = new Image();
            TileGame.instance.mapped.body.onload = function() {
               TileGame.instance.mapped.loaded.fillTileList();
            };
            TileGame.instance.mapped.body.src = pathToFolder + '/' + mapName + '_body.png';
         } else {
            TileGame.instance.mapped.loaded.fillTileList();
         }
      };
      this.ground.src = pathToFolder + '/' + mapName + '_ground.png';
   };

   this.clearBitmaps = function clearBitmaps() {
      this.ground = null;
      this.body = null;
      this.callback();
   };
}