import dotenv from 'dotenv';
import { program } from 'commander';
import User from '../src/models/user.model.js';
import '../src/config/db.js';

dotenv.config();

program
  .requiredOption('-n, --name <name>', 'Admin name')
  .requiredOption('-e, --email <email>', 'Admin email')
  .requiredOption('-p, --password <password>', 'Admin password')
  .parse(process.argv);

const options = program.opts();

const createAdmin = async () => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: options.email });
    
    if (existingUser) {
      console.log(`User with email ${options.email} already exists`);
      
      // If user exists but is not admin, update to admin
      if (existingUser.role !== 'admin') {
        existingUser.role = 'admin';
        await existingUser.save();
        console.log(`User ${options.email} has been upgraded to admin role`);
      } else {
        console.log(`User ${options.email} is already an admin`);
      }
    } else {
      // Create new admin user
      const newAdmin = await User.create({
        name: options.name,
        email: options.email,
        password: options.password, // Will be hashed by pre-save hook
        role: 'admin'
      });
      
      console.log(`Admin user created successfully: ${newAdmin.email}`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error.message);
    process.exit(1);
  }
};

createAdmin();
