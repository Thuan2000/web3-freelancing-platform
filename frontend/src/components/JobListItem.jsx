import Dotdotdot from "react-dotdotdot";
import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/Auth.context";
import { Skeleton } from "@/components/ui/skeleton";
import { truncateText } from "@/utils/strings";
import { useContract } from "@/contexts/Contract.context";
import { EJobItemType } from "@/constants";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "./ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const JobListItem = (props) => {
  const { title, description, onClick, isSelected, employer, type, jobId } =
    props;
  const { userAddress } = useAuth();
  const {
    getJobDetails,
    reviewJobInConflict,
    signer,
    hasReviewed,
    freelancerSubmitConflictDescription,
    getAllJobs,
  } = useContract();
  const [freelancerAddress, setFreelancerAddress] = useState("");
  const [submitFreelancerConflictDialog, setSubmitFreelancerConflictDialog] =
    useState(false);
  const [freelancerConflictDocLink, setFreelancerConflictDocLink] =
    useState("");
  const [hasReviewedJobInConflict, setHasReviewedJobInConflict] =
    useState(null);
  const [job, setJob] = useState({});
  const { toast } = useToast();

  const fetchFreelancerAddress = async () => {
    const jobDetails = await getJobDetails(jobId);
    setJob(jobDetails);
    setFreelancerAddress(jobDetails.freelancer);
  };

  const fetchHasReviewedStatus = async () => {
    const result = await hasReviewed(jobId, signer.address);
    setHasReviewedJobInConflict(result);
  };

  useEffect(() => {
    fetchFreelancerAddress();
    fetchHasReviewedStatus();
  }, []);

  const handleSubmitFreelancerConflict = async () => {
    await freelancerSubmitConflictDescription(
      job.id,
      freelancerConflictDocLink
    );
    toast({
      description: "Document submitted!"
    })
    setSubmitFreelancerConflictDialog(false);
    getAllJobs(); // Refresh job list
    fetchFreelancerAddress();
  };
  const __calcProgressValue = () => {
    return Math.ceil(
      ((Number(job.employerVotes) + Number(job.freelancerVotes)) / 11) * 100
    );
  };

  return (
    <Dialog
      open={submitFreelancerConflictDialog}
      onOpenChange={setSubmitFreelancerConflictDialog}
    >
      <Card
        onClick={onClick}
        className={`p-2 mb-2 cursor-pointer hover:shadow-lg ${
          isSelected ? "border border-black" : ""
        }`}
      >
        <CardHeader className="p-2">
          <CardTitle className="text-lg">
            {title}

            {job.status === "IN_CONFLICT" &&
              job.employer === signer.address && (
                <Badge className="w-fit ml-4 bg-zinc-700">I am employer</Badge>
              )}

            {job.status === "IN_CONFLICT" &&
              job.freelancer === signer.address && (
                <Badge className="w-fit ml-4 bg-zinc-700">I am freelancer</Badge>
              )}
          </CardTitle>
          {type === EJobItemType.DEFAULT && (
            <div className="flex flex-row">
              <CardDescription>
                Author: {truncateText(employer, 4)}
              </CardDescription>
              {employer === userAddress ? (
                <Badge className="ml-2 bg-zinc-700">You</Badge>
              ) : (
                <></>
              )}
            </div>
          )}

          {type === EJobItemType.INPROGRESS && (
            <div className="flex flex-row">
              <CardDescription>
                {freelancerAddress ? (
                  `Freelancer: ${truncateText(freelancerAddress, 4)}`
                ) : (
                  <Skeleton className="w-[150px] h-[20px] rounded-full bg-zinc-200" />
                )}
              </CardDescription>
            </div>
          )}

          {/* If it's complete and had conflict */}
          {type === EJobItemType.COMPLETE &&
            Number(job.freelancerVotes) + Number(job.employerVotes) > 0 && (
              <div className="flex flex-col">
                <div className="flex flex-row items-center justify-start w-[50%]">
                  {Number(job.freelancerVotes) > Number(job.employerVotes)
                    ? "Freelancer"
                    : "Employer"}{" "}
                  won the votes.
                </div>
                <p className="text-xs">
                  Job Owner: {truncateText(employer, 4)} (
                  {Number(job.employerVotes)})
                  <a
                    href={
                      job.ownerConflictDescription
                        ? job.ownerConflictDescription
                        : "#"
                    }
                    target={job.ownerConflictDescription ? "_blank" : "_self"}
                  >
                    <Button
                      variant={
                        job.ownerConflictDescription ? "link" : "disabled"
                      }
                      className="mr-1 text-xs my-1 py-0"
                    >
                      {job.ownerConflictDescription
                        ? "View Argument"
                        : "No Argument Yet"}
                    </Button>
                  </a>
                  <br />
                  Freelancer: {truncateText(freelancerAddress, 4)} (
                  {Number(job.freelancerVotes)})
                  <a
                    href={
                      job.freelancerConflictDescription
                        ? job.freelancerConflictDescription
                        : "#"
                    }
                    target={job.freelancerConflictDescription ? "_blank" : "_self"}
                  >
                    <Button
                      variant={
                        job.freelancerConflictDescription ? "link" : "disabled"
                      }
                      className="mr-1 text-xs my-1 py-0"
                    >
                      {job.freelancerConflictDescription
                        ? "View Argument"
                        : "No Argument Yet"}
                    </Button>
                  </a>
                </p>
              </div>
            )}

          {type === EJobItemType.INCONFLICT && (
            <div className="flex flex-col">
              <div className="flex flex-row items-center justify-start w-[50%]">
                <p>
                  Progress (
                  {Number(job.employerVotes || 0) + Number(job.freelancerVotes)}
                  /11):&nbsp;&nbsp;
                </p>
                <Progress
                  value={__calcProgressValue()}
                  className="h-2 flex flex-1"
                />
              </div>
              <p className="text-xs">
                Job Owner: {truncateText(employer, 4)} (
                {Number(job.employerVotes)})
                <a
                  href={
                    job.ownerConflictDescription
                      ? job.ownerConflictDescription
                      : "#"
                  }
                  target={job.ownerConflictDescription ? "_blank" : "_self"}
                >
                  <Button
                    variant={job.ownerConflictDescription ? "link" : "disabled"}
                    className="mr-1 text-xs my-1 py-0"
                  >
                    {job.ownerConflictDescription
                      ? "View Argument"
                      : "No Argument Yet"}
                  </Button>
                </a>
                {job.freelancer !== signer.address &&
                  job.employer !== signer.address &&
                  !hasReviewedJobInConflict && (
                    <Button
                      className="mr-1 text-xs my-0 py-0"
                      onClick={() => {
                        reviewJobInConflict(job.id, false).then(() => {
                          setHasReviewedJobInConflict(true);
                          fetchFreelancerAddress();
                          toast({
                            description: "Your vote has been recorded.",
                          });
                          getAllJobs(); // Refresh job list
                        });
                      }}
                    >
                      Vote for Job Owner
                    </Button>
                  )}
                <br />
                Freelancer: {truncateText(freelancerAddress, 4)} (
                {Number(job.freelancerVotes)})
                <a
                  href={
                    job.freelancerConflictDescription
                      ? job.freelancerConflictDescription
                      : "#"
                  }
                  target={job.freelancerConflictDescription ? "_blank" : "_self"}
                >
                  <Button
                    variant={
                      job.freelancerConflictDescription ? "link" : "disabled"
                    }
                    className="mr-1 text-xs my-1 py-0"
                  >
                    {job.freelancerConflictDescription
                      ? "View Argument"
                      : "No Argument Yet"}
                  </Button>
                </a>
                {job.freelancer !== signer.address &&
                  job.employer !== signer.address &&
                  !hasReviewedJobInConflict && (
                    <Button
                      className="mr-1 text-xs my-0 py-0"
                      onClick={() => {
                        reviewJobInConflict(job.id, true).then(() => {
                          setHasReviewedJobInConflict(true);
                          fetchFreelancerAddress();
                          toast({
                            description: "Your vote has been recorded.",
                          });
                          getAllJobs(); // Refresh job list
                        });
                      }}
                    >
                      Vote for Freelancer
                    </Button>
                  )}
                {job.status === "IN_CONFLICT" &&
                  job.freelancer === signer.address &&
                  !job.freelancerConflictDescription && (
                    <DialogTrigger className="flex justify-start">
                      <Button className="text-xs">
                        Submit conflict description
                      </Button>
                    </DialogTrigger>
                  )}
              </p>
            </div>
          )}
        </CardHeader>
        <Separator />
        <CardContent className="p-2 text-sm">
          <Dotdotdot clamp={3}>{description}</Dotdotdot>
        </CardContent>
      </Card>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Submit Conflict Description</DialogTitle>
          <DialogDescription>
            Submit the link to your document:
          </DialogDescription>
          <div className="grid gap-4 py-4">
            <Input
              type="text"
              placeholder="Paste your link"
              value={freelancerConflictDocLink}
              onChange={(e) => {
                setFreelancerConflictDocLink(e.target.value);
              }}
            />
            <Button onClick={handleSubmitFreelancerConflict}>
              Submit Description
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

JobListItem.defaultProps = {
  type: EJobItemType.DEFAULT,
};

JobListItem.propTypes = {
  jobId: PropTypes.bigint.isRequired,
  title: PropTypes.node.isRequired,
  description: PropTypes.node.isRequired,
  onClick: PropTypes.node,
  isSelected: PropTypes.bool.isRequired,
  employer: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};
export default JobListItem;
