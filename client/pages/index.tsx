import Head from "next/head";
import Image from "next/image";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { userDetails } from "../store/auth/auth-slice";
import setAuthToken from "../utils/setAuthToken";

let tokenFromLocalStorage: string;
if (typeof window !== "undefined") {
  // Perform localStorage action
  tokenFromLocalStorage = localStorage.getItem("token");
}

if (tokenFromLocalStorage) {
  setAuthToken(tokenFromLocalStorage);
}

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(userDetails());
  }, []);
  return (
    <div>
      <h1>HMX</h1>
    </div>
  );
}
