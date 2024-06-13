import logging
from cartesi.router import DAppAddressRouter
from cartesi.wallet.ether import EtherWallet
from cartesi import DApp, Rollup, RollupData, JSONRouter, ABIRouter, ABILiteralHeader, ABIFunctionSelectorHeader, URLRouter, URLParameters

LOGGER = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG)

ETHER_PORTAL_ADDRESS = '0xffdbe43d4c855bf7e0f105c400a50857f53ab044'
ADDRESS_RELAY_ADDRESS = '0xf5de34d6bbc0446e2a45719e718efebaae179dae'

dapp = DApp()
abi_router = ABIRouter()
url_router = URLRouter()
json_router = JSONRouter()
dapp_address = DAppAddressRouter(relay_address=ADDRESS_RELAY_ADDRESS)
ether_wallet = EtherWallet(portal_address=ETHER_PORTAL_ADDRESS, dapp_address_router=dapp_address)

dapp.add_router(json_router)
dapp.add_router(url_router)
dapp.add_router(ether_wallet)
dapp.add_router(dapp_address)


"""
LOCAL VARIABLES
"""
users = {}
products = {}
productions = {}


"""
PRODUCT INPUT
"""
@json_router.advance({"type": 0}) #insert product
def product_input(rollup: Rollup, data: RollupData) -> bool:
    payload = data.json_payload()
    msg_sender = str(data.metadata.msg_sender).lower()

    if products.get(msg_sender, 0) == 0:
        products[msg_sender] = []
        productions[msg_sender] = []
        users[msg_sender] = True

    if payload.get('data', 0) == 0:
        msg = "No data was sent in the payload"
        rollup.report("0x" + str(msg).encode('utf-8').hex())
        return False
    
    elif payload['data'].get('name', "") == '' or payload['data'].get('description', "") == '' or payload['data'].get('components', "") == '':
        msg = "Missing data in the payload"
        rollup.report("0x" + str(msg).encode('utf-8').hex())
        return False

    new_product =  {
        "id": len(products[msg_sender]),
        "name": payload['data']['name'],
        "description": payload['data']['description'],
        "components": payload['data']['components'],
    }

    products[msg_sender].append(new_product)

    LOGGER.debug("Echoing in type 0 data was inserted")
    msg = "product from user " + msg_sender + " was inserted at " + str(new_product['id'])
    rollup.notice("0x" + str(msg).encode('utf-8').hex())

    return True



"""
PRODUCTION INPUT
"""
@json_router.advance({"type": 1}) # insert production (each time)
def product_input(rollup: Rollup, data: RollupData) -> bool:
    payload = data.json_payload()
    LOGGER.debug("Echoing in type 1 '%s'", payload)
    LOGGER.debug(data)
    rollup.notice("0x" + str(payload).encode('utf-8').hex())
    return True



"""
BALANCE
"""
@url_router.inspect('balance/ether/{address}')
def balance_of_wallet(rollup: Rollup, params: URLParameters) -> bool:
    msg = f"Balance: {ether_wallet.balance.get(params.path_params['address'].lower(), 0)} wei"
    rollup.notice('0x' + msg.encode('utf-8').hex())
    return True


"""
INSPECT PRODUCTS
"""

@url_router.inspect('products/{address}')
def balance_of_wallet(rollup: Rollup, params: URLParameters) -> bool:
    msg_sender = params.path_params.get('address', "").lower()
    rollup.report('0x' + str(products.get(msg_sender, [])).encode('utf-8').hex())
    return True


"""
INSPECT PRODUCTIONS
"""
@url_router.inspect('productions/{address}')
def balance_of_wallet(rollup: Rollup, params: URLParameters) -> bool:
    msg_sender = params.path_params.get('address', "").lower()
    rollup.report('0x' + str(productions.get(msg_sender, [])).encode('utf-8').hex())
    return True

if __name__ == '__main__':
    dapp.run()