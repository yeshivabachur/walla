import Layout from "./Layout.jsx";
import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

import DriverAnalytics from "./DriverAnalytics";
import DriverDashboard from "./DriverDashboard";
import DriverEarnings from "./DriverEarnings";
import DriverLoyalty from "./DriverLoyalty";
import DriverOnboarding from "./DriverOnboarding";
import DriverTraining from "./DriverTraining";
import Home from "./Home";
import HomeScreen from "./HomeScreen";
import MissionControl from "./MissionControl";
import MyRides from "./MyRides";
import Packages from "./Packages";
import PassengerPreferences from "./PassengerPreferences";
import PassengerRideHistory from "./PassengerRideHistory";
import Preferences from "./Preferences";
import RequestRide from "./RequestRide";
import SendPackage from "./SendPackage";
import TrackRequest from "./TrackRequest";
import TrackRide from "./TrackRide";
import TranscendenceHub from "./TranscendenceHub";

import { BrowserRouter as Router, Route, Routes, useLocation, Navigate, useParams } from 'react-router-dom';

const PAGES = {
    DriverAnalytics,
    DriverDashboard,
    DriverEarnings,
    DriverLoyalty,
    DriverOnboarding,
    DriverTraining,
    Home,
    MissionControl,
    MyRides,
    Packages,
    PassengerPreferences,
    PassengerRideHistory,
    Preferences,
    RequestRide,
    SendPackage,
    TrackRequest,
    TrackRide,
    TranscendenceHub,
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || 'Home';
}

function SmartRootRedirect() {
    const [user, setUser] = useState(undefined);
    useEffect(() => {
        base44.auth.me().then(setUser).catch(() => setUser(null));
    }, []);

    if (user === undefined) return null; // Loading
    if (!user) return <Home />; // Show landing page if not logged in
    return <HomeScreen />; // Show hub if logged in
}

function LegacyPageRedirect() {
    const { legacy } = useParams();
    const legacyStr = (legacy || "").toString();
    if (!legacyStr) return <Navigate to="/" replace />;

    const norm = legacyStr.toLowerCase().replace(/-/g, "");
    const match = Object.keys(PAGES).find((k) => {
        const kl = k.toLowerCase();
        return kl === legacyStr.toLowerCase() || kl.replace(/-/g, "") === norm;
    });

    if (match) return <Navigate to={`/${match}`} replace />;
    return <Navigate to="/" replace />;
}


// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                <Route path="/" element={<SmartRootRedirect />} />
                
                <Route path="/DriverAnalytics" element={<DriverAnalytics />} />
                <Route path="/DriverDashboard" element={<DriverDashboard />} />
                <Route path="/DriverEarnings" element={<DriverEarnings />} />
                <Route path="/DriverLoyalty" element={<DriverLoyalty />} />
                <Route path="/DriverOnboarding" element={<DriverOnboarding />} />
                <Route path="/DriverTraining" element={<DriverTraining />} />
                <Route path="/Home" element={<HomeScreen />} />
                <Route path="/Landing" element={<Home />} />
                <Route path="/MissionControl" element={<MissionControl />} />
                <Route path="/MyRides" element={<MyRides />} />
                <Route path="/Packages" element={<Packages />} />
                <Route path="/PassengerPreferences" element={<PassengerPreferences />} />
                <Route path="/PassengerRideHistory" element={<PassengerRideHistory />} />
                <Route path="/Preferences" element={<Preferences />} />
                <Route path="/RequestRide" element={<RequestRide />} />
                <Route path="/SendPackage" element={<SendPackage />} />
                <Route path="/TrackRequest" element={<TrackRequest />} />
                <Route path="/TrackRide" element={<TrackRide />} />
                <Route path="/TranscendenceHub" element={<TranscendenceHub />} />
                <Route path="/:legacy" element={<LegacyPageRedirect />} />
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}