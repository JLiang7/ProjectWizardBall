function defaultBall(player) {
	var speed;
	var isLive=true;
	var bounce=5;
	var isVisible=true;
	var defSprite;

	this.onHit=function() {
		isLive=false;
	}

	this.grounded=function() {
		bounce--;
	}

	this.visible=function() {
		if(bounce==0) {
			
		}
	}



}