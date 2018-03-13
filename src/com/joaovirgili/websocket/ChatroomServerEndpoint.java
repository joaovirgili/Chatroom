package com.joaovirgili.websocket;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import org.json.JSONException;
import org.json.JSONObject;

@ServerEndpoint("/chatroomServerEndpoint")
public class ChatroomServerEndpoint {
	//static Set<Session> chatroomUsers = Collections.synchronizedSet(new HashSet<Session>());
	static ArrayList<Session> chatroomUsers = new ArrayList<Session>();
	
	@OnOpen
	public void handleOpen(Session userSession) throws IOException, JSONException {
		System.out.println("Public");
		messageAllSessions(buildUsersJson());
		chatroomUsers.add(userSession);
	}
	
	@OnMessage
	public void handleMessage(String message, Session userSession) throws IOException, JSONException {
		String username = (String) userSession.getUserProperties().get("username");
		
		if (username == null) {
			userSession.getUserProperties().put("username", message);
			messageAllSessions(buildJsonData("System", message + " entrou."));
			messageAllSessions(buildUsersJson());
		} else {
			messageAllSessions(buildJsonData(username, message));
		}
	}
	
	@OnClose
	public void handleClose(Session userSession) throws IOException, JSONException {
		chatroomUsers.remove(userSession);
		messageAllSessions(buildJsonData("System", userSession.getUserProperties().get("username") + " saiu."));
		messageAllSessions(buildUsersJson());
	}
	
	private void messageAllSessions(String message) throws IOException, JSONException {

		for (int i=0; i<chatroomUsers.size();i++) {
			if (chatroomUsers.get(i).getUserProperties().get("username") != null)
				chatroomUsers.get(i).getBasicRemote().sendText(message);
		}
		/*Iterator<Session> iterator = chatroomUsers.iterator();
		while (iterator.hasNext())
			iterator.next().getBasicRemote().sendText(message);*/
			
	}
	
	private String buildJsonData (String username, String message) throws JSONException {
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("message", username + ": " + message);
		return jsonObject.toString();
	}
	
	private String buildUsersJson () throws JSONException {
		JSONObject jsonObject = new JSONObject();
		ArrayList<String> usernames = new ArrayList<String>();
		Iterator<Session> iterator = chatroomUsers.iterator();
		while (iterator.hasNext())
			usernames.add((String)iterator.next().getUserProperties().get("username"));
		
		jsonObject.put("users", usernames);
		return jsonObject.toString();
	}
}
