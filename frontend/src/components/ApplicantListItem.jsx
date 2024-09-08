import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { truncateText } from "@/utils/strings";
import { formatTimeAgo } from "@/utils/time";
import { useEffect, useState } from "react";
import { useContract } from "@/contexts/Contract.context";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useToast } from "@/components/ui/use-toast"

const ApplicantListItem = (props) => {
  const { applicantAddress, timestamp, jobId, applicationDescription, handleRefreshAfterAcceptFreelancer } = props;
  const [applicantName, setApplicantName] = useState("");
  const { acceptFreelancer, getUsername } = useContract();
  const { toast } = useToast()

  const handleAcceptFreelancer = async () => {
    await acceptFreelancer(jobId, applicantAddress);
    handleRefreshAfterAcceptFreelancer();
    toast({
      description: "Freelancer's application has been accepted.",
    })
  };

  useEffect(() => {
    const fetchApplicantName = async () => {
      const name = await getUsername(applicantAddress);
      setApplicantName(name);
    };
    fetchApplicantName();
  }, []);

  return (
    <HoverCard>
      <div dir="ltr">
        <div className="m-2 border-s-4 ml-0 pl-2 text-xs leading-6">
          <div className="flex flex-row align-middle">
            <span>Name:&nbsp;</span>{" "}
            {applicantName ? (
              applicantName
            ) : (
              <Skeleton className="w-[100px] h-[20px] rounded-full bg-zinc-200" />
            )}
            &nbsp;-&nbsp; Address: {truncateText(applicantAddress, 4)}
          </div>
          <Button className="mr-1 text-xs" onClick={handleAcceptFreelancer}>
            Accept
          </Button>
          <HoverCardTrigger>
            <Button variant="link" className="mr-1 text-xs">
              View Description
            </Button>
          </HoverCardTrigger>
          <br />
          <span className="text-xs">
            Posted: {formatTimeAgo(timestamp)} ago.
          </span>
        </div>
      </div>
      <HoverCardContent className="text-xs">
        {applicationDescription}
      </HoverCardContent>
    </HoverCard>
  );
};

ApplicantListItem.propTypes = {
  jobId: PropTypes.bigint.isRequired,
  timestamp: PropTypes.bigint.isRequired,
  applicantAddress: PropTypes.string.isRequired,
  applicationDescription: PropTypes.string.isRequired,
  handleRefreshAfterAcceptFreelancer: PropTypes.func.isRequired
};

export default ApplicantListItem;
