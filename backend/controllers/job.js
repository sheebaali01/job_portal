import Job from "../models/job.js";

export const postJob = async (req,res) =>{
    try {
        const {title,description,requirements,salary,experience,location,jobType,position,companyId} = req.body;
        const userId= req.id;

        if(!title || !description || !requirements || !salary || !experience || !location || !jobType || !position || !companyId){
            return res.status(400).json({
                success: false, 
                message: "Something is missing."
            });
        };
        const job = await Job.create({
            title,
            description,
            requirements:requirements.split(","),
            salary:Number(salary),
            experienceLevel:experience,
            location,
            jobType,
            position,
            company:companyId,
            created_by:userId
        });
        return res.status(200).json({
            success: true, 
            job,
            message: "New job created successfully."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({  
            success: false,
            message: "Server error" 
        });
    }
}

export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || '';
        const query = {
            $or:[
                {title:{$regex:keyword, $options:"i"}},
                {description:{$regex:keyword, $options:"i"}},
            ]
        }
        const jobs = await Job.find(query).populate('company');
        if(!jobs){
            return res.status(404).json({
                success: false,
                message: "No job found."
            });
        }
        return res.status(200).json({
            success: true, 
            jobs,
            message: "Jobs fetched successfully."
        });
    } catch (error) {
        return res.status(500).json({  
            success: false,
            message: "Server error" 
        });
    }
}

//students
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: 'applications',
        });
        if(!job){
            return res.status(404).json({
                success: false,
                message: "Job not found."
            });
        }
        return res.status(200).json({
            success: true, 
            job,
            message: "Job fetched successfully."
        });
    } catch (error) {
        return res.status(500).json({  
            success: false,
            message: "Server error" 
        });
    }
}

export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({created_by:adminId}).populate({
            path: 'company',
            createdAt: -1,
        });
        if(!jobs){
            return res.status(404).json({
                success: false,
                message: "Jobs not found."
            });
        }
        return res.status(200).json({
            success: true, 
            jobs,
            message: "Job fetched successfully."
        });
    } catch (error) {
        return res.status(500).json({  
            success: false,
            message: "Server error" 
        });
    }
}

export const updateJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId= req.id;
        const {title,description,requirements,salary,experience,location,jobType,position,companyId} = req.body;
        if(!title || !description || !requirements || !salary || !experience || !location || !jobType || !position || !companyId){
            return res.status(400).json({            
                success: false,
                message: "Something is missing."
            });
        };
        const job = await Job.findById(jobId);
        if(!job){
            return res.status(404).json({
                success: false,
                message: "Job not found."
            });
        }
        if(job.created_by.toString() !== userId){
            return res.status(401).json({
                success: false,
                message: "You are not authorized to update this job."
            });
        }
        const updateData = {title,description,requirements,salary,experienceLevel:experience,location,jobType,position,company:companyId};
        const updatedJob = await Job.findByIdAndUpdate(jobId, updateData, {new:true});
        return res.status(200).json({
            success: true, 
            updatedJob,
            message: "Job updated successfully."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({  
            success: false,
            message: "Server error" 
        });
    }
}
