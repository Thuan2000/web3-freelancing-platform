// This page is reserved for testing and can be used to do anything.

import { useContract } from "@/contexts/Contract.context";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Label } from "@radix-ui/react-label";

const TestPage = () => {
  const [contractUsername, setContractUsername] = useState("");
  const { getUsername, signer, getUserDetails, hasReviewed } = useContract();
  const [hasReviewResult, setHasReviewResult] = useState(null);

  const handleGetUserName = async () => {
    console.log('signer is: ', signer)
    const value = await getUsername(signer.address);
    console.log("handleGetUserName clicked: ", value);
    if (value) setContractUsername(value);
  };

  const handleGetUserDetails = async () => {
    console.log('The button is clicked!')
    const value = await getUserDetails(signer.address);
    // const value = await getUserDetails(BigInt(1n));
    console.log('Value is: ');
    console.log(value);

    console.log('List of applied jobs: ');
    console.log(value.appliedJobs[0]);
  }

  const handleHasReviewed = async () => {
    const jobId = 1n;
    const result = await hasReviewed(jobId, signer.address);
    setHasReviewResult(result);
    console.log(`The job ${String(jobId)} hasReview result: ${result}`)
  }

  return (
    <div className="p2">
      <Button onClick={handleGetUserName}>Get Username (from contract)</Button>{" "}
      <br />
      <Label>Current value: {contractUsername || "NOT_INITIALIZED_YET"}</Label>
      <br />
      <Button onClick={handleGetUserDetails}>Get User Details (from contract)</Button>{" "}
      <br />
      <Label>Has reviewed? {String(hasReviewResult)}</Label> <br/>
      <Button onClick={handleHasReviewed}>Has reviewed? (from contract)</Button>{" "}
    </div>
  );
};
export default TestPage;
