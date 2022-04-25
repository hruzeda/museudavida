package mstech.singleton {
	import flash.events.EventDispatcher;
	
	import mstech.Constants;
	import mstech.TileGame;
	import mstech.entity.Interactable;
	import mstech.entity.Node;
	
	/**
	 * @author henrique.uzeda
	 */
	public class SpriteHandler extends EventDispatcher {
        private var vector:Vector.<Object> = new Vector.<Object>();
		private var i:int, length:int, index:uint;
        private var testOne:Boolean, testTwo:Boolean;
		private var SPEED:int = Constants.SPEED;
		
		public function SpriteHandler() {
			
		}
		
		public function add(object:Interactable):void {
			object.index = vector.length;
			vector.push({reference:object, sprite:object.sprite, path:null, currentStep:null});
		}
        
		public function remove(object:Interactable):void {
			if(object.currentNode) object.currentNode.interactable = null;
			vector[object.index] = null;
		}
		
		public function setPath(index:int, path:Vector.<Node>):void {
			if(vector[index]) vector[index].path = path;
		}
		
		public function update():void {
			length = vector.length - 1;
			for(i = length; i >= 0; i--){
				if(vector[i] && vector[i].sprite.visible){
					if(vector[i].path){
						if(vector[i].currentStep) step(vector[i]);
						else next(vector[i]);
					} else if(vector[i].currentStep){
						vector[i].currentStep = null;
						vector[i].reference.updateState('still');
					} else {
						vector[i].reference.nextPath();
					}
				}
			}
		}
		
		private function next(object:Object):void{
			if(object.currentStep){
				index = object.path.indexOf(object.currentStep);
				if(index < object.path.length - 1){
					object.currentStep = object.path[index + 1];
					object.reference.step(object.currentStep.coord.x, object.currentStep.coord.y);
					step(object);
				} else {
					object.path = null;
				}
			} else {
				object.currentStep = object.path[0];
				object.reference.step(object.currentStep.coord.x, object.currentStep.coord.y);
				step(object);
			}
		}
		
		private function step(object:Object):void{
			if(object.sprite.x == object.currentStep.center.x && object.sprite.y == object.currentStep.center.y){
				object.reference.currentNode = object.currentStep;
				next(object);
			} else {
				if(object.currentStep.coord.x > 0){
					object.sprite.x += Constants.SPEED;
				} else if(object.currentStep.coord.x < 0){
					object.sprite.x -= Constants.SPEED;
				}
				
				if(object.currentStep.coord.y > 0){
					object.sprite.y += Constants.SPEED;
				} else if(object.currentStep.coord.y < 0){
					object.sprite.y -= Constants.SPEED;
				}
			}
		}
		
		public function dispose():void {
			var i:int, length:int = vector.length - 1;
			for(i = length; i >= 0; i--){
				if(vector[i].sprite){
					TileGame.instance.mapped.loaded.removeChild(vector[i].sprite);
					vector[i].sprite.dispose();
				}
				
				if(vector[i].path) vector[i].path.splice(0, vector[i].path.length);
				vector[i].currentStep = null;
			};
			
			vector.splice(0, vector.length);
		}
	}
}