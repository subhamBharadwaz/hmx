import React from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../store/auth/auth-slice";
import { AppDispatch } from "../../store";
import { useEffect } from "react";

export default function Index() {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div>
      <button onClick={() => dispatch(logoutUser())}>Logout</button>
    </div>
  );
}
