const config = require('./config.json');
const { claimgbmvote, claimgbmvoteFromDappContract } = require('./claimgbmvote');
const { claimrefund } = require('./claimrefund');
const { clearexpired } = require('./clearexpired');
const { sync } = require('./sync');
const { createfarms } = require('./createfarms');
const { compound_lswax } = require('./compound_lswax');
const { transact } = require('./transact');

const runApp = async () => {

	console.log("App is running")

	/**
	 *  @TODO
	 * 	go through all the transactions and add logic that checks the chain state
	 * 	and determines whether or not a transaction needs to be submitted
	 * 	then each function below can run much more frequently as it will just 
	 * 	exit without submitting a transaction if one doesnt need to be sent
	 */
					   

	/** @pol_contract_transactions */	

	/** @claimgbmvote
	 *  every 6 hours + 1 minute, try claiming voting rewards from POL contract
	 */
	setInterval(() => claimgbmvote(), config.one_minute * 360 );	

	/** @claimrefund
	 *  every 1 hour try claiming any refunds from the POL contract
	 */
	setInterval(() => claimrefund(config.contracts.pol_contract), config.one_minute * 60 );	

	/** @clearexpired
	 * 	deletes/unstakes expired CPU rentals from POL contract
	 *  needs to run every minute to make sure all expired orders are cleared
	 * 	in the 5 minute window
	 */
	setInterval(() => clearexpired(), config.one_minute );	

	/** @rebalance 
	 * 	rebalances the lswax/wax buckets in the pol contract 
	 */
	setInterval(() => transact(config.contracts.pol_contract, "rebalance", {}), config.one_minute * 230 );


	/** @dapp_contract_transactions */		

	/** @claimgbmvoteFromDappContract
	 */
	setInterval(() => claimgbmvoteFromDappContract(config.cpu_contracts.contract1), config.one_minute - 3000 );
	setInterval(() => claimgbmvoteFromDappContract(config.cpu_contracts.contract2), config.one_minute - 2000 );
	setInterval(() => claimgbmvoteFromDappContract(config.cpu_contracts.contract3), config.one_minute - 1000);	

	/** @claimrefunds
	 *  every 1 hour try claiming any refunds from the cpu contracts (via dapp contract)
	 */
	setInterval(() => claimrefund(config.contracts.dapp_contract), config.one_minute * 60 );	

	/** @createfarms
	 *  every 12 hours, try creating incentives on alcor
	 */
	setInterval(() => createfarms(config.contracts.dapp_contract), config.one_minute * 60 * 12 );

	/** @compound_lswax
	 *  every 5 minutes, compound lsWAX
	 */
	setInterval(() => compound_lswax(config.contracts.dapp_contract), config.one_minute * 5 );		

	/** @reallocate 
	 * 	when necessary, move unclaimed funds from redemption pool back to rental pool
	 */
	setInterval(() => transact(config.contracts.dapp_contract, "reallocate", {}), config.one_minute * 10 );			

	/** @stakeallcpu 
	 * 	
	 */
	setInterval(() => transact(config.contracts.dapp_contract, "stakeallcpu", {}), config.one_minute * 5 );	

	/** @sync */
	setInterval(() => sync(), config.one_minute - 5000 );	

	/** @unstakecpu 
	 * 	
	 */
	setInterval(() => transact(config.contracts.dapp_contract, "unstakecpu", {"epoch_id": 0, "limit": 0}), config.one_minute * 2 );

	/** @updatetop21 
	 * 	
	 */
	setInterval(() => transact(config.contracts.dapp_contract, "updatetop21", {}), config.one_minute * 240 );		


    process.on('SIGINT', () => {
        process.exit();
    });	
	
};

runApp();