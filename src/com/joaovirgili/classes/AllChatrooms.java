package com.joaovirgili.classes;

import java.util.ArrayList;

public class AllChatrooms {
	private static AllChatrooms unique;
	private static ArrayList<Chatroom> chatrooms = new ArrayList<Chatroom>();
	private static int numRooms = 0;
	
	private AllChatrooms() {}
	
	public static synchronized AllChatrooms getInstance() {
		if (unique == null)
			unique = new AllChatrooms();
		return unique;
	}
	
	public static void addRoom (Chatroom room) {
		numRooms += 1;
		chatrooms.add(room);
	}
	
	public static void removeRoom (Chatroom room) {
		numRooms -= 1;
		chatrooms.remove(room);
	}
	
	public int roomExists (Chatroom room) {
		Chatroom chatroom;
		for (int i=0; i<chatrooms.size(); i++) {
			chatroom = chatrooms.get(i);
			if (compareRooms(chatroom, room))
				return room.getId();
		}
		return -1;
	}
	
	private static boolean compareRooms (Chatroom room1, Chatroom room2) {
		ArrayList<String> users1 = room1.getUsers();
		
		if (room1.getNumberOfUsers() != room2.getNumberOfUsers()) {
			return false;
		} else {
			for (int i=0; i<room1.getNumberOfUsers(); i++) {
				if (!room2.containsUser(users1.get(i)))
					return false;
			}
		}
		return true;
	}
	
	public void addNewRoom (Chatroom chatroom) {
		numRooms++;
		chatrooms.add(chatroom);
	}
	
	public Chatroom searchRoom(int roomId) {
		
		for (int i=0; i<numRooms;i++) {
			if (chatrooms.get(i).getId() == roomId)
				return chatrooms.get(i);
		}
		
		return null;
	}
	
	public void printRooms() {
		Chatroom auxChat;
		for (int i=0; i<chatrooms.size();i++) {
			auxChat = chatrooms.get(i);
			System.out.print("Room (" + i + ") id(" + auxChat.getId()+ "): ");
			for (int j=0; j<auxChat.getNumberOfUsers(); j++) {
				System.out.print(auxChat.getUsers().get(j));
				if (j+1 != auxChat.getNumberOfUsers())
					System.out.print(", ");
			}
			System.out.println();
		}
	}
}