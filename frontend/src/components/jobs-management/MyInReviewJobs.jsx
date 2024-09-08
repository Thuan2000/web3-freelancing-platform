import { useEffect, useState } from "react";
import { useContract } from "@/contexts/Contract.context";
import JobListItem from "@/components/JobListItem";
import { EJobItemType } from "@/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

const MyInReviewJobs = () => {
  const { signer, jobs, completeJob, markJobInConflict } = useContract();
  const [myInReviewJobs, setMyInReviewJobs] = useState([]);
  const [openReviewJobDialog, setOpenReviewJobDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState({});
  const [conflictDocLink, setConflictDocLink] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (signer && signer.address) {
      const filteredJobs = jobs.filter(
        (x) => x.employer === signer.address && x.status === "IN_REVIEW"
      );
      setMyInReviewJobs(filteredJobs);
    }
  }, [jobs]);

  const handleCompleteJob = async () => {
    await completeJob(selectedJob.id);
    setOpenReviewJobDialog(false);
    toast({
      description: "Job has been marked as complete.",
    });
  };

  const handleMarkJobInConflict = async () => {
    await markJobInConflict(selectedJob.id, conflictDocLink);
    setOpenReviewJobDialog(false);
    toast({
      description: "Job has been marked in conflict.",
    });
  };

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
              onClick={() => {
                // TODO: Implement it here
                setSelectedJob(job);
                setOpenReviewJobDialog(true);
              }}
            />
          ))
        ) : (
          <div className="mb-2">No In-Review Jobs Found.</div>
        )}
      </div>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Job: <i>{selectedJob.title}</i>
          </DialogTitle>
          <DialogDescription>
            The freelancer is waiting for your conclusion.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <DialogDescription>
            (If you are happy with the freelancer's work)
          </DialogDescription>
          <Button onClick={handleCompleteJob}>Complete Job</Button>
          <Separator />
          <span className="text-center">(OR)</span>
          <Separator />
          <DialogDescription>
            (If you are unsatisfied with the freelancer's delivery)
          </DialogDescription>
          <Input
            type="text"
            placeholder="Paste a link to your document"
            value={conflictDocLink}
            onChange={(e) => {
              setConflictDocLink(e.target.value);
            }}
          />
          <Button onClick={handleMarkJobInConflict}>Raise Conflict</Button>
        </div>
        <DialogFooter>
          Please be sure with your decision as it is irreversible.
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MyInReviewJobs;
