import Job from "../models/job.js";
import Application from "../models/application.js";

export const applyJob = async (req,res) => {    
    try {
       const userId = req.id;
       const jobId = req.params.id;
       if(!jobId){
           return res.status(400).json({
               success: false,
               message: "Job id is required"
           });
       }
       const job = await Job.findById(jobId);
       if(!job){
           return res.status(404).json({
               success: false,
               message: "Job not found"
           });
       }
       const existingApplication = await Application.findOne({userId, jobId});
       if(existingApplication){
           return res.status(400).json({
               success: false,
               message: "You have already applied for this job"
           });
        }
        const newApplication = await Application.create({
            job:jobId,
            applicant: userId,
        });
        job.applications.push(newApplication._id);
        await job.save();
        res.status(201).json({
            success: true,
            message: "Job applied successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            success: false,
            message: "Server error" 
        });        
    }
};

export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const applications = await Application.find({applicant: userId}).sort({createdAt:-1}).populate({
            path: 'job',
            options:{sort:{createdAt:-1}},
            populate: {
                path: 'company',
                options:{sort:{createdAt:-1}},
            }
        });
        if(!applications){
            return res.status(404).json({
                success: false,
                message: "No applications found"
            });
        }
        return res.status(200).json({
            success: true,
            applications,
            message: "Applications fetched successfully"
        });
    } catch (error) {
        return res.status(500).json({  
            success: false,
            message: "Server error" 
        });
    }
}

export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: 'applications',
            options:{sort:{createdAt:-1}},
            populate: {
                path: 'applicant',
                options:{sort:{createdAt:-1}},
            }
        });
        if(!job){
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }
        return res.status(200).json({
            success: true,
            job,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({  
            success: false,
            message: "Server error" 
        });
    }
}

export const updateStatus = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const {status} = req.body;
        if(!status){
            return res.status(404).json({
                success: false,
                message: "Status is required"
            });
        }
        const application = await Application.findById(applicationId);
        if(!application){
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }
        application.status = status;
        await application.save();

        return res.status(200).json({
            success: true,            
            message: "Application status updated"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({  
            success: false,
            message: "Server error" 
        });
    }
}