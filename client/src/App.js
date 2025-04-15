import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ProfilePage from "./pages/ProfilePage";
import Feed from "./pages/Feed";
import Chat from "./pages/Chat";
import DiscussionForum from "./pages/DiscussionForum";
import CourseReview from "./pages/CourseReview";
import OtherProfilePage from "./pages/OtherProfilePage";
import SearchPage from "./pages/SearchPage";
import DiscussionView from "./pages/discussionView";
import CourseView from "./pages/courseView";
import { Navigate } from "react-router-dom";
import EditProfileCard from "./components/ProfilePage/EditProfileCard";
import GroupChat from "./pages/GroupChat";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import Communities from "./pages/Communities";
import CommunityView from "./pages/CommunityView";
import CreateCommunity from "./pages/CreateCommunity";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext } from "react";

// Protected route wrapper component
function ProtectedRoute({ children }) {
  const { currentUser, loading } = useContext(AuthContext);
  
  // Show nothing while checking authentication status
  if (loading) return null;
  
  // Redirect to signin if not authenticated
  if (!currentUser) return <Navigate to="/signin" />;
  
  // If authenticated, render the children
  return children;
}

function AppRoutes() {
  const { currentUser, loading } = useContext(AuthContext);
  
  // Don't render anything while checking auth state
  if (loading) return <div>Loading...</div>;
  
  return (
    <Routes>
      {/* Public routes - accessible to everyone */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      
      {/* Protected routes - require authentication */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
      <Route path="/feed" element={
        <ProtectedRoute>
          <Feed />
        </ProtectedRoute>
      } />
      <Route path="/profile/:id" element={
        <ProtectedRoute>
          <OtherProfilePage />
        </ProtectedRoute>
      } />
      <Route path="/discussion" element={
        <ProtectedRoute>
          <DiscussionForum />
        </ProtectedRoute>
      } />
      <Route path="/discussionView" element={
        <ProtectedRoute>
          <DiscussionView />
        </ProtectedRoute>
      } />
      <Route path="/communities" element={
        <ProtectedRoute>
          <Communities />
        </ProtectedRoute>
      } />
      <Route path="/community/:id" element={
        <ProtectedRoute>
          <CommunityView />
        </ProtectedRoute>
      } />
      <Route path="/create-community" element={
        <ProtectedRoute>
          <CreateCommunity />
        </ProtectedRoute>
      } />
      <Route path="/courseReview" element={
        <ProtectedRoute>
          <CourseReview />
        </ProtectedRoute>
      } />
      <Route path="/search" element={
        <ProtectedRoute>
          <SearchPage />
        </ProtectedRoute>
      } />
      <Route path="/courseView" element={
        <ProtectedRoute>
          <CourseView />
        </ProtectedRoute>
      } />
      <Route path="/community" element={
        <ProtectedRoute>
          <GroupChat />
        </ProtectedRoute>
      } />
      <Route path="/editProfile" element={
        <ProtectedRoute>
          <EditProfileCard />
        </ProtectedRoute>
      } />
      
      {/* Catch all other routes */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
