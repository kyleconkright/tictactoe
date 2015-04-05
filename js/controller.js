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
		self.chatPanel = chatPanel;
		self.sendChat = sendChat;
		self.chatOpen;



		
		function gamePlay(){
			var ref = new Firebase('https://tictackyle.firebaseio.com/');
			var gameData = $firebaseObject(ref);
			
			gameData.spaces = [];
			gameData.chatEntry = [{entry: '', player: ''}];

			for(var i = 0; i < 9; i++) {
				gameData.spaces.push({move: ''});
			}

			gameData.currentMove = 'X';
			gameData.announce = "Let's Play!";
			gameData.playerTurnInfo = 'X gets the first move...';
			gameData.scoreX = 0;
			gameData.scoreO = 0;
			gameData.count = 0;
			gameData.playAgain = false;
			gameData.chatNotify = false;
			gameData.chatDisplay = null;
			gameData.remotePlayer = true;


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

				if(self.gamePlay.currentMove === 'X' && self.localPlayer !== 'O') {
					if(play.move === '') {
						play.move = 'X';
						self.localPlayer = 'X';
						self.gamePlay.currentMove = 'O';
						self.gamePlay.playerTurnInfo = 'Your move O';
						console.log(self.localPlayer);
						self.gamePlay.count++;
						if(self.getWinner(play) === play.move) {
							self.gamePlay.announce = play.move + ' Wins!!'
							self.gamePlay.playerTurnInfo = '';
							self.gamePlay.playAgain = true;
							self.gamePlay.scoreX++;
						}
						if(self.gamePlay.count === 9 && !self.getWinner()) {
							self.gamePlay.announce = 'A tie... lame.'
							self.gamePlay.playerTurnInfo = 'play again and settle this!';
							self.gamePlay.playAgain = true;
						}
						self.gamePlay.$save();
					}
				} else if(self.gamePlay.currentMove === 'O' && self.localPlayer !== 'X') {
					if(play.move === '') {
						play.move = 'O';
						self.localPlayer = 'O'
						self.gamePlay.currentMove = 'X';
						self.gamePlay.playerTurnInfo = 'Your move X';
						console.log(self.localPlayer);
						self.getWinner(play);
						self.gamePlay.count++;
						if(self.getWinner(play) === play.move) {
							self.gamePlay.announce = play.move + ' Wins!!'
							self.gamePlay.playerTurnInfo = '';
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

		function chatPanel() {
			if(self.chatOpen === true) {
				self.gamePlay.chatNotify = false;
				self.chatOpen = false;
			} else {
				self.gamePlay.chatNotify = true;
				self.chatOpen = true;
			}	
			self.gamePlay.$save();
		}

		//custom shortcut to reset game
		function sendChat(text) {
			if(self.gamePlay.chatBox !== null) {
				if(self.gamePlay.chatBox === 'clearScore') {
					self.gamePlay.scoreO = 0;
					self.gamePlay.scoreX = 0;
					self.gamePlay.chatBox = null;
				} else if (self.gamePlay.chatBox === 'clearChat') {
					self.gamePlay.chatDisplay = '';
					self.gamePlay.chatBox = '';
				} else {
					// self.gamePlay.chatDisplay = text + '\n' +  self.gamePlay.chatDisplay;
					self.gamePlay.chatEntry.push({entry: text, player: self.localPlayer});
					self.gamePlay.chatBox = '';
					self.gamePlay.chatNotify = true;
				}
			}
			self.gamePlay.$save();
		}


		//////////////////////////////
		//////////RESET GAME//////////
		//////////////////////////////

		function resetGame(arr){
			for(var i = 0; i < arr.length; i++) {
				arr[i].move = '';
			}
			self.gamePlay.announce = "Let's Play!";
			self.gamePlay.playerTurnInfo = 'X gets the first move...';
			self.gamePlay.currentMove = 'X';
			self.gamePlay.playAgain = false;
			self.gamePlay.count = 0;
			self.gamePlay.$save();
		}

	} // end of controller