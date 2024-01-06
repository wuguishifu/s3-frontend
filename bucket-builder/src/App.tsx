import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Landing } from "./pages";
import { Setup } from "./pages/Setup";

export default function App() {
    const location = useLocation();
    useEffect(() => {
        document.querySelector('body')?.scrollTo(0, 0);
    }, [location]);

    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/setup" element={<Setup />} />
        </Routes>
    );
};