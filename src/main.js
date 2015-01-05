var _ = require('lodash');

var applicationID = '9F17CBBE';
var namespace = 'urn:x-cast:simple-flashcard';

var App = function(){
	this._session = null;

	this._setupCastSession();

	this.renderWordSets(wordSets);
};

_.extend(App.prototype, {

	_setupCastSession: function(){
		var sessionRequest = new chrome.cast.SessionRequest(applicationID);
		var apiConfig = new chrome.cast.ApiConfig(sessionRequest,
													this._handleSessionEvents.bind(this),
													this._handleReceiverEvents.bind(this));

		chrome.cast.initialize(apiConfig, this._onInit.bind(this), onError);
	},

	_onInit: function(){
		console.log('onInit', arguments);
	},

	_handleReceiverEvents: function(event){
		if( event === 'available' ){
			console.log('device available');
		}
		else{
			console.log('device not available');
		}
	},

	_handleSessionEvents: function(event){
	  this._session = event;
	  this._session.addUpdateListener(this._handleSessionUpdateEvents);
	  this._session.addMessageListener(namespace, this._onMessage.bind(this));
	},

	_handleSessionUpdateEvents: function(isActive){
		if(!isActive){
			this._session = null;
			console.log('session is not active');
		}
		else{
			console.log('session is active');
		}
	},

	_onMessage: function(message){
		document.body.classList.add('active');
		card.text = message.data;
	},

	sendMessage: function(message){
		if (this._session) {
			this._session.sendMessage(namespace, message);
		}
		else {
			chrome.cast.requestSession(function(e) {
				this._session = e;
				this.sendMessage(message);
			}.bind(this), onError);
		}
	},

	renderWordSets: function(wordSets){
		wordSets.forEach(this._renderWordSet.bind(this));
	},

	_renderWordSet: function(wordSet){
		var setDiv = document.createElement('div');
		setDiv.classList.add('word-set');

		var header = document.createElement('div');
		header.classList.add('word-set-header');

		var title = document.createElement('div');
		title.classList.add('word-set-title');
		title.textContent = wordSet.title;
		header.appendChild(title);

		var show = document.createElement('span');
		show.classList.add('word-set-show');
		show.textContent = 'Show on TV';
		header.appendChild(show);

		setDiv.appendChild(header);


		var body = document.createElement('div');
		body.classList.add('word-set-body');
		body.style.display = 'none';

		setDiv.appendChild(body);

		wordSet.words.forEach(function(word){

			var wordDiv = document.createElement('div');
			wordDiv.classList.add('word');
			wordDiv.textContent = word;

			body.appendChild(wordDiv);

		});

		title.addEventListener('click', function(){

			if(body.style.display === 'none'){
				body.style.display = '';
			}
			else{
				body.style.display = 'none';
			}

		});

		var self = this;
		show.addEventListener('click', function(){
			self.sendMessage(JSON.stringify({
				interval: document.getElementById('interval').value ? parseFloat(document.getElementById('interval').value) * 1000 : 2000,
				words: wordSet.words
			}));
		});

		var wordSetsDiv = document.getElementById('word-sets');
		wordSetsDiv.appendChild(setDiv);

	}

});


function onError(err){
	console.log('error', err);
}

setTimeout(function(){
	window.app = new App();
}, 1000);


var wordSets = [
	{
		title: 'Most Common In My Life',
		words: [
			'Amaya',
			'mommy',
			'daddy',
			'halmony',
			'haribodgy',
			'teta',
			'geddo',
			'uncle',
			'aunt',
			'cousin',
			'friend',
			'neighbor',
			'Marley',
			'Thelma-Lea',
			'love',
			'milk',
			'eat',
			'food',
			'sleep',
			'bath',
			'nap',
			'change',
			'diaper',
			'clothes',
			'home',
			'car',
			'stroller',
			'bumbo',
			'orange',
			'breakfast',
			'lunch',
			'dinner'
		]
	}
];
