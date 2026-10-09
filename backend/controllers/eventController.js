import {
  getAllEvents,
  getEventById as fetchEventById,
  createEvent as insertEvent,
  updateEvent as patchEvent,
  deleteEvent as removeEvent,
  getOrganizerEvents,
  checkUserRegisteredForEvent,
} from '../services/dataStore.js';

export const getEvents = async (req, res, next) => {
  try {
    const { search, category, status, featured, sort } = req.query;

    const events = await getAllEvents({
      search,
      category,
      status,
      featured,
      sort,
    });

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await fetchEventById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found with requested ID.',
      });
    }

    let isRegistered = false;
    let registrationDetails = null;

    if (req.user) {
      const reg = await checkUserRegisteredForEvent(id, req.user._id);
      if (reg) {
        isRegistered = true;
        registrationDetails = reg;
      }
    }

    res.status(200).json({
      success: true,
      event,
      isRegistered,
      registrationDetails,
    });
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      date,
      startTime,
      endTime,
      venue,
      maxParticipants,
      registrationDeadline,
      image,
      prizes,
      requirements,
      tags,
      featured,
    } = req.body;

    if (!title || !description || !category || !date || !startTime || !endTime || !venue || !maxParticipants || !registrationDeadline) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all mandatory event fields: title, description, category, date, timings, venue, capacity, and deadline.',
      });
    }

    const event = await insertEvent(
      {
        title,
        description,
        category,
        date,
        startTime,
        endTime,
        venue,
        maxParticipants: Number(maxParticipants),
        registrationDeadline,
        image: image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
        prizes: prizes || '',
        requirements: Array.isArray(requirements) ? requirements : (requirements ? [requirements] : []),
        tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t) => t.trim()) : []),
        featured: Boolean(featured),
        status: 'Upcoming',
      },
      req.user
    );

    res.status(201).json({
      success: true,
      message: 'Event created successfully!',
      event,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await fetchEventById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Event not found to update.',
      });
    }

    // Role check: Only the organizer of this event or an admin can update
    const organizerId = existing.organizer?._id || existing.organizer;
    if (
      req.user.role !== 'admin' &&
      organizerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You are not authorized to edit this event.',
      });
    }

    const updated = await patchEvent(id, req.body);

    res.status(200).json({
      success: true,
      message: 'Event updated successfully!',
      event: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await fetchEventById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Event not found to delete.',
      });
    }

    // Role check: Only organizer or admin
    const organizerId = existing.organizer?._id || existing.organizer;
    if (
      req.user.role !== 'admin' &&
      organizerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You are not authorized to delete this event.',
      });
    }

    await removeEvent(id);

    res.status(200).json({
      success: true,
      message: 'Event and associated registrations deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const getMyEvents = async (req, res, next) => {
  try {
    const events = await getOrganizerEvents(req.user._id);

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    next(error);
  }
};
