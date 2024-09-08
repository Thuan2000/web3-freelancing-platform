// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract JobMarketplace {
    struct Job {
        uint id;
        address payable employer;
        string description;
        string title;
        string ownerConflictDescription;
        string freelancerConflictDescription;
        uint payment;
        string status;
        address payable freelancer;
        uint timestamp;
        uint[] applications;
        uint freelancerVotes;
        uint employerVotes;
        mapping(address => bool) reviewers; // Track who has reviewed the job
        mapping(address => bool) reviewerVotes; // Track whether the reviewer voted for the freelancer (true) or employer (false)
        address[] reviewerAddresses; // Stores the addresses of the reviewers
    }

    struct Application {
        uint id;
        address payable freelancer;
        string applicationDescription;
        uint timestamp;
    }

    struct User {
        string name;
        uint[] postedJobs;
        uint[] appliedJobs;
        uint[] completedJobs;
    }

    mapping(uint => Job) public jobs;
    mapping(uint => Application[]) public jobApplicationsByJobId;
    mapping(uint => Application) public jobApplicationById;
    mapping(address => User) public users;

    address public owner;

    uint public jobCounter;
    uint[] public jobIds;
    uint public applicationCounter;
    uint[] public applicationIds;

    event JobPosted(
        uint jobId,
        address employer,
        string description,
        uint payment
    );
    event JobApplied(uint jobId, address freelancer);
    event JobAccepted(uint jobId, address employer, address freelancer);
    event JobInReview(uint jobId, address freelancer);
    event JobCompleted(uint jobId, address freelancer);
    event JobResolved(uint jobId, string result);
    event JobInConflict(uint jobId, address employer, address freelancer);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyRegistered() {
        require(
            bytes(users[msg.sender].name).length > 0,
            "User not registered"
        );
        _;
    }

    modifier onlyEmployer(uint _jobId) {
        require(
            jobs[_jobId].employer == msg.sender,
            "Only employer can call this."
        );
        _;
    }

    modifier onlyFreelancer(uint _jobId) {
        require(
            jobs[_jobId].freelancer == msg.sender,
            "Only freelancer can call this."
        );
        _;
    }

    function getAllJobsIds() public view returns (uint[] memory) {
        return jobIds;
    }

    function isEqualString(
        string memory a,
        string memory b
    ) public pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }

    function registerUser(string memory _name) public {
        users[msg.sender].name = _name;
    }

    function postJob(
        string memory _description,
        string memory _title
    ) public payable onlyRegistered {
        require(
            bytes(_description).length > 0,
            "Job description cannot be empty."
        );
        require(msg.value > 0, "Payment must be greater than zero.");

        uint[] memory tempEmptyApplicationsArray;
        address[] memory tempEmptyReviewerAddressesArray;
        jobCounter++;

        Job storage newJob = jobs[jobCounter];
        newJob.id = jobCounter;
        newJob.employer = payable(msg.sender);
        newJob.description = _description;
        newJob.title = _title;
        newJob.payment = msg.value;
        newJob.status = "OPEN";
        newJob.freelancer = payable(address(0));
        newJob.timestamp = block.timestamp;
        newJob.ownerConflictDescription = "";
        newJob.freelancerConflictDescription = "";
        newJob.applications = tempEmptyApplicationsArray;
        newJob.reviewerAddresses = tempEmptyReviewerAddressesArray;
        newJob.freelancerVotes = 0;
        newJob.employerVotes = 0;

        jobIds.push(jobCounter);
        users[msg.sender].postedJobs.push(jobCounter);

        emit JobPosted(jobCounter, msg.sender, _description, msg.value);
    }

    function applyForJob(
        uint _jobId,
        string memory _applicationDescription
    ) public onlyRegistered {
        Job storage job = jobs[_jobId];
        require(isEqualString(job.status, "OPEN"), "Job is not open.");
        require(
            job.employer != msg.sender,
            "Owner cannot apply for their own job."
        );

        Application memory newApplication = Application(
            applicationCounter,
            payable(msg.sender),
            _applicationDescription,
            block.timestamp
        );
        jobApplicationsByJobId[_jobId].push(newApplication);
        jobApplicationById[applicationCounter] = newApplication;

        jobs[_jobId].applications.push(applicationCounter);
        applicationIds.push(applicationCounter);
        users[msg.sender].appliedJobs.push(_jobId);

        applicationCounter++;
        emit JobApplied(_jobId, msg.sender);
    }

    function getApplicationsIds() public view returns (uint[] memory) {
        return applicationIds;
    }

    function markJobInConflict(
        uint _jobId,
        string memory _ownerConflictDescription
    ) public onlyEmployer(_jobId) {
        Job storage job = jobs[_jobId];
        require(
            isEqualString(job.status, "IN_REVIEW"),
            "Job is not in review."
        );
        job.status = "IN_CONFLICT";
        job.ownerConflictDescription = _ownerConflictDescription;
        emit JobInConflict(_jobId, msg.sender, job.freelancer);
    }

    function markJobInReview(uint _jobId) public onlyFreelancer(_jobId) {
        Job storage job = jobs[_jobId];
        require(
            isEqualString(job.status, "IN_PROGRESS"),
            "Job is not in progress."
        );
        job.status = "IN_REVIEW";
        emit JobInReview(_jobId, msg.sender);
    }

    function reviewJobInConflict(
        uint _jobId,
        bool voteForFreelancer
    ) public onlyRegistered {
        Job storage job = jobs[_jobId];
        require(
            isEqualString(job.status, "IN_CONFLICT"),
            "Job is not in conflict."
        );
        require(msg.sender != job.employer, "Employer cannot vote.");
        require(msg.sender != job.freelancer, "Freelancer cannot vote.");
        require(!job.reviewers[msg.sender], "You have already voted.");

        if (voteForFreelancer) {
            job.freelancerVotes++;
        } else {
            job.employerVotes++;
        }
        job.reviewers[msg.sender] = true;
        job.reviewerVotes[msg.sender] = voteForFreelancer;  // Store the vote
        job.reviewerAddresses.push(msg.sender); // Store the voter's address

        if (job.freelancerVotes + job.employerVotes == 11) {
            // If it's already having 11 votes, then resolve this conflicted job.
            resolveConflict(_jobId);
        }
    }

    function resolveConflict(uint _jobId) internal {
        Job storage job = jobs[_jobId];
        uint totalPayment = job.payment;
        uint winnerPayment = (totalPayment * 95) / 100;
        uint votersReward = (totalPayment * 5) / 100;

        if (job.freelancerVotes > job.employerVotes) {
            // Freelancer wins
            job.freelancer.transfer(winnerPayment);
            distributeRewards(_jobId, true, votersReward);
            job.status = "COMPLETE";
            emit JobResolved(_jobId, "Freelancer Wins");
        } else {
            // Employer wins
            job.employer.transfer(winnerPayment);
            distributeRewards(_jobId, false, votersReward);
            job.status = "COMPLETE";
            emit JobResolved(_jobId, "Employer Wins");
        }
    }

    function distributeRewards(
        uint _jobId,
        bool forFreelancer,
        uint reward
    ) internal {
        Job storage job = jobs[_jobId];
        uint totalVotes = forFreelancer
            ? job.freelancerVotes
            : job.employerVotes;
        uint rewardPerVoter = reward / totalVotes;

        for (uint i = 0; i < job.reviewerAddresses.length; i++) {
            address reviewer = job.reviewerAddresses[i];
            // Check if the reviewer voted for the freelancer or the employer
            bool votedForFreelancer = job.reviewerVotes[reviewer];

            if (
                (forFreelancer && votedForFreelancer) ||
                (!forFreelancer && !votedForFreelancer)
            ) {
                payable(reviewer).transfer(rewardPerVoter);
            }
        }
    }

    function acceptFreelancer(
        uint _jobId,
        address payable _freelancer
    ) public onlyEmployer(_jobId) onlyRegistered {
        Job storage job = jobs[_jobId];
        require(isEqualString(job.status, "OPEN"), "Job is not open.");

        job.freelancer = _freelancer;
        job.status = "IN_PROGRESS";
        emit JobAccepted(_jobId, msg.sender, job.freelancer);
    }

    function freelancerSubmitConflictDescription(
        uint _jobId,
        string memory _freelancerConflictDescription
    ) public onlyFreelancer(_jobId) {
        Job storage job = jobs[_jobId];
        require(
            isEqualString(job.status, "IN_CONFLICT"),
            "Job is not in review."
        );

        job.freelancerConflictDescription = _freelancerConflictDescription;
    }

    function completeJob(uint _jobId) public onlyEmployer(_jobId) {
        Job storage job = jobs[_jobId];
        require(
            isEqualString(job.status, "IN_REVIEW"),
            "Job is not in review."
        );

        job.freelancer.transfer(job.payment);
        job.status = "COMPLETE";
        users[job.freelancer].completedJobs.push(_jobId);

        emit JobCompleted(_jobId, job.freelancer);
    }

    function getPostedJobs(address _user) public view returns (uint[] memory) {
        return users[_user].postedJobs;
    }

    function getAppliedJobs(address _user) public view returns (uint[] memory) {
        return users[_user].appliedJobs;
    }

    function getCompletedJobs(
        address _user
    ) public view returns (uint[] memory) {
        return users[_user].completedJobs;
    }

    function getJobDetails(
        uint _jobId
    )
        public
        view
        returns (
            uint,
            address,
            string memory,
            string memory,
            uint,
            string memory,
            address,
            uint,
            uint[] memory,
            uint,
            uint,
            string memory,
            string memory
        )
    {
        Job storage job = jobs[_jobId];
        return (
            job.id,
            job.employer,
            job.description,
            job.title,
            job.payment,
            job.status,
            job.freelancer,
            job.timestamp,
            job.applications,
            job.freelancerVotes,
            job.employerVotes,
            job.ownerConflictDescription,
            job.freelancerConflictDescription
        );
    }

    function getApplicationDetails(
        uint _applicationId
    ) public view returns (uint, address, string memory, uint) {
        Application memory application = jobApplicationById[_applicationId];
        return (
            application.id,
            application.freelancer,
            application.applicationDescription,
            application.timestamp
        );
    }

    function getFreelancerCompletedJobs(
        address _freelancer
    ) public view returns (uint[] memory) {
        return users[_freelancer].completedJobs;
    }

    function getUserDetails(
        address _user
    )
        public
        view
        returns (string memory, uint[] memory, uint[] memory, uint[] memory)
    {
        User memory user = users[_user];
        return (
            user.name,
            user.postedJobs,
            user.appliedJobs,
            user.completedJobs
        );
    }

    function isOutsider(uint _jobId, address _user) public view returns (bool) {
        Job storage job = jobs[_jobId];

        if (job.employer == _user || job.freelancer == _user) {
            return false;
        }

        return true;
    }

    function hasReviewed(
        uint _jobId,
        address _user
    ) public view returns (bool) {
        Job storage job = jobs[_jobId];

        return job.reviewers[_user];
    }

    function hasVotedForFreelancer(uint _jobId, address _user) public view returns (bool) {
        Job storage job = jobs[_jobId];
        
        return job.reviewerVotes[_user];
    }
}
