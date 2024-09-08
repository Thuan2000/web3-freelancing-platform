import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JobListItem from "@/components/JobListItem";
import { useJobsSearch } from "./__contexts__/JobsSearch.context";
import { useEffect } from "react";
import { useContract } from "@/contexts/Contract.context";
import JobItemDisplay from "@/components/JobItemDisplay";

const JobsSearchPage = () => {
  const { selectedJob, setSelectedJob } = useJobsSearch();
  const { jobs, getUsername } = useContract();

  const [jobDetails, setJobDetails] = useState({
    authorName: "Placeholder_Author_Name",
    authorAddress: "Placeholder_0x00000000",
    jobTitle: "Placeholder_Title",
    jobDescription: "Placeholder_Description",
  });

  useEffect(() => {
    if (jobs.length > 0 && !selectedJob) {
      setSelectedJob(jobs[0]);
    }

    console.log(jobs);
  }, [jobs, setSelectedJob, selectedJob]);

  useEffect(() => {
    const fetchAuthorName = async () => {
      if (selectedJob) {
        const username = await getUsername(selectedJob.employer);
        setJobDetails({
          ...jobDetails,
          authorAddress: selectedJob.employer,
          authorName: username,
        });
      }
    };

    fetchAuthorName();
  }, [selectedJob, getUsername]);

  const inCompleteJobs = jobs.filter(x => x.status !== "COMPLETE");
  const completeJobs = jobs.filter(x => x.status === "COMPLETE");

  return (
    <div className="flex flex-row justify-around mt-2">
      <Card style={{ flex: "0.4" }}>
        <CardHeader>
          <CardTitle>List of Jobs</CardTitle>
          <CardDescription>View active or finished jobs</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active" className="w-full">
            <TabsList style={{ width: "-webkit-fill-available" }}>
              <TabsTrigger style={{ width: "100%" }} value="active">
                Active
              </TabsTrigger>
              <TabsTrigger style={{ width: "100%" }} value="finished">
                Finished
              </TabsTrigger>
            </TabsList>
            <TabsContent value="active">
              {inCompleteJobs.length > 0 ? (
                inCompleteJobs.map((job) => (
                    <JobListItem
                      jobId={job.id}
                      key={job.title}
                      title={job.title}
                      description={job.description}
                      onClick={() => setSelectedJob(job)}
                      isSelected={job === selectedJob}
                      employer={job.employer}
                    />
                  ))
              ) : (
                <div>No Active Jobs Found.</div>
              )}
            </TabsContent>
            <TabsContent value="finished">
              {completeJobs.length > 0 ? (
                completeJobs.map((job) => (
                    <JobListItem
                      jobId={job.id}
                      key={job.title}
                      title={job.title}
                      description={job.description}
                      onClick={() => setSelectedJob(job)}
                      isSelected={job === selectedJob}
                      employer={job.employer}
                    />
                  ))
              ) : (
                <div>No Finished Jobs Found.</div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <JobItemDisplay
        isEmpty={!selectedJob}
        jobId={selectedJob ? selectedJob.id + "" : ""}
        jobTitle={selectedJob ? selectedJob.title : ""}
        authorName={jobDetails.authorName}
        authorAddress={jobDetails.authorAddress}
        description={selectedJob ? selectedJob.description : "No content here."}
        createdAt={selectedJob ? selectedJob.createdAt : "No time found."}
        employer={
          selectedJob ? selectedJob.employer : "No employer address found."
        }
        status={selectedJob ? selectedJob.status : ""}
      />
    </div>
  );
};

export default JobsSearchPage;
