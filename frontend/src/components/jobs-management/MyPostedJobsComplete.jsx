import { useEffect, useState } from "react";
import JobListItem from "@/components/JobListItem";
import { useContract } from "@/contexts/Contract.context";
import { EJobItemType } from "@/constants";

const MyPostedJobsComplete = () => {
  const { signer, jobs } = useContract();
  const [openJobDetailsSheet, setIsOpenJobDetailsSheet] = useState(false);
  const [myPostedJobs, setMyPostedJobs] = useState([]);

  useEffect(() => {
    if (signer && signer.address) {
      const filteredJobs = jobs.filter(
        (x) => x.employer === signer.address && x.status === "COMPLETE"
      );
      setMyPostedJobs(filteredJobs);
    }
  }, [jobs]);

  return (
    <div className="flex flex-col">
      {myPostedJobs.length > 0 ? (
        myPostedJobs.map((job) => (
          <JobListItem
            jobId={job.id}
            key={job.title}
            title={job.title}
            description={job.description}
            onClick={() => {
              setIsOpenJobDetailsSheet(!openJobDetailsSheet);
            }}
            isSelected={false}
            employer={job.employer}
            type={EJobItemType.DEFAULT}
          />
        ))
      ) : (
        <div>No Complete Jobs Found.</div>
      )}
    </div>
  );
};

export default MyPostedJobsComplete;
