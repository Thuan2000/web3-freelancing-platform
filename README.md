# De-centralized Job Marketplace (using web3 smart contracts)

## Overview
This is a decentralized job marketplace where employers can post jobs, and freelancers can apply to them. The platform facilitates job posting, freelancer application, employer selection, job completion, and conflict resolution in case of disputes. The actors involved in the platform include employers, freelancers, and voters.

### Application Flow:

1. Posting a Job (Employer):

	•	An employer posts a job by providing a title, description, and an escrow payment (ETH).

	•	The job is initially set to the “OPEN” status.

    <b>Method:</b> `postJob(string memory _description, string memory _title)`

2. Applying for a Job (Freelancer):

	•	A freelancer who is registered on the platform can apply for any open job.

	•	When applying, the freelancer submits a description of their application.

	•	The freelancer’s address is recorded, and the job’s status remains “OPEN”.

    <b>Method:</b> `applyForJob(uint _jobId, string memory _applicationDescription)`

3. Choosing a Freelancer (Employer):

	•	The employer reviews the applications and selects a freelancer for the job.

	•	Once the freelancer is selected, the job’s status is updated to “IN_PROGRESS”.

    <b>Method:</b> `acceptFreelancer(uint _jobId, address payable _freelancer)`

4. Completing a Job (Freelancer & Employer):

	•	Once the freelancer completes the job, they can mark the job as “IN_REVIEW”.

	•	The employer then reviews the work. If satisfied, the employer marks the job as “COMPLETE” and the payment is released to the freelancer.

    <b>Method (Freelancer):</b> `markJobInReview(uint _jobId)`

    <b>Method (Employer):</b> `completeJob(uint _jobId)`

5. Raising a Conflict (Employer)

	•	If the employer is dissatisfied with the work, they can raise a conflict by providing a description of the issue.

	•	The job status is then updated to “IN_CONFLICT”, allowing community voting.

    <b>Method:</b> `markJobInConflict(uint _jobId, string memory _ownerConflictDescription)`

6. Resolving a Conflict (Voters)

	•	When a job is in conflict, voters (other platform users who are not the employer or freelancer) are called upon to vote.

	•	Voters can either support the freelancer or the employer. Once 11 votes are collected, the conflict is resolved based on the majority.

	•	The winning party (freelancer or employer) gets 95% of the payment, and 5% of the payment is distributed to the voters who supported the winning side.

    <b>Methods:</b>
    
    •	`reviewJobInConflict(uint _jobId, bool voteForFreelancer)`

    •	`resolveConflict(uint _jobId) (automatically called after 11 votes)`
  
### Technologies Used:

	•	Smart Contracts: Written in Solidity 0.8.9
	•	Blockchain Framework: Hardhat used for deploying and testing smart contracts on a local blockchain network.
	•	Frontend: Developed using React and JavaScript.
	•	UI Components: Leveraged shadcn for user interface components.

## Running the Project:

### Prerequisites:
	•	Node.js (Ensure you have Node.js 16+ installed)
	•	Hardhat: A development environment for compiling, testing, and deploying Solidity smart contracts (https://hardhat.org/hardhat-runner/docs/getting-started#installation)
	•	MetaMask (browser extension) installed on your browser.

### Setting Up:
1. Clone the repository:
```
git clone git@github.com:Thuan2000/web3-freelancing-platform.git
cd web3-freelancing-platform
```

2. Install dependencies:
```
npm install
```

3.	Set up your environment by configuring MetaMask to connect to your local Hardhat network. (https://support.metamask.io/networks-and-sidechains/managing-networks/how-to-add-a-custom-network-rpc/)

4. Deploy the contract:
```
npx hardhat run ./scripts/initialize.js --network localhost
```
Note: Remember to replace the dummy addresses for the faucet to your own wallet address(es).

4. Start the server:
```
npm install
npm run start
```

## Contact Information:
	•	Name: Thuan Nguyen
	•	Email: nhthuan20@gmail.com
	•	Phone (Telegram): +84 70 2845158

Feel free to reach out for any questions or collaboration opportunities!

## License

This project is licensed under the MIT License.