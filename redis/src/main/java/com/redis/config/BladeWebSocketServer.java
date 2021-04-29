/*
 *      Copyright (c) 2018-2028, Chill Zhuang All rights reserved.
 *
 *  Redistribution and use in source and binary forms, with or without
 *  modification, are permitted provided that the following conditions are met:
 *
 *  Redistributions of source code must retain the above copyright notice,
 *  this list of conditions and the following disclaimer.
 *  Redistributions in binary form must reproduce the above copyright
 *  notice, this list of conditions and the following disclaimer in the
 *  documentation and/or other materials provided with the distribution.
 *  Neither the name of the dreamlu.net developer nor the names of its
 *  contributors may be used to endorse or promote products derived from
 *  this software without specific prior written permission.
 *  Author: Chill 庄骞 (smallchill@163.com)
 *//*

package com.redis.config;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Component;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.concurrent.CopyOnWriteArraySet;

*/
/**
 * websocket
 *
 * @author hjf
 *//*

@ServerEndpoint("/webSocket/{sid}")
@Component
public class BladeWebSocketServer {

	private static CopyOnWriteArraySet<BladeWebSocketServer> webSocketSet = new CopyOnWriteArraySet<>();
	private Session session;
	private String sid = "";

	*/
/*
	* 连接成功调用的方法
	* *//*

	@OnOpen
	public void onOpen(Session session, @Param("sid") String sid){
		this.session = session;
		webSocketSet.add(this);
		this.sid = sid;
	}

	*/
/*
	* 连接关闭调用的方法
	* *//*

	@OnClose
	public void onClose(){
		webSocketSet.remove(this);
	}

	*/
/*
	* 收到客户端的消息
	* *//*

	@OnMessage
	public void onMessage(String message,Session session) throws IOException {
		for (BladeWebSocketServer item : webSocketSet){
			item.sendMessage(message);
		}
	}

	@OnError
	public void onError(Session session,Throwable error){
		error.printStackTrace();
	}

	public void sendMessage(String message) throws IOException {
		this.session.getBasicRemote().sendText(message);
	}

	*/
/*
	* 群发自定义消息
	*//*

	public void sendInfo(String message,@PathParam("sid") String sid) throws IOException {
		for (BladeWebSocketServer item : webSocketSet){
			if (sid == null){
				item.sendMessage(message);
			}else if (item.sid.equals(sid)){
				item.sendMessage(message);
			}
		}
	}
}
*/
