import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ticketCode: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Cancelled', 'Attended'],
      default: 'Confirmed',
    },
    participantName: {
      type: String,
      required: true,
    },
    participantEmail: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      default: 'General',
    },
    collegeId: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to guarantee uniqueness at database level
registrationSchema.index({ event: 1, user: 1 }, { unique: true });

const Registration =
  mongoose.models.Registration || mongoose.model('Registration', registrationSchema);
export default Registration;
