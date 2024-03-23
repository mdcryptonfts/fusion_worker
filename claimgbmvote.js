const config = require('./config.json');
const { Session } = require('@wharfkit/session');
const { WalletPluginPrivateKey } = require('@wharfkit/wallet-plugin-privatekey')

const claimgbmvote = async () => {
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
          account: config.contracts.pol_contract,
          name: 'claimgbmvote',
          authorization: [{
            actor: config.permission.wallet,
            permission: config.permission.permission_name,
          }],
          data: {
          }
        }]
      }, {
        blocksBehind: config.blocks_behind,
        expireSeconds: config.expire_seconds
      });

      const result = await Promise.race([apiCallPromise, new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), config.transaction_timeout))]);

      console.log("\n\nclaimgbmvote submission successful");
      success = true;
      return success;
    } catch (e) {
      console.log(`error submitting claimgbmvote: ${e}`);
    }
  }

  return success;
};

module.exports = {
  claimgbmvote
};
