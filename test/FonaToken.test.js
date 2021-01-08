const { accounts, contract } = require('@openzeppelin/test-environment');

const { expect } = require('chai');

// Import utilities from Test Helpers
const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

const FonaToken = contract.fromArtifact('FonaToken');

describe('FonaToken', function () {
  const [ owner, acc2, acc3 ] = accounts;

  beforeEach(async function () {
    this.fonaToken = await FonaToken.new({ from: owner });
  });

  
      // Use large integers ('big numbers') for total supply
      const totalValue = new BN('1000000000000000000000000000');

    //1. totalSupply()  
    it('1. shows totalSupply()', async function () {
        await this.fonaToken.totalSupply();

    // Test if the returned value is the same one
    expect(await this.fonaToken.totalSupply())
          .to.be.bignumber.equal(totalValue);
  });

    //2. symbol()  
    it('2. shows symbol()', async function () {
    await this.fonaToken.symbol();
    expect((await this.fonaToken.symbol()).toString()).to.equal('FONA');
  });

    //3. name()  
    it('3. shows name()', async function () {
        await this.fonaToken.name();
        expect((await this.fonaToken.name()).toString()).to.equal('FonaToken');
      });

    //4. shows decimals()  
    it('4. shows decimals()', async function () {
        await this.fonaToken.decimals();
        expect((await this.fonaToken.decimals()).toString()).to.equal('18');
      });

    //5a. shows balanceOf(owner)  
    it('5a. shows balanceOf(owner)', async function () {
        await this.fonaToken.balanceOf(owner);
        // Note that we need to use strings to compare the 256 bit integers
        expect((await this.fonaToken.balanceOf(owner)).toString()).to.equal('1000000000000000000000000000');
      });

    //5b. balanceOf(acc2)  
    it('5b. shows balanceOf(acc2)', async function () {
        await this.fonaToken.balanceOf(acc2);
        expect((await this.fonaToken.balanceOf(acc2)).toString()).to.equal('0');
      });

      //6. DEFAULT_ADMIN_ROLE()  
    it('6. shows DEFAULT_ADMIN_ROLE()', async function () {
        await this.fonaToken.DEFAULT_ADMIN_ROLE();
        expect((await this.fonaToken.DEFAULT_ADMIN_ROLE()).toString()).to.equal('0x0000000000000000000000000000000000000000000000000000000000000000');
      });

      // Use large integers ('big numbers')
      const value = new BN('100000000000000000000');
      
        //7a. transfer()  
      it('7a. transfer(acc2, 100 FONA) from owner', async function () {
        await this.fonaToken.transfer(acc2, value, { from: owner });
        expect((await this.fonaToken.balanceOf(acc2)).toString()).to.equal('100000000000000000000') &&
        expect((await this.fonaToken.balanceOf(owner)).toString()).to.equal('999999900000000000000000000');                                                                              
      });

      //7b. transfer()  

      it('7b. reverts when transferring tokens to the zero address', async function () {
        // Conditions that trigger a require statement can be precisely tested
        await expectRevert(
          this.fonaToken.transfer(constants.ZERO_ADDRESS, value, { from: owner }),
          'ERC20: transfer to the zero address',
        );
      });
    
      it('7c. emits a Transfer event on successful transfers', async function () {
        const receipt = await this.fonaToken.transfer(
          acc3, value, { from: owner }
        );
    
        // Event assertions can verify that the arguments are the expected ones
        expectEvent(receipt, 'Transfer', {
          from: owner,
          to: acc3,
          value: value,
        });
      });
    
      it('7d. updates balances on successful transfers', async function () {
        this.fonaToken.transfer(acc3, value, { from: owner });
    
        // BN assertions are automatically available via chai-bn (if using Chai)
        expect(await this.fonaToken.balanceOf(acc3))
          .to.be.bignumber.equal(value);
      });

      //8. burn()  
      it('8. burn(100 FONA) from owner', async function () {
        await this.fonaToken.burn(value, { from: owner });
        expect((await this.fonaToken.totalSupply()).toString()).to.equal('999999900000000000000000000');
    });
    
    //9. mint()  
      it('9. mint(100 FONA) from owner', async function () {
        await this.fonaToken.mint(acc2, value, { from: owner });
        expect((await this.fonaToken.balanceOf(acc2)).toString()).to.equal('100000000000000000000') &&
        expect((await this.fonaToken.totalSupply()).toString()).to.equal('1000000100000000000000000000');
      });
        //10. approve, 11. allowance and 12. transferfrom()  
        it('10. approve(acc2, 100 FONA) from owner\n\t 11. check allowance(owner, acc2)\n\t 12. transferFrom(owner, acc3, 100 FONA) by acc2', 
        async function () {
          await this.fonaToken.approve(acc2, value, { from: owner });
          expect((await this.fonaToken.allowance(owner, acc2)).toString()).to.equal('100000000000000000000')

          await this.fonaToken.transferFrom(owner,acc3,value,{ from: acc2 });
          expect((await this.fonaToken.balanceOf(acc3)).toString()).to.equal('100000000000000000000')
        });

        //13. increaseAllowence, 14 decreaseAllowance, 15. burnFrom  
        it('13. increaseAllowance(acc2, 100 FONA) from owner\n\t 14. decreaseAllowance(acc2, 100 FONA) from owner\n\t 15. burnFrom(owner, 100 FONA) by acc2', 
        async function () {
          await this.fonaToken.approve(acc2, value, { from: owner });
          await this.fonaToken.increaseAllowance(acc2, value, { from: owner });
          expect((await this.fonaToken.allowance(owner, acc2)).toString()).to.equal('200000000000000000000')
          
          await this.fonaToken.decreaseAllowance(acc2, value, { from: owner });
          expect((await this.fonaToken.allowance(owner, acc2)).toString()).to.equal('100000000000000000000')
          
          await this.fonaToken.burnFrom(owner,value,{ from: acc2 });
          expect((await this.fonaToken.balanceOf(owner)).toString()).to.equal('999999900000000000000000000') &&
          expect((await this.fonaToken.totalSupply()).toString()).to.equal('999999900000000000000000000');
        });

      //16. MINTER_ROLE()  
      it('16. shows MINTER_ROLE()', async function () {
        await this.fonaToken.MINTER_ROLE();
        expect((await this.fonaToken.MINTER_ROLE()).toString()).to.equal('0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6');
      });

      //17. grantRole(0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6, acc2).
      it('17. grantRole(MINTER_ROLE,acc2) from owner\n\t 18. hasRole(MINTER_ROLE, acc2)', async function () {
        await this.fonaToken.grantRole('0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6', acc2, { from: owner });
        expect((await this.fonaToken.hasRole('0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6', acc2))).equal(true);

        await this.fonaToken.mint(acc3, value, { from: acc2 });
        expect((await this.fonaToken.balanceOf(acc3)).toString()).to.equal('100000000000000000000') &&
        expect((await this.fonaToken.totalSupply()).toString()).to.equal('1000000100000000000000000000');
      });

      //19. PAUSER_ROLE()  
      it('19. shows PAUSER_ROLE()', async function () {
        await this.fonaToken.PAUSER_ROLE();
        expect((await this.fonaToken.PAUSER_ROLE()).toString()).to.equal('0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a');
      });

      //20. pause, paused unpause.
      it('20. pause\n\t 21.paused\n\t 22.unpause', async function () {
        await this.fonaToken.pause({ from: owner });
        expect((await this.fonaToken.paused())).equal(true);

        await this.fonaToken.unpause({ from: owner });
        expect((await this.fonaToken.paused())).equal(false);
      });

      it('20b. reverts when token transfer while paused\n\t 20c. emits a Transfer event after running unpause()', async function () {
        await this.fonaToken.pause({ from: owner });
        await expectRevert(
          this.fonaToken.transfer(acc2, value, { from: owner }),
          'ERC20Pausable: token transfer while paused',
        );

        await this.fonaToken.unpause({ from: owner });
        const receipt = await this.fonaToken.transfer(
          acc3, value, { from: owner }
        );
    
        // Event assertions can verify that the arguments are the expected ones
        expectEvent(receipt, 'Transfer', {
          from: owner,
          to: acc3,
          value: value,
        });
      });

      //23. shows getRoleAdmin  
      it('23. shows getRoleAdmin(MINTER_ROLE)', async function () {
        await this.fonaToken.getRoleAdmin('0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6');
        expect((await this.fonaToken.getRoleAdmin('0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6')).toString())
          .to.equal('0x0000000000000000000000000000000000000000000000000000000000000000');
      });

      //24. getRoleMember 25. getRoleMemberCount 26. revokeRole 27. renounceRole  
      it('24. getRoleMember(PAUSER_ROLE,1)\n\t25. getRoleMemberCount(PAUSER_ROLE)\n\t26. revokeRole(PAUSER_ROLE, acc2) from owner)\n\t27. renounceRole(PAUSER_ROLE, acc3) from acc3', 
      async function () {
        await this.fonaToken.grantRole('0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a', acc2, { from: owner });
        await this.fonaToken.grantRole('0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a', acc3, { from: owner });
        expect((await this.fonaToken.getRoleMember('0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a', 1))).equal(acc2) &&
        expect((await this.fonaToken.getRoleMemberCount('0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a')).toString()).to.equal('3');

        await this.fonaToken.revokeRole('0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a', acc2, { from: owner })       
        expect((await this.fonaToken.hasRole('0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a', acc2))).equal(false);

        await this.fonaToken.renounceRole('0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a', acc3, { from: acc3 })       
        expect((await this.fonaToken.hasRole('0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a', acc3))).equal(false);
      });
});
