import { useEffect, useState } from "react";
import { useContract } from "@/contexts/Contract.context";
import JobListItem from "@/components/JobListItem";
import { Separator } from "@/components/ui/separator";
import { EJobItemType } from "@/constants";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatTimeAgo } from "@/utils/time";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast"

const MyActiveJobs = () => {
  const { signer, jobs, getApplicationsOfJob, markJobInReview } = useContract();
  const [myActiveJobs, setMyActiveJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState({});
  const [openJobDetailsSheet, setIsOpenJobDetailsSheet] = useState(false);
  const [myApplication, setMyApplication] = useState({});
  const { toast } = useToast()

  useEffect(() => {
    if (signer && signer.address) {
      const filteredJobs = jobs.filter(
        (x) => x.freelancer === signer.address && x.status === "IN_PROGRESS"
      );
      setMyActiveJobs(filteredJobs);
    }
  }, [jobs]);

  const handleMarkJobInReview = async () => {
    await markJobInReview(selectedJob.id);
    setIsOpenJobDetailsSheet(false);
    toast({
      description: "Your job has been marked for review.",
    })
  };

  return (
    <Sheet open={openJobDetailsSheet} onOpenChange={setIsOpenJobDetailsSheet}>
      <div className="flex flex-col">
        {myActiveJobs.length > 0 ? (
          myActiveJobs.map((job) => (
            <JobListItem
              jobId={job.id}
              key={job.title}
              title={job.title}
              description={job.description}
              onClick={() => {
                setSelectedJob(job);
                setIsOpenJobDetailsSheet(true);
                const fetchApplicationsOfJob = async () => {
                  const results = await getApplicationsOfJob(job.id);
                  const filteredApplication = results.filter(
                    (x) => x.freelancer === signer.address
                  )[0];
                  setMyApplication(filteredApplication);
                };
                fetchApplicationsOfJob();
              }}
              isSelected={false}
              employer={job.employer}
              type={EJobItemType.ACTIVE}
            />
          ))
        ) : (
          <div className="mb-2">No Active Jobs Found.</div>
        )}
      </div>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{selectedJob.title}</SheetTitle>
          <SheetDescription>{selectedJob.description}</SheetDescription>
        </SheetHeader>
        <Separator className="my-4" />
        <SheetHeader>
          <SheetTitle>Activities History</SheetTitle>
          <SheetDescription>
            1. Job was posted {formatTimeAgo(selectedJob.createdAt)}.
          </SheetDescription>
          <SheetDescription>
            2. I applied {formatTimeAgo(myApplication.createdAt)}.
          </SheetDescription>
          <SheetDescription>
            3. I was accepted some time ago (time feature for this is in
            development).
          </SheetDescription>
        </SheetHeader>
        <Separator className="my-4" />
        <SheetHeader>
          <SheetTitle>Actions</SheetTitle>
          <SheetDescription>
            Finished your work?
            <br />
            <span className="text-xs">
              (Remember to notify the job owner before signing for completion)
            </span>
          </SheetDescription>
          <Button onClick={handleMarkJobInReview}>Complete work</Button>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default MyActiveJobs;
