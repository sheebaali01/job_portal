import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminJobs, getAllJobs, getJobById, postJob, updateJob } from "../controllers/job.js";

const router = express.Router();


router.post('/post',isAuthenticated, postJob);
router.get('/get', isAuthenticated,getAllJobs);
router.get('/getadminjobs', isAuthenticated, getAdminJobs);
router.get('/get/:id', isAuthenticated, getJobById);
router.post('/update/:id', isAuthenticated, updateJob);

export default router;