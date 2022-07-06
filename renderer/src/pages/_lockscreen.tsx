import React from "react";

 const LockScreen = () => {
  return (
    <div className="pin-login" id="mainPinLogin">
      <input type="password" className="pin-login__text" />
      <div className="pin-login__numpad"></div>
    </div>
  );
};

export default LockScreen;
