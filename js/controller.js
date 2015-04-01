angular
	.module('app')
	.controller('TheGame', TheGame);

	TheGame.$inject = ['$firebaseObject'];



	function TheGame($firebaseObject) {
		var self = this;
		self.gamePlay = gamePlay();
		self.setMove = setMove;
		self.resetGame = resetGame;
		self.sendChat = sendChat;

		
		function gamePlay(){
			var ref = new Firebase('https://tictackyle.firebaseio.com/');
			var gameData = $firebaseObject(ref);
			
			gameData.spaces = [];

			for(var i = 0; i < 9; i++) {
				gameData.spaces.push({move: ''});
			}

			gameData.currentMove = true;
			gameData.announce = "Let's Play!";
			gameData.clearBoard = true;
			gameData.playAgain = false;
			gameData.chatBoxX = null;
			gameData.chatBoxO = null;

			gameData.$loaded(function(){
				gameData.$save();
			});

			// gameData.$save();
			
			return gameData;
		}


		function setMove(play) {
			self.gamePlay.announce = "Ok! Let's Go!"
			self.gamePlay.clearBoard = true;
			if(self.gamePlay.currentMove === true) {
				if(play.move === '') {
					play.move = 'X';
					self.gamePlay.currentMove = false;
					self.gamePlay.$save();
				}
			} else {
				if(play.move === '') {
					play.move = 'O';
					self.gamePlay.currentMove = true;
					self.gamePlay.$save();
				}
			}
		}

		function sendChat(text) {
			self.chatBoxX = text;
			self.gamePlay.$save();
			self.chatBoxX = null;
		}

		function resetGame(arr){
			for(var i = 0; i < arr.length; i++) {
				console.log(arr[i].move = '');
			}
			self.gamePlay.announce = "Let's Play!";
			self.gamePlay.currentMove = true;
			self.gamePlay.clearBoard = false;
			gameData.chatBoxX = null;
			gameData.chatBoxO = null;

			self.gamePlay.$save();
		}

	} // end of controller