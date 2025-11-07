import React, { useState } from "react";
import Login from "./Login";
import Payment from "./Payment";

function App() {
  const [page, setPage] = useState("login");
  const [currentUser, setCurrentUser] = useState(null);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setPage("payment");
  };

  const renderPage = () => {
    switch (page) {
      case "login":
        return <Login onLoginSuccess={handleLoginSuccess} />;
      case "payment":
        if (!currentUser)
          return (
            <p style={{ textAlign: "center", marginTop: "50px" }}>
              Please log in first
            </p>
          );
        return <Payment />;
      default:
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }
  };

  const buttonStyle = {
    margin: "0 10px",
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  };

  const buttonContainerStyle = {
    textAlign: "center",
    marginTop: "20px",
    marginBottom: "20px",
  };

  return (
    <div>
      <div style={buttonContainerStyle}>
        <button style={buttonStyle} onClick={() => setPage("login")}>
          Login
        </button>
        <button style={buttonStyle} onClick={() => setPage("payment")}>
          Payment
        </button>
      </div>
      {renderPage()}
    </div>
  );
}

export default App;
