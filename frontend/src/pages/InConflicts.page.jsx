import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useContract } from "@/contexts/Contract.context";
import JobListItem from "@/components/JobListItem";
import { EJobItemType } from "@/constants";

const InConflictsPage = () => {
  const { signer, jobs } = useContract();
  const [inConflictJobs, setInConflictJobs] = useState([]);
  const [resolvedJobs, setResolvedJobs] = useState([]);

  useEffect(() => {
    if (signer && signer.address) {
      const filteredJobs = jobs.filter(
        (x) =>
          x.status === "IN_CONFLICT" &&
          Number(x.employerVotes) + Number(x.freelancerVotes) < 11
      );
      setInConflictJobs(filteredJobs);

      const alreadyResolvedJobs = jobs.filter(
        (x) => Number(x.freelancerVotes) + Number(x.employerVotes) >= 10
      );
      setResolvedJobs(alreadyResolvedJobs);
    }
  }, [jobs]);

  return (
    <div className="flex flex-row w-full justify-around mt-2">
      <Card className="flex flex-1 mr-2 ml-2 flex-col">
        <CardHeader>
          <CardTitle>In-Conflict Jobs</CardTitle>
          <CardDescription>
            Currently in-conflict and awaiting votes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            {inConflictJobs.length > 0 ? (
              inConflictJobs.map((job) => {
                return (
                  <JobListItem
                    jobId={job.id}
                    key={job.title}
                    title={job.title}
                    description={job.description}
                    onClick={() => {
                      console.log("The button is clicked!");
                    }}
                    isSelected={false}
                    employer={job.employer}
                    type={EJobItemType.INCONFLICT}
                  />
                );
              })
            ) : (
              <div className="mb-2">No In-Conflicts Jobs found.</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="flex flex-1 mr-2 ml-2 flex-col">
        <CardHeader>
          <CardTitle>Resolved</CardTitle>
          <CardDescription>
            In-Conflict jobs that have been resolved through enough votes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {resolvedJobs.length > 0 ? (
            resolvedJobs.map((job) => {
              return (
                <JobListItem
                  jobId={job.id}
                  key={job.title}
                  title={job.title}
                  description={job.description}
                  onClick={() => {
                    console.log("The button is clicked!");
                  }}
                  isSelected={false}
                  employer={job.employer}
                  type={EJobItemType.COMPLETE}
                />
              );
            })
          ) : (
            <div className="mb-2">
              No In-Conflict jobs that have been resolved found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InConflictsPage;
