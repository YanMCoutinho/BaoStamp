from os import environ
import logging
import requests
import json
import erc721.json as erc721_json



ERC721_CONTRACT_ADDRESS = erc721_json["address"]

abi = erc721_json["abi"]

last_token_id = 0

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

execution = b'x'

rollup_server = environ["ROLLUP_HTTP_SERVER_URL"]
logger.info(f"HTTP rollup_server url is {rollup_server}")

def hex2str(hex):
    """
    Decodes a hex string into a regular string
    """
    return bytes.fromhex(hex[2:]).decode("utf-8")


def str2hex(str):
    """
    Encodes a string as a hex string
    """
    return "0x" + str.encode("utf-8").hex()


def json2hex(jsons):
    """
    Encodes a json as a hex string
    """
    return str2hex(json.dumps(jsons))


def send_voucher(voucher):
    """
    Sends a voucher to the rollup server
    """
    response = requests.post(rollup_server + "/voucher", json=voucher)
    logger.info(f"Received response status {response.status_code}, {response.text}, {response.json()}")
    if response.status_code == 201:
        logger.info("Voucher sent successfully")
        return True


def get_next_token_id():
    global last_token_id
    last_token_id += 1
    return last_token_id


def mint_nft(sender, metadata,  status):
    global last_token_id
    token_id = get_next_token_id()
    
    logger.info(f"Minting NFT with token_id {token_id} for sender {sender}")
    token_uri = ""
    
    if status == "accept":
        token_uri = f"https://fastly.picsum.photos/id/119/200/200.jpg?hmac=JGrHG7yCKfebsm5jJSWw7F7x2oxeYnm5YE_74PhnRME"
    else:
        token_uri = f"https://fastly.picsum.photos/id/62/200/200.jpg?hmac=IdjAu94sGce82DBYTMbOYzXr7kup1tYqdr0bHkRDWUs"
        
    #metadata is a json
    metadata = {
        "to": sender,
        "token_id": token_id,
        "token_uri": token_uri,
        "metadata": metadata
    }
    
    execution_function_encoded = abi.encode_function_call("depositERC721Token", [ERC721_CONTRACT_ADDRESS, sender, token_id, json2hex(metadata), ""])
    
    send_voucher({
        "execution": execution_function_encoded,
        "metadata": metadata
    })
    
    
    
    
    

def handle_advance(data):
    logger.info(f"Received advance request data {data}")
    input = hex2str(data["payload"])
    input = json.loads(input)
    
    if input["create_nft"] == "yes":
        metadata = {
            "fluxo do sku": ["sku1", "sku2", "sku3"],
            "resultado do modelo": 0,
            "resumo do produto": {
                "nome": "produto",
                "descricao": "descricao",
                "preco": 100
            }
        }
        mint_nft(data["metadata"]["msg_sender"].lower(), metadata, "accept")
    return "accept"


def handle_inspect(data):
    logger.info(f"Received inspect request data {data}")
    return "accept"


handlers = {
    "advance_state": handle_advance,
    "inspect_state": handle_inspect,
}

finish = {"status": "accept"}

while True:
    logger.info("Sending finish")
    response = requests.post(rollup_server + "/finish", json=finish)
    logger.info(f"Received finish status {response.status_code}")
    if response.status_code == 202:
        logger.info("No pending rollup request, trying again")
    else:
        rollup_request = response.json()
        data = rollup_request["data"]
        handler = handlers[rollup_request["request_type"]]
        finish["status"] = handler(rollup_request["data"])
