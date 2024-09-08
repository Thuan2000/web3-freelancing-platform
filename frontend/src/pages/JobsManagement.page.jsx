import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

import MyPostedJobs from "@/components/jobs-management/MyPostedJobs";
import MyPostedJobsComplete from "@/components/jobs-management/MyPostedJobsComplete";
import MyInProgressJobs from "@/components/jobs-management/MyInProgressJobs";
import MyActiveJobs from "@/components/jobs-management/MyActiveJobs";
import MyAppliedJobs from "@/components/jobs-management/MyAppliedJobs";
import MyAppliedJobsComplete from "@/components/jobs-management/MyAppliedJobsComplete";
import { Separator } from "@/components/ui/separator";
import MyInReviewJobs from "@/components/jobs-management/MyInReviewJobs";
import MyWaitingForReviewJobs from "@/components/jobs-management/MyWaitingForReviewJobs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const JobsManagementPage = () => {
  const [showCompleteMyPostedJobs, setShowCompleteMyPostedJobs] =
    useState(false);
  const [showComplete, setShowComplete] = useState(false);

  return (
    <div className="flex flex-row w-full justify-around mt-2">
      <Card className="flex flex-1 mr-2 ml-2 flex-col">
        <CardHeader>
          <CardTitle>Jobs I posted</CardTitle>
          <CardDescription>Currently open for applications</CardDescription>
        </CardHeader>
        <CardContent>
          <MyPostedJobs />
          <Separator className="mt-2" />
          <CardDescription className="mt-2">Jobs I posted and are complete</CardDescription>
          <div className="flex items-center space-x-2 my-4">
            <Switch
              id="show-complete-jobs-toggle"
              checked={showCompleteMyPostedJobs}
              onCheckedChange={setShowCompleteMyPostedJobs}
            />
            <Label htmlFor="show-complete-jobs-toggle">
              Show complete job(s)
            </Label>
          </div>
          {
            showCompleteMyPostedJobs && <MyPostedJobsComplete />
          }
        </CardContent>
      </Card>
      <Card className="flex flex-1 mr-2 ml-2 flex-col">
        <CardHeader>
          <CardTitle>In-Progress Jobs</CardTitle>
          <CardDescription>
            Freelancers are working on these jobs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MyInProgressJobs />
          <Separator />
        </CardContent>
        <CardHeader className="pt-0">
          <CardTitle>In-Review Jobs</CardTitle>
          <CardDescription>
            Jobs waiting for your review/conclusion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MyInReviewJobs />
        </CardContent>
      </Card>
      <Card className="flex flex-1 mr-2 ml-2 flex-col">
        <CardHeader>
          <CardTitle>Active Jobs</CardTitle>
          <CardDescription>I'm actively working on these jobs</CardDescription>
        </CardHeader>
        <CardContent>
          <MyActiveJobs />
          <Separator />
        </CardContent>
        <CardHeader className="pt-0">
          <CardTitle>Waiting-For-Review Jobs</CardTitle>
          <CardDescription>The job owner is reviewing my work</CardDescription>
        </CardHeader>
        <CardContent>
          <MyWaitingForReviewJobs />
        </CardContent>
      </Card>
      <Card className="flex flex-1 mr-2 ml-2 flex-col">
        <CardHeader>
          <CardTitle>My Applied Jobs</CardTitle>
          <CardDescription>I have applied to these jobs</CardDescription>
        </CardHeader>
        <CardContent>
          <MyAppliedJobs />
          <Separator />
          <CardDescription className="mt-2">Jobs I applied and have completed</CardDescription>
          <div className="flex items-center space-x-2 my-4">
            <Switch
              id="show-complete-jobs-toggle"
              checked={showComplete}
              onCheckedChange={setShowComplete}
            />
            <Label htmlFor="show-complete-jobs-toggle">
              Show complete job(s)
            </Label>
          </div>
          {showComplete && <MyAppliedJobsComplete/>}
        </CardContent>
      </Card>
    </div>
  );
};

export default JobsManagementPage;
