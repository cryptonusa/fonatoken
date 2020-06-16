pragma solidity ^0.6.0;

import '@openzeppelin/contracts/presets/ERC20PresetMinterPauser.sol';

contract FonaToken is ERC20PresetMinterPauser {
    
    uint256 total = 1000000000 ;
    constructor() ERC20PresetMinterPauser("FonaToken","FNT") public { 
        _mint(msg.sender,  total * 10**uint256(decimals()));
    }
}