import { useEffect, useState } from "react";
import { useContract } from "@/contexts/Contract.context";
import JobListItem from "@/components/JobListItem";
import { EJobItemType } from "@/constants";

const MyAppliedJobsComplete = () => {
  const { signer, jobs, getAppliedJobs } = useContract();
  const [myAppliedJobs, setMyAppliedJobs] = useState([]);
  const [, setSelectedJob] = useState({});

  useEffect(() => {
    if (signer && signer.address) {
      const fetchMyAppliedJobs = async () => {
        const results = await getAppliedJobs(signer.address);
        const filteredResults = results.filter(x => x.status === "COMPLETE");
        setMyAppliedJobs(filteredResults);
      }
      fetchMyAppliedJobs();
    }
  }, [jobs]);

  return (
    <div className="flex flex-col">
      {myAppliedJobs && myAppliedJobs.length > 0 ? (
        myAppliedJobs.map((job) => (
          <JobListItem
            jobId={job.id}
            key={job.title}
            title={job.title}
            description={job.description}
            onClick={() => {
              setSelectedJob(job);
            }}
            isSelected={false}
            employer={job.employer}
            type={EJobItemType.MYAPPLIED}
          />
        ))
      ) : (
        <div className="mb-2">No Applied Jobs Found.</div>
      )}
    </div>
  );
};

export default MyAppliedJobsComplete;
