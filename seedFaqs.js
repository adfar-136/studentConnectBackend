import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Faq from './models/Faq.js';

dotenv.config();

const faqs = [
  // Admission Related FAQs
  {
    question: "What is the admission process for MCA program?",
    answer: "The MCA admission process involves: 1) Online application submission, 2) Document verification, 3) Entrance test (if applicable), 4) Merit list publication, 5) Counseling and seat allocation, 6) Fee payment and enrollment. Applications typically open in May-June for the academic year starting in August.",
    category: "admission",
    tags: ["mca", "admission", "process", "application", "enrollment"]
  },
  {
    question: "What are the eligibility criteria for MCA admission?",
    answer: "Eligibility for MCA: 1) Bachelor's degree in any discipline with Mathematics at 10+2 level, 2) Minimum 50% aggregate marks (45% for reserved categories), 3) Valid entrance test score (if applicable), 4) Age limit: 25 years for general, 28 years for reserved categories. Final year students can apply provisionally.",
    category: "admission",
    tags: ["mca", "eligibility", "criteria", "requirements", "qualification"]
  },
  {
    question: "How to apply for hostel accommodation?",
    answer: "Hostel application process: 1) Fill online hostel application form during admission, 2) Submit required documents (ID proof, address proof, photos), 3) Pay hostel fees, 4) Get room allocation based on availability, 5) Check-in on specified date. Hostel facilities include furnished rooms, mess, WiFi, and 24/7 security.",
    category: "hostel",
    tags: ["hostel", "accommodation", "application", "fees", "facilities"]
  },
  {
    question: "What documents are required for admission?",
    answer: "Required documents: 1) 10th and 12th mark sheets, 2) Bachelor's degree certificate and mark sheets, 3) Transfer certificate, 4) Character certificate, 5) Caste certificate (if applicable), 6) Income certificate (for fee concession), 7) Passport size photographs, 8) ID proof (Aadhar/PAN), 9) Migration certificate (if from other university).",
    category: "admission",
    tags: ["documents", "admission", "certificates", "mark sheets", "requirements"]
  },
  {
    question: "What is the fee structure for MCA program?",
    answer: "MCA fee structure: 1) Tuition fee: ₹45,000 per semester, 2) Development fee: ₹15,000 per semester, 3) Examination fee: ₹5,000 per semester, 4) Hostel fee: ₹25,000 per semester (optional), 5) Mess fee: ₹8,000 per month (optional). Total program cost: approximately ₹4.5 lakhs for 6 semesters. Payment can be made in installments.",
    category: "admission",
    tags: ["fees", "mca", "cost", "payment", "structure", "semester"]
  },
  {
    question: "How to pay semester fees online?",
    answer: "Online fee payment: 1) Login to student portal, 2) Go to 'Fee Payment' section, 3) Select semester and fee type, 4) Choose payment method (UPI/Card/Net Banking), 5) Enter payment details, 6) Download receipt after successful payment. Payment gateway accepts all major cards and UPI. Keep payment receipt for future reference.",
    category: "admission",
    tags: ["fees", "payment", "online", "portal", "receipt", "semester"]
  },
  {
    question: "What is the admission deadline for this year?",
    answer: "Admission deadlines for current academic year: 1) Online application: May 15 - June 30, 2) Document submission: June 1 - July 15, 3) Entrance test: July 20 (if applicable), 4) Merit list: July 25, 5) Counseling: July 28-30, 6) Final enrollment: August 5. Late applications may be considered based on seat availability.",
    category: "admission",
    tags: ["deadline", "admission", "dates", "timeline", "application", "enrollment"]
  },
  {
    question: "Can I transfer from another university to IUST?",
    answer: "University transfer process: 1) Apply for transfer certificate from current university, 2) Submit transfer application to IUST with valid reasons, 3) Provide mark sheets and course details, 4) Credit transfer evaluation by academic committee, 5) Approval based on course compatibility and academic performance. Transfer is possible only in first two semesters with valid justification.",
    category: "admission",
    tags: ["transfer", "university", "credit", "evaluation", "approval", "semester"]
  },

  // Faculty and Academic FAQs
  {
    question: "Who is the HOD of Computer Science Department?",
    answer: "Dr. Mohammad Ahmad is the current Head of Computer Science Department. He has 15+ years of experience in computer science education and research. Office: Room 205, Computer Science Block. Contact: hod.cs@iust.ac.in, Phone: +91-123-4567890. Office hours: Monday-Friday, 10:00 AM - 4:00 PM.",
    category: "faculty",
    tags: ["hod", "computer science", "department", "contact", "office hours", "faculty"]
  },
  {
    question: "What are the faculty qualifications and experience?",
    answer: "Faculty qualifications: 1) All faculty members have PhD degrees from reputed institutions, 2) Minimum 5 years of teaching experience, 3) Active research publications in peer-reviewed journals, 4) Industry experience in relevant domains, 5) Regular participation in conferences and workshops. Faculty-student ratio is maintained at 1:15 for quality education.",
    category: "faculty",
    tags: ["faculty", "qualifications", "experience", "research", "publications", "ratio"]
  },
  {
    question: "How to contact faculty members?",
    answer: "Faculty contact methods: 1) Email: firstname.lastname@iust.ac.in, 2) Office hours: Posted on department notice board, 3) Phone: Department office (+91-123-4567890), 4) Student portal messaging system, 5) Department WhatsApp group for urgent queries. Response time: Within 24 hours on working days.",
    category: "faculty",
    tags: ["faculty", "contact", "email", "office hours", "phone", "portal"]
  },
  {
    question: "What research areas do faculty specialize in?",
    answer: "Faculty research areas: 1) Artificial Intelligence and Machine Learning, 2) Data Science and Big Data Analytics, 3) Cybersecurity and Network Security, 4) Software Engineering and Cloud Computing, 5) Internet of Things and Embedded Systems, 6) Computer Vision and Image Processing. Students can join research projects from 3rd semester onwards.",
    category: "faculty",
    tags: ["research", "faculty", "specialization", "ai", "data science", "cybersecurity", "projects"]
  },

  // Examination and Academic FAQs
  {
    question: "What is the examination schedule for this semester?",
    answer: "Examination schedule: 1) Mid-semester: Week 8-9, 2) End-semester: Week 15-16, 3) Practical exams: Week 14, 4) Project evaluation: Week 16-17. Timetable published 2 weeks before exams. Exam duration: Theory papers (3 hours), Practical (2 hours). Hall tickets available online 1 week before exams.",
    category: "examination",
    tags: ["examination", "schedule", "mid-semester", "end-semester", "practical", "projects", "timetable"]
  },
  {
    question: "How to apply for exam revaluation?",
    answer: "Exam revaluation process: 1) Apply within 7 days of result declaration, 2) Fill revaluation form with ₹500 fee per paper, 3) Submit to examination cell, 4) Revaluation completed within 15 days, 5) Result communicated via email and portal. If marks change by more than 10%, fee is refunded. Only theory papers eligible for revaluation.",
    category: "examination",
    tags: ["examination", "revaluation", "application", "fees", "process", "result", "theory"]
  },
  {
    question: "What is the attendance requirement for exams?",
    answer: "Attendance requirements: 1) Minimum 75% attendance mandatory for exam eligibility, 2) Medical certificate required for attendance below 75%, 3) Attendance calculated per subject, 4) Regular attendance monitoring through biometric system, 5) Warning letters sent at 70% and 65% attendance levels. Special consideration for genuine medical cases.",
    category: "examination",
    tags: ["attendance", "examination", "eligibility", "medical", "monitoring", "requirements", "75%"]
  },
  {
    question: "How are semester grades calculated?",
    answer: "Grade calculation: 1) Mid-semester: 30% weightage, 2) End-semester: 50% weightage, 3) Internal assessment: 20% weightage (assignments, projects, participation), 4) Grade scale: A+ (90-100), A (80-89), B+ (70-79), B (60-69), C (50-59), F (Below 50). CGPA calculated as weighted average of all semester GPAs.",
    category: "examination",
    tags: ["grades", "calculation", "weightage", "mid-semester", "end-semester", "internal", "cgpa", "gpa"]
  },
  {
    question: "What is the project submission deadline?",
    answer: "Project submission deadlines: 1) Project proposal: Week 4 of semester, 2) Mid-term review: Week 8, 3) Final submission: Week 15, 4) Presentation: Week 16-17. Late submissions penalized with 10% marks deduction per day. Project report format available on student portal. Both hard copy and soft copy required.",
    category: "examination",
    tags: ["project", "submission", "deadline", "proposal", "review", "presentation", "penalty", "format"]
  },

  // Hostel and Accommodation FAQs
  {
    question: "What are the hostel facilities available?",
    answer: "Hostel facilities: 1) Furnished rooms with attached bathrooms, 2) 24/7 WiFi connectivity, 3) Centralized air conditioning, 4) Laundry service, 5) Common room with TV and games, 6) Library and study room, 7) Gym and sports facilities, 8) 24/7 security and CCTV surveillance, 9) Medical first aid, 10) Transportation to campus.",
    category: "hostel",
    tags: ["hostel", "facilities", "rooms", "wifi", "ac", "laundry", "security", "gym", "library"]
  },
  {
    question: "What is the hostel fee structure?",
    answer: "Hostel fee structure: 1) Room rent: ₹25,000 per semester, 2) Mess fee: ₹8,000 per month (optional), 3) Security deposit: ₹10,000 (refundable), 4) Electricity charges: ₹2,000 per semester, 5) Maintenance fee: ₹1,000 per semester. Total hostel cost: approximately ₹35,000 per semester. Payment accepted in installments.",
    category: "hostel",
    tags: ["hostel", "fees", "room rent", "mess", "security deposit", "electricity", "maintenance", "cost"]
  },
  {
    question: "How to apply for hostel leave?",
    answer: "Hostel leave application: 1) Submit leave application 48 hours in advance, 2) Get parent/guardian approval, 3) Obtain warden signature, 4) Register departure and return time, 5) Submit leave form to hostel office. Emergency leaves processed within 24 hours. Maximum leave allowed: 15 days per semester. Outstation leave requires parent consent.",
    category: "hostel",
    tags: ["hostel", "leave", "application", "approval", "warden", "emergency", "outstation", "parent consent"]
  },
  {
    question: "What are the hostel rules and regulations?",
    answer: "Hostel rules: 1) Entry time: 8:00 PM, 2) Lights out: 11:00 PM, 3) No smoking/alcohol on premises, 4) Visitors allowed only in common areas, 5) No cooking in rooms, 6) Regular room inspection, 7) Noise restrictions after 10:00 PM, 8) Mandatory attendance at hostel meetings. Violations may result in disciplinary action.",
    category: "hostel",
    tags: ["hostel", "rules", "regulations", "entry time", "lights out", "visitors", "cooking", "inspection", "noise"]
  },

  // General and Miscellaneous FAQs
  {
    question: "How to access the student portal?",
    answer: "Student portal access: 1) Visit iust.ac.in/student-portal, 2) Login with student ID and password, 3) Password reset available through registered email, 4) Portal features: attendance, grades, fees, assignments, timetable, results, 5) Mobile app available for Android and iOS. Technical support: support@iust.ac.in or call +91-123-4567890.",
    category: "general",
    tags: ["student portal", "login", "password", "reset", "features", "mobile app", "support", "technical"]
  },
  {
    question: "What are the library timings and rules?",
    answer: "Library timings: 1) Monday-Friday: 8:00 AM - 10:00 PM, 2) Saturday: 8:00 AM - 6:00 PM, 3) Sunday: 10:00 AM - 4:00 PM. Rules: 1) Maximum 3 books for 14 days, 2) Fine: ₹5 per day for late return, 3) No food/drinks allowed, 4) Silent study environment, 5) Online book reservation available, 6) Digital library access 24/7.",
    category: "general",
    tags: ["library", "timings", "rules", "books", "borrowing", "fines", "reservation", "digital", "study"]
  },
  {
    question: "How to report technical issues?",
    answer: "Technical issue reporting: 1) Submit ticket through student portal, 2) Email: techsupport@iust.ac.in, 3) Call: +91-123-4567890 (9:00 AM - 6:00 PM), 4) WhatsApp: +91-9876543210, 5) Include: issue description, screenshots, device details, student ID. Response time: Critical issues (2 hours), General issues (24 hours), Minor issues (48 hours).",
    category: "general",
    tags: ["technical", "support", "issues", "ticket", "email", "phone", "whatsapp", "response time", "reporting"]
  },
  {
    question: "What sports facilities are available?",
    answer: "Sports facilities: 1) Indoor: Table tennis, badminton, chess, carrom, 2) Outdoor: Cricket, football, basketball, volleyball, tennis, 3) Gym: Modern equipment with trainer, 4) Swimming pool (seasonal), 5) Sports competitions held annually, 6) Equipment available on loan, 7) Professional coaching available. Sports complex open: 6:00 AM - 10:00 PM.",
    category: "general",
    tags: ["sports", "facilities", "indoor", "outdoor", "gym", "swimming", "competitions", "coaching", "equipment"]
  },
  {
    question: "How to join student clubs and organizations?",
    answer: "Student organizations: 1) Technical clubs: Coding, Robotics, AI/ML, 2) Cultural clubs: Music, Dance, Drama, Photography, 3) Sports clubs: Various sports teams, 4) Academic clubs: Debate, Quiz, Literature, 5) Social clubs: NSS, NCC, Red Cross. Registration: Visit student affairs office or apply online. Membership free for all students.",
    category: "general",
    tags: ["student clubs", "organizations", "technical", "cultural", "sports", "academic", "social", "membership", "registration"]
  },
  {
    question: "What transportation options are available?",
    answer: "Transportation options: 1) University buses: 6 routes covering major areas, 2) Bus pass: ₹2000 per semester, 3) Metro station: 2 km from campus, 4) Auto-rickshaw stand at main gate, 5) Bike/scooter parking available, 6) Car parking for final year students, 7) Shuttle service between hostels and campus. Bus timings: 7:00 AM - 9:00 PM.",
    category: "general",
    tags: ["transportation", "buses", "metro", "auto", "parking", "shuttle", "bus pass", "routes", "timings"]
  },
  {
    question: "How to access WiFi on campus?",
    answer: "Campus WiFi access: 1) Connect to 'IUST-Student' network, 2) Login with student ID and portal password, 3) Speed: 50 Mbps download, 25 Mbps upload, 4) Coverage: All academic blocks, library, canteen, hostels, 5) Data limit: 10 GB per day, 6) 24/7 availability, 7) Technical support for connection issues. Guest WiFi available for visitors.",
    category: "general",
    tags: ["wifi", "campus", "network", "login", "speed", "coverage", "data limit", "support", "guest"]
  },
  {
    question: "What medical facilities are available?",
    answer: "Medical facilities: 1) On-campus health center with doctor, 2) First aid available in all blocks, 3) Emergency ambulance service, 4) Tie-up with nearby hospitals, 5) Health insurance coverage for students, 6) Regular health checkups, 7) Mental health counseling available, 8) Pharmacy on campus. Health center timings: 9:00 AM - 5:00 PM.",
    category: "general",
    tags: ["medical", "health center", "doctor", "first aid", "ambulance", "insurance", "checkups", "counseling", "pharmacy"]
  },
  {
    question: "How to apply for scholarships?",
    answer: "Scholarship application: 1) Merit-based: Top 10% students automatically eligible, 2) Need-based: Submit income certificate and application, 3) Sports quota: Based on sports achievements, 4) Minority scholarships: Submit caste/religion certificate, 5) Application deadline: August 15, 6) Documents: Income proof, caste certificate, mark sheets, 7) Selection based on merit and need.",
    category: "general",
    tags: ["scholarships", "merit-based", "need-based", "sports", "minority", "application", "deadline", "documents", "selection"]
  },
  {
    question: "What are the canteen timings and menu?",
    answer: "Canteen services: 1) Timings: 8:00 AM - 8:00 PM, 2) Breakfast: 8:00 AM - 10:00 AM, 3) Lunch: 12:00 PM - 3:00 PM, 4) Snacks: 4:00 PM - 6:00 PM, 5) Dinner: 6:00 PM - 8:00 PM. Menu: North Indian, South Indian, Chinese, Continental. Meal cost: ₹50-80. Monthly meal plans available. Food quality regularly monitored by student committee.",
    category: "general",
    tags: ["canteen", "timings", "menu", "breakfast", "lunch", "dinner", "snacks", "cost", "meal plans", "quality"]
  },
  {
    question: "How to access digital library resources?",
    answer: "Digital library access: 1) Login to library portal with student credentials, 2) Access: E-books, research papers, journals, databases, 3) Popular databases: IEEE, ACM, Springer, ScienceDirect, 4) Download limit: 50 papers per month, 5) Off-campus access available, 6) Mobile app for reading, 7) Citation tools available, 8) Research assistance from librarians.",
    category: "general",
    tags: ["digital library", "e-books", "research papers", "databases", "download", "off-campus", "mobile app", "citation", "research"]
  },
  {
    question: "What are the academic calendar dates?",
    answer: "Academic calendar: 1) Semester start: August 1, 2) Mid-semester break: October 15-20, 3) Winter break: December 25 - January 5, 4) Spring break: March 15-20, 5) Semester end: May 30, 6) Summer vacation: June 1 - July 31. Holidays: National holidays, religious festivals, university foundation day. Academic calendar published in July each year.",
    category: "general",
    tags: ["academic calendar", "semester", "breaks", "holidays", "vacation", "dates", "published", "foundation day"]
  },
  {
    question: "How to apply for leave of absence?",
    answer: "Leave of absence application: 1) Submit application 1 week in advance, 2) Get department head approval, 3) Submit to academic office, 4) Maximum leave: 30 days per semester, 5) Medical leave: Submit doctor's certificate, 6) Emergency leave: Processed within 24 hours, 7) Leave affects attendance calculation, 8) Re-entry requires approval.",
    category: "general",
    tags: ["leave of absence", "application", "approval", "department head", "medical leave", "emergency", "attendance", "re-entry"]
  },
  {
    question: "What career services are available?",
    answer: "Career services: 1) Placement cell with dedicated team, 2) Resume building workshops, 3) Mock interviews and GD sessions, 4) Industry expert talks, 5) Job fairs twice annually, 6) Internship opportunities, 7) Higher education guidance, 8) Entrepreneurship support, 9) Alumni network access, 10) Career counseling sessions. Services available from 2nd semester onwards.",
    category: "general",
    tags: ["career services", "placement", "resume", "interviews", "workshops", "job fairs", "internships", "counseling", "alumni"]
  },
  {
    question: "How to access study materials online?",
    answer: "Online study materials: 1) Student portal: Lecture notes, assignments, previous papers, 2) Google Classroom: Subject-wise materials, 3) YouTube channel: Video lectures, 4) Faculty blogs: Additional resources, 5) E-library: Textbooks and references, 6) Mobile app: Offline access, 7) Discussion forums: Student queries, 8) Study groups: Collaborative learning.",
    category: "general",
    tags: ["study materials", "online", "portal", "google classroom", "youtube", "blogs", "e-library", "mobile app", "forums"]
  },
  {
    question: "What are the laboratory facilities?",
    answer: "Laboratory facilities: 1) Computer labs: 200+ systems with latest software, 2) Hardware lab: Networking and embedded systems, 3) Research lab: AI/ML and data science, 4) Project lab: Final year projects, 5) Library lab: Digital resources, 6) Language lab: Communication skills, 7) Lab timings: 9:00 AM - 6:00 PM, 8) Weekend access for projects.",
    category: "general",
    tags: ["laboratory", "computer labs", "hardware", "research", "project lab", "library lab", "language lab", "timings", "weekend"]
  },
  {
    question: "How to participate in cultural events?",
    answer: "Cultural events participation: 1) Annual cultural fest: March-April, 2) Technical fest: September-October, 3) Sports meet: November, 4) Events: Music, dance, drama, art, photography, 5) Registration through cultural committee, 6) Prizes worth ₹5 lakhs, 7) Inter-university competitions, 8) Professional judges, 9) Media coverage, 10) Certificate of participation.",
    category: "general",
    tags: ["cultural events", "fest", "music", "dance", "drama", "art", "photography", "registration", "prizes", "competitions"]
  },
  {
    question: "What are the student support services?",
    answer: "Student support services: 1) Academic counseling, 2) Mental health support, 3) Disability support, 4) Financial aid guidance, 5) Legal assistance, 6) Emergency support, 7) Grievance redressal, 8) Student welfare fund, 9) Insurance coverage, 10) 24/7 helpline. All services confidential and free. Contact: support@iust.ac.in or call helpline.",
    category: "general",
    tags: ["student support", "counseling", "mental health", "disability", "financial aid", "legal", "emergency", "grievance", "helpline"]
  },
  {
    question: "How to access alumni network?",
    answer: "Alumni network access: 1) Join alumni portal after graduation, 2) Access: Job opportunities, mentorship, networking, 3) Alumni meet: Annual gathering in December, 4) LinkedIn group: Professional networking, 5) WhatsApp groups: Batch-wise and location-wise, 6) Mentorship program: Connect with industry experts, 7) Job referrals, 8) Investment opportunities, 9) Knowledge sharing sessions.",
    category: "general",
    tags: ["alumni network", "portal", "job opportunities", "mentorship", "networking", "alumni meet", "linkedin", "whatsapp", "referrals"]
  },
  {
    question: "What are the research opportunities for students?",
    answer: "Research opportunities: 1) Join faculty research projects from 3rd semester, 2) Summer research internships, 3) Research paper publication, 4) Conference presentations, 5) Patent filing support, 6) Industry collaboration projects, 7) Research grants for innovative ideas, 8) Publication in university journal, 9) Research methodology courses, 10) Thesis guidance for final year.",
    category: "general",
    tags: ["research", "opportunities", "projects", "internships", "publications", "conferences", "patents", "grants", "thesis", "methodology"]
  },
  {
    question: "How to apply for international exchange programs?",
    answer: "International exchange programs: 1) Partner universities: USA, UK, Germany, Australia, Singapore, 2) Eligibility: CGPA 8.0+, English proficiency, 3) Application: Submit in 4th semester, 4) Duration: 1 semester, 5) Credits transferable, 6) Scholarships available, 7) Cultural immersion activities, 8) Language courses, 9) Industry visits, 10) Global networking opportunities.",
    category: "general",
    tags: ["international exchange", "partner universities", "eligibility", "application", "credits", "scholarships", "cultural immersion", "language", "networking"]
  },
  {
    question: "What are the entrepreneurship support programs?",
    answer: "Entrepreneurship support: 1) Startup incubation center, 2) Business plan competitions, 3) Seed funding up to ₹10 lakhs, 4) Mentorship from industry experts, 5) Legal and financial guidance, 6) Market research support, 7) Networking events, 8) Pitch deck preparation, 9) Patent filing assistance, 10) Alumni investor network. Programs open to all students.",
    category: "general",
    tags: ["entrepreneurship", "startup", "incubation", "competitions", "funding", "mentorship", "guidance", "networking", "pitch deck", "patents"]
  },
  {
    question: "How to access mental health counseling?",
    answer: "Mental health counseling: 1) Free counseling sessions available, 2) Professional psychologists on campus, 3) Confidential and non-judgmental environment, 4) Individual and group sessions, 5) Crisis intervention available, 6) Stress management workshops, 7) Academic pressure counseling, 8) Relationship guidance, 9) Career counseling, 10) 24/7 crisis helpline. No appointment needed for urgent cases.",
    category: "general",
    tags: ["mental health", "counseling", "psychologists", "confidential", "individual", "group", "crisis", "stress management", "academic", "helpline"]
  },
  {
    question: "What are the disability support services?",
    answer: "Disability support services: 1) Accessibility audit of all facilities, 2) Assistive technologies available, 3) Note-taking assistance, 4) Extended exam time, 5) Alternative format materials, 6) Sign language interpreters, 7) Mobility assistance, 8) Adaptive equipment, 9) Disability awareness training, 10) Dedicated support coordinator. All services free and confidential.",
    category: "general",
    tags: ["disability support", "accessibility", "assistive technologies", "note-taking", "exam time", "materials", "interpreters", "mobility", "equipment", "coordinator"]
  },
  {
    question: "How to report harassment or discrimination?",
    answer: "Harassment reporting: 1) Anti-harassment cell with dedicated officers, 2) Multiple reporting channels: online, email, phone, in-person, 3) Anonymous reporting available, 4) 24-hour response guarantee, 5) Confidential investigation process, 6) Support for victims, 7) Disciplinary action against perpetrators, 8) Regular awareness programs, 9) External legal support if needed, 10) Zero tolerance policy.",
    category: "general",
    tags: ["harassment", "discrimination", "reporting", "anti-harassment cell", "anonymous", "investigation", "support", "disciplinary action", "zero tolerance"]
  },
  {
    question: "What are the emergency contact numbers?",
    answer: "Emergency contacts: 1) Campus security: +91-123-4567890, 2) Medical emergency: +91-123-4567891, 3) Fire safety: +91-123-4567892, 4) Student helpline: +91-123-4567893, 5) Women's safety: +91-123-4567894, 6) Technical support: +91-123-4567895, 7) Hostel warden: +91-123-4567896, 8) Police control: 100, 9) Ambulance: 108, 10) All numbers available 24/7.",
    category: "general",
    tags: ["emergency", "contacts", "security", "medical", "fire", "helpline", "women safety", "technical", "warden", "police", "ambulance"]
  }
];

const seedFaqs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/iust-portal');
    console.log('Connected to MongoDB');

    await Faq.deleteMany({});
    console.log('Cleared existing FAQs');

    const createdFaqs = await Faq.insertMany(faqs);
    console.log(`Successfully seeded ${createdFaqs.length} FAQs`);

    const categoryStats = await Faq.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('\nFAQ Category Distribution:');
    categoryStats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count} FAQs`);
    });

    console.log('\nSeeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding FAQs:', error);
    process.exit(1);
  }
};

seedFaqs();
