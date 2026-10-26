
export const protect = async (req, res, next) => {
    try {
        const { userId } = req.auth();

        // console.log('Clerk userId:', userId);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated'
            });
        }

        return next();
    } catch (error) {
        console.error('Authentication error:', error);

        return res.status(401).json({
            success: false,
            message: error.message
        });
    }
};
