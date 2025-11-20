import WaterReport from "../models/WaterReport.model.js";
import { getReportLocationName } from "../utils/geoCodingutils.js";

//Create a water report
export const createReport = async(req, res)=>{
    try{
        const {userId, location, waterAvailable, waterClean, description} = req.body
        const coordinates = location.coordinates

        //Coordinate validation
        if(!coordinates || !Array.isArray(coordinates) ||coordinates.length !== 2){
            return res.status(400).json({
                message: "Valid coordinates [longitude, latitude] are required"
            });
        };

        //Report creation
        const newReport = new WaterReport({
            userId,
            location: {
                type:'Point',
                coordinates:coordinates
            },
            waterAvailable,
            waterClean,
            description: description || ''

        })

        const savedReport = await newReport.save();

        res.status(201).json({
            message:"Water report created successfully",
            savedReport
        });


    }catch(error){

        console.error("Error creating report", error);
        res.status(500).json({
            message:"Server error",
            error:error.message
        });

    };
};


//Update water report
export const updateReport = async (req, res) => {
    try{

        const {_id} = req.params;
        const updatedReport = await WaterReport.findByIdAndUpdate(
            _id,
            req.body,
            {
                new:true,
                runValidators:true
            }
        ).populate("userId", "name email location -_id");

        if(!updatedReport){
            res.status(404).json({
                message:"The report was not found"
            });
        }
        
        res.status(200).json({
            message:"Report successfully updated",
            data:updatedReport
        })

        
    }catch(error){

        console.error(`Server error ${error}`);
        return res.status(500).json({
            message:"Server error just occured",
            error:error.message
        });

    };
};

// Get water report
export const getAllReports = async (req, res)=>{
    
    try{
        const reports = await WaterReport.find().populate('userId','name email location').sort({timestamp:-1}).lean()

        // so as to get the data like coordinates name instead of the number array
        const enrichedReports = await Promise.all(
            reports.map(async (report) => {
                if (report.location?.coordinates && report.location.coordinates.length === 2) {
                    const [lon, lat] = report.location.coordinates; 
                    
                    const locationName = await getReportLocationName(lon, lat);
                
                    return { ...report, locationName };
                    }

                return { ...report, locationName: 'Location Data Missing' };
            })
        );

        res.status(200).json({
            count: enrichedReports.length,
            reports: enrichedReports 
        });

    }catch(error){

        console.error("Error fetching reports",error);
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
        
    };
};

// Get single report By Id
export const getReportById = async(req, res)=>{
    try{
        const {_id}=req.params;
        const report = await WaterReport.findById(_id).populate("userId","name email location -_id");

        if(!report){
            return res.status(401).json({
                message: "The Report could Not be found"
            });
        }

        res.status(200).json({report});

    }catch(error){

        console.error("Error fetching report", error);
        res.status(500).json({
            message:"Server error",
            error: error.message

        });
    }

};

export const deleteReport = async(req, res)=>{
    try{

        const {_id} = req.params;
        const deleteWaterReport = await WaterReport.findByIdAndDelete(_id);

        if(!deleteWaterReport){
            return res.status(404).json({
                message:"The Record could not be found"
            })
        }

        res.status(200).json({
            message:"Report deleted successfully"
        })

    }catch(error){

        console.error("Server error", error);
        return res.status(500).json({
            message:"Server error",
            error: error.message
        })

    }
}