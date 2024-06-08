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
    "components": [
        {
        "name": "Corante Anilina",
        "step": 6,
        "desc": "paia"
        }
    ]
    }
}
'

JSON descriptions
type
0 = insert product
1 = insert production
2 = insert new sku (product)

"""

products = {}

def insert_product(input):
    msg_sender = input['msg_sender']
    if products.get(msg_sender, 0) == 0:
        products[msg_sender] = []
    products[msg_sender].append(input['data'])
    logger.info(f"Array {products[msg_sender]}")

#routes by type
routes = {
    0: insert_product
}
def handle_advance(data):
    logger.info(f"Received advance request data {data}")
    try:
        input = hex2str(data["payload"])
        input_json = json.loads(format(input))
        print(type(input_json))
        input_json['msg_sender'] = data['metadata']['msg_sender']
        handler_function = routes[input_json['type']]
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