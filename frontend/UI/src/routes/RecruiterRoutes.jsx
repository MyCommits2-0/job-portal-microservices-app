import { Route } from "react-router-dom";
import RecruiterLayout from "../components/layout/RecruiterLayout";
import { Navigate } from "react-router-dom";
import RecruiterDashboard from "../pages/recruiter/RecruiterDashboard";
import PostJob from "../pages/recruiter/PostJob";
import MyJobs from "../pages/recruiter/MyJobs";
import Applications from "../pages/recruiter/Applications";
import SavedCandidates from "../pages/recruiter/SavedCandidates";
import CandidateProfile from "../pages/recruiter/CandidateProfile";
import RecruiterSettings from "../pages/recruiter/RecruiterSettings";
import Home from "../pages/Home";
import FindCandidate from "../pages/recruiter/FindCandidates";
import RecruiterProfile from "../pages/recruiter/RecruiterProfile";


const RecruiterRoutes = (

  <Route path="/recruiter" element={<RecruiterLayout />}>
    <Route index element={<Navigate to="/recruiter/dashboard" />} />

    <Route path="dashboard" element={<RecruiterDashboard />} />
    <Route path="find-candidate" element={<FindCandidate />} />
    <Route path="post-job" element={<PostJob />} />
    <Route path="my-jobs" element={<MyJobs />} />
    <Route path="applications/:jobId" element={<Applications />} />
    <Route path="settings" element={<RecruiterSettings />} />
    <Route path="saved-candidates" element={<SavedCandidates />} />
    <Route path="candidate-profile/:id" element={<CandidateProfile />} />
    <Route path="recruiter/edit-job/:jobId" element={<PostJob />} />
    <Route path="profile" element={<RecruiterProfile />} />
  </Route>
  
);

export default RecruiterRoutes;