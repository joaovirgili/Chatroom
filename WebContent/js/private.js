var names = getAllUrlParams();
var websocket2 = new WebSocket("ws://localhost:8080/Chatroom04/privateServerEndpoint/" +
names.user1 + "/" +
names.user2 + "/" +
Math.floor((Math.random() * 10000) + 1));

websocket2.onmessage = function (message) {
    var jsonData = JSON.parse(message.data);

    //Se é uma mensagem
    if (jsonData.message) { 
        document.getElementById("messagesTextArea").value += jsonData.message + "\n";
    } else if (jsonData.users) {
    	$("#usersList").empty();
    	
        for (let i=0; i< jsonData.users.length; i++)
            if (jsonData.users[i] != null)
                $("#usersList").append('<li>' + jsonData.users[i] + '</li>');
    }

}

websocket2.onopen = function () {
  websocket2.send(names.user1);
}


function sendMessage() {
  websocket2.send(document.getElementById("messageText").value);
    docuwebsocket2ment.getElementById("messageText").value = "";  
}

window.onbeforeunload = function() {
  websocket2.onclose = function() { };
  websocket2.close;
};

function getAllUrlParams(url) {

    // get query string from url (optional) or window
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
  
    // we'll store the parameters here
    var obj = {};
  
    // if query string exists
    if (queryString) {
  
      // stuff after # is not part of query string, so get rid of it
      queryString = queryString.split('#')[0];
  
      // split our query string into its component parts
      var arr = queryString.split('&');
  
      for (var i=0; i<arr.length; i++) {
        // separate the keys and the values
        var a = arr[i].split('=');
  
        // in case params look like: list[]=thing1&list[]=thing2
        var paramNum = undefined;
        var paramName = a[0].replace(/\[\d*\]/, function(v) {
          paramNum = v.slice(1,-1);
          return '';
        });
  
        // set parameter value (use 'true' if empty)
        var paramValue = typeof(a[1])==='undefined' ? true : a[1];
  
        // (optional) keep case consistent
        paramName = paramName.toLowerCase();
        paramValue = paramValue.toLowerCase();
  
        // if parameter name already exists
        if (obj[paramName]) {
          // convert value to array (if still string)
          if (typeof obj[paramName] === 'string') {
            obj[paramName] = [obj[paramName]];
          }
          // if no array index number specified...
          if (typeof paramNum === 'undefined') {
            // put the value on the end of the array
            obj[paramName].push(paramValue);
          }
          // if array index number specified...
          else {
            // put the value at that index number
            obj[paramName][paramNum] = paramValue;
          }
        }
        // if param name doesn't exist yet, set it
        else {
          obj[paramName] = paramValue;
        }
      }
    }
  
    return obj;
  }