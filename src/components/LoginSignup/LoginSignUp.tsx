import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';

const LoginSignupTabs: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newIndex: number) => {
    setTabIndex(newIndex);
  };

  const tabStyle: React.CSSProperties = {
    color: 'black',
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "80vh",
      background: "rgb(202, 240, 248)",
      flexDirection: "column",
      margin: "20px",
      borderRadius: "18px",
    }}>
      <h1 style={{ color: "black", fontSize: "30px", marginBottom: "30px" }}>Welcome to Agile Track</h1>

      <div style={{ width: "350px", textAlign: "center", background: "#ffffff", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", overflow: "hidden" }}>
        <div style={{ padding: "20px", height: "350px", overflowY: "auto" }}>
          <div style={{ marginBottom: "10px" }}>
            <button style={{ ...tabStyle, backgroundColor: tabIndex === 0 ? "#ccc" : "transparent", border: "none", padding: "10px", cursor: "pointer", borderRadius: "5px", marginRight: "10px" }} onClick={(e) => handleChange(e, 0)}>Login</button>
            <button style={{ ...tabStyle, backgroundColor: tabIndex === 1 ? "#ccc" : "transparent", border: "none", padding: "10px", cursor: "pointer", borderRadius: "5px" }} onClick={(e) => handleChange(e, 1)}>Sign Up</button>
          </div>
          {tabIndex === 0 && <Login />}
          {tabIndex === 1 && <Signup />}
        </div>
      </div>
    </div>
  );



};

// interface TabPanelProps {
//   children?: React.ReactNode;
//   index: number;
//   value: number;
// }

// const TabPanel: React.FC<TabPanelProps> = ({ children, index, value }) => {
//   return (
//     <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`}>
//       {value === index && <div>{children}</div>}
//     </div>
//   );
// };

export default LoginSignupTabs;
