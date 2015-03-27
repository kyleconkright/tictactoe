angular
	.module('app')
	.controller('TheGame', TheGame);

	function TheGame() {
		var self = this;
		
		self.pieces = [];
		
		self.setX = setX;

		// set the board
		for(var i = 0; i < 9; i++){
			self.pieces.push({num: 1+i, move: ''})
		};

		function setX(play) {
			console.log(play);
			play.move = 'X';
		}

	} // end of controller