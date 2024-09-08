import { useEffect, useState } from "react";
import { useContract } from "@/contexts/Contract.context";
import JobListItem from "@/components/JobListItem";
import { EJobItemType } from "@/constants";
import { Dialog } from "@/components/ui/dialog";

const MyWaitingForReviewJobs = () => {
  const { signer, jobs } = useContract();
  const [myInReviewJobs, setMyInReviewJobs] = useState([]);
  const [openReviewJobDialog, setOpenReviewJobDialog] = useState(false);

  useEffect(() => {
    if (signer && signer.address) {
      const filteredJobs = jobs.filter(
        (x) => x.freelancer === signer.address && x.status === "IN_REVIEW"
      );
      setMyInReviewJobs(filteredJobs);
    }
  }, [jobs]);

  return (
    <Dialog open={openReviewJobDialog} onOpenChange={setOpenReviewJobDialog}>
      <div className="flex flex-col">
        {myInReviewJobs.length > 0 ? (
          myInReviewJobs.map((job) => (
            <JobListItem
              jobId={job.id}
              key={job.title}
              title={job.title}
              description={job.description}
              isSelected={false}
              employer={job.employer}
              type={EJobItemType.INREVIEW}
              onClick={() => {}}
            />
          ))
        ) : (
          <div className="mb-2">No Waiting-For-Review Jobs Found.</div>
        )}
      </div>
    </Dialog>
  );
};

export default MyWaitingForReviewJobs;
