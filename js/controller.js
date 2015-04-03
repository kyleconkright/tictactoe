angular
	.module('app')
	.controller('TheGame', TheGame);

	TheGame.$inject = ['$firebaseObject'];



	function TheGame($firebaseObject) {
		var self = this;
		self.gamePlay = gamePlay();
		self.setMove = setMove;
		self.getWinner = getWinner;
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
			gameData.playerTurn = 'X gets the first move...';
			gameData.scoreX = 0;
			gameData.scoreO = 0;
			gameData.count = 0;
			gameData.testWin = false;
			gameData.playAgain = true;
			gameData.playAgain = false;
			gameData.chatBoxX = null;
			gameData.chatBoxO = null;


			gameData.$loaded(function(){
				gameData.$save();
			});

			// gameData.$save();
			
			return gameData;
		}



		//////////////////////////////////////////
		/////////SET MOVE AKA THE BRAIN //////////
		//////////////////////////////////////////
		
		

		function setMove(play) {
			
			self.gamePlay.announce = "";
			
			if(!self.getWinner()) { //ONLY ALLOW CLICKS WHEN THERE IS NO WINNER

				if(self.gamePlay.currentMove === true) {
					if(play.move === '') {
						play.move = 'X';
						self.gamePlay.currentMove = false;
						self.gamePlay.playerTurn = 'Your move O';
						self.gamePlay.count++;
						if(self.getWinner(play) === play.move) {
							self.gamePlay.testWin = true;
							self.gamePlay.announce = play.move + ' Wins!!'
							self.gamePlay.playerTurn = '';
							self.gamePlay.playAgain = true;
							self.gamePlay.scoreX++;
						}
						if(self.gamePlay.count === 9 && !self.getWinner()) {
							self.gamePlay.announce = 'A tie... lame.'
							self.gamePlay.playerTurn = 'play again and settle this!';
							self.gamePlay.playAgain = true;
						}
						self.gamePlay.$save();
					}
				} else {
					if(play.move === '') {
						play.move = 'O';
						self.gamePlay.currentMove = true;
						self.gamePlay.playerTurn = 'Your move X';
						self.getWinner(play);
						self.gamePlay.count++;
						if(self.getWinner(play) === play.move) {
							self.gamePlay.announce = play.move + ' Wins!!'
							self.gamePlay.playerTurn = '';
							self.gamePlay.playAgain = true;
							self.gamePlay.scoreO++;	
						}
						self.gamePlay.$save();
					}
				}
			}
		}// end set move


		//////////////////////////////
		/////////TEST WINNER//////////
		//////////////////////////////
		function getWinner(play) {
			var space = self.gamePlay.spaces;
			if(
				space[0].move !== '' && space[0].move === space[1].move && space[1].move === space[2].move ||
				space[3].move !== '' && space[3].move === space[4].move && space[4].move === space[5].move ||
				space[6].move !== '' && space[6].move === space[7].move && space[7].move === space[8].move
				) {
				return play.move;
			} else if(
				space[0].move !== '' && space[0].move === space[3].move && space[3].move === space[6].move ||
				space[1].move !== '' && space[1].move === space[4].move && space[4].move === space[7].move ||
				space[2].move !== '' && space[2].move === space[5].move && space[5].move === space[8].move
				) {
				return play.move;	
			} else if (
				space[0].move !== '' && space[0].move === space[4].move && space[4].move === space[8].move
				) {
				return play.move;	
			} else if (
				space[2].move !== '' && space[2].move === space[4].move && space[4].move === space[6].move
				) {
				return play.move;	
			}

		} // end get winner





		//////////////////////////////
		////////CHAT FEATURE//////////
		//////////////////////////////

		//custom shortcut to reset game
		function sendChat(text) {
			if(self.gamePlay.chatBoxX === 'clearScore' || self.gamePlay.chatBoxO === 'clearScore') {
				self.gamePlay.scoreO = 0;
				self.gamePlay.scoreX = 0;
				self.gamePlay.chatBoxX = null;
				self.gamePlay.chatBoxO = null;
			}
			self.gamePlay.chatBoxX = null;
			self.gamePlay.chatBoxO = null;
			self.gamePlay.$set(self.gamePlay.chatBoxX);
			self.gamePlay.$set(self.gamePlay.chatBoxO);
		}

		function resetGame(arr){
			for(var i = 0; i < arr.length; i++) {
				arr[i].move = '';
			}
			self.gamePlay.announce = "Let's Play!";
			self.gamePlay.playerTurn = 'X gets the first move...';
			self.gamePlay.currentMove = true;
			self.gamePlay.playAgain = false;
			self.gamePlay.count = 0;

			self.gamePlay.$save();
		}

	} // end of controller