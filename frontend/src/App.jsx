import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import JobsSearchPage from "@/pages/JobsSearch.page";
import { ContractProvider } from "@/contexts/Contract.context";
import { AuthProvider } from "@/contexts/Auth.context";
import { JobsSearchProvider } from "@/pages/__contexts__/JobsSearch.context";
import JobsManagementPage from "@/pages/JobsManagement.page";
import SignUpPage from "@/pages/SignUp.page";
import TestPage from "@/pages/Test.page";
import InConflictsPage from "@/pages/InConflicts.page";

const App = () => {
  return (
    <ContractProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route
                path="/"
                element={
                  <JobsSearchProvider>
                    <JobsSearchPage />
                  </JobsSearchProvider>
                }
              />
              <Route path="/" element={<div>Testing</div>} />
              <Route path="/jobs-management" element={<JobsManagementPage />} />
              <Route path="/test" element={<TestPage />} />
              <Route
                path="/in-conflicts"
                element={<InConflictsPage />}
              />
              <Route path="/sign-up" element={<SignUpPage />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ContractProvider>
  );
};

export default App;
