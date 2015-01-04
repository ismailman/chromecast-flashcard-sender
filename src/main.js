var _ = require('lodash');

var applicationID = '9F17CBBE';
var namespace = 'urn:x-cast:simple-flashcard';

var App = function(){
	this._session = null;
	this._button = document.getElementById('send');

	this._bindToButton();
	this._setupCastSession();
};

_.extend(App.prototype, {

	_bindToButton: function(){
		this._button.addEventListener('click', function(){
			this.sendMessage('monkeys');
		}.bind(this));
	},

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
			session.sendMessage(namespace, message, onSuccess.bind(this, "Message sent: " + message), onError);
		}
		else {
			chrome.cast.requestSession(function(e) {
				this._session = e;
				this.sendMessage(message);
			}.bind(this), onError);
		}
	}

});


function onError(err){
	console.log('error', err);
}

setTimeout(function(){
	var app = new App();
}, 1000);

