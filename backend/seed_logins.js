const mongoose = require('mongoose');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Patient = require('./models/Patient');
const Department = require('./models/Department');
const bcrypt = require('bcryptjs');

async function main() {
  try {
    await mongoose.connect('mongodb://localhost:27017/hms');
    console.log('Connected to MongoDB');

    // 1. Create default department if not existing
    let dept = await Department.findOne({ name: 'General Medicine' });
    if (!dept) {
      dept = await Department.create({
        departmentId: 'DEP-101',
        name: 'General Medicine',
        description: 'General OPD and Consultation'
      });
      console.log('Created General Medicine department');
    }

    // 2. Default accounts
    const defaultAccounts = [
      { name: 'System Super Admin', email: 'superadmin@test.com', password: 'password123', role: 'super_admin', phone: '1234567890' },
      { name: 'System Admin', email: 'admin@test.com', password: 'password123', role: 'admin', phone: '1234567891' },
      { name: 'Dr. Rahul Sharma', email: 'doctor@test.com', password: 'password123', role: 'doctor', phone: '9876543210' },
      { name: 'Receptionist Sarah', email: 'receptionist@test.com', password: 'password123', role: 'receptionist', phone: '5551234567' },
      { name: 'Nurse Maya', email: 'nurse@test.com', password: 'password123', role: 'nurse', phone: '5551234568' },
      { name: 'Pharmacist Amit', email: 'pharmacist@test.com', password: 'password123', role: 'pharmacist', phone: '5551234569' },
      { name: 'Billing Executive Neha', email: 'billing@test.com', password: 'password123', role: 'billing_executive', phone: '5551234570' },
      { name: 'Lab Technician Vikram', email: 'lab@test.com', password: 'password123', role: 'lab_technician', phone: '5551234571' },
      { name: 'Patient Aditi Sharma', email: 'patient@test.com', password: 'password123', role: 'patient', phone: '9998887776' }
    ];

    for (const acc of defaultAccounts) {
      let user = await User.findOne({ email: acc.email });
      const hashedPassword = await bcrypt.hash(acc.password, 10);
      if (!user) {
        user = await User.create({
          name: acc.name,
          email: acc.email,
          password: hashedPassword,
          role: acc.role,
          phone: acc.phone
        });
        console.log(`Created ${acc.role.toUpperCase()} user: ${acc.email}`);
      } else {
        user.password = hashedPassword;
        user.role = acc.role;
        user.isActive = true;
        await user.save();
        console.log(`Updated ${acc.role.toUpperCase()} user: ${acc.email}`);
      }

      // Link Doctor record if role is doctor
      if (acc.role === 'doctor') {
        let docDoc = await Doctor.findOne({ email: acc.email });
        if (!docDoc) {
          await Doctor.create({
            userId: user._id,
            doctorId: 'DOC-101',
            name: acc.name,
            email: acc.email,
            phone: acc.phone,
            gender: 'Male',
            specialization: 'General Physician',
            qualification: 'MBBS, MD',
            department: dept._id,
            registrationNumber: 'REG-1001'
          });
          console.log('Created linked Doctor record for doctor@hms.com');
        } else {
          docDoc.userId = user._id;
          await docDoc.save();
        }
      }

      // Link Patient record if role is patient
      if (acc.role === 'patient') {
        let patDoc = await Patient.findOne({ userId: user._id });
        if (!patDoc) {
          await Patient.create({
            userId: user._id,
            patientId: 'PAT-101',
            name: acc.name,
            email: acc.email,
            phone: acc.phone,
            gender: 'Female',
            age: 28,
            address: '123 Main St'
          });
          console.log('Created linked Patient record for patient@hms.com');
        }
      }
    }

    console.log('\n--- SEEDING COMPLETE ---');
  } catch (err) {
    console.error('Error seeding logins:', err);
  } finally {
    await mongoose.disconnect();
  }
}

main();
