import React, { useMemo } from "react";
import PhoneControllerApp from "./components/Controller/PhoneControllerApp";
import LaptopGameApp from "./components/Game/LaptopGameApp";
import "./index.css";

export default function App() {
  const isPhoneController = useMemo(() => {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search);
    if (params.get("controller") === "1") return true;
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }, []);

  return isPhoneController ? <PhoneControllerApp /> : <LaptopGameApp />;
}
