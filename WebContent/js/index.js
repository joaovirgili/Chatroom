var user;
var publicWebsocket;
var privateWebsocket;

function sendMessage() {
    var messageText = $('#inputMessage');
}

function openChat(userClicked) {
    randomId = Math.floor((Math.random() * 10000) + 1);
    var url = "ws://localhost:8080/Chatroom04/privateServerEndpoint/" + user.username + "/" + userClicked + "/" + randomId;
    var jsonURL = {
        notify: url,
        username: userClicked,
        from: user.username
    };

    privateWebsocket = connectPrivateWebsocket(url);
    waitForSocketConnection(privateWebsocket, function () {
        $('#chat').show();
    	privateWebsocket.send(JSON.stringify(user));
    });

    publicWebsocket.send(JSON.stringify(jsonURL));

}


function connectPrivateWebsocket(url) {
    
    var websocket = new WebSocket(url);
    var messageTextArea = document.getElementById("messagesTextArea");
    var ulUsers = $('#privateUsersList');

    websocket.onmessage = function (message) {
        var jsonData = JSON.parse(message.data);
        //Caso seja uma mensagem a ser exibida no chat
        if (jsonData.message) {
            messageTextArea.value += jsonData.message + "\n";
        //Caso seja passagem da lista de usuários
        } else if (jsonData.users) {
            $('#privateUsersList').empty();
		    jsonData = jsonData.users;
		    for (let i=0;i<jsonData.length;i++) {
			    if (jsonData[i] != null)
				    ulUsers.append('<li>' + jsonData[i] + '</li>');
		    }	
        }
    }
    websocket.onclose = function() {
        console.log()
    }
    return websocket;
}

function connectPublicWebsocket() {
    publicWebsocket = new WebSocket("ws://localhost:8080/Chatroom04/chatroomServerEndpoint");
	publicWebsocket.onmessage = function (message) {
        var jsonData = JSON.parse(message.data);
        //Caso seja passagem da lista de usuários
        if (jsonData.users) {
            buildUsersList(jsonData);           
        }
        //Caso seja passagem de notificação para usuário
        else if (jsonData.notify) {
            getNotification(jsonData);
        }
    }
	publicWebsocket.onclose = function() {
        console.log(user + " closed.");
     };
    
}

function getNotification(jsonData) {
    privateWebsocket = connectPrivateWebsocket(jsonData.notify);
    var message = { username: jsonData.username };
    waitForSocketConnection(privateWebsocket, function () {
        $('#chat').show();
        privateWebsocket.send(JSON.stringify(message));
    });
}

function login() {
    user ={ username: $('#messageText').val() };
    $('#disconnect').show();
    $('#login').hide();
    $('#messageText').hide();
    connectPublicWebsocket();
    waitForSocketConnection(publicWebsocket, function () {
    	publicWebsocket.send(JSON.stringify(user));
    });
    document.getElementById("messageText").value = "";  
}

function waitForSocketConnection(websocket, callback){
    setTimeout(
        function(){
            if (websocket.readyState === 1) {
                if(callback !== undefined){
                    callback();
                }
                return;
            } else {
                waitForSocketConnection(websocket,callback);
            }
        }, 5);
};

window.onbeforeunload = function() {
        
	publicWebsocket.close;
};

function disconnect() {
    $('#disconnect').hide();
    $('#login').show();
    $('#messageText').show();
    $("#usersList").empty();
    publicWebsocket.close();
}

function search() {
    var test = { notify: $('#searchTest').val()};
    publicWebsocket.send(JSON.stringify(test));
}

function buildUsersList(jsonData) {
    $("#usersList").empty(); 
    var urlChat;
    for (let i=0; i< jsonData.users.length; i++)
    if (jsonData.users[i] != null) {     	
        urlChat = 'http://localhost:8080/Chatroom04/private.html?user1='+user+'&user2='+jsonData.users[i];
        li = '<li class="users" onclick="openChat(' + "'"+jsonData.users[i]+"'" + ');">' + jsonData.users[i] + '</li>';
        //li+= "'"+jsonData.users[i]+"'";
        //li+= ');">' + jsonData.users[i] + '</li>';
        $("#usersList").append(li); 
    }  
}

function sendMessage() {
    var text = { message: $('#inputMessage').val() };
    $('#inputMessage').val("");
    privateWebsocket.send(JSON.stringify(text)); 
}
