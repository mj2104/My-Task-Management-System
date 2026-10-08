import { useState } from "react";

function Login({ onLoginSuccess, onGoToRegister }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const handleLogin = async (event) => {

        event.preventDefault();

        setError("");


        // ==================================================
        // SEND LOGIN REQUEST
        // ==================================================

        try {

            setLoading(true);


            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );


            const data = await response.json();


            // ==================================================
            // LOGIN SUCCESSFUL
            // ==================================================

            if (response.ok) {

                // Save JWT token
                localStorage.setItem(
                    "token",
                    data.token
                );


                // Save user information
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );


                // Notify App.jsx
                if (onLoginSuccess) {

                    onLoginSuccess(data.user);

                }

            } else {

                setError(
                    data.message || "Login failed."
                );

            }

        } catch (error) {

            console.log("Login error:", error);

            setError(
                "Unable to connect to the server."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="auth-container">

            <div className="auth-card">

                <h2>Welcome Back!</h2>

                <p className="auth-subtitle">
                    Login to manage your tasks
                </p>


                {/* ERROR MESSAGE */}

                {error && (

                    <div className="error-message">

                        {error}

                    </div>

                )}


                <form onSubmit={handleLogin}>


                    {/* EMAIL */}

                    <div className="form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            placeholder="Enter your email"
                            required
                        />

                    </div>


                    {/* PASSWORD */}

                    <div className="form-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            placeholder="Enter your password"
                            required
                        />

                    </div>


                    {/* LOGIN BUTTON */}

                    <button
                        type="submit"
                        className="primary-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Logging in..."
                            : "Login"
                        }

                    </button>

                </form>


                {/* REGISTER LINK */}

                <p className="auth-switch">

                    Don't have an account?

                    <button
                        type="button"
                        className="link-button"
                        onClick={onGoToRegister}
                    >
                        Register
                    </button>

                </p>

            </div>

        </div>

    );

}

export default Login;