import User from "../models/User.model.js";


export const userRegistration = async(req, res)=>{
    try{

        const {clerkId, name, email, coordinates, role} = req.body
        
        if(!clerkId || !clerkId.trim()){
            return res.status(400).json({
                message:"The clerkId field cannot be empty"
            })
        };
        
        if(!name || !name.trim()){
            return res.status(400).json({
                message:"The name field cannot be left empty"
            })
        }

        if(!email || !email.trim()){
            return res.status(400).json({
                message:"Email is required"
            })
        }

        // Check if user with this clerkId already exists
        const existingUserByClerkId = await User.findOne({ clerkId });
        if(existingUserByClerkId){
            return res.status(200).json({
                message:"User already exists",
                savedUser: existingUserByClerkId
            });
        }

        // Check if user with this email already exists
        const existingUserByEmail = await User.findOne({ email });
        if(existingUserByEmail){
            // If email exists but different clerkId, update it
            existingUserByEmail.clerkId = clerkId;
            const updatedUser = await existingUserByEmail.save();
            return res.status(200).json({
                message:"User updated with clerkId",
                savedUser: updatedUser
            });
        }

        const newUser = new User ({
            clerkId,
            name: name.trim(),
            email: email.trim(),
            location:{
                type:"Point",
                coordinates: coordinates || [0, 0]
            },
            role: role || 'user'
        })

        const savedUser = await newUser.save();

        res.status(201).json({
            message:"User Registration completed",
            savedUser
        })


    }catch(error){

        console.error("Server Error creating user:", error);
        
        // Handle MongoDB duplicate key error
        if(error.code === 11000){
            const field = Object.keys(error.keyPattern)[0];
            let message = `A user with this ${field} already exists`;
            
            if(field === 'clerkId'){
                // Try to get the existing user
                try {
                    const existingUser = await User.findOne({ clerkId: req.body.clerkId });
                    if(existingUser){
                        return res.status(200).json({
                            message:"User already exists",
                            savedUser: existingUser
                        });
                    }
                } catch (findError) {
                    console.error("Error finding existing user:", findError);
                }
            }
            
            return res.status(409).json({
                message: message,
                error: error.message
            });
        }

        res.status(500).json({
            message:"Server Error",
            error:error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        })

    }
}

export const getUser = async (req, res)=>{
    try{

        const users = await User.find();
        res.status(200).json({
            users     
        })
    }catch(error){

        console.error("Server error", error);
        res.status(500).json({
            message:"Server Error",
            error:error.message
        })

    }
}

// Get user by clerkId
export const getUserByClerkId = async (req, res) => {
    try {
        const { clerkId } = req.params;
        const authenticatedClerkId = req.auth?.userId;
        
        // Ensure user can only access their own data
        if (clerkId !== authenticatedClerkId) {
            return res.status(403).json({
                message: "Forbidden - You can only access your own user data"
            });
        }
        
        if (!clerkId || !clerkId.trim()) {
            return res.status(400).json({
                message: "ClerkId is required"
            });
        }

        const user = await User.findOne({ clerkId });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User found",
            user
        });
    } catch (error) {
        console.error("Server error", error);
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
}

// Get current authenticated user
export const getCurrentUser = async (req, res) => {
    try {
        const { userId: clerkId } = req.auth;
        
        if (!clerkId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        let user = await User.findOne({ clerkId });

        if (!user) {
            // User doesn't exist in database yet, return Clerk ID only
            return res.status(200).json({
                message: "User not found in database",
                clerkId,
                exists: false
            });
        }

        res.status(200).json({
            message: "User found",
            user
        });
    } catch (error) {
        console.error("Server error", error);
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
}