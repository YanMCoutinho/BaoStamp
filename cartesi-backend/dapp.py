from os import environ
import requests
import logging
import traceback
import json

"""
BASIC STRUCTURE OF THE DAPP
"""
logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

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


def send_report(report: str) -> None:
    send_post("report", report)

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

def insert_sku(input):
    msg_sender = input['msg_sender']
    id = input['data']['production_id']

    if  id < 0 or len(production.get(msg_sender,  [])) <= 0 or len(production[msg_sender]) < id:
        msg = f"Production id {id} searched by {msg_sender} was not found."
        send_report({"payload": str2hex(msg)})
        raise ValueError(msg)
    
    if skus.get(msg_sender, 0) == 0:
        skus[msg_sender] = {id: []}
    elif skus[msg_sender].get(id, 0) == 0:
        skus[msg_sender][id] = []
    
    skus[msg_sender][id].append(input['data'])
    send_notice({"payload": str2hex(f"SKU {input['data']} inserted by {msg_sender}")})
    logger.info(f"Inserting sku {input['data']} for production id {id} by {msg_sender}")

#routes by type
advance_routes = {
    0: insert_production,
    1: insert_sku
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
        handler_function(input_json)        

    except Exception as e:
        msg = f"Error {e} processing data {data}"
        logger.error(f"{msg}\n{traceback.format_exc()}")
        send_report({"payload": str2hex(msg)})
        return "reject"
    
    return "accept"


def handle_inspect(data):
    logger.info(f"Received inspect request data {data}")
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
    response = requests.post(rollup_server + "/finish", json=finish)
    logger.info(f"Received finish status {response.status_code}")
    if response.status_code == 202:
        logger.info("No pending rollup request, trying again")
    else:
        rollup_request = response.json()
        data = rollup_request["data"]
        handler = handlers[rollup_request["request_type"]]
        finish["status"] = handler(rollup_request["data"])