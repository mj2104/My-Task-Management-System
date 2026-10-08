import { useState } from "react";

import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";


function App() {

    // ======================================================
    // CHECK IF USER IS ALREADY LOGGED IN
    // ======================================================

    const savedUser = localStorage.getItem("user");


    const [user, setUser] = useState(
        savedUser
            ? JSON.parse(savedUser)
            : null
    );


    // ======================================================
    // CURRENT PAGE
    // ======================================================

    const [page, setPage] = useState(
        savedUser
            ? "dashboard"
            : "login"
    );


    // ======================================================
    // LOGIN SUCCESS
    // ======================================================

    const handleLoginSuccess = (loggedInUser) => {

        setUser(loggedInUser);

        setPage("dashboard");

    };


    // ======================================================
    // REGISTER SUCCESS
    // ======================================================

    const handleRegisterSuccess = () => {

        setPage("login");

    };


    // ======================================================
    // LOGOUT
    // ======================================================

    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        setUser(null);

        setPage("login");

    };


    // ======================================================
    // MAIN APP
    // ======================================================

    return (

        <div className="app">


            {/* ==================================================
                HEADER
            ================================================== */}

            <header className="app-header">

                <div className="logo">

                    <span className="logo-icon">
                        ✓
                    </span>

                    <span>
                        TaskFlow
                    </span>

                </div>


                {/* Show logout only when logged in */}

                {user && (

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                )}

            </header>


            {/* ==================================================
                MAIN CONTENT
            ================================================== */}

            <main className="app-main">


                {/* ==================================================
                    LOGIN PAGE
                ================================================== */}

                {page === "login" && (

                    <Login

                        onLoginSuccess={
                            handleLoginSuccess
                        }

                        onGoToRegister={() =>
                            setPage("register")
                        }

                    />

                )}


                {/* ==================================================
                    REGISTER PAGE
                ================================================== */}

                {page === "register" && (

                    <Register

                        onRegisterSuccess={
                            handleRegisterSuccess
                        }

                        onGoToLogin={() =>
                            setPage("login")
                        }

                    />

                )}


                {/* ==================================================
                    DASHBOARD
                ================================================== */}

                {page === "dashboard" && user && (

                    <Dashboard

                        user={user}

                        onLogout={handleLogout}

                    />

                )}

            </main>


            {/* ==================================================
                FOOTER
            ================================================== */}

            <footer className="app-footer">

                <p>
                    © 2026 TaskFlow. Manage your work. Stay productive.
                </p>

            </footer>

        </div>

    );

}


export default App;