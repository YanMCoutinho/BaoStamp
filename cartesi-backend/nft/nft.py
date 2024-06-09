import requests

ERC721_CONTRACT_ADDRESS = "0x237F8DD094C0e47f4236f12b4Fa01d6Dae89fb87"

last_token_id = 0


"""
    fluxo do sku: [],
    resultado do modelo: num,
    resumo do produto: obj,
"""
def get_next_token_id():
    global last_token_id
    last_token_id += 1
    return last_token_id

def mint_nft(sender, metadata, logger, status, str2hex, hex2str):
    global last_token_id
    token_id = get_next_token_id()
    
    logger.info(f"Minting NFT with token_id {token_id} for sender {sender}")
    token_uri = ""
    
    if status == "accept":
        token_uri = f"https://fastly.picsum.photos/id/119/200/200.jpg?hmac=JGrHG7yCKfebsm5jJSWw7F7x2oxeYnm5YE_74PhnRME"
    else:
        token_uri = f"https://fastly.picsum.photos/id/62/200/200.jpg?hmac=IdjAu94sGce82DBYTMbOYzXr7kup1tYqdr0bHkRDWUs"
        
    #metadata is a json
    data = {
        "to": sender,
        "token_id": token_id,
        "token_uri": token_uri,
        "metadata": metadata
    }
    
    payload = str2hex(data)
    voucher = {
        "contract_address": ERC721_CONTRACT_ADDRESS,
        "payload": payload
    }
    
    logger.info(f"Sending mint request with voucher {voucher}")
    