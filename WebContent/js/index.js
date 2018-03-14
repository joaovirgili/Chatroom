var user;
var websocket;

function openChat(urlChat) {
    // window.open(urlChat, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
    $("#chat").attr("src", urlChat);
    $("#chat").show();
}

function login() {
    user = $('#messageText').val();
    $('#disconnect').show();
    $('#login').hide();
    $('#messageText').hide();
    connectWebsocket();
    waitForSocketConnection(websocket, function () {
        websocket.send(user);
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

function connectWebsocket() {
    websocket = new WebSocket("ws://localhost:8080/Chatroom04/chatroomServerEndpoint");
    websocket.onmessage = function (message) {
        var jsonData = JSON.parse(message.data);
        if (jsonData.users) {
            $("#usersList").empty(); 
            var urlChat;
            for (let i=0; i< jsonData.users.length; i++)
                if (jsonData.users[i] != null) {
                    urlChat = 'http://localhost:8080/Chatroom04/private.html?user1='+user+'&user2='+jsonData.users[i];
                    li = "<li><a onclick='openChat(";
                    li+='"'+urlChat+'"';
                    li+=");'>" + jsonData.users[i] + "</a></li>";
                    $("#usersList").append(li);
                }    
        }
    }
    websocket.onclose = function() {
        console.log("close");
     };
    
}

window.onbeforeunload = function() {
        
    websocket.close;
};

function disconnect() {
    $('#disconnect').hide();
    $('#login').show();
    $('#messageText').show();
    $("#usersList").empty();
    websocket.close();
}


