import express from "express";
import Chatroom from "../models/chatroom-model.js";
import User from "../models/user-model.js";

export const addChatroom = async (req, res, next) => {
    try{
        const {chatroomName, creatorUserId, creatorUsername} = req.body;
        console.log(chatroomName, creatorUserId);  
        const chatroomExists = await Chatroom.findOne({chatroomName:chatroomName});
        if (chatroomExists) {
            return res.status(400).send({msg: "Chatroom Already Exists"});
        }
        const userDetails = await User.findOne({userId: creatorUserId, username:creatorUsername});
        if (!userDetails.isAdmin) {
            return res.status(400).send({msg: "User Does not have permission to Create Chatroom"});
        }
        const newChatroom = await Chatroom.create({chatroomName, creatorUserId, creatorUsername});
        res.status(200).json({msg: `Creation of Chatroom ${chatroomName} Successful`});
    }
    catch (err) {
        const status = 404;
        const message = "Error in Creating Chatroom";
        const extraDetails = "Not much";
        const errorDetails = {
            message,
            status,
            extraDetails
        }
        next(errorDetails);
    }
}

export const removeChatroom = async (req, res, next) => {
    try{
        const {chatroomId, userId} = req.body;
        const userDetails = await User.findOne({userId: userId});
        if (!userDetails.isAdmin) {
            return res.status(400).send({msg: "User Does not have permission to Remove Chatroom"});
        }
        const deletion = await Chatroom.deleteOne({chatroomId: chatroomId});
        res.status(200).json({msg: `Removal of Chatroom ${chatroomId} Successful`});
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

export const getChatrooms = async (req, res, next) => {
    try{
        const chatrooms = await Chatroom.find();
        res.status(200).json({msg: `Fetching Chatrooms was Successful`, chatrooms:chatrooms});
    }
    catch (err) {
        const status = 404;
        const message = "Error in Fetching Chatroom";
        const extraDetails = "Not much";
        const errorDetails = {
            message,
            status,
            extraDetails
        }
        next(errorDetails);
    }
}