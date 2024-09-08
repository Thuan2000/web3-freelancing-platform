import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import JobListItem from "@/components/JobListItem";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useContract } from "@/contexts/Contract.context";
import { Separator } from "@/components/ui/separator";
import ApplicantListItem from "@/components/ApplicantListItem";
import { EJobItemType } from "@/constants";
import { useToast } from "@/components/ui/use-toast"

// TODO: 
// 2. Add a numeric indicator to see the number of current applications.
const MyPostedJobs = () => {
  const { signer, postJob, jobs, getApplicationsOfJob } = useContract();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [payment, setPayment] = useState("");
  const [openJobDetailsSheet, setIsOpenJobDetailsSheet] = useState(false);
  const [openPostJobDialog, setIsOpenPostJobDialog] = useState(false);
  const [myPostedJobs, setMyPostedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState({});
  const { toast } = useToast()
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (signer && signer.address) {
      const filteredJobs = jobs.filter(
        (x) => x.employer === signer.address && x.status === "OPEN"
      );
      setMyPostedJobs(filteredJobs);
    }
  }, [jobs]);

  useEffect(() => {
    const fetchApplicationsOfJob = async () => {
      const results = await getApplicationsOfJob(selectedJob.id);
      // Sort descending (latest on top)
      const sortedResults = results.sort((a,b) => {
        return Number(b.createdAt) - Number(a.createdAt)
      });

      setApplications(sortedResults);
    };
    fetchApplicationsOfJob();
  }, [selectedJob]);

  const handlePostJob = async () => {
    if (title && payment) {
      await postJob(description, title, payment);
      setIsOpenPostJobDialog(false)
      toast({
        description: "New job has been posted.",
      })
    }
  };

  const handleRefreshAfterAcceptFreelancer = () => {
    const fetchApplicationsOfJob = async () => {
      const results = await getApplicationsOfJob(selectedJob.id);
      // Sort descending (latest on top)
      const sortedResults = results.sort((a,b) => {
        return Number(b.createdAt) - Number(a.createdAt)
      });

      setApplications(sortedResults);
    };
    fetchApplicationsOfJob();
    setIsOpenJobDetailsSheet(false)
  }

  return (
    <>
      <Dialog open={openPostJobDialog} onOpenChange={setIsOpenPostJobDialog}>
        <div className="flex flex-col">
          {myPostedJobs.length > 0 ? (
            myPostedJobs.map((job) => (
              <JobListItem
                jobId={job.id}
                key={job.title}
                title={job.title}
                description={job.description}
                onClick={() => {
                  setSelectedJob(job);
                  setIsOpenJobDetailsSheet(!openJobDetailsSheet);
                }}
                isSelected={false}
                employer={job.employer}
                type={EJobItemType.DEFAULT}
              />
            ))
          ) : (
            <div>No Active Jobs Found.</div>
          )}
        </div>
        <DialogTrigger>
          <Button className="text-xs mt-2">Post New Job</Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Post a new Job</DialogTitle>
            <DialogDescription>Fill in your job information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Payment
              </Label>
              <Input
                id="payment"
                type="number"
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handlePostJob}>
              Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={openJobDetailsSheet} onOpenChange={setIsOpenJobDetailsSheet}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{selectedJob.title}</SheetTitle>
            <SheetDescription>{selectedJob.description}</SheetDescription>
          </SheetHeader>
          <Separator className="my-4" />
          <SheetHeader>
            <SheetTitle>
              Applications ({applications ? applications.length : 0})
            </SheetTitle>
            <SheetDescription>
              Waiting for your approval/rejection.
            </SheetDescription>
          </SheetHeader>
          {applications &&
            applications.map((x) => (
              <ApplicantListItem
                key={selectedJob.id + ""}
                jobId={selectedJob.id}
                applicantName={"Freelancer Name"}
                applicantAddress={x.freelancer}
                timestamp={x.createdAt}
                applicationDescription={x.applicationDescription}
                handleRefreshAfterAcceptFreelancer={handleRefreshAfterAcceptFreelancer}
              />
            ))}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MyPostedJobs;
