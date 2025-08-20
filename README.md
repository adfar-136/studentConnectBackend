# Server Documentation

## Database Seeding

This server includes comprehensive database seeding functionality to populate your cloud MongoDB database with sample data.

### Available Scripts

- `npm run seed:db` - Seeds the entire database with sample data
- `npm run seed:admin` - Seeds only the admin user (using existing seedAdmin.js)

### What Gets Seeded

The seeding script will populate the following collections:

#### 1. ValidStudentIds (18 entries)
- Sample student IDs for different departments and years
- Format: `YYYY-DEPARTMENT-XXX` (e.g., 2021-CSE-001)

#### 2. Users (8 entries)
- 1 Admin user
- 7 Student users across different departments and years
- All students have password: `student123`

#### 3. Events (4 entries)
- Annual Tech Fest 2024
- Cultural Night
- Sports Meet 2024
- Career Fair

#### 4. Duties (4 entries)
- Various duty assignments for events
- Different roles: coordinator, publicity, decoration, registration

#### 5. Applications (3 entries)
- Student council applications with different statuses
- Various positions: president, vice-president, treasurer

#### 6. FAQs (5 entries)
- Common questions across different categories
- Categories: admission, hostel, faculty, examination, general

#### 7. Queries (3 entries)
- Sample student queries with different statuses
- Statuses: open, in_progress, resolved

### Default Credentials

#### Admin User
- Email: `adfarrasheed136@gmail.com`
- Password: `admin123`

#### Sample Student Users
- Email: `john.doe@iust.edu` (Password: `student123`)
- Email: `jane.smith@iust.edu` (Password: `student123`)
- Email: `mike.johnson@iust.edu` (Password: `student123`)

### Running the Seeding Script

1. Make sure your MongoDB connection string is set in your `.env` file:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   ```

2. Run the seeding script:
   ```bash
   npm run seed:db
   ```

3. The script will:
   - Connect to your MongoDB database
   - Clear existing data (optional)
   - Seed all collections with sample data
   - Display a summary of what was created

### Important Notes

- **Data Clearing**: The script clears all existing data before seeding. If you want to keep existing data, comment out the `deleteMany` operations in the script.
- **Password Hashing**: All passwords are automatically hashed using bcrypt before being stored in the database.
- **Relationships**: The script properly sets up relationships between collections (e.g., duties reference events and users).
- **Error Handling**: The script includes comprehensive error handling and will exit with an error code if seeding fails.

### Customizing Sample Data

You can modify the `sampleData` object in `seedDatabase.js` to:
- Add more users, events, or other entities
- Change the sample data to match your specific needs
- Add more departments or student IDs
- Modify event details or FAQ content

### Troubleshooting

If you encounter issues:

1. **Connection Error**: Verify your MongoDB connection string in `.env`
2. **Permission Error**: Ensure your MongoDB user has write permissions
3. **Schema Validation Error**: Check that your models match the expected data structure
4. **Duplicate Key Error**: The script handles this automatically, but you can modify the logic if needed

### Database Schema

The seeding script works with the following models:
- `User` - Users (admin/students)
- `ValidStudentId` - Valid student IDs for registration
- `Event` - University events
- `Duty` - Event duty assignments
- `Application` - Student council applications
- `Faq` - Frequently asked questions
- `Query` - Student queries/complaints
