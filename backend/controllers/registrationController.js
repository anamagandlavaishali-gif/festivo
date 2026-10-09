import {
  createRegistration as saveRegistration,
  cancelRegistration as revokeRegistration,
  getUserRegistrations,
  getEventRegistrations,
  checkUserRegisteredForEvent,
  getEventById,
} from '../services/dataStore.js';

export const registerForEvent = async (req, res, next) => {
  try {
    const { eventId, notes } = req.body;

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: 'Event ID is required to register.',
      });
    }

    const registration = await saveRegistration({
      eventId,
      user: req.user,
      notes,
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Your digital ticket is ready.',
      registration,
    });
  } catch (error) {
    // 400 for business validation (full, expired, duplicate)
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to complete registration.',
    });
  }
};

export const cancelRegistration = async (req, res, next) => {
  try {
    const { id } = req.params;

    const cancelled = await revokeRegistration(id, req.user._id, req.user.role);

    res.status(200).json({
      success: true,
      message: 'Registration successfully cancelled. Your seat has been released.',
      registration: cancelled,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to cancel registration.',
    });
  }
};

export const getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await getUserRegistrations(req.user._id);

    res.status(200).json({
      success: true,
      count: registrations.length,
      registrations,
    });
  } catch (error) {
    next(error);
  }
};

export const getEventParticipants = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const event = await getEventById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    // Role check: Only event organizer or admin can view participants
    const organizerId = event.organizer?._id || event.organizer;
    if (
      req.user.role !== 'admin' &&
      organizerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Only the event organizer or an admin can access participant records.',
      });
    }

    const participants = await getEventRegistrations(eventId);

    res.status(200).json({
      success: true,
      event: {
        _id: event._id,
        title: event.title,
        date: event.date,
        venue: event.venue,
        maxParticipants: event.maxParticipants,
        registeredCount: event.registeredCount,
      },
      count: participants.length,
      participants,
    });
  } catch (error) {
    next(error);
  }
};

export const checkRegistrationStatus = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const reg = await checkUserRegisteredForEvent(eventId, req.user._id);

    res.status(200).json({
      success: true,
      isRegistered: !!reg,
      registration: reg,
    });
  } catch (error) {
    next(error);
  }
};
