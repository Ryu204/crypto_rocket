// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

uint16 constant maxEntries = 1000;

contract CryptoRocket {

    struct Entry {
        string name;
        uint32 score;
    }

    Entry[] public rankings; 
    address payable public immutable owner;
    uint16 public currentEntryIndex;

    constructor() {
        owner = payable(msg.sender);
        currentEntryIndex = 0;
    }

    // This function only appends the entry into storage without actual sorting
    function addEntry(string memory name, uint32 score) public {
        if (currentEntryIndex >= maxEntries) {
            currentEntryIndex = 0;
            rankings[0] = Entry(name, score);
        }
        else {
            rankings.push(Entry(name, score));
            currentEntryIndex++;
        }
    }

    // Return `num` entries with greatest score
    // Might return less entries than `num` if `rankings` does not have enough elements
    function getTopEntries(uint16 num) view public returns (Entry[] memory) {
        bool[] memory mark = new bool[](rankings.length);
        Entry[] memory res = new Entry[](min(num, uint32(rankings.length)));
        uint16 id = 0;
        while (id < num) {
            uint16 maxId;
            bool found = false;
            uint32 score = 0;
            for (uint16 i = 0; i < rankings.length; ++i)
                if (mark[i] == false && rankings[i].score >= score) {
                    maxId = i;
                    score = rankings[i].score;
                    found = true;
                }
            if (!found)
                break;
            res[id] = rankings[maxId];
            mark[maxId] = true;
            id++;
        }
        return res;
    }

    function transferToOwner() public {
        if (msg.sender != owner)
            revert("Not owner");
        owner.transfer(address(this).balance);
    }

    function min(uint32 a, uint32 b) private pure returns(uint32) {
        return a < b ? a : b;
    }

    receive() external payable {
        
    }
}