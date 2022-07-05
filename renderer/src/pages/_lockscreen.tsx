import React from "react";

export const _lockscreen = () => {
  return (
    <div className="pin-login" id="mainPinLogin">
      <input type="password" className="pin-login__text" />
      <div className="pin-login__numpad"></div>
    </div>
  );
};
