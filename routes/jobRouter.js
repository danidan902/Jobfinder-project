import express from 'express'
// import authMiddleware from '../middleware/authMiddleware.js'
import {
  createJob,
  getAllJobs,
  getJobById,
  applyToJob,
  getMyJobs,
  deleteJob
} from '../controller/jobControler.js'

const router = express.Router()

router.get('/', getAllJobs)
router.get('/:id', getJobById)
router.post('/',  createJob)
router.get('/my/jobs', getMyJobs)
router.post('/:id/apply', applyToJob)
router.delete("/:id", deleteJob);

export default router
