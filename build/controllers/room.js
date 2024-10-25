"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRoom = exports.updateRoomDetails = exports.reviewRoom = exports.bookRoom = exports.createRoom = exports.roomDetails = exports.allRoomDetails = void 0;
const server_1 = require("../server");
const room_1 = require("../schemas/room");
// GET
const allRoomDetails = async (req, res, next) => {
    //   const { roomId } = req.params;
    console.log(req.params);
};
exports.allRoomDetails = allRoomDetails;
const roomDetails = async (req, res, next) => {
    //   const { roomId } = req.params;
    console.log(req.params);
};
exports.roomDetails = roomDetails;
// POST
const createRoom = async (req, res, next) => {
    console.log(req.body);
    const { name, city, location, photos, videos, price, mincapacity, maxcapacity, roomtype, verified, furnishingStatus, aminities, } = req.body;
    // Create the room in the database
    const newRoom = await server_1.prismaClient.roomForRent.create({
        data: {
            name,
            city,
            location,
            photos,
            videos,
            price,
            mincapacity,
            maxcapacity,
            roomtype,
            verified,
            furnishingStatus,
            aminities,
        },
    });
    // Respond with the created room data
    res.status(201).json({
        success: true,
        data: newRoom,
    });
};
exports.createRoom = createRoom;
const bookRoom = async (req, res, next) => {
    //   const { roomId } = req.params;
    console.log(req.params);
};
exports.bookRoom = bookRoom;
const reviewRoom = async (req, res, next) => {
    room_1.ReviewSchema.parse(req.body);
    const { rating, comment, roomForRentId, userId } = req.body;
    const newReview = await server_1.prismaClient.$transaction(async (prisma) => {
        // Step 1: Create a new review
        const review = await prisma.roomReview.create({
            data: {
                rating,
                comment,
                user: { connect: { id: userId } },
                roomForRent: { connect: { id: roomForRentId } },
            },
        });
        // Step 2: Calculate the new average rating for the room
        const { _avg } = await prisma.roomReview.aggregate({
            where: { roomForRentId },
            _avg: { rating: true },
        });
        // Step 3: Update the `ratings` field in the `RoomForRent` model
        if (_avg.rating !== null) {
            await prisma.roomForRent.update({
                where: { id: roomForRentId },
                data: { ratings: _avg.rating }, // Set the average rating
            });
        }
        return review; // Return the newly created review
    });
    res.status(201).json(newReview);
};
exports.reviewRoom = reviewRoom;
// PUT
const updateRoomDetails = async (req, res, next) => {
    //   const { roomId } = req.params;
    console.log(req.params);
};
exports.updateRoomDetails = updateRoomDetails;
// DELETE
const deleteRoom = async (req, res, next) => {
    //   const { roomId } = req.params;
    console.log(req.params);
};
exports.deleteRoom = deleteRoom;
