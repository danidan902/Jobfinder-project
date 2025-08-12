import Job from '../models/Job.js';
import User from '../models/User.js'; // For populate if needed
import jwt from 'jsonwebtoken';

// Helper: extract & verify token from Authorization header (returns decoded payload or throws)
const verifyAuthToken = (req) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) throw new Error('No token provided');

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') throw new Error('Invalid token format');

  const token = parts[1];
  return jwt.verify(token, process.env.JWT_SECRET); // throws if invalid/expired
};

// Create a new job (Protected, manual token verification)
export const createJob = async (req, res) => {
  try {
    // Verify token manually
    const decoded = verifyAuthToken(req);

    const { title, description, company, location, salary,jobType } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const job = new Job({
      title,
      description,
      company,
      location,
      salary,
      jobType,
      createdBy: decoded.id,
    });

    await job.save();

    res.status(201).json({ message: 'Job created successfully', job });
  } catch (error) {
    if (error.message.includes('token')) {
      return res.status(401).json({ message: 'Unauthorized: ' + error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all jobs (Public)
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch jobs', error: err.message });
  }
};

// Get job by ID (Public, includes user info)
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('createdBy', 'name email');
    if (!job) return res.status(404).json({ message: 'Job not found!' });
    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch job', error: err.message });
  }
};

// Apply to a job (Protected)
export const applyToJob = async (req, res) => {
  try {
    const decoded = verifyAuthToken(req);
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found!' });

    if (job.applicants.includes(decoded.id)) {
      return res.status(400).json({ message: 'You already applied for this job' });
    }

    job.applicants.push(decoded.id);
    await job.save();

    res.status(200).json({ message: 'Application submitted successfully!' });
  } catch (err) {
    if (err.message.includes('token')) {
      return res.status(401).json({ message: 'Unauthorized: ' + err.message });
    }
    res.status(500).json({ message: 'Failed to apply', error: err.message });
  }
};


export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find();  
    res.status(200).json({ jobs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching jobs' });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};
