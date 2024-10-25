"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const room_1 = require("../controllers/room");
const error_handler_1 = require("../utils/error_handler");
const roomRoutes = (0, express_1.Router)();
// GET
roomRoutes.get("/", (0, error_handler_1.errorHandler)(room_1.allRoomDetails));
roomRoutes.get("/:roomId", (0, error_handler_1.errorHandler)(room_1.roomDetails));
// POST
roomRoutes.post("/create", (0, error_handler_1.errorHandler)(room_1.createRoom));
roomRoutes.post("/:roomId/book", (0, error_handler_1.errorHandler)(room_1.bookRoom));
roomRoutes.post("/review", (0, error_handler_1.errorHandler)(room_1.reviewRoom));
// PUT
roomRoutes.put("/:roomId", (0, error_handler_1.errorHandler)(room_1.updateRoomDetails));
// DElETE
roomRoutes.delete("/:roomId", (0, error_handler_1.errorHandler)(room_1.deleteRoom));
exports.default = roomRoutes;
