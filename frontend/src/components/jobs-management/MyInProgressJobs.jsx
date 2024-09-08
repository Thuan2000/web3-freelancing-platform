import { useEffect, useState } from "react";
import { useContract } from "@/contexts/Contract.context";
import JobListItem from "@/components/JobListItem";
import { EJobItemType } from "@/constants";

const MyInProgressJobs = () => {
  const { signer, jobs } = useContract();
  const [myInProgressJobs, setMyInProgressJobs] = useState([]);
  // const [, setSelectedJob] = useState({});

  useEffect(() => {
    if (signer && signer.address) {
      const filteredJobs = jobs.filter(
        (x) => x.employer === signer.address && x.status === "IN_PROGRESS"
      );
      setMyInProgressJobs(filteredJobs);
    }
  }, [jobs]);

  return (
    <div className="flex flex-col">
      {myInProgressJobs.length > 0 ? (
        myInProgressJobs.map((job) => (
          <JobListItem
            jobId={job.id}
            key={job.title}
            title={job.title}
            description={job.description}
            isSelected={false}
            employer={job.employer}
            type={EJobItemType.INPROGRESS}
          />
        ))
      ) : (
        <div className="mb-2">No In-Progress Jobs Found.</div>
      )}
    </div>
  );
};

export default MyInProgressJobs;
