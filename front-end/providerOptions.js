import Portis from "@portis/web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Fortmatic from "fortmatic";
const providerOptions = {
  portis: {
    package: Portis, 
    options: {
      id: "4ae59703-f6d5-49cd-a727-5145998c55cd"
    }
  },
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: "https://rinkeby.infura.io/v3/310c4c6ad23941cba0388859c3d2411f" // required
    }
  },
  fortmatic: {
    package: Fortmatic, // required
    options: {
      key: "pk_test_EBC181430C93A5B6" // required
    }
  }
};

export default providerOptions;