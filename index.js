const config = require('./config.json');
const { submitAddLiquidityTx } = require('./add_liquidity');


const runApp = async () => {

	console.log("App is running")
					      
	/** @submitAddLiquidityTx
	 *  every 6 hours, try adding liquidity (it can be called once a day)
	 */
	setInterval(() => submitAddLiquidityTx(), (60 * 1000) );

    process.on('SIGINT', () => {
        process.exit();
    });	
	
};

runApp();