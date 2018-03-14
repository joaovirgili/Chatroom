var user;
var publicWebsocket;
var privateWebsocket = [];

function sendMessage() {
    var messageText = $('#inputMessage');
}

function openChat(userClicked) {
    randomId = Math.floor((Math.random() * 10000) + 1);
    var privateWebsocket = connectPrivateWebsocket(user.username, userClicked, randomId);

    waitForSocketConnection(privateWebsocket, function () {
        $('#chat').show();
    	privateWebsocket.send(JSON.stringify(user));
    });
    
}


function connectPrivateWebsocket(user1, user2, id) {
    var url = "ws://localhost:8049/Chatroom03/privateServerEndpoint/" + user1 + "/" + user2 + "/" + id;
    var websocket = new WebSocket(url);
    var messageTextArea = document.getElementById("messagesTextArea");
    var ulUsers = $('#privateUsersList');

    websocket.onmessage = function (message) {
        var jsonData = JSON.parse(message.data);
        //Caso seja uma mensagem a ser exibida no chat
        if (jsonData.message) {
            messageTextArea.value += jsonData.message + "\n";
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
	publicWebsocket = new WebSocket("ws://localhost:8049/Chatroom03/chatroomServerEndpoint");
	publicWebsocket.onmessage = function (message) {
        var jsonData = JSON.parse(message.data);
        if (jsonData.users) {
            $("#usersList").empty(); 
            var urlChat;
            for (let i=0; i< jsonData.users.length; i++)
                if (jsonData.users[i] != null) {
                	
                    urlChat = 'http://localhost:8049/Chatroom03/private.html?user1='+user+'&user2='+jsonData.users[i];
                    /*li = "<li><a onclick='openChat(";
                    li+='"'+urlChat+'"';
                    li+=");'>" + jsonData.users[i] + "</a></li>";*/
                    li = '<li class="users" onclick="openChat(';
                    li+= "'"+jsonData.users[i]+"'";
                    li+= ');">' + jsonData.users[i] + '</li>';
                    
                    $("#usersList").append(li); 
                }  
            
        }
        if (jsonData.notify) {
            alert("uhul \o/");
        }
    }
	publicWebsocket.onclose = function() {
        console.log(user + " closed.");
     };
    
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

