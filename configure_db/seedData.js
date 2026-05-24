/**
 * Seed script - adds realistic hospital data to MongoDB
 * Run: npm run seed
 */
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const AuthModel = require("../Models/AuthModel");
const DoctorModel = require("../Models/DoctorModel");
const SlotModel = require("../Models/SlotModel");
const { getDayFromDate } = require("../utils/dateHelper");

const doctorsData = [
  {
    name: "Dr. Ravi Sharma",
    email: "ravi.sharma@medibook.com",
    password: "Doctor@123",
    specialization: "Cardiology",
    experience: 12,
    fees: 800,
    hospital: "MediBook Heart Centre",
    image: "doctor1.jpg",
    workingDays: ["Mon", "Wed", "Fri"],
    startTime: "09:00",
    endTime: "12:00",
  },
  {
    name: "Dr. Priya Nair",
    email: "priya.nair@medibook.com",
    password: "Doctor@123",
    specialization: "Dermatology",
    experience: 8,
    fees: 600,
    hospital: "MediBook Skin Clinic",
    image: "doctor2.jpg",
    workingDays: ["Tue", "Thu", "Sat"],
    startTime: "10:00",
    endTime: "13:00",
  },
  {
    name: "Dr. Arjun Mehta",
    email: "arjun.mehta@medibook.com",
    password: "Doctor@123",
    specialization: "Neurology",
    experience: 15,
    fees: 1000,
    hospital: "MediBook Neuro Institute",
    image: "doctor3.jpg",
    workingDays: ["Mon", "Tue", "Thu"],
    startTime: "14:00",
    endTime: "17:00",
  },
  {
    name: "Dr. Sneha Reddy",
    email: "sneha.reddy@medibook.com",
    password: "Doctor@123",
    specialization: "Paediatrics",
    experience: 10,
    fees: 700,
    hospital: "MediBook Children Hospital",
    image: "doctor4.jpg",
    workingDays: ["Mon", "Wed", "Sat"],
    startTime: "09:30",
    endTime: "12:30",
  },
  {
    name: "Dr. Karthik Rao",
    email: "karthik.rao@medibook.com",
    password: "Doctor@123",
    specialization: "Orthopaedics",
    experience: 14,
    fees: 900,
    hospital: "MediBook Bone & Joint Care",
    image: "doctor5.jpg",
    workingDays: ["Tue", "Wed", "Fri"],
    startTime: "11:00",
    endTime: "14:00",
  },
  {
    name: "Dr. Ananya Iyer",
    email: "ananya.iyer@medibook.com",
    password: "Doctor@123",
    specialization: "Gynaecology and obstetrics",
    experience: 11,
    fees: 850,
    hospital: "MediBook Women's Health",
    image: "doctor6.jpg",
    workingDays: ["Mon", "Thu", "Fri"],
    startTime: "10:00",
    endTime: "13:00",
  },
];

// Generate next 14 days as YYYY-MM-DD
const getUpcomingDates = (count = 14) => {
  const dates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    dates.push(`${yyyy}-${mm}-${dd}`);
  }
  return dates;
};

// Create 30-min slots between start and end time
const generateTimeSlots = (date, startTime, endTime, doctorId, days) => {
  const slots = [];
  let current = new Date(`${date}T${startTime}`);
  const end = new Date(`${date}T${endTime}`);

  while (current < end) {
    const formattedTime = current.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    slots.push({
      doctorId,
      date,
      time: formattedTime,
      days,
      isBooked: false,
    });

    current.setMinutes(current.getMinutes() + 30);
  }

  return slots;
};

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URL, { dbName: "Hospital" });
    console.log("Connected to MongoDB");

    // Clear existing data (optional - comment out if you want to keep data)
    await SlotModel.deleteMany({});
    await DoctorModel.deleteMany({});
    await AuthModel.deleteMany({
      email: {
        $in: [
          ...doctorsData.map((d) => d.email),
          "admin@medibook.com",
          "patient@medibook.com",
        ],
      },
    });

    // Admin user
    const adminExists = await AuthModel.findOne({ email: "admin@medibook.com" });
    if (!adminExists) {
      await AuthModel.create({
        name: "Hospital Admin",
        email: "admin@medibook.com",
        password: await bcrypt.hash("Admin@123", 12),
        role: "admin",
        phone: "9876543210",
      });
      console.log("Admin created: admin@medibook.com / Admin@123");
    }

    // Demo patient
    const patientExists = await AuthModel.findOne({ email: "patient@medibook.com" });
    if (!patientExists) {
      await AuthModel.create({
        name: "John Doe",
        email: "patient@medibook.com",
        password: await bcrypt.hash("Patient@123", 12),
        role: "patient",
        phone: "9123456789",
      });
      console.log("Patient created: patient@medibook.com / Patient@123");
    }

  const upcomingDates = getUpcomingDates(14);
  let totalSlots = 0;

  for (const doc of doctorsData) {
    const hashedPassword = await bcrypt.hash(doc.password, 12);

    const user = await AuthModel.create({
      name: doc.name,
      email: doc.email,
      password: hashedPassword,
      role: "doctor",
      phone: "9000000000",
    });

    const doctor = await DoctorModel.create({
      name: doc.name,
      userId: user._id,
      specialization: doc.specialization,
      experience: doc.experience,
      fees: doc.fees,
      hospital: doc.hospital,
      image: doc.image,
    });

    // Create slots for matching days in next 14 days
    for (const date of upcomingDates) {
      const day = getDayFromDate(date);
      if (doc.workingDays.includes(day)) {
        const slotDocs = generateTimeSlots(
          date,
          doc.startTime,
          doc.endTime,
          user._id,
          doc.workingDays,
        );
        await SlotModel.insertMany(slotDocs);
        totalSlots += slotDocs.length;
      }
    }

    console.log(`Doctor added: ${doc.name} (${doc.specialization})`);
  }

    console.log(`\nSeed completed! ${doctorsData.length} doctors, ${totalSlots} slots created.`);
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seedDatabase();
