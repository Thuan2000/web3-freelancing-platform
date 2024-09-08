import { createContext, useState, useContext } from "react";
import PropTypes from "prop-types";

const JobsSearchContext = createContext(undefined);

export const JobsSearchProvider = ({ children }) => {
  const [selectedJob, setSelectedJob] = useState(null);

  return (
    <JobsSearchContext.Provider
      value={{ selectedJob, setSelectedJob }}
    >
      {children}
    </JobsSearchContext.Provider>
  );
};

JobsSearchProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useJobsSearch = () => {
  const context = useContext(JobsSearchContext);
  if (context === undefined) {
    throw new Error("useJobsSearch must be used within a JobsSearchProvider");
  }
  return context;
};
