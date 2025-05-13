// Authentication controller functions

// Handle user registration
export const signup = async (req, res) => {
    res.json({
        data: "You hit the signup endpoint",
    });
};

// Handle user login
export const login = async (req, res) => {
    res.json({
        data: "You hit the login endpoint",
    });
};

// Handle user logout
export const logout = async (req, res) => {
    res.json({
        data: "You hit the logout endpoint",
    });
};
