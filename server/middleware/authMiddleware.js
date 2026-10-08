const jwt = require("jsonwebtoken");


// ======================================================
// AUTHENTICATION MIDDLEWARE
// ======================================================

function authMiddleware(req, res, next) {

    try {

        // ==================================================
        // GET AUTHORIZATION HEADER
        // ==================================================

        const authHeader = req.headers.authorization;


        // Check if token exists
        if (!authHeader) {

            return res.status(401).json({

                message: "Authentication required"

            });

        }


        // ==================================================
        // CHECK BEARER TOKEN
        // ==================================================

        const parts = authHeader.split(" ");


        if (
            parts.length !== 2 ||
            parts[0] !== "Bearer"
        ) {

            return res.status(401).json({

                message: "Invalid authentication format"

            });

        }


        const token = parts[1];


        // ==================================================
        // VERIFY JWT TOKEN
        // ==================================================

        const decoded = jwt.verify(

            token,

            process.env.JWT_SECRET

        );


        // ==================================================
        // STORE USER ID
        // ==================================================

        req.userId = decoded.userId;


        // ==================================================
        // CONTINUE TO ROUTE
        // ==================================================

        next();

    } catch (error) {

        console.log("Authentication error:", error);


        return res.status(401).json({

            message: "Invalid or expired token"

        });

    }

}


module.exports = authMiddleware;