var websocket = new WebSocket("ws://localhost:8049/Chatroom03/chatroomServerEndpoint");
var user;

websocket.onmessage = function (message) {
    var jsonData = JSON.parse(message.data);
    console.log(user);
    //Se é uma mensagem
    if (jsonData.message) { 
        document.getElementById("messagesTextArea").value += jsonData.message + "\n";
    //Se é usuario
    } else if (jsonData.users) {
    	$("#usersList").empty();
        
        var urlChat;
        for (let i=0; i< jsonData.users.length; i++)
            if (jsonData.users[i] != null) {
            	urlChat = 'http://localhost:8049/Chatroom03/private.html?user1='+user+'&user2='+jsonData.users[i];
                li = "<li><a onclick='openChat(";
                li+='"'+urlChat+'"';
                li+=");'>" + jsonData.users[i] + "</a></li>";
                
            	//$("#usersList").append('<li><a onclick="openChat();" >' + jsonData.users[i] + '</a></li>');
                $("#usersList").append(li);
            }

                
    }


}

function openChat(urlChat) {
    window.open(urlChat, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
}

function login() {
    user = document.getElementById("messageText").value;
    websocket.send(user);
    document.getElementById("messageText").value = "";  
}


window.onbeforeunload = function() {
    websocket.onclose = function() { };
    websocket.close;
};

