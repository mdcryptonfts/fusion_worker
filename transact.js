const config = require('./config.json');
const { Session } = require('@wharfkit/session');
const { WalletPluginPrivateKey } = require('@wharfkit/wallet-plugin-privatekey')

const transact = async (contract, action, data) => {
  let success = false;

  for (let endpoint of config.chain_api.endpoints) {
    try {

      const WAX_CHAIN = { id: config.chain_api.chain_id, 
                          url: endpoint }  

      const session = new Session({
          actor: config.permission.wallet,
          permission: config.permission.permission_name,
          chain: WAX_CHAIN,
          walletPlugin: new WalletPluginPrivateKey(config.permission.private_key)
      })                          

      const apiCallPromise = session.transact({
        actions: [{
          account: contract,
          name: action,
          authorization: [{
            actor: config.permission.wallet,
            permission: config.permission.permission_name,
          }],
          data: data
        }]
      }, {
        blocksBehind: config.blocks_behind,
        expireSeconds: config.expire_seconds
      });

      const result = await Promise.race([apiCallPromise, new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), config.transaction_timeout))]);

      console.log(`\n\n${action} submission successful`);
      success = true;
      return success;
    } catch (e) {
      console.log(`error submitting ${action}: ${e}`);
      if(e?.indexOf("assertion failure with message") > -1){
        return false;
      }      
    }
  }

  return success;
};

module.exports = {
  transact
};
