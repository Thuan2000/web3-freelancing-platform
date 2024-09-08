import { createContext, useState, useContext, useEffect } from "react";
import { ethers } from "ethers";
import { JobMarketplace as contractAddress } from "@/contracts/contract-address.json";
import { abi as contractABI } from "@/contracts/JobMarketplace.json";
import PropTypes from "prop-types";

const ContractContext = createContext(undefined);

export const ContractProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const initEthers = async () => {
      // Create an ethers provider from MetaMask
      const providerInstance = new ethers.BrowserProvider(window.ethereum);
      setProvider(providerInstance);

      // Request account access if needed
      await providerInstance.send("eth_requestAccounts", []);

      const signerInstance = await providerInstance.getSigner();
      setSigner(signerInstance);

      // Create a contract instance
      const contractInstance = new ethers.Contract(
        contractAddress,
        contractABI,
        signerInstance
      );
      setContract(contractInstance);
    };

    initEthers();
  }, []);

  const getApplicationsOfJob = async (jobId) => {
    try {
      const jobDetails = await getJobDetails(jobId);
      const applicationIdsOfJobs = jobDetails.applications;
      const applicationsOfJobs = await Promise.all(
        applicationIdsOfJobs.map((x) => getApplicationDetails(x))
      );
      return applicationsOfJobs;
    } catch (error) {
      console.log(
        "Error on Contract.context.jsx on getApplicationsOfJob function"
      );
      console.error(error);
    }
  };

  const reviewJobInConflict = async (jobId, voteForFreelancer) => {
    try {
      if (contract && signer) {
        const tx = await contract.reviewJobInConflict(jobId, voteForFreelancer);
        await tx.wait();
        await getAllJobs(); // Refresh the job list.
      }
    } catch (error) {
      console.log(
        "Error on Contract.context.jsx on reviewJobInConflict function"
      );
      console.error(error);
    }
  };

  const markJobInReview = async (jobId) => {
    try {
      if (contract && signer) {
        const tx = await contract.markJobInReview(jobId);
        await tx.wait();
        await getAllJobs(); // Refresh the job list
      }
    } catch (error) {
      console.log("Error on Contract.context.jsx on markJobInReview function");
      console.error(error);
    }
  };

  const acceptFreelancer = async (jobId, freelancerAddress) => {
    try {
      if (contract && signer) {
        const tx = await contract.acceptFreelancer(jobId, freelancerAddress);
        await tx.wait();
        await getAllJobs(); // Refresh the job list
      }
    } catch (error) {
      console.log("Error on Contract.context.jsx on acceptFreelancer function");
      console.error(error);
    }
  };

  const registerUser = async (name) => {
    if (contract && signer) {
      const tx = await contract.registerUser(name);
      await tx.wait();
    }
  };

  const getAppliedJobs = async (address) => {
    try {
      if (contract) {
        const userDetails = await getUserDetails(address);
        const appliedJobIds = userDetails.appliedJobs;
        const appliedJobs = await Promise.all(
          appliedJobIds.map((id) => getJobDetails(id))
        );
        return appliedJobs;
      }
    } catch (error) {
      console.log("Error on Contract.context.jsx on getAppliedJobs function");
      console.error(error);
    }
  };

  const getUserDetails = async (address) => {
    try {
      if (contract) {
        const userDetails = await contract.getUserDetails(address);
        return {
          name: userDetails[0],
          postedJobs: userDetails[1],
          appliedJobs: userDetails[2],
          completedJobs: userDetails[3],
        };
      }
      return null;
    } catch (error) {
      console.log("Error on Contract.context.jsx on getUserDetails function");
      console.error(error);
    }
  };

  const applyForJob = async (jobId, applicationDesc) => {
    try {
      if (contract && signer) {
        const tx = await contract.applyForJob(jobId, applicationDesc);
        await tx.wait();
        await getAllJobs(); // Refresh the job list
      }
    } catch (error) {
      console.log("Error on Contract.context.jsx on applyForJob function");
      console.error(error);
    }
  };

  const markJobInConflict = async (jobId, ownerConflictDesc) => {
    try {
      const tx = await contract.markJobInConflict(jobId, ownerConflictDesc);
      await tx.wait();
      await getAllJobs(); // Refresh the job list
    } catch (error) {
      console.log(
        "Error on Contract.context.jsx on markJobInConflict function"
      );
      console.error(error);
    }
  };

  const freelancerSubmitConflictDescription = async (jobId, freelancerConflictDescription) => {
    try {
      const tx = await contract.freelancerSubmitConflictDescription(jobId, freelancerConflictDescription);
      await tx.wait();
      await getAllJobs(); // Refresh the job list
    } catch (error) {
      console.log(
        "Error on Contract.context.jsx on freelancerSubmitConflictDescription function"
      )
      console.error(error);
    }
  }

  const completeJob = async (jobId) => {
    try {
      const tx = await contract.completeJob(jobId);
      await tx.wait();
      await getAllJobs(); // Refresh the job list
    } catch (error) {
      console.log("Error on Contract.context.jsx on completeJob function");
      console.error(error);
    }
  };

  const postJob = async (description, title, value) => {
    try {
      if (contract && signer) {
        const tx = await contract.postJob(description, title, {
          value: ethers.parseEther(value),
        });
        await tx.wait();
        await getAllJobs(); // Refresh the job list
      }
    } catch (error) {
      console.log("Error on Contract.context.jsx on postJob function");
      console.error(error);
    }
  };

  const getApplicationDetails = async (applicationId) => {
    if (contract) {
      const application = await contract.getApplicationDetails(applicationId);
      return {
        id: application[0],
        freelancer: application[1],
        applicationDescription: application[2],
        createdAt: application[3],
      };
    }
  };

  const getJobDetails = async (jobId) => {
    if (contract) {
      const job = await contract.getJobDetails(jobId);
      return {
        id: job[0],
        employer: job[1],
        description: job[2],
        title: job[3],
        payment: job[4],
        status: job[5],
        freelancer: job[6],
        createdAt: job[7],
        applications: job[8],
        freelancerVotes: job[9],
        employerVotes: job[10],
        ownerConflictDescription: job[11],
        freelancerConflictDescription: job[12],
      };
    }
    return null;
  };

  const getAllJobs = async () => {
    if (contract) {
      const jobIds = await contract.getAllJobsIds();
      const jobsList = await Promise.all(jobIds.map((id) => getJobDetails(id)));
      setJobs(jobsList);
    }
  };

  const getUsername = async (address) => {
    if (contract) {
      // Solidity automatically resolves into the attribute that has type string for some reason?
      return await contract.users(address);
    }
    return "";
  };

  const hasReviewed = async (jobId, address) => {
    if (contract) {
      return await contract.hasReviewed(jobId, address);
    }
  }

  const hasVotedForFreelancer = async (jobId, address) => {
    if (contract) {
      return await contract.hasVotedForFreelancer(jobId, address);
    }
  }

  useEffect(() => {
    if (contract) {
      getAllJobs();
    }
  }, [contract]);

  return (
    <ContractContext.Provider
      value={{
        provider,
        signer,
        contract,
        registerUser,
        postJob,
        getJobDetails,
        applyForJob,
        jobs,
        getUsername,
        getUserDetails,
        getAppliedJobs,
        getApplicationsOfJob,
        acceptFreelancer,
        markJobInConflict,
        markJobInReview,
        reviewJobInConflict,
        hasReviewed,
        hasVotedForFreelancer,
        completeJob,
        getAllJobs,
        freelancerSubmitConflictDescription
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

ContractProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useContract = () => {
  const context = useContext(ContractContext);
  if (context === undefined) {
    throw new Error("useContract must be used within a ContractProvider");
  }
  return context;
};
