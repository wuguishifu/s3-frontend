import { Route, Routes } from "react-router-dom";
import { Landing } from "./pages";
import { Setup } from "./pages/Setup";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/setup" element={<Setup />} />
        </Routes>
    );
};