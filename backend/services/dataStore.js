import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';

// Helper to check if Mongoose is actively connected to a real MongoDB
const isMongoActive = () => mongoose.connection.readyState === 1;

// In-Memory Seed Storage for Instant Demo & Resilient Fallback
let inMemoryUsers = [];
let inMemoryEvents = [];
let inMemoryRegistrations = [];

const defaultPasswordHash = bcrypt.hashSync('Admin@123', 10);
const organizerPasswordHash = bcrypt.hashSync('Organizer@123', 10);
const studentPasswordHash = bcrypt.hashSync('Student@123', 10);

const initInMemoryData = () => {
  inMemoryUsers = [
    {
      _id: '65f1a001a111111111111001',
      name: 'Alexander Wright',
      email: 'admin@festivo.edu',
      password: defaultPasswordHash,
      role: 'admin',
      department: 'Central Administration & Student Affairs',
      collegeId: 'ADM-2026-001',
      phone: '+1 (555) 100-2000',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bio: 'Festivo Chief Campus Administrator and Student Life Coordinator.',
      isActive: true,
      createdAt: new Date('2026-01-10'),
    },
    {
      _id: '65f1a001a111111111111002',
      name: 'Elena Rostova',
      email: 'organizer@festivo.edu',
      password: organizerPasswordHash,
      role: 'organizer',
      department: 'Computer Science & Tech Club Lead',
      collegeId: 'ORG-2026-104',
      phone: '+1 (555) 200-3000',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      bio: 'Head of Student Tech Council and Lead Organizer for TechNovation & Hackathons.',
      isActive: true,
      createdAt: new Date('2026-01-15'),
    },
    {
      _id: '65f1a001a111111111111003',
      name: 'Jordan Miller',
      email: 'student@festivo.edu',
      password: studentPasswordHash,
      role: 'student',
      department: 'Information Technology (3rd Year)',
      collegeId: 'STU-2026-582',
      phone: '+1 (555) 300-4000',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
      bio: 'Passionate student coder, avid hackathon participant, and music club guitarist.',
      isActive: true,
      createdAt: new Date('2026-02-01'),
    },
    {
      _id: '65f1a001a111111111111004',
      name: 'Marcus Chen',
      email: 'marcus.chen@festivo.edu',
      password: studentPasswordHash,
      role: 'student',
      department: 'Electrical Engineering',
      collegeId: 'STU-2026-619',
      phone: '+1 (555) 400-5000',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      bio: 'Robotics enthusiast and competitive badminton player.',
      isActive: true,
      createdAt: new Date('2026-02-05'),
    },
  ];

  inMemoryEvents = [
    {
      _id: '65f2b002b222222222222001',
      title: 'TechNovation 2026 - Annual Flagship Tech Summit',
      description: 'The pinnacle celebration of engineering excellence! Join over 1,200 tech enthusiasts for keynote speeches by Silicon Valley leaders, cutting-edge AI demos, project exhibitions, and hardware showcases.',
      category: 'Technical',
      date: '2026-11-15',
      startTime: '09:00 AM',
      endTime: '05:30 PM',
      venue: 'Main Auditorium & Tech Park Hall A',
      organizer: '65f1a001a111111111111002',
      organizerName: 'Elena Rostova (CS Tech Council)',
      organizerEmail: 'organizer@festivo.edu',
      organizerPhone: '+1 (555) 200-3000',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
      maxParticipants: 350,
      registeredCount: 142,
      registrationDeadline: '2026-11-10',
      status: 'Upcoming',
      prizes: '$5,000 in Innovation Grants & Cloud Credits',
      requirements: ['Student ID Card', 'Laptop for hands-on sessions', 'Active Interest in Tech'],
      tags: ['AI', 'Cloud', 'Robotics', 'Keynote', 'Innovation'],
      featured: true,
      createdAt: new Date('2026-02-10'),
    },
    {
      _id: '65f2b002b222222222222002',
      title: 'CodeClash 36H - Inter-College Hackathon',
      description: 'A relentless 36-hour sprint where brilliant minds unite to solve real-world problems in HealthTech, EdTech, FinTech, and Climate Resilience. Mentors from top startups will guide teams through ideation, MVP build, and pitching.',
      category: 'Hackathons',
      date: '2026-11-20',
      startTime: '08:00 AM',
      endTime: '08:00 PM',
      venue: 'Innovation Hub & Computer Center Wing B',
      organizer: '65f1a001a111111111111002',
      organizerName: 'Elena Rostova (Hackathon Guild)',
      organizerEmail: 'organizer@festivo.edu',
      organizerPhone: '+1 (555) 200-3000',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
      maxParticipants: 120,
      registeredCount: 89,
      registrationDeadline: '2026-11-18',
      status: 'Upcoming',
      prizes: '1st Prize: $2,500 | 2nd Prize: $1,200 | Best UI: $500',
      requirements: ['Team of 2-4 members', 'GitHub Account', 'Chargers & Development Rig'],
      tags: ['Hackathon', 'Coding', 'FullStack', 'AI', 'Prize'],
      featured: true,
      createdAt: new Date('2026-02-12'),
    },
    {
      _id: '65f2b002b222222222222003',
      title: 'Aura 2026 - National Cultural & Arts Extravaganza',
      description: 'Step into a world of rhythm, melody, theater, and vivid colors! Aura 2026 features classical and street dance competitions, battle of the bands, solo singing, drama skits, and a star celebrity musical night.',
      category: 'Cultural',
      date: '2026-11-28',
      startTime: '10:00 AM',
      endTime: '10:00 PM',
      venue: 'Open Air Amphitheatre & Student Plaza',
      organizer: '65f1a001a111111111111001',
      organizerName: 'Alexander Wright (Cultural Affairs)',
      organizerEmail: 'admin@festivo.edu',
      organizerPhone: '+1 (555) 100-2000',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
      maxParticipants: 600,
      registeredCount: 380,
      registrationDeadline: '2026-11-25',
      status: 'Upcoming',
      prizes: 'Trophies, Gold Medals, and $3,000 Cash Prizes',
      requirements: ['Festivo QR Ticket', 'Valid College ID'],
      tags: ['Music', 'Dance', 'Drama', 'Concert', 'Art'],
      featured: true,
      createdAt: new Date('2026-02-14'),
    },
    {
      _id: '65f2b002b222222222222004',
      title: 'Olympus Arena 2026 - Inter-Collegiate Sports Championship',
      description: 'Feel the adrenaline! Compete across Football, Basketball, Badminton, Table Tennis, Track & Field, and Volleyball. High-energy sportsmanship with live commentary, refreshments, and athletic scouts.',
      category: 'Sports',
      date: '2026-12-05',
      startTime: '07:30 AM',
      endTime: '06:00 PM',
      venue: 'Campus Sports Complex & Olympic Stadium',
      organizer: '65f1a001a111111111111001',
      organizerName: 'Alexander Wright (Sports Director)',
      organizerEmail: 'admin@festivo.edu',
      organizerPhone: '+1 (555) 100-2000',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
      maxParticipants: 400,
      registeredCount: 210,
      registrationDeadline: '2026-11-30',
      status: 'Upcoming',
      prizes: 'Rolling Championship Trophy, Medals & Sponsored Sports Kits',
      requirements: ['Proper Sports Attire & Non-marking shoes', 'College Medical Fitness Form'],
      tags: ['Football', 'Basketball', 'Athletics', 'Fitness', 'Tournament'],
      featured: false,
      createdAt: new Date('2026-02-16'),
    },
    {
      _id: '65f2b002b222222222222005',
      title: 'Full-Stack GenAI & Agentic Systems Masterclass',
      description: 'An immersive 6-hour hands-on workshop building real production applications with LangChain, Gemini API, vector embeddings, RAG pipelines, and autonomous web agent architectures.',
      category: 'Workshops',
      date: '2026-11-12',
      startTime: '01:00 PM',
      endTime: '07:00 PM',
      venue: 'Advanced Computing Lab 304',
      organizer: '65f1a001a111111111111002',
      organizerName: 'Elena Rostova (AI Special Interest Group)',
      organizerEmail: 'organizer@festivo.edu',
      organizerPhone: '+1 (555) 200-3000',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
      maxParticipants: 80,
      registeredCount: 76,
      registrationDeadline: '2026-11-11',
      status: 'Upcoming',
      prizes: 'Verified Certificate of Mastery + Access to Cloud GPU Clusters',
      requirements: ['Node.js & Python Basics', 'Laptop with VS Code & Git installed'],
      tags: ['GenAI', 'LLM', 'HandsOn', 'Certificate', 'Python'],
      featured: false,
      createdAt: new Date('2026-02-18'),
    },
    {
      _id: '65f2b002b222222222222006',
      title: 'Festivo Grand Spring Carnival & Food Fiesta',
      description: 'The mega annual social carnival! Experience 40+ artisanal food stalls, carnival game booths, silent disco, live acoustic busking, photo booths, and spectacular fireworks to close out the semester.',
      category: 'Fests',
      date: '2026-12-18',
      startTime: '03:00 PM',
      endTime: '11:00 PM',
      venue: 'North Green Grounds & Lake Promenade',
      organizer: '65f1a001a111111111111001',
      organizerName: 'Alexander Wright (Campus Life)',
      organizerEmail: 'admin@festivo.edu',
      organizerPhone: '+1 (555) 100-2000',
      image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80',
      maxParticipants: 1000,
      registeredCount: 420,
      registrationDeadline: '2026-12-15',
      status: 'Upcoming',
      prizes: 'Carnival vouchers and raffle tickets for smart tech prizes',
      requirements: ['Open to all students, faculty, and alumni with digital pass'],
      tags: ['Carnival', 'Food', 'Games', 'Fireworks', 'Party'],
      featured: true,
      createdAt: new Date('2026-02-20'),
    },
    {
      _id: '65f2b002b222222222222007',
      title: 'RoboWars & Autonomous Drone Sprint 2026',
      description: 'Metal-clashing combat robots and high-speed autonomous drone racing in a reinforced arena. Features 15kg combat bots, obstacle navigators, and line-follower robotics competitions.',
      category: 'Technical',
      date: '2026-12-08',
      startTime: '10:00 AM',
      endTime: '05:00 PM',
      venue: 'Mechanical Workshop High-Bay Arena',
      organizer: '65f1a001a111111111111002',
      organizerName: 'Elena Rostova (Robotics Guild)',
      organizerEmail: 'organizer@festivo.edu',
      organizerPhone: '+1 (555) 200-3000',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
      maxParticipants: 150,
      registeredCount: 65,
      registrationDeadline: '2026-12-03',
      status: 'Upcoming',
      prizes: '$3,500 Cash Purse + 3D Printer Kits',
      requirements: ['Robot specifications meeting safety rulebook', 'Fire safety compliance'],
      tags: ['Robotics', 'Combat', 'Drones', 'Hardware'],
      featured: false,
      createdAt: new Date('2026-02-22'),
    },
    {
      _id: '65f2b002b222222222222008',
      title: 'Battle of the Bands & Rock Symphonies',
      description: 'Ten college rock and indie bands face off on the central concert stage. Heavy riffs, soaring vocals, acoustic battles, and energetic drum solos evaluated by celebrity guest judges.',
      category: 'Cultural',
      date: '2026-11-29',
      startTime: '05:30 PM',
      endTime: '10:30 PM',
      venue: 'Main Stadium Central Stage',
      organizer: '65f1a001a111111111111001',
      organizerName: 'Alexander Wright (Music Guild)',
      organizerEmail: 'admin@festivo.edu',
      organizerPhone: '+1 (555) 100-2000',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
      maxParticipants: 500,
      registeredCount: 310,
      registrationDeadline: '2026-11-26',
      status: 'Upcoming',
      prizes: 'Recording Studio Time + $2,000 Musical Gear Voucher',
      requirements: ['Standard pass holders welcome'],
      tags: ['Music', 'LiveBand', 'Rock', 'Concert'],
      featured: false,
      createdAt: new Date('2026-02-24'),
    },
  ];

  inMemoryRegistrations = [
    {
      _id: '65f3c003c333333333333001',
      event: '65f2b002b222222222222001',
      user: '65f1a001a111111111111003',
      ticketCode: 'FST-TKT-782914',
      status: 'Confirmed',
      participantName: 'Jordan Miller',
      participantEmail: 'student@festivo.edu',
      department: 'Information Technology (3rd Year)',
      collegeId: 'STU-2026-582',
      phone: '+1 (555) 300-4000',
      registeredAt: new Date('2026-03-01'),
      notes: 'Interested in the AI systems track.',
    },
    {
      _id: '65f3c003c333333333333002',
      event: '65f2b002b222222222222002',
      user: '65f1a001a111111111111003',
      ticketCode: 'FST-TKT-419823',
      status: 'Confirmed',
      participantName: 'Jordan Miller',
      participantEmail: 'student@festivo.edu',
      department: 'Information Technology (3rd Year)',
      collegeId: 'STU-2026-582',
      phone: '+1 (555) 300-4000',
      registeredAt: new Date('2026-03-05'),
      notes: 'Team Leader for team ByteCrafters.',
    },
    {
      _id: '65f3c003c333333333333003',
      event: '65f2b002b222222222222001',
      user: '65f1a001a111111111111004',
      ticketCode: 'FST-TKT-551092',
      status: 'Confirmed',
      participantName: 'Marcus Chen',
      participantEmail: 'marcus.chen@festivo.edu',
      department: 'Electrical Engineering',
      collegeId: 'STU-2026-619',
      phone: '+1 (555) 400-5000',
      registeredAt: new Date('2026-03-02'),
      notes: 'Hardware showcase attendee.',
    },
  ];
};

initInMemoryData();

// ======================== USER OPERATIONS ========================

export const findUserByEmail = async (email) => {
  const normalized = email.toLowerCase().trim();
  if (isMongoActive()) {
    return await User.findOne({ email: normalized });
  }
  return inMemoryUsers.find((u) => u.email.toLowerCase() === normalized) || null;
};

export const findUserById = async (id) => {
  const idStr = id?.toString();
  if (isMongoActive()) {
    return await User.findById(idStr).select('-password');
  }
  const user = inMemoryUsers.find((u) => u._id.toString() === idStr);
  if (!user) return null;
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const findUserWithPasswordById = async (id) => {
  const idStr = id?.toString();
  if (isMongoActive()) {
    return await User.findById(idStr);
  }
  return inMemoryUsers.find((u) => u._id.toString() === idStr) || null;
};

export const createUser = async (userData) => {
  const normalizedEmail = userData.email.toLowerCase().trim();

  if (isMongoActive()) {
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      throw new Error('A user with this email address already exists.');
    }
    const newUser = await User.create({
      ...userData,
      email: normalizedEmail,
    });
    return newUser;
  }

  // Fallback memory
  const existing = inMemoryUsers.find(
    (u) => u.email.toLowerCase() === normalizedEmail
  );
  if (existing) {
    throw new Error('A user with this email address already exists.');
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(userData.password, salt);

  const newUser = {
    _id: new mongoose.Types.ObjectId().toString(),
    name: userData.name,
    email: normalizedEmail,
    password: hashedPassword,
    role: userData.role || 'student',
    department: userData.department || 'Computer Science',
    collegeId: userData.collegeId || `FST-2026-${Math.floor(100 + Math.random() * 900)}`,
    phone: userData.phone || '+1 (555) 000-0000',
    avatar: userData.avatar || '',
    bio: userData.bio || '',
    isActive: true,
    createdAt: new Date(),
  };

  inMemoryUsers.push(newUser);
  return newUser;
};

export const getAllUsers = async () => {
  if (isMongoActive()) {
    return await User.find({}).select('-password').sort({ createdAt: -1 });
  }
  return inMemoryUsers.map(({ password, ...rest }) => rest);
};

export const updateUser = async (id, updateData) => {
  const idStr = id.toString();

  if (isMongoActive()) {
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }
    return await User.findByIdAndUpdate(idStr, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');
  }

  const index = inMemoryUsers.findIndex((u) => u._id.toString() === idStr);
  if (index === -1) return null;

  if (updateData.password) {
    const salt = bcrypt.genSaltSync(10);
    updateData.password = bcrypt.hashSync(updateData.password, salt);
  }

  inMemoryUsers[index] = { ...inMemoryUsers[index], ...updateData, updatedAt: new Date() };
  const { password, ...rest } = inMemoryUsers[index];
  return rest;
};

export const deleteUser = async (id) => {
  const idStr = id.toString();
  if (isMongoActive()) {
    await Registration.deleteMany({ user: idStr });
    return await User.findByIdAndDelete(idStr);
  }
  const index = inMemoryUsers.findIndex((u) => u._id.toString() === idStr);
  if (index === -1) return null;
  const removed = inMemoryUsers.splice(index, 1)[0];
  inMemoryRegistrations = inMemoryRegistrations.filter((r) => r.user.toString() !== idStr);
  return removed;
};

// ======================== EVENT OPERATIONS ========================

export const getAllEvents = async ({ search, category, status, featured, sort }) => {
  if (isMongoActive()) {
    let query = {};
    if (category && category !== 'All') {
      query.category = category;
    }
    if (status && status !== 'All') {
      query.status = status;
    }
    if (featured === 'true' || featured === true) {
      query.featured = true;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    let sortOptions = { date: 1 };
    if (sort === 'popular') sortOptions = { registeredCount: -1 };
    if (sort === 'newest') sortOptions = { createdAt: -1 };
    if (sort === 'date-asc') sortOptions = { date: 1 };
    if (sort === 'date-desc') sortOptions = { date: -1 };

    return await Event.find(query).sort(sortOptions);
  }

  // Memory fallback
  let filtered = [...inMemoryEvents];

  if (category && category !== 'All') {
    filtered = filtered.filter(
      (e) => e.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (status && status !== 'All') {
    filtered = filtered.filter(
      (e) => e.status.toLowerCase() === status.toLowerCase()
    );
  }

  if (featured === 'true' || featured === true) {
    filtered = filtered.filter((e) => e.featured === true);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q) ||
        (e.tags && e.tags.some((t) => t.toLowerCase().includes(q)))
    );
  }

  if (sort === 'popular') {
    filtered.sort((a, b) => b.registeredCount - a.registeredCount);
  } else if (sort === 'newest') {
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sort === 'date-desc') {
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else {
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  return filtered;
};

export const getEventById = async (id) => {
  const idStr = id?.toString();
  if (isMongoActive()) {
    return await Event.findById(idStr);
  }
  return inMemoryEvents.find((e) => e._id.toString() === idStr) || null;
};

export const createEvent = async (eventData, user) => {
  const payload = {
    ...eventData,
    organizer: user._id,
    organizerName: user.name,
    organizerEmail: user.email,
    organizerPhone: user.phone || '',
    registeredCount: 0,
    status: eventData.status || 'Upcoming',
  };

  if (isMongoActive()) {
    return await Event.create(payload);
  }

  const newEvent = {
    _id: new mongoose.Types.ObjectId().toString(),
    ...payload,
    createdAt: new Date(),
  };

  inMemoryEvents.unshift(newEvent);
  return newEvent;
};

export const updateEvent = async (id, updateData) => {
  const idStr = id.toString();
  if (isMongoActive()) {
    return await Event.findByIdAndUpdate(idStr, updateData, {
      new: true,
      runValidators: true,
    });
  }

  const index = inMemoryEvents.findIndex((e) => e._id.toString() === idStr);
  if (index === -1) return null;

  inMemoryEvents[index] = {
    ...inMemoryEvents[index],
    ...updateData,
    updatedAt: new Date(),
  };
  return inMemoryEvents[index];
};

export const deleteEvent = async (id) => {
  const idStr = id.toString();
  if (isMongoActive()) {
    await Registration.deleteMany({ event: idStr });
    return await Event.findByIdAndDelete(idStr);
  }

  const index = inMemoryEvents.findIndex((e) => e._id.toString() === idStr);
  if (index === -1) return null;

  const deleted = inMemoryEvents.splice(index, 1)[0];
  inMemoryRegistrations = inMemoryRegistrations.filter((r) => r.event.toString() !== idStr);
  return deleted;
};

export const getOrganizerEvents = async (organizerId) => {
  const orgStr = organizerId.toString();
  if (isMongoActive()) {
    return await Event.find({ organizer: orgStr }).sort({ createdAt: -1 });
  }
  return inMemoryEvents
    .filter((e) => e.organizer.toString() === orgStr)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

// ======================== REGISTRATION OPERATIONS ========================

export const createRegistration = async ({ eventId, user, notes }) => {
  const event = await getEventById(eventId);
  if (!event) {
    throw new Error('Event not found.');
  }

  // 1. Check if event is cancelled or completed
  if (event.status === 'Cancelled') {
    throw new Error('Cannot register. This event has been cancelled.');
  }

  // 2. Check registration deadline
  const today = new Date().toISOString().split('T')[0];
  if (event.registrationDeadline && event.registrationDeadline < today) {
    throw new Error(
      `Registration closed! The deadline for this event was ${event.registrationDeadline}.`
    );
  }

  // 3. Check seat capacity
  if (event.registeredCount >= event.maxParticipants) {
    throw new Error('Registration full! This event has reached maximum participant capacity.');
  }

  const eventIdStr = event._id.toString();
  const userIdStr = user._id.toString();

  // 4. Prevent duplicate registration
  if (isMongoActive()) {
    const existing = await Registration.findOne({
      event: eventIdStr,
      user: userIdStr,
      status: { $ne: 'Cancelled' },
    });

    if (existing) {
      throw new Error('You have already registered for this event.');
    }

    const ticketCode = `FST-${Math.floor(100000 + Math.random() * 900000)}`;

    const registration = await Registration.create({
      event: eventIdStr,
      user: userIdStr,
      ticketCode,
      status: 'Confirmed',
      participantName: user.name,
      participantEmail: user.email,
      department: user.department || 'General',
      collegeId: user.collegeId || '',
      phone: user.phone || '',
      notes: notes || '',
    });

    await Event.findByIdAndUpdate(eventIdStr, { $inc: { registeredCount: 1 } });
    return registration;
  }

  // Memory fallback duplicate check
  const existing = inMemoryRegistrations.find(
    (r) =>
      r.event.toString() === eventIdStr &&
      r.user.toString() === userIdStr &&
      r.status !== 'Cancelled'
  );

  if (existing) {
    throw new Error('You have already registered for this event.');
  }

  const ticketCode = `FST-${Math.floor(100000 + Math.random() * 900000)}`;

  const newReg = {
    _id: new mongoose.Types.ObjectId().toString(),
    event: eventIdStr,
    user: userIdStr,
    ticketCode,
    status: 'Confirmed',
    participantName: user.name,
    participantEmail: user.email,
    department: user.department || 'General',
    collegeId: user.collegeId || '',
    phone: user.phone || '',
    registeredAt: new Date(),
    notes: notes || '',
  };

  inMemoryRegistrations.push(newReg);

  // Increment event registered count
  const evIndex = inMemoryEvents.findIndex((e) => e._id.toString() === eventIdStr);
  if (evIndex !== -1) {
    inMemoryEvents[evIndex].registeredCount =
      (inMemoryEvents[evIndex].registeredCount || 0) + 1;
  }

  return newReg;
};

export const cancelRegistration = async (registrationId, userId, userRole) => {
  const regIdStr = registrationId.toString();
  const userIdStr = userId.toString();

  if (isMongoActive()) {
    const reg = await Registration.findById(regIdStr);
    if (!reg) throw new Error('Registration record not found.');

    if (userRole !== 'admin' && reg.user.toString() !== userIdStr) {
      throw new Error('Unauthorized to cancel this registration.');
    }

    if (reg.status === 'Cancelled') {
      throw new Error('Registration is already cancelled.');
    }

    reg.status = 'Cancelled';
    await reg.save();

    await Event.findByIdAndUpdate(reg.event, {
      $inc: { registeredCount: -1 },
    });

    return reg;
  }

  const regIndex = inMemoryRegistrations.findIndex(
    (r) => r._id.toString() === regIdStr
  );
  if (regIndex === -1) throw new Error('Registration record not found.');

  const reg = inMemoryRegistrations[regIndex];
  if (userRole !== 'admin' && reg.user.toString() !== userIdStr) {
    throw new Error('Unauthorized to cancel this registration.');
  }

  if (reg.status === 'Cancelled') {
    throw new Error('Registration is already cancelled.');
  }

  reg.status = 'Cancelled';

  // Decrement event registered count
  const evIndex = inMemoryEvents.findIndex(
    (e) => e._id.toString() === reg.event.toString()
  );
  if (evIndex !== -1 && inMemoryEvents[evIndex].registeredCount > 0) {
    inMemoryEvents[evIndex].registeredCount -= 1;
  }

  return reg;
};

export const getUserRegistrations = async (userId) => {
  const userIdStr = userId.toString();

  if (isMongoActive()) {
    return await Registration.find({ user: userIdStr })
      .populate('event')
      .sort({ registeredAt: -1 });
  }

  const userRegs = inMemoryRegistrations.filter(
    (r) => r.user.toString() === userIdStr
  );

  return userRegs.map((reg) => {
    const ev = inMemoryEvents.find((e) => e._id.toString() === reg.event.toString());
    return {
      ...reg,
      event: ev || null,
    };
  }).sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt));
};

export const getEventRegistrations = async (eventId) => {
  const eventIdStr = eventId.toString();

  if (isMongoActive()) {
    return await Registration.find({ event: eventIdStr })
      .populate('user', 'name email collegeId department phone')
      .sort({ registeredAt: -1 });
  }

  const participants = inMemoryRegistrations.filter(
    (r) => r.event.toString() === eventIdStr
  );

  return participants.map((reg) => {
    const u = inMemoryUsers.find((usr) => usr._id.toString() === reg.user.toString());
    return {
      ...reg,
      user: u ? { name: u.name, email: u.email, collegeId: u.collegeId, department: u.department, phone: u.phone } : null,
    };
  }).sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt));
};

export const checkUserRegisteredForEvent = async (eventId, userId) => {
  const eventIdStr = eventId.toString();
  const userIdStr = userId.toString();

  if (isMongoActive()) {
    const reg = await Registration.findOne({
      event: eventIdStr,
      user: userIdStr,
      status: 'Confirmed',
    });
    return !!reg ? reg : null;
  }

  const reg = inMemoryRegistrations.find(
    (r) =>
      r.event.toString() === eventIdStr &&
      r.user.toString() === userIdStr &&
      r.status === 'Confirmed'
  );
  return reg || null;
};

export const getAllRegistrations = async () => {
  if (isMongoActive()) {
    return await Registration.find({})
      .populate('event', 'title category date venue')
      .populate('user', 'name email collegeId department')
      .sort({ registeredAt: -1 });
  }

  return inMemoryRegistrations.map((reg) => {
    const ev = inMemoryEvents.find((e) => e._id.toString() === reg.event.toString());
    const usr = inMemoryUsers.find((u) => u._id.toString() === reg.user.toString());
    return {
      ...reg,
      event: ev ? { title: ev.title, category: ev.category, date: ev.date, venue: ev.venue } : null,
      user: usr ? { name: usr.name, email: usr.email, collegeId: usr.collegeId, department: usr.department } : null,
    };
  }).sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt));
};

// ======================== STATS OPERATIONS ========================

export const getPlatformStats = async () => {
  if (isMongoActive()) {
    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalRegistrations = await Registration.countDocuments({ status: 'Confirmed' });
    const upcomingEvents = await Event.countDocuments({ status: 'Upcoming' });
    const completedEvents = await Event.countDocuments({ status: 'Completed' });

    return {
      totalUsers,
      totalEvents,
      totalRegistrations,
      upcomingEvents,
      completedEvents,
    };
  }

  return {
    totalUsers: inMemoryUsers.length,
    totalEvents: inMemoryEvents.length,
    totalRegistrations: inMemoryRegistrations.filter((r) => r.status === 'Confirmed').length,
    upcomingEvents: inMemoryEvents.filter((e) => e.status === 'Upcoming').length,
    completedEvents: inMemoryEvents.filter((e) => e.status === 'Completed').length,
  };
};
