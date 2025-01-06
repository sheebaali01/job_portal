
import Company from '../models/company.js';
import cloudinary from '../utils/cloudinary.js';
import getDataUri from '../utils/datauri.js';
export const registerCompany = async (req,res) => {
    try {
        const {companyName} = req.body;
        console.log(companyName);
        if(!companyName){
            return res.status(400).json({
                success: false,
                message: "Company name is required"
            });
        }
        let company = await Company.findOne({name:companyName});
        if(company){
            return res.status(400).json({
                success: false,
                message: "You can't register the same company twice"
            });
        }
        company = await Company.create({
            name: companyName,
            userId: req.id,
        });
        res.status(201).json({
            success: true,
            company,
            message: "Company registered successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            success: false,
            message: "Server error" 
        });
    }
}

export const getCompany = async (req, res) => {
    try {
        const userId = req.id;
        const companies = await Company.find({userId});
        if(!companies){
            return res.status(404).json({
                success: false,
                message: "No companies found"
            });
        }
        return res.status(200).json({
            success: true,
            companies,
            message: "Companies fetched successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({  
            success: false,
            message: "Server error" 
        });
    }
}
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if(!company){
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }
        return res.status(200).json({
            success: true,
            company,
            message: "Company fetched successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({  
            success: false,
            message: "Server error" 
        });
    }
}

export const updateCompany = async (req, res) => {
    try {
        const {name, description, website, location} = req.body;

        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        const logo = cloudResponse.secure_url;

        const updateData = {name, description, website, location, logo};
        const company = await Company.findByIdAndUpdate(req.params.id, updateData, {new:true});
        if(!company){
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Company information updated"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({  
            success: false,
            message: "Server error" 
        });
    }
}