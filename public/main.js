
(function() {
	"use strict";
	
	var dialog = document.getElementById('dialog');
	var lastMessageElement = null;
	var input = document.getElementById('input');
	var infoElement = document.getElementById('info');

	var socket = io();
	//socket.io.reconnection(false);

	socket.on('serverMessage', function(data) {
		addMessage(data.msg, data.system);
	});

	//set username
	var username = prompt('What username would you like to use?');
	socket.emit('login', username);

	socket.on('logged', function(data) {
		console.log("user logged in");
		usersInfoUpdate(data)
	});
	socket.on('userJoined', function(data) {
		console.log("user joined");
		usersInfoUpdate(data)
	});
	socket.on('userLeft', function(data) {
		console.log("user left");
		usersInfoUpdate(data)
	});

	socket.on('disconnect', function() {
		console.log('disconnect');
		addMessage("You've been disconnected", true);
	});

	//update server info about reconnected users
	socket.on('reconnecting', function() {
		console.log('reconnect');
		socket.emit('login', username);
	});

	input.onkeydown = function(e) {
		if (e.keyCode === 13) {
			socket.emit('clientMessage', this.value);
			this.value = '';
			return false;
		} else {
			return true;
		}
	};

	function addMessage(message, system) {
		var newMessageElement = document.createElement('div');
		var newMessageText = document.createTextNode(message);
		if(system) {
			newMessageElement.classList.add("strong");
		}
		newMessageElement.appendChild(newMessageText);
		dialog.insertBefore(newMessageElement, lastMessageElement);
		lastMessageElement = newMessageElement;
	}

	function usersInfoUpdate(data) {
		infoElement.innerHTML = "Currently " + data.usersCount + " users is logged in";
	}

})();
