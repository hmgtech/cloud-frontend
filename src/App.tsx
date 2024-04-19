import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import KanbanBoard from './components/KanbanBoard';
import LoginSignupTabs from './components/LoginSignup/LoginSignUp';
import Navbar from './components/LoginSignup/Navbar/Navbar';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { BASE_URL } from "../config.ts";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [ownedBoards, setOwnedBoards] = useState([]);
  const [sharedBoards, setSharedBoards] = useState([]);
  const [currentBoard, setCurrentBoard] = useState(null);
  const [isAddingBoard, setIsAddingBoard] = useState(false);
  const [, setBoardTitle] = useState(""); // Add state for board title

  const history = useHistory();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(`${BASE_URL}/protected`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            setIsLoggedIn(true);
            fetchBoards(token);
          } else {
            setIsLoggedIn(false);
            history.push('/');
          }
        } catch (error) {
          console.error('Error validating token:', error);
          setIsLoggedIn(false);
          history.push('/');
        }
      } else {
        setIsLoggedIn(false);
        history.push('/');
      }
    };

    validateToken();
  }, [history]);

  const fetchBoards = async (token) => {
    try {
      const response = await fetch(`${BASE_URL}/get_boards`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setOwnedBoards(data.owned_boards);
      setSharedBoards(data.shared_boards);
    } catch (error) {
      console.error("Error fetching boards:", error);
    }
  };

  const handleAddBoard = async () => {
    try {
      setIsAddingBoard(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/add_board`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to add board');
      }
      fetchBoards(token);
    } catch (error) {
      console.error("Error adding board:", error);
    } finally {
      setIsAddingBoard(false);
    }
  };
  const updateBoardTitle = (newTitle) => {
    setBoardTitle(newTitle);
    console.log(newTitle);

  };

  return (
    <Router>
      <div>
        <Navbar ownedBoards={ownedBoards} />
        <Switch>
          <Route exact path="/">
            <div className="flex justify-center mt-4 overflow-x-auto m-auto">
              <div className="flex flex-shrink-0">
                {ownedBoards.map((board) => (
                  <div key={board.id} onClick={() => setCurrentBoard(board)} className="flex items-center justify-center mx-2 cursor-pointer">
                    <div className="rounded-md text-black font-bold flex items-center justify-center p-4" style={{ background: "#90e0ef" }}>
                      {board.title}
                    </div>
                  </div>
                ))}
                {sharedBoards.map((board) => (
                  <div key={board.id} onClick={() => setCurrentBoard(board)} className="flex items-center justify-center mx-2 cursor-pointer">
                    <div className="rounded-md text-black font-bold flex items-center justify-center p-4" style={{ background: "#90e0ef" }}>
                      {board.title} (Shared With You)
                    </div>
                  </div>
                ))}
              </div>
              {isLoggedIn && (
                <button onClick={handleAddBoard} className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md ml-4" style={{ background: "#0077b6", minWidth: "100px" }}>
                  {isAddingBoard ? 'Adding...' : '+ Add Board'}
                </button>
              )}
            </div>

            <div style={{ background: "#caf0f8", marginTop: "20px", margin: "20px", borderRadius: "12px" }}>
              {isLoggedIn ? (
                currentBoard ? (
                  <KanbanBoard key={currentBoard.id} boards={currentBoard} onUpdateTitle={updateBoardTitle} />
                ) : (
                  <div className="flex justify-center items-center mt-4" style={{ height: "75vh", fontSize: "24px", color: 'black' }}>
                    <p>Please select a board from above.</p>
                  </div>
                )
              ) : (
                <div className="flex justify-center items-center mt-4" style={{ height: "75vh", fontSize: "24px", color: 'black' }}>
                  <p>Please login first.</p>
                </div>
              )}
            </div>
          </Route>
          <Route exact path="/login" component={LoginSignupTabs} />
        </Switch>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
