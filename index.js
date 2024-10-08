const config = require('./config.json');
const { claimrefund } = require('./claimrefund');
const { createfarms } = require('./create_farms');
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
	setInterval(() => transact(config.contracts.pol_contract, "claimgbmvote", {}), config.one_minute * 360 );

	/** @claimrefund
	 *  every 1 hour try claiming any refunds from the POL contract
	 */
	setInterval(() => claimrefund(config.contracts.pol_contract), config.one_minute * 60 );	

	/** @clearexpired
	 * 	deletes/unstakes expired CPU rentals from POL contract
	 *  needs to run every minute to make sure all expired orders are cleared
	 * 	in the 5 minute window
	 */
	setInterval(() => transact(config.contracts.pol_contract, "clearexpired", {limit: 1000}), config.one_minute);

	/** @rebalance 
	 * 	rebalances the lswax/wax buckets in the pol contract 
	 */
	setInterval(() => transact(config.contracts.pol_contract, "rebalance", {}), config.one_minute * 230 );


	/** @dapp_contract_transactions */		

	/** @claimgbmvote
	 */
	setInterval(() => transact(config.contracts.dapp_contract, "claimgbmvote", {cpu_contract: config.cpu_contracts.contract1}), config.one_minute - 3000 );
	setInterval(() => transact(config.contracts.dapp_contract, "claimgbmvote", {cpu_contract: config.cpu_contracts.contract2}), config.one_minute - 2000 );
	setInterval(() => transact(config.contracts.dapp_contract, "claimgbmvote", {cpu_contract: config.cpu_contracts.contract3}), config.one_minute - 1000 );

	/** @claimrefunds
	 *  every 1 hour try claiming any refunds from the cpu contracts (via dapp contract)
	 */
	setInterval(() => claimrefund(config.contracts.dapp_contract), config.one_minute * 2 );	

	/** @createfarms
	 *  every 12 hours, try creating incentives on alcor
	 */
	setInterval(() => createfarms(config.contracts.dapp_contract), config.one_minute * 60 * 12 );

	/** @compound
	 *  every 5 minutes, compound lsWAX
	 */
	setInterval(() => transact(config.contracts.dapp_contract, "compound", {}), config.one_minute * 5 );		

	/** @reallocate 
	 * 	when necessary, move unclaimed funds from redemption pool back to rental pool
	 */
	setInterval(() => transact(config.contracts.dapp_contract, "reallocate", {}), config.one_minute * 10 );			

	/** @sync */
	setInterval(() => transact(config.contracts.dapp_contract, "sync", {caller: config.permission.wallet}), config.one_minute * 30 );

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