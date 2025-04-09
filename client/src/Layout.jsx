import React from "react";
import theme from "./theme"; // Import the theme file

const Layout = ({ children }) => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      backgroundColor: theme.body.backgroundColor, 
      color: theme.body.color, 
      fontFamily: theme.body.fontFamily, 
      margin: theme.body.margin, 
      padding: theme.body.padding 
    }}>
      {children}
    </div>
  );
};

export default Layout; 