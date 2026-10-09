import {
  getPlatformStats,
  getAllUsers,
  updateUser,
  deleteUser,
  getAllEvents,
  getAllRegistrations,
} from '../services/dataStore.js';

export const getAdminStats = async (req, res, next) => {
  try {
    const stats = await getPlatformStats();
    const allEvents = await getAllEvents({});
    const allRegistrations = await getAllRegistrations();
    const allUsers = await getAllUsers();

    // Category breakdown
    const categoryCount = {};
    allEvents.forEach((ev) => {
      categoryCount[ev.category] = (categoryCount[ev.category] || 0) + 1;
    });

    // Recent activity: recent registrations + recent events
    const recentRegistrations = allRegistrations.slice(0, 5);
    const recentEvents = allEvents.slice(0, 5);
    const recentUsers = allUsers.slice(0, 5);

    res.status(200).json({
      success: true,
      stats: {
        ...stats,
        categoryBreakdown: categoryCount,
      },
      recentRegistrations,
      recentEvents,
      recentUsers,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsersAdmin = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role, isActive, department, collegeId } = req.body;

    const updated = await updateUser(id, {
      ...(role && { role }),
      ...(isActive !== undefined && { isActive }),
      ...(department && { department }),
      ...(collegeId && { collegeId }),
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User details updated successfully by Admin.',
      user: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUserAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Admin cannot delete their own active account.',
      });
    }

    const deleted = await deleteUser(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User and their registrations deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const getAllRegistrationsAdmin = async (req, res, next) => {
  try {
    const registrations = await getAllRegistrations();
    res.status(200).json({
      success: true,
      count: registrations.length,
      registrations,
    });
  } catch (error) {
    next(error);
  }
};
