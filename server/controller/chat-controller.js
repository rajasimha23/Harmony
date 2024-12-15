import express from "express";
import Chat from "../models/chat-model.js";

export const addChat = async (req, res, next) => {
    try{
        const {chatroomId, userId, username, message} = req.body; 
        const newChat = await Chat.create({chatroomId, userId, username, message});
        res.status(200).json({message: `Creation of Message Successful`});
    }
    catch (err) {
        const status = 404;
        const message = "Error in Creating Chat";
        const extraDetails = "Not much";
        const errorDetails = {
            message,
            status,
            extraDetails
        }
        next(errorDetails);
    }
}

export const deleteChat = async (req, res, next) => {
    try{
        const {chatId} = req.body;
        const deletion = await Chat.updateOne({_id: chatId}, {isDeleted:true});
        res.status(200).json({message: `Removal of Chat Successful`});
    }
    catch (err) {
        const status = 404;
        const message = "Error in Removing Chatroom";
        const extraDetails = "Not much";
        const errorDetails = {
            message,
            status,
            extraDetails
        }
        next(errorDetails);
    }
}

export const fetchChat = async (req, res, next) => {
    try{
        const {chatroomId} = req.body;
        const chatrooms = await Chat.find({chatroomId:chatroomId});
        res.status(200).json({message: `Fetching Chatroom Chats was Successful`, chatrooms:chatrooms});
    }
    catch (err) {
        const status = 404;
        const message = "Error in Fetching Chatroom Chats";
        const extraDetails = "Not much";
        const errorDetails = {
            message,
            status,
            extraDetails
        }
        next(errorDetails);
    }
}

export const updateChat = async (req, res, next) => {
    try{
        const {chatId, newMessage} = req.body;
        const updation = await Chat.updateOne({_id: chatId}, {isEdited:true, message: newMessage});
        res.status(200).json({message: `Removal of Chat Successful`});
    }
    catch (err) {
        const status = 404;
        const message = "Error in Updating Chat";
        const extraDetails = "Not much";
        const errorDetails = {
            message,
            status,
            extraDetails
        }
        next(errorDetails);
    }
}