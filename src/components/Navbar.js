import React, { useEffect, useState } from 'react';
import style from './style/Navbar.css';
import { useLocation, useNavigate } from 'react-router-dom';
import realimage from './style/PartnurUp.png';
import searchbtn from './style/search-interface-symbol.png';
import { Link } from 'react-router-dom';
import Searchmodal from './Searchmodal';

const Navbar = () => {
    let navigate = useNavigate();
    const logout = () => {
        sessionStorage.clear();
        navigate('/');
    };

    let location = useLocation();
    const [modalResult, setModalResult] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = sessionStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const response = await fetch(`http://127.0.0.1:8000/api/accounts/search/${searchTerm}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();

                if (Array.isArray(data) && data.length > 0) {
                    setSearchResults(data);
                    console.log(data)
                    setModalResult(true);
                } else {
                    setSearchResults([]);
                    setModalResult(false);
                }

                if(setModalResult){
                    window.addEventListener('click',()=>{
                        setModalResult(false);
                    })
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (searchTerm.trim() !== '') {
            fetchData();
            // console.log(fetchData());
        } else {
            setSearchResults([]);
            setModalResult(false);
        }
    }, [searchTerm, token]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className='nav-main-container' style={location.pathname === '/' || location.pathname === '/paartnup' || location.pathname === '/post' || location.pathname === '/user-profile' ? style : { display: 'none' }} >
            <div className="nav-first-container">
                <ul>
                    <img src={realimage} id='nav-logo' width={'50vw'} alt="an 3d art view" />
                    <li id='Logo'>
                        Project Pals
                    </li>
                    <li>
                        <div className="nav-search">
                            <input type="text" placeholder='Search... ' value={searchTerm} onChange={handleSearch}/>
                            <img src={searchbtn} alt="button for searching" />
                        </div>
                    </li>
                    <li>

                    </li>
                    
                    
                    <li className= 'nav-list'>
                        <Link to={'/aboutus'}>About us</Link>
                    </li>
                    <li className= 'nav-list'>
                        <Link to={'/post'}>Posts</Link>
                    </li>
                    <li className= 'nav-list'>
                        <Link to={'/message'}>Messages</Link>
                    </li>
                    <li id='options'>
                        Options
                    </li>
                    {!(sessionStorage.getItem('token')) ? (
                        <div className='signup-button'>
                            <ul>
                                <li className="nav-signup ">
                                    <Link to={'/signup'}><button className='nav-signup'>Sign Up</button></Link>
                                </li>
                                <li className="nav-signup">
                                    <Link to={'/login'}><button className='nav-signup'>Login</button></Link>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <ul>
                        {/*<li className='your-account'>
                            Your account
                            {/* <div className='circle'></div> */}
                        {/*</li>*/}
                        <li className='nav-signup'><button className='nav-signup' onClick={logout}>Logout</button></li>
                        </ul>

                    )}
                   

                </ul>
            </div>
            <div className="search-modal">
            {searchResults.length > 0 && searchResults.map((element) => (
        <Searchmodal key={element.id} modalResult={modalResult} realresult={element}/>
    ))}

            </div>
        </div>
    );
};

export default Navbar;
