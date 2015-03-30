angular
	.module('app')
	.controller('TheGame', TheGame);

	function TheGame() {
		var self = this;
		
		self.pieces = [];

		self.intro = true;

		self.setMove = setMove; 
		self.testWinner = testWinner;

		self.announce = "let's play!"

		// set the board
		for(var i = 0; i < 9; i++){
			self.pieces.push({num: 1+i, move: ''})
		};

		function testWinner() {
			console.log('hello');
			if(self.pieces[0].move === self.pieces[1].move) {
				console.log('yes')
			}
		}

		// play the game
		var count = 0;

		function setMove(play) {
			self.announce = "it's on!";
			
			//place X
			if (count % 2 === 0) {
				if(play.move === '') {
					play.move = 'X';
					self.currentMove = true;
					count++;
					testWinner();
				}
				
			//place O	
			} else {
				if(play.move === '') {
					play.move = 'O';
					self.currentMove = false;
					count++;
				}
			}
		}

	} // end of controller