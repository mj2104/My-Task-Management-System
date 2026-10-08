import { useState } from "react";

function Register({ onRegisterSuccess, onGoToLogin }) {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const handleRegister = async (event) => {

        event.preventDefault();

        setMessage("");
        setError("");


        // ==================================================
        // VALIDATE PASSWORD
        // ==================================================

        if (password !== confirmPassword) {

            setError("Passwords do not match.");

            return;

        }


        // ==================================================
        // SEND REGISTRATION REQUEST
        // ==================================================

        try {

            setLoading(true);


            const response = await fetch(
                "http://localhost:5000/api/auth/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password
                    })
                }
            );


            const data = await response.json();


            if (response.ok) {

                setMessage(
                    "Registration successful! You can now login."
                );


                // Clear form
                setName("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");


                // Optional callback
                if (onRegisterSuccess) {

                    onRegisterSuccess();

                }

            } else {

                setError(
                    data.message || "Registration failed."
                );

            }

        } catch (error) {

            console.log("Registration error:", error);

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

                <h2>Create Your Account</h2>

                <p className="auth-subtitle">
                    Join Task Management System
                </p>


                {message && (
                    <div className="success-message">
                        {message}
                    </div>
                )}


                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}


                <form onSubmit={handleRegister}>


                    {/* NAME */}

                    <div className="form-group">

                        <label>
                            Full Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            placeholder="Enter your name"
                            required
                        />

                    </div>


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
                            placeholder="Create a password"
                            required
                        />

                    </div>


                    {/* CONFIRM PASSWORD */}

                    <div className="form-group">

                        <label>
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(event) =>
                                setConfirmPassword(event.target.value)
                            }
                            placeholder="Confirm your password"
                            required
                        />

                    </div>


                    {/* REGISTER BUTTON */}

                    <button
                        type="submit"
                        className="primary-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Creating Account..."
                            : "Create Account"
                        }

                    </button>

                </form>


                {/* LOGIN LINK */}

                <p className="auth-switch">

                    Already have an account?

                    <button
                        type="button"
                        className="link-button"
                        onClick={onGoToLogin}
                    >
                        Login
                    </button>

                </p>

            </div>

        </div>

    );

}

export default Register;