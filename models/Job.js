import mongoose from 'mongoose'

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: false },
  company: { type: String, required: true },
  location: { type: String },
  salary: { type: String },
  jobType: {type: String},
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })

export default mongoose.model('Job', jobSchema)
