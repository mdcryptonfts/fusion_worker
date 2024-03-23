const config = require('./config.json');
const { submitAddLiquidityTx } = require('./add_liquidity');
const { claimgbmvote } = require('./claimgbmvote');
const { claimrefund } = require('./claimrefund');
const { clearexpired } = require('./clearexpired');

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

	/** @submitAddLiquidityTx
	 *  every 6 hours, try adding liquidity (it can be called once a day)
	 */
	setInterval(() => submitAddLiquidityTx(), config.one_minute * 360 );

	/** @claimgbmvote
	 *  every 6 hours + 1 minute, try claiming voting rewards from POL contract
	 */
	setInterval(() => claimgbmvote(), config.one_minute * 360 );	

	/** @claimrefund
	 *  every 1 hour try claiming any refunds from the POL contract
	 */
	setInterval(() => claimrefund(), config.one_minute * 60 );	

	/** @clearexpired
	 * 	deletes/unstakes expired CPU rentals from POL contract
	 *  needs to run every minute to make sure all expired orders are cleared
	 * 	in the 5 minute window
	 */
	setInterval(() => clearexpired(), config.one_minute );	



	/** @dapp_contract_transactions */		

	/** @claimgbmvoteFromDappContract
	 */
	setInterval(() => claimgbmvoteFromDappContract(config.cpu_contracts.contract1), config.one_minute - 3000 );
	setInterval(() => claimgbmvoteFromDappContract(config.cpu_contracts.contract2), config.one_minute - 2000 );
	setInterval(() => claimgbmvoteFromDappContract(config.cpu_contracts.contract3), config.one_minute - 1000);	


    process.on('SIGINT', () => {
        process.exit();
    });	
	
};

runApp();