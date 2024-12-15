import express from "express";
import Chatroom from "../models/chatroom-model.js";
import User from "../models/user-model.js";

export const addChatroom = async (req, res, next) => {
    try{
        const {chatroomName, creatorUserId, creatorUsername} = req.body; 
        const chatroomExists = await Chatroom.findOne({chatroomName:chatroomName});
        if (chatroomExists) {
            return res.status(400).send({message: "Chatroom Already Exists"});
        }
        const userDetails = await User.findOne({userId: creatorUserId, username:creatorUsername});
        if (!userDetails.isAdmin) {
            return res.status(400).send({message: "User Does not have permission to Create Chatroom"});
        }
        const newChatroom = await Chatroom.create({chatroomName, creatorUserId, creatorUsername});
        res.status(200).json({message: `Creation of Chatroom ${chatroomName} Successful`});
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
            return res.status(400).send({message: "User Does not have permission to Remove Chatroom"});
        }
        const deletion = await Chatroom.deleteOne({chatroomId: chatroomId});
        res.status(200).json({message: `Removal of Chatroom ${chatroomId} Successful`});
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

export const fetchChatrooms = async (req, res, next) => {
    try{
        const chatrooms = await Chatroom.find();
        res.status(200).json({message: `Fetching Chatrooms was Successful`, chatrooms:chatrooms});
    }
    catch (err) {
        const status = 404;
        const message = "Error in Fetching Chatrooms";
        const extraDetails = "Not much";
        const errorDetails = {
            message,
            status,
            extraDetails
        }
        next(errorDetails);
    }
}


export const getChatroom = async (req, res, next) => {
    try{
        const {chatroomId} = req.body
        const chatroomInfo = await Chatroom.find({chatroomId: chatroomId});
        res.status(200).json({message: `Getting Chatroom was Successful`, chatroomInfo:chatroomInfo});
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