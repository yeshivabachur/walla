/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import DeveloperNexus from './pages/DeveloperNexus';
import DriverAnalytics from './pages/DriverAnalytics';
import DriverDashboard from './pages/DriverDashboard';
import DriverEarnings from './pages/DriverEarnings';
import DriverLoyalty from './pages/DriverLoyalty';
import DriverOnboarding from './pages/DriverOnboarding';
import DriverPayouts from './pages/DriverPayouts';
import DriverSettings from './pages/DriverSettings';
import DriverTraining from './pages/DriverTraining';
import GalacticMarketplace from './pages/GalacticMarketplace';
import Home from './pages/Home';
import HomeScreen from './pages/HomeScreen';
import InstitutionalCommand from './pages/InstitutionalCommand';
import Layout from './pages/Layout';
import MissionControl from './pages/MissionControl';
import MyRides from './pages/MyRides';
import OfferRide from './pages/OfferRide';
import Packages from './pages/Packages';
import PassengerPreferences from './pages/PassengerPreferences';
import PassengerRideHistory from './pages/PassengerRideHistory';
import Preferences from './pages/Preferences';
import RequestRide from './pages/RequestRide';
import SendPackage from './pages/SendPackage';
import SovereigntyTransparency from './pages/SovereigntyTransparency';
import SupportChat from './pages/SupportChat';
import TrackRequest from './pages/TrackRequest';
import TrackRide from './pages/TrackRide';
import TranscendenceHub from './pages/TranscendenceHub';
import index from './pages/index';


export const PAGES = {
    "DeveloperNexus": DeveloperNexus,
    "DriverAnalytics": DriverAnalytics,
    "DriverDashboard": DriverDashboard,
    "DriverEarnings": DriverEarnings,
    "DriverLoyalty": DriverLoyalty,
    "DriverOnboarding": DriverOnboarding,
    "DriverPayouts": DriverPayouts,
    "DriverSettings": DriverSettings,
    "DriverTraining": DriverTraining,
    "GalacticMarketplace": GalacticMarketplace,
    "Home": Home,
    "HomeScreen": HomeScreen,
    "InstitutionalCommand": InstitutionalCommand,
    "Layout": Layout,
    "MissionControl": MissionControl,
    "MyRides": MyRides,
    "OfferRide": OfferRide,
    "Packages": Packages,
    "PassengerPreferences": PassengerPreferences,
    "PassengerRideHistory": PassengerRideHistory,
    "Preferences": Preferences,
    "RequestRide": RequestRide,
    "SendPackage": SendPackage,
    "SovereigntyTransparency": SovereigntyTransparency,
    "SupportChat": SupportChat,
    "TrackRequest": TrackRequest,
    "TrackRide": TrackRide,
    "TranscendenceHub": TranscendenceHub,
    "index": index,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
};