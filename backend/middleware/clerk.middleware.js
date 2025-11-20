import { clerkClient, requireAuth } from '@clerk/express';

// Check if CLERK_SECRET_KEY is set
if (!process.env.CLERK_SECRET_KEY) {
  console.error('ERROR: CLERK_SECRET_KEY is not set in environment variables');
  console.error('Clerk authentication will not work properly without this key.');
  console.error('Please add CLERK_SECRET_KEY to your backend .env file');
} else {
  console.log('CLERK_SECRET_KEY is configured');
}

// Middleware to verify Clerk authentication
// This automatically verifies the JWT token from Authorization header
// If token is invalid or missing, it will automatically return 401
export const verifyAuth = requireAuth({
  // Clerk will automatically use CLERK_SECRET_KEY from environment
  // If secret key is missing, this will fail
});

// Helper function to get authenticated user info from request
export const getAuthUser = async (req) => {
  try {
    // Check if req.auth exists (set by requireAuth middleware)
    if (!req.auth || !req.auth.userId) {
      console.error('No auth data in request - middleware may not have run');
      return null;
    }

    const { userId } = req.auth;
    
    if (!userId) {
      return null;
    }

    try {
      // Get user details from Clerk
      const user = await clerkClient.users.getUser(userId);
      
      // Get email - try multiple sources
      const email = user.emailAddresses?.[0]?.emailAddress || 
                   user.primaryEmailAddressId ? 
                     user.emailAddresses?.find(e => e.id === user.primaryEmailAddressId)?.emailAddress : 
                     '' ||
                   user.emailAddresses?.[0]?.emailAddress || 
                   '';

      const firstName = user.firstName || '';
      const lastName = user.lastName || '';
      const username = user.username || '';
      
      const fullName = `${firstName} ${lastName}`.trim() || username || 'User';

      return {
        clerkId: userId,
        email: email,
        firstName: firstName,
        lastName: lastName,
        fullName: fullName
      };
    } catch (error) {
      console.error('Error fetching user from Clerk:', error);
      // Return basic info even if Clerk API call fails
      return {
        clerkId: userId,
        email: `user_${userId}@temp.com`, // Temporary email if we can't get it
        firstName: '',
        lastName: '',
        fullName: 'User'
      };
    }
  } catch (error) {
    console.error('Error in getAuthUser:', error);
    return null;
  }
};

