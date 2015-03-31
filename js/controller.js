angular
	.module('app')
	.controller('TheGame', TheGame);

	TheGame.$inject = ['$firebaseArray','$firebaseObject'];



	function TheGame($firebaseArray, $firebaseObject) {
		var self = this;
		
		self.setBoard = setBoard();
		self.getInfo = getInfo();
		self.setMove = setMove; 

		self.intro = true;

		

		// self.announce = "let's play!"

		function setBoard() {
			var ref = new Firebase('https://tictackyle.firebaseio.com/pieces');
			var pieces = $firebaseArray(ref);
			return pieces;
		}

		function getInfo(){
			var ref = new Firebase('https://tictackyle.firebaseio.com/info');
			var info = $firebaseObject(ref);

			info.announce = "Let's Play";


			info.$save();

			return info
		}


		// play the game
		var count = 0;

		function setMove(play) {

			self.getInfo.announce = "it's on!";
			
			//place X
			if (count % 2 === 0) {
				if(play.move === '') {
					play.move = 'X';
					self.getInfo.currentMove = true;
					self.getInfo.$save();
					self.setBoard.$save();
					count++;
				}
				
			//place O	
			} else {
				if(play.move === '') {
					play.move = 'O';
					self.getInfo.currentMove = false;
					self.getInfo.$save();
					self.setBoard.$save();
					count++;
				}
			}
		}

	} // end of controller