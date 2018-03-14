package com.joaovirgili.classes;

import java.util.ArrayList;;

public class Chatroom {
	private int id;
	private ArrayList<String> users;
	
	public Chatroom (String user1, String user2, int id) {
		users = new ArrayList<String>();
		users.add(user1);
		users.add(user2);
		this.id = id;
	}
	
	public void addUser(String user) {
		users.add(user);
	}
	public void removeUser(String user) {
		users.remove(user);
	}
	public int getId() {
		return this.id;
	}
	public ArrayList<String> getUsers() {
		return this.users;
	}
	public int getNumberOfUsers() {
		return this.users.size();
	}
	public boolean containsUser(String user) {
		return (this.users.contains(user));
	}
	
}