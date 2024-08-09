import { ethers } from "ethers";
import configFile from "../config.json";
import { hexValue } from "ethers/lib/utils";
import { getVoucher, executeVoucher, getUnexecutedVouchers } from "@mugen-builders/client";
import {
    InputBox,
    InputBox__factory
} from "../generated/rollups";

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


  constructor(dapp_address: string = "0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e") {

    this.provider = null;
    if (window.ethereum) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.config = configFile;
      this.inputContract = this.config[Object.keys(this.config)[0]].InputBoxAddress;
      this.erc721Contract = this.config[Object.keys(this.config)[0]].Erc721PortalAddress;
      this.relayApp = this.config[Object.keys(this.config)[0]].RelayAppAddress;
      this.dappAddress = dapp_address;
      this.signer = this.provider.getSigner();
      this.inspectURL = this.config[Object.keys(this.config)[0]].inspectAPIURL;
    }else{
      throw new Error("MetaMask is not installed");
    }
  }

  async executeVoucher(voucher_index: number, input_index: number, graphqlUrl: string = "http://localhost:8080") {
    let voucher = await getVoucher(graphqlUrl + '/graphql', voucher_index, input_index);
    if (voucher.proof && this.signer) {
      try {
          const tx = await executeVoucher(this.signer, this.dappAddress, voucher.input.index, voucher.index, graphqlUrl);
          return {"error": false, "tx": tx, "msg": "Voucher executed"};
      } catch (e) {
          return {"error": true, "tx": null, "msg": "An error occurred"};
      }
    }
  }

  
  async switchChain() {
    const chainId = Object.keys(this.config)[0].slice(2);
    if (this.provider) {
      await this.provider.send("wallet_switchEthereumChain", [
        { chainId: `0x${chainId.toString()}` },
      ]);
      return chainId;
    } else {
      throw new Error("No wallet is connected");
    }
  }

  async disconnectWallet() {
    if (this.provider) {
      this.provider = null;
      this.signer = null;
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
        await this.switchChain();
        return true;
      } else {
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
        return false;
      } else {
        return true;
      }
    } else {
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
        try{
          if (this.signer) {
              const inputContract = InputBox__factory.connect(this.inputContract, this.signer);
              await inputContract.addInput(this.dappAddress, payload);
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
    async getInspectClient(route:string){
      try{
        const response = await fetch(`${this.inspectURL}/inspect/${route}`);

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
      const newUserInput = {"type":2, data: user};
      const payload = JSON.stringify(newUserInput);
      try{
        if(this.signer){
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

    async isUserSigned(){
      try{
        const account = await this.signer?.getAddress();
        const response = await fetch(`${this.inspectURL}/inspect/users`);
        const data = await response.json();
        let payload = JSON.parse(this.hex2string(data.reports[0].payload).replace(/'/g, '"'));
        //verificar se account está na lista de usuários
        if(account){
          if(payload.includes(account.toLowerCase())){
            return true;
          }else{
            return false;
          }
        }else{
          console.error("No account found");
          return false;
        }
      }
      catch(error){
        console.error("Error fetching user data: ",error);
        return false;
      }
    }

    async getCompanies(){
      try{
        const response = await fetch(`${this.inspectURL}/inspect/users`);
        const data = await response.json();
        let payload = JSON.parse(this.hex2string(data.reports[0].payload).replace(/'/g, '"'));
        return payload;
      }catch(error){
        console.error("Error fetching companies: ",error);
        return false;
      }
    }

    async getCompaniesData() {
      try {
          const companiesAddress = await this.getCompanies();
          let companiesData = [];
          for (const company of companiesAddress) {
              const response = await fetch(`${this.inspectURL}/inspect/user/${company}`);
              const data = await response.json();
  
              let payloadString = ethers.utils.toUtf8String(data.reports[0].payload);
  
              // Substituir aspas simples por aspas duplas
              let jsonString = payloadString.replace(/'/g, '"').replace(/\bTrue\b/g, 'true').replace(/\bFalse\b/g, 'false');
  
              let payload;
              try {
                  payload = JSON.parse(jsonString);
              } catch (e:any) {
                  console.error("Erro ao parsear JSON:", e.message, "Payload string:", jsonString);
                  throw new Error("Erro ao parsear JSON: " + e.message);
              }
              companiesData.push({payload});
          }
          return companiesData;
      } catch (error) {
          console.error("Erro ao buscar dados das empresas:", error);
          throw new Error("Error fetching companies data: " + error);
      }
  }  
  
  async getCompanyData(companyAddress: string) {
    try {
        const response = await fetch(`${this.inspectURL}/inspect/user/${companyAddress}`);
        const data = await response.json();

        let payloadString = ethers.utils.toUtf8String(data.reports[0].payload);

        // Substituir aspas simples por aspas duplas
        let jsonString = payloadString.replace(/'/g, '"').replace(/\bTrue\b/g, 'true').replace(/\bFalse\b/g, 'false');

        let payload;
        try {
            payload = JSON.parse(jsonString);
        } catch (e:any) {
            console.error("Erro ao parsear JSON:", e.message, "Payload string:", jsonString);
            throw new Error("Erro ao parsear JSON: " + e.message);
        }
        return payload;
    } catch (error) {
        console.error("Erro ao buscar dados da empresa:", error);
        throw new Error("Error fetching company data: " + error);
    }
  }

  async getProduct(address:string, product_id:string){
    try{
      const response = await fetch(`${this.inspectURL}/inspect/productions/${address}/${product_id}`);
      const data = await response.json();
      let payload = JSON.parse(this.hex2string(data.reports[0].payload).replace(/'/g, '"'));
      return payload;
    }catch(error){
      console.error("Error fetching product: ",error);
      return false;
    }
  }

  async getProducts(address: string){
    try{
      const response = await fetch(`${this.inspectURL}/inspect/products/${address}`);
      const data = await response.json();
      let payload = JSON.parse(this.hex2string(data.reports[0].payload).replace(/'/g, '"'));
      return payload;
    }catch(error){
      console.error("Error fetching products: ",error);
      return false;
    }
  }
  
}

