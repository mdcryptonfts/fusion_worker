const config = require('./config.json');
const { submitAddLiquidityTx } = require('./add_liquidity');
const { claimbgmvote } = require('./claimbgmvote');


const runApp = async () => {

	console.log("App is running")
					      
	/** @submitAddLiquidityTx
	 *  every 6 hours, try adding liquidity (it can be called once a day)
	 */
	setInterval(() => submitAddLiquidityTx(), (60 * 60 * 6 * 1000) );

	/** @claimgbmvote
	 *  every 6 hours + 1 minute, try adding claimbgmvote (it can be called once a day)
	 */
	setInterval(() => claimbgmvote(), (60 * 1000) + 1 );	

    process.on('SIGINT', () => {
        process.exit();
    });	
	
};

runApp();