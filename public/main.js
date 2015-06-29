
(function() {
	"use strict";

	var dialog = document.getElementById('dialog');
	var previousDialog = null;
	var input = document.getElementById('input');
	var infoElement = document.getElementById('info');
	var systemMessagesBox = document.getElementById('system');
	var userBox = document.getElementById('user');

	var socket = io();
	//socket.io.reconnection(false);

	socket.on('serverMessage', function(data) {
		addMessage(data.msg);
	});

	socket.on('dialogUpdate', function(data) {
		addDialog(data);
	});

	//set username
	var username = prompt('What username would you like to use?');
	userBox.innerHTML = username;
	socket.emit('login', {
		username: username
	});

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
		socket.emit('login', {
			username: username,
			reconnect: true
		});
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

	function addMessage(message) {
		systemMessagesBox.innerHTML =  message;
	}

	function addDialog(data) {
		var message = data.msg;
		var current = data.current;
		var archive = data.history;
		var newMessageElement = document.createElement('div');
		if (current) {
			newMessageElement.classList.add("current");
		}
		var newMessageText = document.createTextNode(message);
		newMessageElement.appendChild(newMessageText);
		if (archive) {
			dialog.insertBefore(newMessageElement, previousDialog);
		} else {
			dialog.appendChild(newMessageElement);
			dialog.scrollTop = dialog.scrollHeight;
		}
		previousDialog = newMessageElement;
	}

	function usersInfoUpdate(data) {
		infoElement.innerHTML = "Currently " + data.usersCount + " users is logged in";
	}

})();
