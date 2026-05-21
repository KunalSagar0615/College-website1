import React, {
    useEffect,
    useState,
    useContext
} from "react";

import axios from "axios";

import { AuthContext }
    from "../context/AuthContext.jsx";

const NOTIFICATION_API =
    "http://localhost:8081/api/notifications";

const GALLERY_API =
    "http://localhost:8081/api/gallery";

const USER_API =
    "http://localhost:8081/api/users";

const Dashboard = () => {

    const { user } = useContext(AuthContext);

    const [students, setStudents] = useState([]);

    const [notifications, setNotifications] =
        useState([]);

    const [images, setImages] =
        useState([]);

    const [admin, setAdmin] = useState({
        name: "",
        email: "",
        lastLogin: "Just now"
    });

    const [editProfile, setEditProfile] =
        useState(false);

    // ================= FETCH DATA =================
    useEffect(() => {

        const fetchData = async () => {

            try {

                const s =
                    await axios.get(
                        `${USER_API}/students`
                    );

                const n =
                    await axios.get(
                        `${NOTIFICATION_API}/all`
                    );

                const g =
                    await axios.get(
                        `${GALLERY_API}/all`
                    );

                setStudents(s.data || []);

                setNotifications(n.data || []);

                setImages(g.data || []);

            } catch (err) {

                console.log(
                    "Error loading dashboard data"
                );
            }
        };

        fetchData();

    }, []);

    // ================= LOAD ADMIN =================
    useEffect(() => {

        // 🔥 NEW ADMIN STORAGE
        const loggedAdmin =
            JSON.parse(
                localStorage.getItem("admin")
            );

        // 🔥 OLD USER STORAGE SUPPORT
        const loggedUser =
            JSON.parse(
                localStorage.getItem("user")
            );

        const current =
            loggedAdmin || loggedUser || user;

        if (current) {

            setAdmin({
                name:
                    current.name ||
                    "Unknown User",

                email:
                    current.email ||
                    "No Email",

                lastLogin:
                    "Just now"
            });
        }

    }, [user]);

    // ================= PROFILE CHANGE =================
    const handleProfileChange = (e) => {

        setAdmin({
            ...admin,
            [e.target.name]: e.target.value
        });
    };

    // ================= SAVE PROFILE =================
    const saveProfile = () => {

        // 🔥 LOCAL STORAGE UPDATE
        localStorage.setItem(
            "admin",
            JSON.stringify(admin)
        );

        setEditProfile(false);

        alert(
            "Profile Updated Successfully ✅"
        );
    };

    return (

        <div className="space-y-6">

            {/* HEADER */}
            <h1
                className="
                    text-2xl
                    font-bold
                    text-gray-800
                "
            >
                Admin Dashboard
            </h1>

            {/* PROFILE + LOGIN */}
            <div
                className="
                    grid
                    md:grid-cols-2
                    gap-6
                "
            >

                {/* PROFILE */}
                <div
                    className="
                        bg-white
                        p-6
                        shadow
                        rounded-lg
                    "
                >

                    <h2
                        className="
                            text-lg
                            font-bold
                            mb-4
                        "
                    >
                        👤 Profile
                    </h2>

                    {!editProfile ? (

                        <div className="space-y-2">

                            <p>
                                <b>Name:</b>
                                {" "}
                                {admin.name}
                            </p>

                            <p>
                                <b>Email:</b>
                                {" "}
                                {admin.email}
                            </p>

                            <button
                                onClick={() =>
                                    setEditProfile(true)
                                }

                                className="
                                    mt-4
                                    bg-blue-600
                                    text-white
                                    px-4
                                    py-2
                                    rounded
                                "
                            >
                                Edit Profile
                            </button>

                        </div>

                    ) : (

                        <div className="space-y-3">

                            <input
                                name="name"
                                value={admin.name}
                                onChange={
                                    handleProfileChange
                                }

                                className="
                                    border
                                    p-2
                                    w-full
                                    rounded
                                "

                                placeholder="Name"
                            />

                            <input
                                name="email"
                                value={admin.email}
                                onChange={
                                    handleProfileChange
                                }

                                className="
                                    border
                                    p-2
                                    w-full
                                    rounded
                                "

                                placeholder="Email"
                            />

                            <div className="flex gap-2">

                                <button
                                    onClick={saveProfile}

                                    className="
                                        bg-green-600
                                        text-white
                                        px-4
                                        py-2
                                        rounded
                                    "
                                >
                                    Save
                                </button>

                                <button
                                    onClick={() =>
                                        setEditProfile(false)
                                    }

                                    className="
                                        bg-gray-500
                                        text-white
                                        px-4
                                        py-2
                                        rounded
                                    "
                                >
                                    Cancel
                                </button>

                            </div>

                        </div>
                    )}

                </div>

                {/* LOGIN ACTIVITY */}
                <div
                    className="
                        bg-white
                        p-6
                        shadow
                        rounded-lg
                    "
                >

                    <h2
                        className="
                            text-lg
                            font-bold
                            mb-4
                        "
                    >
                        🔐 Login Activity
                    </h2>

                    <p>
                        <b>Last Login:</b>
                        {" "}
                        {admin.lastLogin}
                    </p>

                    <p className="text-green-600 mt-2">
                        Active Session: Yes
                    </p>

                </div>

            </div>

            {/* STATS */}
            <div
                className="
                    grid
                    md:grid-cols-3
                    gap-6
                "
            >

                {/* STUDENTS */}
                <div
                    className="
                        bg-white
                        p-6
                        shadow
                        rounded
                        text-center
                        hover:shadow-lg
                        transition
                    "
                >

                    <h2
                        className="
                            text-blue-600
                            font-bold
                        "
                    >
                        Students
                    </h2>

                    <p className="text-3xl">
                        {students.length}
                    </p>

                </div>

                {/* NOTIFICATIONS */}
                <div
                    className="
                        bg-white
                        p-6
                        shadow
                        rounded
                        text-center
                        hover:shadow-lg
                        transition
                    "
                >

                    <h2
                        className="
                            text-yellow-600
                            font-bold
                        "
                    >
                        Notifications
                    </h2>

                    <p className="text-3xl">
                        {notifications.length}
                    </p>

                </div>

                {/* GALLERY */}
                <div
                    className="
                        bg-white
                        p-6
                        shadow
                        rounded
                        text-center
                        hover:shadow-lg
                        transition
                    "
                >

                    <h2
                        className="
                            text-purple-600
                            font-bold
                        "
                    >
                        Gallery
                    </h2>

                    <p className="text-3xl">
                        {images.length}
                    </p>

                </div>

            </div>

        </div>
    );
};

export default Dashboard;