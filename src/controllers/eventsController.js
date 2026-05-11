const { SuccessResponse, ErrorResponse } = require("../middlewares/utils/common");
const { EventService } = require("../services");
const { StatusCodes } = require("http-status-codes");

async function getAllEvents(req, res) {
  try {
    const events = await EventService.getAllEvents();
    SuccessResponse.data = events;
    return res
      .status(StatusCodes.OK)
      .json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = "Failed to fetch events";
    ErrorResponse.error = error;
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
}
async function getEventById(req, res) {
  try {
    const event = await EventService.getEventById(req.params.id);
    SuccessResponse.data = event;
    return res
      .status(StatusCodes.OK)
      .json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = "Failed to fetch event";
    ErrorResponse.error = error;
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
}
async function createEvent(req, res) {
  try {
    const event = await EventService.createEvent(req.body);
    SuccessResponse.data = event;
    return res
      .status(StatusCodes.CREATED)
      .json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = "Failed to create event";
    ErrorResponse.error = error;
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
}

async function updateEvent(req, res) {
  try {
    const event = await EventService.updateEvent(req.params.id, req.body);
    SuccessResponse.data = event;
    return res
      .status(StatusCodes.OK)
      .json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = "Failed to update event";
    ErrorResponse.error = error;
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
}
async function deleteEvent(req, res) {
  try {
    await EventService.deleteEvent(req.params.id);
    SuccessResponse.message = "Event deleted successfully";
    return res
      .status(StatusCodes.OK)
      .json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message = "Failed to delete event";
    ErrorResponse.error = error;
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ErrorResponse);
  }
}
module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
};