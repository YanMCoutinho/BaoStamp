import { ethers } from "ethers";
import configFile from "./config.json";
import { hexValue } from "ethers/lib/utils";
import {
    InputBox,
    InputBox__factory
} from "./generated/rollups";

class User{
    cnpj: string = "";
    corporate_name: string = "";
    fantasy_name: string = "";
    open_date: string = "yyyy-mm-dd";
    size: string = "";
    juridical_nature: string = "";
    MEI: boolean = true;
    simple: boolean = true;
    type: string = "SA";
    situation: string = "N/A";
}

export class Cartesi {
  config: any;
  provider: ethers.providers.Web3Provider | null = null;
  signer: ethers.Signer | null = null;
  inputContract: string = ""
  erc721Contract: string = ""
  relayApp: string = ""
  dappAddress: string = ""
  inspectURL: string = ""


  constructor() {
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    this.config = configFile;
    //primeira chave do arquivo config.json
    this.inputContract = this.config[Object.keys(this.config)[0]].InputBoxAddress;
    this.erc721Contract = this.config[Object.keys(this.config)[0]].Erc721PortalAddress;
    this.relayApp = this.config[Object.keys(this.config)[0]].RelayAppAddress;
    this.dappAddress = "0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e";
    this.signer = this.provider.getSigner();
    this.inspectURL = this.config[Object.keys(this.config)[0]].inspectAPIURL;
  }

  async switchChain() {
    //pegar valor da primeira chave mas tirar os 2 primeiros caracteres

    const chainId = Object.keys(this.config)[0].slice(2);
    console.log(chainId)
    if (this.provider) {
      await this.provider.send("wallet_switchEthereumChain", [
        { chainId: `0x${chainId.toString()}` },
      ]);
      console.log(`Switched to chain ${chainId}`);
      return chainId;
    } else {
      throw new Error("No wallet is connected");
    }
  }

  async disconnectWallet() {
    if (this.provider) {
      this.provider = null;
      this.signer = null;
      console.log("Disconnected wallet");
      return true;
    } else {
      console.error("No wallet is connected");
      return false;
    }
  }

  async connectWallet() {
    if (window.ethereum) {
      if (!this.provider) {
        this.provider = new ethers.providers.Web3Provider(window.ethereum);
      }
      const accounts = await this.provider.listAccounts();
      if (accounts.length === 0) {
        await this.provider.send("eth_requestAccounts", []);
        this.signer = this.provider.getSigner();
        const address = await this.signer.getAddress();
        console.log(`Connected wallet address: ${address}`);
        await this.switchChain();
        return true;
      } else {
        console.log(`Already connected: ${accounts[0]}`);
        return true;
      }
    } else {
      throw new Error("MetaMask is not installed");
    }
  }
  
  async isConnected() {
    if (window.ethereum) {
      if (!this.provider) {
        this.provider = new ethers.providers.Web3Provider(window.ethereum);
      }
      const accounts = await this.provider.listAccounts();
      if (accounts.length === 0) {
        console.log("No wallet is connected");
        return false;
      } else {
        console.log(`Already connected: ${this.signer}`);
        return true;
      }
    } else {
      console.log("No wallet is connected");
      return false;
    }
  }

  utf8BytesToString(bytes: Uint8Array) {
    return ethers.utils.toUtf8String(bytes);
  }
  hex2string(hex: string) {
    return ethers.utils.toUtf8String(hex);
    }

    string2hex(str: string) {
        return ethers.utils.toUtf8Bytes(str);
    }

    async sendInputBox(value: string) {
        const payload: Uint8Array = this.string2hex(value);
        console.log(`Sending value: ${value}`);
        try{
          if (this.signer) {
            console.log(`Sending input with account ${await this.signer.getAddress()}`)
              const inputContract = InputBox__factory.connect(this.inputContract, this.signer);
              await inputContract.addInput(this.dappAddress, payload);
              console.log("Input sent");
              return true;
          }else{
              console.error("No wallet is connected");
              return false;
          }
        }catch(error){
          console.error(error);
          return false;
        }
        
    }

    async getInspect(route:string){
      try{
        const account = await this.signer?.getAddress();
        const response = await fetch(`${this.inspectURL}/inspect/${route}/${account}`);

        const data = await response.json();
        let payload = this.hex2string(data.reports[0].payload);
        if(payload){
          return payload
        }else{
          console.error("No data found");
          return false;
        }
      }catch(error){
        console.error("get inspect error: ",error);
        return false;
      }
    }

    async sign(user: User){
      console.log("Signing user");
      const newUserInput = {"type":2, data: user};
      const payload = JSON.stringify(newUserInput);
      console.log(`Sending value: ${JSON.stringify(newUserInput)}`);
      try{
        if(this.signer){
          console.log(`Signing with account ${await this.signer.getAddress()}`)
          const sendInput = await this.sendInputBox(payload);
          if(sendInput){
            return true;
          }else{
            console.error("Error sending input");
            return false;
          }
        }else{
          console.error("No wallet is connected at sign function");
          return false;
        }
      }catch(error){
        console.error(error);
        return false;
      }
    }

}
