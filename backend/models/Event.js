import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
    },
    category: {
      type: String,
      required: [true, 'Event category is required'],
      enum: ['Technical', 'Cultural', 'Sports', 'Workshops', 'Hackathons', 'Fests'],
    },
    date: {
      type: String,
      required: [true, 'Event date is required (YYYY-MM-DD)'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    organizerName: {
      type: String,
      default: 'College Event Board',
    },
    organizerEmail: {
      type: String,
      default: '',
    },
    organizerPhone: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    maxParticipants: {
      type: Number,
      required: [true, 'Maximum participant limit is required'],
      min: [1, 'Capacity must be at least 1'],
    },
    registeredCount: {
      type: Number,
      default: 0,
    },
    registrationDeadline: {
      type: String,
      required: [true, 'Registration deadline is required'],
    },
    status: {
      type: String,
      enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
      default: 'Upcoming',
    },
    prizes: {
      type: String,
      default: '',
    },
    requirements: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);
export default Event;
