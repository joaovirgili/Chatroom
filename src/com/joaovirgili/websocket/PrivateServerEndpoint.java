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
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

import org.json.JSONException;
import org.json.JSONObject;

import com.joaovirgili.classes.AllChatrooms;
import com.joaovirgili.classes.Chatroom;

@ServerEndpoint("/privateServerEndpoint/{username1}/{username2}/{roomId}")
public class PrivateServerEndpoint {
	//static Set<Session> chatroomUsers = Collections.synchronizedSet(new HashSet<Session>());
	static ArrayList<Session> chatroomUsers = new ArrayList<Session>();
	
	@OnOpen
	public void handleOpen(Session userSession, 
			@PathParam("username1") final String username1,
			@PathParam("username2") final String username2,
			@PathParam("roomId") final int roomId) throws IOException, JSONException {
		System.out.println("Private - " + String.valueOf(roomId));
		
		//Cria sala e verifica se ja existe uma sala com esses usuarios.
		Chatroom chatroom = new Chatroom(username1, username2, roomId);
		int auxId = AllChatrooms.getInstance().roomExists(chatroom);
		if (auxId == -1) 
			AllChatrooms.getInstance().addNewRoom(chatroom);
		else 
			chatroom = AllChatrooms.getInstance().searchRoom(auxId);
		
		userSession.getUserProperties().put("roomId", chatroom.getId());
		messageAllSessions(buildUsersJson(userSession));
		chatroomUsers.add(userSession);
		AllChatrooms.getInstance().printRooms();
		printUsers();
	}
	
	@OnMessage
	public void handleMessage(String message, Session userSession) throws IOException, JSONException {
		String username = (String) userSession.getUserProperties().get("username");
		JSONObject jsonMessage = new JSONObject(message);
		
		if (username == null && jsonMessage.has("username")) {
			userSession.getUserProperties().put("username", jsonMessage.get("username"));
			messageAllSessions(buildJsonData("System", jsonMessage.get("username") + " entrou."));
			messageAllSessions(buildUsersJson(userSession));
		} else if (jsonMessage.has("message")){
			messageAllSessions(buildJsonData(username, jsonMessage.getString("message")));
		}
	}
	
	@OnClose
	public void handleClose(Session userSession) throws IOException, JSONException {
		chatroomUsers.remove(userSession);
		messageAllSessions(buildJsonData("System", userSession.getUserProperties().get("username") + " saiu."));
		messageAllSessions(buildUsersJson(userSession));
	}
	
	private void messageAllSessions(String message) throws IOException, JSONException {

		for (int i=0; i<chatroomUsers.size();i++) {
			if (chatroomUsers.get(i).getUserProperties().get("username") != null)
				chatroomUsers.get(i).getBasicRemote().sendText(message);
		}
			
	}
	
	private String buildJsonData (String username, String message) throws JSONException {
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("message", username + ": " + message);
		return jsonObject.toString();
	}
	
	private String buildUsersJson (Session userSession) throws JSONException {
		JSONObject jsonObject = new JSONObject();
		ArrayList<String> usernames = new ArrayList<String>();
		for (int i=0; i<chatroomUsers.size();i++) {
//			if (chatroomUsers.get(i) != userSession)
			usernames.add((String) chatroomUsers.get(i).getUserProperties().get("username"));
		}
		
		jsonObject.put("users", usernames);
		return jsonObject.toString();
	}
	
	private void printUsers() {
		for (int i=0; i<chatroomUsers.size();i++) {
			System.out.println("Usuario(" + i +") Id(" +
					chatroomUsers.get(i).getUserProperties().get("roomId") +"): " + 
					chatroomUsers.get(i).getUserProperties().get("username")); 
		}
	}
	

}
