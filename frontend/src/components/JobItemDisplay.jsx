/* eslint-disable react/no-unescaped-entities */
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { formatTimeAgo } from "@/utils/time";
import { truncateText } from "@/utils/strings";
import { useAuth } from "@/contexts/Auth.context";
import { Button } from "./ui/button";
import { useContract } from "@/contexts/Contract.context";
import BusinessManSvg from "@/assets/business_man.svg";
import { useToast } from "@/components/ui/use-toast";

const JobItemDisplay = (props) => {
  const {
    jobId,
    jobTitle,
    authorAddress,
    authorName,
    description,
    createdAt,
    employer,
    isEmpty,
    status,
  } = props;
  const { userAddress } = useAuth();
  const { applyForJob, getAppliedJobs, signer } = useContract();
  const [jobApplicationDesc, setJobApplicationDesc] = useState("");
  const [isAlreadyApplied, setIsAlreadyApplied] = useState(false);
  const { toast } = useToast();
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      const myAppliedJobs = await getAppliedJobs(signer.address);
      for (let i = 0; i < myAppliedJobs.length; i++) {
        if (myAppliedJobs[i].id === BigInt(jobId)) {
          setIsAlreadyApplied(true);
          return;
        }
      }
      setIsAlreadyApplied(false);
    };
    fetchAppliedJobs().catch(console.error);
  });

  const renderCTA = () => {
    if (status === "COMPLETE") {
      return <Badge className="w-fit bg-fuchsia-400">Complete</Badge>;
    }

    if (status === "IN_CONFLICT") {
      return <Badge className="w-fit bg-red-400">In-Conflict</Badge>;
    }
    if (status === "IN_REVIEW") {
      return <Badge className="w-fit bg-indigo-600">Waiting for Review</Badge>;
    }
    if (employer !== userAddress) {
      if (isAlreadyApplied) {
        if (status === "IN_PROGRESS") {
          return <Badge className="w-fit bg-green-500">Already Accepted</Badge>;
        }
        return <Badge className="w-fit bg-orange-300">Already Applied</Badge>;
      }

      return (
        <DialogTrigger className="flex justify-start">
          <Button>Apply to Job</Button>
        </DialogTrigger>
      );
    }

    return <></>;
  };

  const handleApplyJob = async () => {
    try {
      await applyForJob(jobId, jobApplicationDesc);
      setApplyDialogOpen(false);
      toast({
        description: "Your application has been recorded.",
      });
    } catch (error) {
      console.log("Error on applying for job: ", jobId);
      console.error(error);
      if (error.reason === "User not registered") {
        console.log("Yes, we caught the error.");
      }
    }
  };

  if (isEmpty) {
    return (
      <Card className="flex flex-1 ml-2 border justify-center flex-col items-center pt-8 pb-8">
        <img width={200} src={BusinessManSvg}></img>
        <CardDescription className="mt-4">No Jobs Found.</CardDescription>
      </Card>
    );
  }

  return (
    <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
      <Card className="flex-1 ml-2 border border-black">
        <CardHeader>
          <CardTitle>{jobTitle ? jobTitle : "Job Title"}</CardTitle>
          <CardDescription>
            Job Id: <i>{jobId + ""}</i> - Author: {authorName} - Address at:{" "}
            {employer === userAddress ? (
              <Badge className="ml-2 mr-2 bg-zinc-700">You</Badge>
            ) : (
              <></>
            )}
            {truncateText(authorAddress, 4)}{" "}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>{description ? description : "Card Content"}</p>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col">
            <p>
              Created At:{" "}
              {createdAt ? formatTimeAgo(createdAt) : "No time found."}
            </p>
            {renderCTA()}
          </div>
        </CardFooter>
      </Card>
      {/* Job Application Form */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Apply to Job <i>"{jobTitle}"</i>
          </DialogTitle>
          <DialogDescription>
            Describe why you are the best fit for this job:
          </DialogDescription>
          <div>
            <Textarea
              id="application-description"
              value={jobApplicationDesc}
              onChange={(e) => setJobApplicationDesc(e.target.value)}
            />
          </div>
          <Button onClick={handleApplyJob} className="w-fit pt-2">
            Apply
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

JobItemDisplay.propTypes = {
  isEmpty: PropTypes.bool.isRequired,
  jobId: PropTypes.string.isRequired,
  jobTitle: PropTypes.string.isRequired,
  authorName: PropTypes.string.isRequired,
  authorAddress: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  employer: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
};

export default JobItemDisplay;
