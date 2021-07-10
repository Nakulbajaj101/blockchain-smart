pragma solidity ^0.4.17;

contract CampaignFactory{
    address[] public campaignRunners;

    function deployCampaign(uint256 minimum) public {
        address campaignRunnerAddress = new Campaign(minimum, msg.sender);
        campaignRunners.push(campaignRunnerAddress);
    }

    function getDeployedCampaigns() public view returns(address[]){
        return campaignRunners;
    }
}


contract Campaign{

    struct Request{
        string description;
        uint256 value;
        address recipient;
        bool complete;
        uint40 approvalCount;
        mapping(address => bool) approvals;
    }

    address public manager;
    uint256 public minimumContribution;
    mapping(address => bool) public approvers;
    uint256 public approversCount;
    Request[] public requests;

    modifier onlyManager(){
        require(msg.sender == manager);
        _;
    }

    function Campaign(uint256 minimum, address campaignRunner) public{
        manager = campaignRunner;
        minimumContribution = minimum;

    }
    function contribute() public payable{
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }
    function createRequest(string description, uint256 value, address recipient) public onlyManager{
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });

        requests.push(newRequest);
    }
    function approveRequest(uint40 index) public{
        require(approvers[msg.sender]);
        require(!requests[index].approvals[msg.sender]);

        requests[index].approvals[msg.sender] = true;
        requests[index].approvalCount++;

    }

    function finaliseRequest(uint40 index) public onlyManager(){
        require(requests[index].approvalCount > (approversCount/2));
        require(!requests[index].complete);
        requests[index].recipient.transfer(requests[index].value);
        requests[index].complete = true;

    }

    function getSummary() public view returns(uint, uint, uint, uint, address){
      return (minimumContribution,
      this.balance,
      requests.length,
      approversCount,
      manager);
    }

    function getRequestCount() public view returns (uint){
      return requests.length;
    }
}
