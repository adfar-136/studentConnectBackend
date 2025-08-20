import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import ValidStudentId from './models/ValidStudentId.js';
import Event from './models/Event.js';
import Duty from './models/Duty.js';
import Application from './models/Application.js';
import Faq from './models/Faq.js';
import Query from './models/Query.js';

dotenv.config();

const mongoUri = process.env.MONGO_URI || 'mongodb+srv://adfarrasheed136:test@cluster0.zi0u3tx.mongodb.net/studentConnect';

// Sample data for seeding
const sampleData = {
  validStudentIds: [
    { studentId: '2021-CSE-001' },
    { studentId: '2021-CSE-002' },
    { studentId: '2021-CSE-003' },
    { studentId: '2021-EEE-001' },
    { studentId: '2021-EEE-002' },
    { studentId: '2021-ME-001' },
    { studentId: '2021-ME-002' },
    { studentId: '2021-CE-001' },
    { studentId: '2021-CE-002' },
    { studentId: '2022-CSE-001' },
    { studentId: '2022-CSE-002' },
    { studentId: '2022-EEE-001' },
    { studentId: '2022-ME-001' },
    { studentId: '2022-CE-001' },
    { studentId: '2023-CSE-001' },
    { studentId: '2023-EEE-001' },
    { studentId: '2023-ME-001' },
    { studentId: '2023-CE-001' }
  ],
  
  users: [
    {
      name: 'Admin User',
      email: 'adfarrasheed136@gmail.com',
      password: 'admin123',
      studentId: 'ADMIN001',
      department: 'Administration',
      year: 'N/A',
      role: 'admin'
    },
    {
      name: 'John Doe',
      email: 'john.doe@iust.edu',
      password: 'student123',
      studentId: '2021-CSE-001',
      department: 'Computer Science & Engineering',
      year: '3rd Year',
      role: 'student',
      isCouncilMember: true
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@iust.edu',
      password: 'student123',
      studentId: '2021-CSE-002',
      department: 'Computer Science & Engineering',
      year: '3rd Year',
      role: 'student',
      isCouncilMember: true
    },
    {
      name: 'Mike Johnson',
      email: 'mike.johnson@iust.edu',
      password: 'student123',
      studentId: '2021-EEE-001',
      department: 'Electrical & Electronics Engineering',
      year: '3rd Year',
      role: 'student'
    },
    {
      name: 'Sarah Wilson',
      email: 'sarah.wilson@iust.edu',
      password: 'student123',
      studentId: '2021-ME-001',
      department: 'Mechanical Engineering',
      year: '3rd Year',
      role: 'student'
    },
    {
      name: 'David Brown',
      email: 'david.brown@iust.edu',
      password: 'student123',
      studentId: '2022-CSE-001',
      department: 'Computer Science & Engineering',
      year: '2nd Year',
      role: 'student'
    },
    {
      name: 'Emily Davis',
      email: 'emily.davis@iust.edu',
      password: 'student123',
      studentId: '2022-EEE-001',
      department: 'Electrical & Electronics Engineering',
      year: '2nd Year',
      role: 'student'
    },
    {
      name: 'Alex Turner',
      email: 'alex.turner@iust.edu',
      password: 'student123',
      studentId: '2023-CSE-001',
      department: 'Computer Science & Engineering',
      year: '1st Year',
      role: 'student'
    }
  ],

  faqs: [
    {
      question: 'How do I register for courses?',
      answer: 'Course registration is done through the student portal. Log in with your student ID and password, then navigate to the course registration section.',
      tags: ['registration', 'courses'],
      category: 'admission'
    },
    {
      question: 'What are the hostel facilities available?',
      answer: 'Our hostels provide 24/7 security, Wi-Fi, laundry services, and dining facilities. Each room accommodates 2-3 students with attached bathrooms.',
      tags: ['hostel', 'accommodation'],
      category: 'hostel'
    },
    {
      question: 'How can I contact my faculty advisor?',
      answer: 'You can contact your faculty advisor through email or by visiting their office during office hours. Contact information is available in the faculty directory.',
      tags: ['faculty', 'advising'],
      category: 'faculty'
    },
    {
      question: 'What is the examination schedule?',
      answer: 'Examination schedules are published 2 weeks before the exam period. Check the student portal or notice boards for updated schedules.',
      tags: ['exams', 'schedule'],
      category: 'examination'
    },
    {
      question: 'How do I apply for student council membership?',
      answer: 'Applications for student council are open at the beginning of each academic year. Submit your application through the student portal with required documents.',
      tags: ['student council', 'leadership'],
      category: 'general'
    }
  ]
};

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully!');

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      ValidStudentId.deleteMany({}),
      Event.deleteMany({}),
      Duty.deleteMany({}),
      Application.deleteMany({}),
      Faq.deleteMany({}),
      Query.deleteMany({})
    ]);

    // Seed ValidStudentIds
    console.log('Seeding ValidStudentIds...');
    const validStudentIds = await ValidStudentId.insertMany(sampleData.validStudentIds);
    console.log(`✓ Seeded ${validStudentIds.length} valid student IDs`);

    // Seed Users (including admin)
    console.log('Seeding Users...');
    const users = await User.insertMany(sampleData.users);
    console.log(`✓ Seeded ${users.length} users`);

    // Get admin and some students for references
    const admin = users.find(u => u.role === 'admin');
    const students = users.filter(u => u.role === 'student');
    const councilMembers = users.filter(u => u.isCouncilMember);

    // Seed Events
    console.log('Seeding Events...');
    const events = await Event.insertMany([
      {
        title: 'Annual Tech Fest 2024',
        description: 'Join us for the biggest technology festival of the year featuring workshops, competitions, and networking opportunities.',
        location: 'Main Auditorium',
        date: new Date('2024-03-15'),
        startTime: '09:00 AM',
        endTime: '06:00 PM',
        organizer: admin._id,
        status: 'upcoming',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500'
      },
      {
        title: 'Cultural Night',
        description: 'A celebration of diversity through music, dance, and cultural performances by students from different backgrounds.',
        location: 'Open Air Theater',
        date: new Date('2024-02-28'),
        startTime: '07:00 PM',
        endTime: '11:00 PM',
        organizer: admin._id,
        status: 'upcoming',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500'
      },
      {
        title: 'Sports Meet 2024',
        description: 'Annual inter-department sports competition featuring cricket, football, basketball, and athletics.',
        location: 'University Ground',
        date: new Date('2024-01-20'),
        startTime: '08:00 AM',
        endTime: '05:00 PM',
        organizer: admin._id,
        status: 'completed',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500'
      },
      {
        title: 'Career Fair',
        description: 'Connect with industry professionals and explore career opportunities in various engineering fields.',
        location: 'Conference Hall',
        date: new Date('2024-04-10'),
        startTime: '10:00 AM',
        endTime: '04:00 PM',
        organizer: admin._id,
        status: 'upcoming',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500'
      }
    ]);
    console.log(`✓ Seeded ${events.length} events`);

    // Seed Duties
    console.log('Seeding Duties...');
    const duties = await Duty.insertMany([
      {
        event: events[0]._id, // Tech Fest
        student: students[0]._id, // John Doe
        role: 'coordinator',
        status: 'confirmed',
        assignedBy: admin._id
      },
      {
        event: events[0]._id, // Tech Fest
        student: students[1]._id, // Jane Smith
        role: 'publicity',
        status: 'confirmed',
        assignedBy: admin._id
      },
      {
        event: events[1]._id, // Cultural Night
        student: students[2]._id, // Mike Johnson
        role: 'decoration',
        status: 'pending',
        assignedBy: admin._id
      },
      {
        event: events[2]._id, // Sports Meet
        student: students[3]._id, // Sarah Wilson
        role: 'registration',
        status: 'completed',
        assignedBy: admin._id
      }
    ]);
    console.log(`✓ Seeded ${duties.length} duties`);

    // Seed Applications
    console.log('Seeding Applications...');
    const applications = await Application.insertMany([
      {
        student: students[0]._id, // John Doe
        motivation: 'I am passionate about leadership and want to contribute to the student community. I have experience organizing events and managing teams.',
        experience: 'I have been a class representative for 2 years and organized several successful events.',
        skills: ['Leadership', 'Event Management', 'Communication', 'Team Building'],
        position: 'president',
        status: 'approved',
        reviewedBy: admin._id,
        reviewComments: 'Excellent candidate with strong leadership qualities.',
        interests: ['Student Welfare', 'Event Organization', 'Community Building']
      },
      {
        student: students[1]._id, // Jane Smith
        motivation: 'I want to serve the student community and bring positive changes to campus life.',
        experience: 'I have experience in public relations and marketing.',
        skills: ['Marketing', 'Public Relations', 'Social Media', 'Communication'],
        position: 'vice-president',
        status: 'approved',
        reviewedBy: admin._id,
        reviewComments: 'Great communication skills and marketing experience.',
        interests: ['Marketing', 'Student Engagement', 'Public Relations']
      },
      {
        student: students[2]._id, // Mike Johnson
        motivation: 'I am interested in financial management and want to ensure transparency in student council finances.',
        experience: 'I have managed budgets for various projects and events.',
        skills: ['Financial Management', 'Budget Planning', 'Excel', 'Accounting'],
        position: 'treasurer',
        status: 'pending',
        interests: ['Financial Management', 'Budget Planning', 'Transparency']
      }
    ]);
    console.log(`✓ Seeded ${applications.length} applications`);

    // Seed FAQs
    console.log('Seeding FAQs...');
    const faqs = await Faq.insertMany(sampleData.faqs.map(faq => ({
      ...faq,
      createdBy: admin._id
    })));
    console.log(`✓ Seeded ${faqs.length} FAQs`);

    // Seed Queries
    console.log('Seeding Queries...');
    const queries = await Query.insertMany([
      {
        student: students[0]._id, // John Doe
        subject: 'Course Registration Issue',
        description: 'I am unable to register for CS301 course. The system shows an error message.',
        status: 'resolved',
        adminReply: 'The issue has been resolved. Please try registering again. If the problem persists, contact the IT department.',
        forwardedTo: '',
        mailForwarded: false
      },
      {
        student: students[1]._id, // Jane Smith
        subject: 'Hostel Room Change Request',
        description: 'I would like to request a room change due to compatibility issues with my current roommate.',
        status: 'in_progress',
        adminReply: 'We are reviewing your request. Please allow 2-3 business days for processing.',
        forwardedTo: 'hostel@iust.edu',
        mailForwarded: true
      },
      {
        student: students[2]._id, // Mike Johnson
        subject: 'Library Book Renewal',
        description: 'I need to renew my library books but the online renewal system is not working.',
        status: 'open',
        adminReply: '',
        forwardedTo: '',
        mailForwarded: false
      }
    ]);
    console.log(`✓ Seeded ${queries.length} queries`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\nSummary:');
    console.log(`- Users: ${users.length} (${users.filter(u => u.role === 'admin').length} admin, ${users.filter(u => u.role === 'student').length} students)`);
    console.log(`- Valid Student IDs: ${validStudentIds.length}`);
    console.log(`- Events: ${events.length}`);
    console.log(`- Duties: ${duties.length}`);
    console.log(`- Applications: ${applications.length}`);
    console.log(`- FAQs: ${faqs.length}`);
    console.log(`- Queries: ${queries.length}`);
    
    console.log('\nDefault admin credentials:');
    console.log('Email: adfarrasheed136@gmail.com');
    console.log('Password: admin123');
    
    console.log('\nDefault student credentials:');
    console.log('Email: john.doe@iust.edu (Password: student123)');
    console.log('Email: jane.smith@iust.edu (Password: student123)');
    console.log('Email: mike.johnson@iust.edu (Password: student123)');

    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

// Run the seeding
seedDatabase();
