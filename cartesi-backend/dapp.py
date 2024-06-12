from os import environ
import requests
import logging
import traceback
import json

erc721_json = json.load(open("erc721.json"))


ERC721_CONTRACT_ADDRESS = erc721_json["address"].lower()

abi = erc721_json["abi"]

last_token_id = 0

"""
BASIC STRUCTURE OF THE DAPP
"""
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

def send_notice(notice: str) -> None:
    send_post("notice", notice)

def dict2hex(dict):
    """
    Encodes a dictionary as a hex string
    """
    return str2hex(json.dumps(dict))

def send_report(report: dict) -> None:
    try:
        # Convert the report dictionary to a JSON string and then to a hex string
        report_hex = str2hex(json.dumps(report))
        response = requests.post(rollup_server + "/report", json={"payload": report_hex})
        logger.info(f"Received response status {response.status_code} body {response.content}")
    except Exception as e:
        logger.error(f"Error sending report {report} {e}")


def send_post(endpoint, json_data) -> None:
    response = requests.post(rollup_server + f"/{endpoint}", json=json_data)
    logger.info(
        f"/{endpoint}: Received response status {response.status_code} body {response.content}")

"""
CUSTOM FUNCTIONS
"""

def classify(input):
    return 0

"""
Expected JSON
payload
    '
{
    "type": 0,
    "data": {
    "product_name": "name",
    "steps": [
        {
        "step": 1,
        "process": "process_name",
        "inputs": {
            "item_name": "qtd"
        },
        "output": {
            "item_name": "qtd"
        },
        "date_init": "2023-01-01",
        "date_end": "2023-07-01",
        "desc": ""
        },
        {
        "step": 1,
        "process": "process_name",
        "inputs": {
            "item_name": "qtd"
        },
        "output": {
            "item_name": "qtd"
        },
        "date_init": "2023-01-01",
        "date_end": "2023-07-01",
        "desc": ""
        }
    ],
    "active": true
  }
}'

// 1: route data input
'
{
    "production_id": 1,
    "components": {
        "item_name": {
            "steps": 6,
            "qtd": 1
        }
    }
}
'

"""

def compare_sku_production(production):
    """
    Compares the production and sku data
    """
    product = production['product_name']
    

production = {}
skus = {}
users = []

def insert_production(input):
    msg_sender = input['msg_sender']
    if production.get(msg_sender, 0) == 0:
        production[msg_sender] = []
        users.append(msg_sender)
    production[msg_sender].append(input['data'])
    msg = f"Production {input['data']['product_name']} inserted by {msg_sender}. Production id {len(production[msg_sender]) - 1}"
    send_notice({"payload": str2hex(msg)})

def inspect_users(data):
    logger.info(f"Users: {users}")
    return users
"""

{'type': 1, 'data': {'id': 1, 'name': 'roupa incrivel da piet', 'description': 'Essa roupa da piet é a mais incrivel de todas as roupas da piet', 'components': ['algodao', 'nylon']}, 'msg_sender': '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'}
"""
def insert_sku(input):
    logger.info(f"Inserting sku ....... {input}")
    msg_sender = input["msg_sender"]
    sku_data = input["data"]

    logger.info(f"User {msg_sender} have that skus: {skus.get(msg_sender, {})}")
    
    if msg_sender not in skus:
        skus[msg_sender] = {}
    
    skus[msg_sender][sku_data["id"]] = sku_data
    msg = f"SKU {sku_data['name']} inserted by {msg_sender}. SKU id {sku_data['id']}"
    
    logger.info(f"Now user {msg_sender} have that skus: {skus.get(msg_sender, {})}")
    send_notice({"payload": str2hex(msg)})
    
    

def get_skus(msg_sender):
    
    try:
        skus_list = skus.get(msg_sender, {})
        logger.info(f"Getting skus for user {msg_sender}:  {skus_list}")
        send_report({"payload": skus_list})
    except Exception as e:
        logger.error(f"Error sending report of the insert sku {e}")
  
def mint_nft(input):
    global last_token_id
    token_id = get_next_token_id()
    sender = input["msg_sender"]
    status = input["data"]["status"]
    metadata = input["data"]["metadata"]
    
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
    
    logger.info(f"Metadata for token_id {token_id} is {metadata}")

#routes by type
advance_routes = {
    0: insert_production,
    1: insert_sku,
    3: mint_nft
}

inspect_routes = {
    0: get_skus,
    1: inspect_users
}
def cast_input_json(received_json):
    """
    JSON descriptions
    type
    0 = insert production
    1 = insert new sku (product)

    """
    desired_json = {
        "type": received_json.get("type", -1),
        "data": received_json.get("data", {})
        }
    return desired_json

def handle_advance(data):
    logger.info(f"Received advance request data {data}")
    try:
        input = hex2str(data["payload"])
        input_json = json.loads(format(input))
        input_json = cast_input_json(input_json)

        #call the function in the route
        input_json['msg_sender'] = data['metadata']['msg_sender']
        handler_function = advance_routes[input_json['type']]
        logger.info(f"Handle Advance: Calling handler function {handler_function} with input {input_json}")
        handler_function(input_json)

    except Exception as e:
        msg = f"Error {e} processing data {data}"
        logger.error(f"{msg}\n{traceback.format_exc()}")
        send_report({"payload": str2hex(msg)})
        return "reject"


def json2hex(jsons):
    """
    Encodes a json as a hex string
    """
    return str2hex(json.dumps(jsons))


def send_nf_token():
    pass

def get_next_token_id():
    global last_token_id
    last_token_id += 1
    return last_token_id

def handle_inspect(data):
    route = hex2str(data["payload"])
    
    #pegar o que estiver dps de get_skus-
    if route.split("-")[0] == "get_skus":
        newRoute = route.split("-")[0]
        msg_sender = route.split("-")[1]
        logger.info(f"Route {newRoute} and msg_sender {msg_sender}")
        handler = inspect_routes[classify(newRoute)]
        handler(msg_sender)
    else:
        logger.info(f"Route {route}")
        handler = inspect_routes[classify(route)]
        handler(data)
    
    logger.info(f"Received inspect request data {data}, at payload {route}")
    return "accept"


"""
Other dapp functions
"""
handlers = {
    "advance_state": handle_advance,
    "inspect_state": handle_inspect,
}

finish = {"status": "accept"}

while True:
    logger.info("Sending finish")
    try:
        response = requests.post(rollup_server + "/finish", json=finish)
        logger.info(f"Received finish status {response.status_code}")
        if response.status_code == 202:
            logger.info("No pending rollup request, trying again")
        else:
            rollup_request = response.json()
            data = rollup_request["data"]
            handler = handlers[rollup_request["request_type"]]
            finish["status"] = handler(rollup_request["data"])
    except Exception as e:
        logger.error(f"Error sending finish {e}")
        break