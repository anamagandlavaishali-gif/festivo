import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Event from './models/Event.js';
import Registration from './models/Registration.js';

dotenv.config();

const seedDatabase = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/festivo';

  try {
    console.log(`Connecting to MongoDB at ${mongoURI}...`);
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected for seeding.');

    // Clear existing data
    await Registration.deleteMany();
    await Event.deleteMany();
    await User.deleteMany();
    console.log('Previous records cleared.');

    // Passwords
    const adminHash = await bcrypt.hash('Admin@123', 10);
    const orgHash = await bcrypt.hash('Organizer@123', 10);
    const studentHash = await bcrypt.hash('Student@123', 10);

    // Create Users
    const adminUser = await User.create({
      name: 'Alexander Wright',
      email: 'admin@festivo.edu',
      password: adminHash,
      role: 'admin',
      department: 'Central Administration & Student Affairs',
      collegeId: 'ADM-2026-001',
      phone: '+1 (555) 100-2000',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bio: 'Festivo Chief Campus Administrator and Student Life Coordinator.',
    });

    const organizerUser = await User.create({
      name: 'Elena Rostova',
      email: 'organizer@festivo.edu',
      password: orgHash,
      role: 'organizer',
      department: 'Computer Science & Tech Club Lead',
      collegeId: 'ORG-2026-104',
      phone: '+1 (555) 200-3000',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      bio: 'Head of Student Tech Council and Lead Organizer for TechNovation & Hackathons.',
    });

    const studentUser = await User.create({
      name: 'Jordan Miller',
      email: 'student@festivo.edu',
      password: studentHash,
      role: 'student',
      department: 'Information Technology (3rd Year)',
      collegeId: 'STU-2026-582',
      phone: '+1 (555) 300-4000',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
      bio: 'Passionate student coder, avid hackathon participant, and music club guitarist.',
    });

    console.log('Seed users created: Admin, Organizer, Student.');

    // Create Events
    const eventsData = [
      {
        title: 'TechNovation 2026 - Annual Flagship Tech Summit',
        description: 'The pinnacle celebration of engineering excellence! Join over 1,200 tech enthusiasts for keynote speeches by Silicon Valley leaders, cutting-edge AI demos, project exhibitions, and hardware showcases.',
        category: 'Technical',
        date: '2026-11-15',
        startTime: '09:00 AM',
        endTime: '05:30 PM',
        venue: 'Main Auditorium & Tech Park Hall A',
        organizer: organizerUser._id,
        organizerName: organizerUser.name,
        organizerEmail: organizerUser.email,
        organizerPhone: organizerUser.phone,
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
        maxParticipants: 350,
        registeredCount: 1,
        registrationDeadline: '2026-11-10',
        status: 'Upcoming',
        prizes: '$5,000 in Innovation Grants & Cloud Credits',
        requirements: ['Student ID Card', 'Laptop for hands-on sessions', 'Active Interest in Tech'],
        tags: ['AI', 'Cloud', 'Robotics', 'Keynote', 'Innovation'],
        featured: true,
      },
      {
        title: 'CodeClash 36H - Inter-College Hackathon',
        description: 'A relentless 36-hour sprint where brilliant minds unite to solve real-world problems in HealthTech, EdTech, FinTech, and Climate Resilience. Mentors from top startups will guide teams through ideation, MVP build, and pitching.',
        category: 'Hackathons',
        date: '2026-11-20',
        startTime: '08:00 AM',
        endTime: '08:00 PM',
        venue: 'Innovation Hub & Computer Center Wing B',
        organizer: organizerUser._id,
        organizerName: organizerUser.name,
        organizerEmail: organizerUser.email,
        organizerPhone: organizerUser.phone,
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
        maxParticipants: 120,
        registeredCount: 1,
        registrationDeadline: '2026-11-18',
        status: 'Upcoming',
        prizes: '1st Prize: $2,500 | 2nd Prize: $1,200 | Best UI: $500',
        requirements: ['Team of 2-4 members', 'GitHub Account', 'Chargers & Development Rig'],
        tags: ['Hackathon', 'Coding', 'FullStack', 'AI', 'Prize'],
        featured: true,
      },
      {
        title: 'Aura 2026 - National Cultural & Arts Extravaganza',
        description: 'Step into a world of rhythm, melody, theater, and vivid colors! Aura 2026 features classical and street dance competitions, battle of the bands, solo singing, drama skits, and a star celebrity musical night.',
        category: 'Cultural',
        date: '2026-11-28',
        startTime: '10:00 AM',
        endTime: '10:00 PM',
        venue: 'Open Air Amphitheatre & Student Plaza',
        organizer: adminUser._id,
        organizerName: adminUser.name,
        organizerEmail: adminUser.email,
        organizerPhone: adminUser.phone,
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
        maxParticipants: 600,
        registeredCount: 0,
        registrationDeadline: '2026-11-25',
        status: 'Upcoming',
        prizes: 'Trophies, Gold Medals, and $3,000 Cash Prizes',
        requirements: ['Festivo QR Ticket', 'Valid College ID'],
        tags: ['Music', 'Dance', 'Drama', 'Concert', 'Art'],
        featured: true,
      },
      {
        title: 'Olympus Arena 2026 - Inter-Collegiate Sports Championship',
        description: 'Feel the adrenaline! Compete across Football, Basketball, Badminton, Table Tennis, Track & Field, and Volleyball. High-energy sportsmanship with live commentary, refreshments, and athletic scouts.',
        category: 'Sports',
        date: '2026-12-05',
        startTime: '07:30 AM',
        endTime: '06:00 PM',
        venue: 'Campus Sports Complex & Olympic Stadium',
        organizer: adminUser._id,
        organizerName: adminUser.name,
        organizerEmail: adminUser.email,
        organizerPhone: adminUser.phone,
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
        maxParticipants: 400,
        registeredCount: 0,
        registrationDeadline: '2026-11-30',
        status: 'Upcoming',
        prizes: 'Rolling Championship Trophy, Medals & Sponsored Sports Kits',
        requirements: ['Proper Sports Attire & Non-marking shoes', 'College Medical Fitness Form'],
        tags: ['Football', 'Basketball', 'Athletics', 'Fitness', 'Tournament'],
        featured: false,
      },
      {
        title: 'Full-Stack GenAI & Agentic Systems Masterclass',
        description: 'An immersive 6-hour hands-on workshop building real production applications with LangChain, Gemini API, vector embeddings, RAG pipelines, and autonomous web agent architectures.',
        category: 'Workshops',
        date: '2026-11-12',
        startTime: '01:00 PM',
        endTime: '07:00 PM',
        venue: 'Advanced Computing Lab 304',
        organizer: organizerUser._id,
        organizerName: organizerUser.name,
        organizerEmail: organizerUser.email,
        organizerPhone: organizerUser.phone,
        image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
        maxParticipants: 80,
        registeredCount: 0,
        registrationDeadline: '2026-11-11',
        status: 'Upcoming',
        prizes: 'Verified Certificate of Mastery + Access to Cloud GPU Clusters',
        requirements: ['Node.js & Python Basics', 'Laptop with VS Code & Git installed'],
        tags: ['GenAI', 'LLM', 'HandsOn', 'Certificate', 'Python'],
        featured: false,
      },
      {
        title: 'Festivo Grand Spring Carnival & Food Fiesta',
        description: 'The mega annual social carnival! Experience 40+ artisanal food stalls, carnival game booths, silent disco, live acoustic busking, photo booths, and spectacular fireworks to close out the semester.',
        category: 'Fests',
        date: '2026-12-18',
        startTime: '03:00 PM',
        endTime: '11:00 PM',
        venue: 'North Green Grounds & Lake Promenade',
        organizer: adminUser._id,
        organizerName: adminUser.name,
        organizerEmail: adminUser.email,
        organizerPhone: adminUser.phone,
        image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80',
        maxParticipants: 1000,
        registeredCount: 0,
        registrationDeadline: '2026-12-15',
        status: 'Upcoming',
        prizes: 'Carnival vouchers and raffle tickets for smart tech prizes',
        requirements: ['Open to all students, faculty, and alumni with digital pass'],
        tags: ['Carnival', 'Food', 'Games', 'Fireworks', 'Party'],
        featured: true,
      },
    ];

    const createdEvents = await Event.insertMany(eventsData);
    console.log(`Created ${createdEvents.length} events in database.`);

    // Create Sample Registration
    await Registration.create({
      event: createdEvents[0]._id,
      user: studentUser._id,
      ticketCode: 'FST-TKT-782914',
      status: 'Confirmed',
      participantName: studentUser.name,
      participantEmail: studentUser.email,
      department: studentUser.department,
      collegeId: studentUser.collegeId,
      phone: studentUser.phone,
      notes: 'Interested in the AI systems track.',
    });

    console.log('Sample registration seeded.');
    console.log('Database seeding finished successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
