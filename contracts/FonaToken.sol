pragma solidity ^0.6.2;

import '@openzeppelin/contracts/presets/ERC20PresetMinterPauser.sol';

contract FonaToken is ERC20PresetMinterPauser {
    
    uint256 total = 10000000000 ;
    constructor() ERC20PresetMinterPauser("FonaTesji","FONA") public { 
        _mint(msg.sender,  total * 10**uint256(decimals()));
    }
}