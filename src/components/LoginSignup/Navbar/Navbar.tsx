import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Navbar.css';

const Navbar = ({ ownedBoards }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [showInvitePopup, setShowInvitePopup] = useState(false);
    const [userName, setUserName] = useState('');
    const history = useHistory();
    const token = localStorage.getItem('token');
    const [selectedBoard, setSelectedBoard] = useState(null);
    const [hasFetchedUserDetails, setHasFetchedUserDetails] = useState(false);
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://3.89.195.15/get_user_details', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserName(data.name);
                    setGreeting(getGreeting());
                } else {
                    throw new Error('Failed to fetch user details');
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
                toast.error('Failed to fetch user details');
            } finally {
                setHasFetchedUserDetails(true);
            }
        };

        if (token && !hasFetchedUserDetails) {
            fetchUserDetails();
        }
    }, [token, hasFetchedUserDetails]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) {
            return 'Good Morning';
        } else if (hour >= 12 && hour < 18) {
            return 'Good Afternoon';
        } else {
            return 'Good Evening';
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        // Reload the entire page
        window.location.reload();
    };

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    const handleInviteClick = () => {
        setShowInvitePopup(true);
    };

    const handleInviteSubmit = async () => {
        try {
            // Fetch token from localStorage
            const token = localStorage.getItem('token');

            // Prepare payload
            const payload = {
                board_id: selectedBoard,
                invitee_email: inviteEmail
            };

            // Send POST request with bearer token
            const response = await fetch('http://3.89.195.15/share_board', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Include bearer token in request headers
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                // Get error message from response body
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            const data = await response.json();
            toast.success(data.message);
            setInviteEmail('');
            setShowInvitePopup(false);
        } catch (error) {
            toast.error(error.message || 'Failed to share board');
        }
    };

    const handleCancel = () => {
        setShowInvitePopup(false);
    };

    return (
        <nav className="navbar" style={{ backgroundColor: '#caf0f8', color: 'white', borderRadius: '8px', margin: '10px' }}>
            <div className="navbar-container">
                <div className="navbar-brand" style={{ color: "#000", fontSize: '20px' }}>Agile Track </div>

                <div style={{ fontSize: '16px', fontWeight: 'bold', color: "black", textAlign: 'center' }}>
                    {userName && <span style={{ fontWeight: 'bold' }}>Hello, {userName}!</span>} &nbsp; {greeting}
                </div>                {isMobile && (
                    <button className="navbar-toggle" onClick={toggleNavbar}>
                        <span className="navbar-icon">&#9776;</span>
                    </button>
                )}
                <div className={`navbar-links ${isMobile && isOpen ? 'active' : ''}`}>
                    {token ? (
                        <>
                            <button className="invite-button" onClick={handleInviteClick}>Invite a Friend</button>
                            <button className="logout-button" onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <button className="login-button" style={{ backgroundColor: '#0077B6', width: '120px', padding: '8px', borderRadius: '5px' }} onClick={() => history.push('/login')}>Login</button>
                    )}
                </div>
            </div>
            {/* Invite Popup */}
            {showInvitePopup && (
                <>
                    <div className={`backdrop ${showInvitePopup ? 'active' : ''}`} onClick={handleCancel}></div>
                    <div className={`invite-popup ${showInvitePopup ? 'active' : ''}`}>
                        <h3 style={{ color: "#0077b6" }}>Invite your friend</h3>
                        <select
                            value={selectedBoard}
                            onChange={(e) => setSelectedBoard(e.target.value)}
                            className="select-dropdown"
                        >
                            <option value="">Select Board</option>
                            {ownedBoards.map(board => (
                                <option key={board.id} value={board.id}>{board.title}</option>
                            ))}
                        </select>
                        <input style={{
                            border: '1px solid #0077b6', // Blue border
                            borderRadius: '5px',
                            padding: '8px',
                            marginTop: '10px', // Adjust as needed
                            width: '100%' // Adjust as needed
                        }} type="email" placeholder="Enter your friend's email address" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
                        <div className="button-container">
                            <button className="invite-submit" onClick={handleInviteSubmit}>Send Invite</button>
                            <button className="invite-cancel" onClick={handleCancel}>Cancel</button>
                        </div>
                    </div>
                </>
            )}
        </nav>
    );
};

export default Navbar;
