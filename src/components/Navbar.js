import React, { useContext, useEffect, useState } from 'react';
import style from './style/Navbar.css';
import { useLocation, useNavigate } from 'react-router-dom';
import realimage from './style/PartnurUp.png';
import searchbtn from './style/search-interface-symbol.png';
import { Link } from 'react-router-dom';

const Navbar = () => {
    let navigate = useNavigate();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState(sessionStorage.getItem('category') || '');
    const [Result, setResult] = useState(sessionStorage.getItem('Result') === 'true'); // Retrieve Result state
    const [notification, setNotification] = useState(false); // Retrieve Result state

    const token = sessionStorage.getItem('token');

    useEffect(() => {
        // Store Result in sessionStorage
        sessionStorage.setItem('Result', Result);
    }, [Result]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleClick1 = () => {
        if (searchTerm.trim() !== "") {
            sessionStorage.setItem('category', searchTerm);
            setResult(true);
            window.location.reload();
        }

        else {
            // Optionally, you could provide some feedback to the user here
            console.log("Search term is empty. Cannot perform search.");
        }
        if(location.pathname!=='/post'){
            navigate('/post')
            window.location.reload();
        }

    };
    const handleClick2 = () => {
        sessionStorage.removeItem('category');
        setSearchTerm(''); // Clear the search input
        setResult(false);
        window.location.reload();
    };

    const logout = () => {
        sessionStorage.clear();
        navigate('/');
    };
    const handleNotifications = () => {
        const newNotificationState = !notification; // Toggle the notification state
        setNotification(newNotificationState);
        sessionStorage.setItem("notification", newNotificationState); // Update sessionStorage after state change
        window.location.reload(); // This will cause the Post component to re-render with the new state
    }
    

    return (
        <div className='nav-main-container' style={location.pathname === '/' || location.pathname === '/paartnup' || location.pathname === '/post' || location.pathname === '/user-profile' || location.pathname==='/your-profile'? style : { display: 'none' }}>
            <div className="nav-first-container">
                <ul>
                    <img src={realimage} id='nav-logo' width={'50vw'} alt="an 3d art view" />
                    <li id='Logo'>
                        Project Pals
                    </li>
                    <li>
                        <div className="nav-search">
                            <input
                                type="text"
                                id='search-input'
                                placeholder='Filter out your project category... '
                                value={searchTerm}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleClick1(); // Trigger the search when Enter is pressed
                                    }
                                }}
                                onChange={handleSearch}
                            />
<img
    src={searchbtn}
    alt="button for searching"
    style={{
        display: Result ? "none" : "block",
        cursor: searchTerm.trim() === "" ? "not-allowed" : "pointer",
        opacity: searchTerm.trim() === "" ? 0.5 : 1
    }}
    onClick={searchTerm.trim() !== "" ? handleClick1 : null}
/>

                            <button
                                style={Result ? { display: "block" } : { display: "none" }}
                                onClick={handleClick2} className='Navbar_x'
                            >
                                X
                            </button>
                        </div>
                    </li>
                    <li></li>
                    <li className='nav-list' onClick={handleNotifications}>
                        Notifications
                    </li>
                    {/* <li className='nav-list'>
                        <Link to={'/aboutus'}>About us</Link>
                    </li> */}
                    <li className='nav-list'>
                        <Link to={'/post'}>Posts</Link>
                    </li>
                    <li className='nav-list'>
                        <Link to={'/message'}>Messages</Link>
                    </li>
                    <li id='options'>
                        Options
                    </li>
                    {!(sessionStorage.getItem('token')) ? (
                        <div className='signup-button'>
                            <ul>
                                <li className="nav-signup ">
                                    <Link to={'/signup'}>
                                        <button className='nav-signup'>Sign Up</button>
                                    </Link>
                                </li>
                                <li className="nav-signup">
                                    <Link to={'/login'}>
                                        <button className='nav-signup'>Login</button>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <ul>
                            <li className='your-account'>
                            <Link to={'/your-profile'}>
                                        Your Account
                                    </Link>
                            </li>
                            <li className='nav-signup'>
                                <button className='nav-signup' onClick={logout}>Logout</button>
                            </li>
                        </ul>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
