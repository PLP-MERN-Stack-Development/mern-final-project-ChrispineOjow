import{body,param,validationResult} from "express-validator";
 
//Middleware to handle validation
export const handleValidation = (req, res, next)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            message:"Validation failed",
            errors:errors.array()
        });

    }
    next();
}

//Validation rules for creating and updating water reports
export const validateReport = [
    body("userId").notEmpty().withMessage("User id is required").isMongoId().withMessage("Invalid userId format"),
    body('location.coordinates')
        .isArray({ min: 2, max: 2 }).withMessage('Coordinates must be an array of [longitude, latitude]')
        .custom((value) => {
            const [lng, lat] = value;
            if (typeof lng !== 'number' || typeof lat !== 'number') {
                throw new Error('Coordinates must be numbers');
            }
            if (lng < -180 || lng > 180) {
                throw new Error('Longitude must be between -180 and 180');
            }
            if (lat < -90 || lat > 90) {
                throw new Error('Latitude must be between -90 and 90');
            }
            return true;
        }),
    
    body('waterAvailable')
        .isBoolean().withMessage('Water available must be true or false'),
    
    body('waterClean')
        .isBoolean().withMessage('Water clean must be true or false'),
    
    body('description')
        .optional()
        .isString().withMessage('Description must be text')
        .trim()
        .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters')
];

// Validation for MongoDB ObjectId params
export const validateMongoId = [
    param('_id')
        .isMongoId().withMessage('Invalid ID format')
];



