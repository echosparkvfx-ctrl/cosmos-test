import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import React from "react";

import Navbar from "./Navbar.jsx";
import Hero from "./Hero.jsx";
import About from "./About.jsx";
import Services from "./Services.jsx";
import WhyUs from "./WhyUs.jsx";
import Contact from "./Contact.jsx";
import Careers from "./Careers.jsx";
import Footer from "./Footer.jsx";
import Training from "./Training.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import RecruiterDashboard from "./RecruiterDashboard.jsx";
import VendorDashboard from "./VendorDashboard.jsx";
import ApplicantDashboard from "./ApplicantDashboard.jsx";
import ApplicantProfile from "./ApplicantProfile.jsx";
import RequestAccess from "./RequestAccess.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import ResetPassword from "./ResetPassword.jsx";
import ScrollToHash from "./ScrollToHash.jsx";

function Home() {
    return (
        <>
            <Hero />
            <About />
            <Services />
            <WhyUs />
            <Contact />
            <Careers />
        </>
    );
}

export default function App() {
    const location = useLocation();
    const navigate  = useNavigate();

    // Detect Supabase password recovery / invite redirect — preserve hash so Supabase can parse tokens
    React.useEffect(() => {
        const hash = window.location.hash;
        if (hash.includes("type=recovery") || hash.includes("type=invite")) {
            navigate("/reset-password" + hash, { replace: true });
        }
    }, []);

    // Dashboard pages get their own app navbar — hide site navbar & footer
    const isDashboard = location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/profile");
    const isAuth = location.pathname.startsWith("/login") || location.pathname.startsWith("/register") || location.pathname.startsWith("/request-access") || location.pathname.startsWith("/reset-password");

    return (
        <>
            {!isDashboard && <Navbar />}
            <ScrollToHash />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/training" element={<Training />} />
                <Route path="/login" element={<Login />} />
                <Route path="/login/:role" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard/applicant" element={<ApplicantDashboard />} />
                <Route path="/profile/applicant" element={<ApplicantProfile />} />
                <Route path="/request-access/:role" element={<RequestAccess />} />
                <Route path="/dashboard/admin" element={<AdminDashboard />} />
                <Route path="/dashboard/recruiter" element={<RecruiterDashboard />} />
                <Route path="/dashboard/vendor" element={<VendorDashboard />} />
                <Route path="/reset-password" element={<ResetPassword />} />
            </Routes>
            {!isDashboard && !isAuth && <Footer />}
        </>
    );
}
