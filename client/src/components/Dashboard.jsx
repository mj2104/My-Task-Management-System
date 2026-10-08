import { useEffect, useState } from "react";

function Dashboard({ user, onLogout }) {

    const [tasks, setTasks] = useState([]);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [editingTask, setEditingTask] = useState(null);

    const [filter, setFilter] = useState("all");

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    // ======================================================
    // GET JWT TOKEN
    // ======================================================

    const token = localStorage.getItem("token");


    // ======================================================
    // FETCH TASKS
    // ======================================================

    const fetchTasks = async () => {

        try {

            setLoading(true);

            const response = await fetch(
                "http://localhost:5000/api/tasks",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            const data = await response.json();


            if (response.ok) {

                setTasks(data);

            } else {

                setError(
                    data.message || "Unable to load tasks."
                );

            }

        } catch (error) {

            console.log("Fetch tasks error:", error);

            setError(
                "Unable to connect to the server."
            );

        } finally {

            setLoading(false);

        }

    };


    // ======================================================
    // LOAD TASKS WHEN DASHBOARD OPENS
    // ======================================================

    useEffect(() => {

        fetchTasks();

    }, []);


    // ======================================================
    // CREATE TASK
    // ======================================================

    const handleCreateTask = async (event) => {

        event.preventDefault();

        setMessage("");
        setError("");


        if (!title.trim()) {

            setError("Please enter a task title.");

            return;

        }


        try {

            const response = await fetch(
                "http://localhost:5000/api/tasks",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        title: title,
                        description: description
                    })
                }
            );


            const data = await response.json();


            if (response.ok) {

                setTasks([
                    data.task,
                    ...tasks
                ]);

                setTitle("");
                setDescription("");

                setMessage(
                    "Task created successfully!"
                );

            } else {

                setError(
                    data.message || "Unable to create task."
                );

            }

        } catch (error) {

            console.log("Create task error:", error);

            setError(
                "Unable to connect to the server."
            );

        }

    };


    // ======================================================
    // START EDITING TASK
    // ======================================================

    const handleEditClick = (task) => {

        setEditingTask(task);

        setTitle(task.title);

        setDescription(
            task.description || ""
        );

        setMessage("");
        setError("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    // ======================================================
    // UPDATE TASK
    // ======================================================

    const handleUpdateTask = async (event) => {

        event.preventDefault();

        setMessage("");
        setError("");


        if (!title.trim()) {

            setError("Please enter a task title.");

            return;

        }


        try {

            const response = await fetch(

                `http://localhost:5000/api/tasks/${editingTask._id}`,

                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        title: title,
                        description: description
                    })
                }

            );


            const data = await response.json();


            if (response.ok) {

                setTasks(

                    tasks.map((task) =>

                        task._id === editingTask._id
                            ? data.task
                            : task

                    )

                );


                setEditingTask(null);

                setTitle("");

                setDescription("");

                setMessage(
                    "Task updated successfully!"
                );

            } else {

                setError(
                    data.message || "Unable to update task."
                );

            }

        } catch (error) {

            console.log("Update task error:", error);

            setError(
                "Unable to connect to the server."
            );

        }

    };


    // ======================================================
    // CANCEL EDIT
    // ======================================================

    const handleCancelEdit = () => {

        setEditingTask(null);

        setTitle("");

        setDescription("");

        setMessage("");
        setError("");

    };


    // ======================================================
    // TOGGLE TASK STATUS
    // ======================================================

    const handleToggleComplete = async (task) => {

        try {

            const response = await fetch(

                `http://localhost:5000/api/tasks/${task._id}/status`,

                {
                    method: "PATCH",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        completed: !task.completed
                    })
                }

            );


            const data = await response.json();


            if (response.ok) {

                setTasks(

                    tasks.map((currentTask) =>

                        currentTask._id === task._id
                            ? data.task
                            : currentTask

                    )

                );

            } else {

                setError(
                    data.message || "Unable to update task."
                );

            }

        } catch (error) {

            console.log(
                "Toggle task error:",
                error
            );

            setError(
                "Unable to connect to the server."
            );

        }

    };


    // ======================================================
    // DELETE TASK
    // ======================================================

    const handleDeleteTask = async (taskId) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this task?"
        );


        if (!confirmDelete) {

            return;

        }


        try {

            const response = await fetch(

                `http://localhost:5000/api/tasks/${taskId}`,

                {
                    method: "DELETE",

                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );


            const data = await response.json();


            if (response.ok) {

                setTasks(

                    tasks.filter(
                        (task) => task._id !== taskId
                    )

                );

                setMessage(
                    "Task deleted successfully!"
                );

            } else {

                setError(
                    data.message || "Unable to delete task."
                );

            }

        } catch (error) {

            console.log(
                "Delete task error:",
                error
            );

            setError(
                "Unable to connect to the server."
            );

        }

    };


    // ======================================================
    // FILTER TASKS
    // ======================================================

    const filteredTasks = tasks.filter((task) => {

        if (filter === "pending") {

            return !task.completed;

        }

        if (filter === "completed") {

            return task.completed;

        }

        return true;

    });


    // ======================================================
    // TASK COUNTS
    // ======================================================

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(
        (task) => task.completed
    ).length;

    const pendingTasks = tasks.filter(
        (task) => !task.completed
    ).length;


    // ======================================================
    // RENDER DASHBOARD
    // ======================================================

    return (

        <div className="dashboard">


            {/* ==================================================
                WELCOME SECTION
            ================================================== */}

            <section className="welcome-section">

                <div>

                    <p className="welcome-label">
                        MY TASKS
                    </p>

                    <h1>
                        Good morning, {user?.name}! 👋
                    </h1>

                    <p>
                        Stay organized and get things done.
                    </p>

                </div>

            </section>


            {/* ==================================================
                STATISTICS
            ================================================== */}

            <section className="stats-grid">

                <div className="stat-card">

                    <span className="stat-icon">
                        📋
                    </span>

                    <div>

                        <h3>
                            {totalTasks}
                        </h3>

                        <p>
                            Total Tasks
                        </p>

                    </div>

                </div>


                <div className="stat-card">

                    <span className="stat-icon">
                        ⏳
                    </span>

                    <div>

                        <h3>
                            {pendingTasks}
                        </h3>

                        <p>
                            Pending
                        </p>

                    </div>

                </div>


                <div className="stat-card">

                    <span className="stat-icon">
                        ✅
                    </span>

                    <div>

                        <h3>
                            {completedTasks}
                        </h3>

                        <p>
                            Completed
                        </p>

                    </div>

                </div>

            </section>


            {/* ==================================================
                MESSAGES
            ================================================== */}

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


            {/* ==================================================
                CREATE / EDIT TASK
            ================================================== */}

            <section className="task-form-section">

                <h2>

                    {editingTask
                        ? "Edit Task"
                        : "Create a New Task"
                    }

                </h2>


                <form
                    onSubmit={
                        editingTask
                            ? handleUpdateTask
                            : handleCreateTask
                    }
                    className="task-form"
                >

                    <input
                        type="text"
                        value={title}
                        onChange={(event) =>
                            setTitle(event.target.value)
                        }
                        placeholder="What needs to be done?"
                    />


                    <textarea
                        value={description}
                        onChange={(event) =>
                            setDescription(event.target.value)
                        }
                        placeholder="Add a description..."
                        rows="3"
                    />


                    <div className="form-actions">

                        <button
                            type="submit"
                            className="primary-button"
                        >

                            {editingTask
                                ? "Update Task"
                                : "Add Task"
                            }

                        </button>


                        {editingTask && (

                            <button
                                type="button"
                                className="secondary-button"
                                onClick={handleCancelEdit}
                            >
                                Cancel
                            </button>

                        )}

                    </div>

                </form>

            </section>


            {/* ==================================================
                TASK LIST
            ================================================== */}

            <section className="tasks-section">

                <div className="tasks-header">

                    <h2>
                        Your Tasks
                    </h2>


                    <div className="filter-buttons">

                        <button
                            className={
                                filter === "all"
                                    ? "filter-button active"
                                    : "filter-button"
                            }
                            onClick={() =>
                                setFilter("all")
                            }
                        >
                            All
                        </button>


                        <button
                            className={
                                filter === "pending"
                                    ? "filter-button active"
                                    : "filter-button"
                            }
                            onClick={() =>
                                setFilter("pending")
                            }
                        >
                            Pending
                        </button>


                        <button
                            className={
                                filter === "completed"
                                    ? "filter-button active"
                                    : "filter-button"
                            }
                            onClick={() =>
                                setFilter("completed")
                            }
                        >
                            Completed
                        </button>

                    </div>

                </div>


                {/* LOADING */}

                {loading && (

                    <div className="empty-state">

                        <p>
                            Loading your tasks...
                        </p>

                    </div>

                )}


                {/* NO TASKS */}

                {!loading &&
                    filteredTasks.length === 0 && (

                        <div className="empty-state">

                            <div className="empty-icon">
                                📝
                            </div>

                            <h3>
                                No tasks here
                            </h3>

                            <p>
                                Create a task and start
                                getting things done!
                            </p>

                        </div>

                    )
                }


                {/* TASKS */}

                {!loading &&
                    filteredTasks.length > 0 && (

                        <div className="task-list">

                            {filteredTasks.map((task) => (

                                <div
                                    key={task._id}
                                    className={
                                        task.completed
                                            ? "task-card completed"
                                            : "task-card"
                                    }
                                >


                                    {/* CHECKBOX */}

                                    <button
                                        className="task-check"
                                        onClick={() =>
                                            handleToggleComplete(
                                                task
                                            )
                                        }
                                    >

                                        {task.completed
                                            ? "✓"
                                            : ""
                                        }

                                    </button>


                                    {/* TASK CONTENT */}

                                    <div className="task-content">

                                        <h3>
                                            {task.title}
                                        </h3>


                                        {task.description && (

                                            <p>
                                                {task.description}
                                            </p>

                                        )}


                                        <small>

                                            Created{" "}

                                            {new Date(
                                                task.createdAt
                                            ).toLocaleDateString()}

                                        </small>

                                    </div>


                                    {/* ACTIONS */}

                                    <div className="task-actions">

                                        <button
                                            className="edit-button"
                                            onClick={() =>
                                                handleEditClick(
                                                    task
                                                )
                                            }
                                        >
                                            Edit
                                        </button>


                                        <button
                                            className="delete-button"
                                            onClick={() =>
                                                handleDeleteTask(
                                                    task._id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )
                }

            </section>


            {/* ==================================================
                LOGOUT
            ================================================== */}

            <div className="dashboard-footer">

                <button
                    className="logout-dashboard-button"
                    onClick={onLogout}
                >
                    Logout
                </button>

            </div>

        </div>

    );

}

export default Dashboard;