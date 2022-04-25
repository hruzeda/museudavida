

// public class TileGame
TileGame.instance = null;
function TileGame() {
   TileGame.instance = this;
   this.stage = null;
   this.player = null;
   this.mapped = new Mapped();
   this.spriteHandler = null;
   this.loadingInteractable = null;
   this.keys = {};
   this.canvas = document.createElement('canvas');
   this.forceStop = false;
   this.intervalID = -1;

   this.init = function init() {
      document.body.appendChild(this.canvas);
      
      window.onresize = this.handleCanvas;
      document.onkeydown = this.handleKeys;
      document.onkeyup = this.handleKeys;
      this.canvas.focus();

      this.stage = new createjs.Stage(this.canvas);
      this.mapped.load('sample', 'assets/maps', this.onMapLoad);
   };
   
   this.onMapLoad = function onMapLoad() {
      TileGame.instance.stage.addChild(TileGame.instance.mapped.loaded);
      TileGame.instance.loadingInteractable = new Player();
      TileGame.instance.loadingInteractable.load('assets/spritesheets/player.json', TileGame.instance.onPlayerLoad);
   };

   this.onPlayerLoad = function onPlayerLoad() {
      TileGame.instance.player = TileGame.instance.loadingInteractable;
      TileGame.instance.loadingInteractable = null;
      TileGame.instance.player.sprite.visible = true;
      TileGame.instance.mapped.loaded.bodyLayer.addChild(TileGame.instance.player.sprite);
      TileGame.instance.playerHandler = new PlayerHandler();
      TileGame.instance.player.place(1, 4);
      TileGame.instance.handleCanvas();
      
      createjs.Ticker.addEventListener('tick', tick);
      createjs.Ticker.useRAF = true;
      createjs.Ticker.setFPS(30);
   };
   
   this.handleCanvas = function handleCanvas() {
      TileGame.instance.canvas.width = ($(window).width() / Constants.TILE_SIZE) | 0;
      TileGame.instance.playerHandler.HORIZONTAL = TileGame.instance.canvas.width;
      TileGame.instance.canvas.width *= Constants.TILE_SIZE;
      
      TileGame.instance.canvas.height = ($(window).height() / Constants.TILE_SIZE) | 0;
      TileGame.instance.playerHandler.VERTICAL = TileGame.instance.canvas.height;
      TileGame.instance.canvas.height *= Constants.TILE_SIZE;
      //ctx.translate(width/2,height/2); ?!!?!?!?
      
      TileGame.instance.playerHandler.HERO_HOR_LIMIT = TileGame.instance.canvas.width >> 1;
      TileGame.instance.playerHandler.HERO_VER_LIMIT = TileGame.instance.canvas.height >> 1;
      TileGame.instance.mapped.loaded.horizontalEdge = ((TileGame.instance.mapped.loaded.cols * Constants.TILE_SIZE) * -1) + TileGame.instance.canvas.width;
      TileGame.instance.mapped.loaded.verticalEdge = ((TileGame.instance.mapped.loaded.rows * Constants.TILE_SIZE) * -1) + TileGame.instance.canvas.height;
      TileGame.instance.playerHandler.reposition();
   };

   this.handleKeys = function handleKeys(e) {
      if(!e) e = window.event;
      TileGame.instance.keys[e.keyCode] = e.type === 'keydown';
   };
}

function tick() {
   TileGame.instance.stage.update();
   TileGame.instance.playerHandler.input(TileGame.instance.keys);
}