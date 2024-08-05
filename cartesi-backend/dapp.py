import logging
from cartesi.router import DAppAddressRouter
from cartesi.wallet.ether import EtherWallet
from difflib import SequenceMatcher
from cartesi import DApp, Rollup, RollupData, JSONRouter, ABIRouter, ABILiteralHeader, ABIFunctionSelectorHeader, URLRouter, URLParameters
from cartesi import abi
from pydantic import BaseModel
from cartesi.vouchers import create_voucher_from_model
import json
import random
import datetime
#import model_functions

"""
Create NFT
"""
class NFT(BaseModel):
    to: abi.Address
    tokenId: abi.UInt256
    tokenUri: abi.String

with open('erc721.json', 'r') as file:
    data = json.load(file)
    erc712_abi = data['abi']
    erc712_address = data['dev_address']

token_id = random.randint(2000, 121039120309123)

def create_nft(msg_sender, status) -> NFT:
    global token_id
    token_uri = f"https://fastly.picsum.photos/id/62/200/200.jpg?hmac=IdjAu94sGce82DBYTMbOYzXr7kup1tYqdr0bHkRDWUs"
    if status:
        token_uri = f"https://fastly.picsum.photos/id/119/200/200.jpg?hmac=JGrHG7yCKfebsm5jJSWw7F7x2oxeYnm5YE_74PhnRME"
    args = NFT(to=msg_sender, tokenId=token_id, tokenUri=token_uri)
    token_id += 1
    return create_voucher_from_model(destination=erc712_address, function_name='safeMint', args_model=args)


"""
Init DApp
"""
LOGGER = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG)

ETHER_PORTAL_ADDRESS = '0xffdbe43d4c855bf7e0f105c400a50857f53ab044'
ADDRESS_RELAY_ADDRESS = '0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e'

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
        msg = "User doesn't exists"
        rollup.report("0x" + str(msg).encode('utf-8').hex())
        return False

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
def production_input(rollup: Rollup, data: RollupData) -> bool:
    payload = data.json_payload()
    msg_sender = str(data.metadata.msg_sender).lower()

    if products.get(msg_sender, 0) == 0 or len(products[msg_sender]) == 0:
        msg = "No products were found for this user"
        rollup.report("0x" + str(msg).encode('utf-8').hex())
        return False
    
    if payload.get('data', 0) == 0:
        msg = "No data was sent in the payload"
        rollup.report("0x" + str(msg).encode('utf-8').hex())
        return False
    
    if payload['data'].get('id', '') == '' or payload['data'].get('n_skus', '') == '':
        msg = "Missing data in the payload"
        rollup.report("0x" + str(msg).encode('utf-8').hex())
        return False
        
    if (len(products[msg_sender])-1) < int(payload['data']['id']):
        msg = "The production id does not exist in the user's products list"
        rollup.report("0x" + str(msg).encode('utf-8').hex())
        return False
    
    payload['data']['id'] = int(payload['data']['id'])

    if len(payload['data']['steps']) != 3:
        msg = "The number of steps is different from 3"
        rollup.report("0x" + str(msg).encode('utf-8').hex())
        return False

    steps = payload['data']['steps']

    new_production =  {
        "id": len(productions[msg_sender]),
        "input_index": data.metadata.input_index,
        "product_id": int(payload['data']['id']),
        "token_id": token_id,
        "steps": steps,
        "n_skus": int(payload['data']['n_skus']),
    }

    """
    MODEL IMPLEMENTATION
    """
    """
    date = datetime.datetime.now()
    year = int(date.year)

    product = products[msg_sender][payload['data']['id']]
    result = model_functions.predict(water_usage, energy_usage, product['components'], year, len(product['components']))
    LOGGER.debug("Echoing in type 1 model result: " + str(result))

    index = len(steps) % 2
    result = result[index]

    if result > 0.5:
        msg = "The productions was unable to be inserted due to the high environmental impact"
        rollup.report("0x" + str(msg).encode('utf-8').hex())
        return False   
    """
    """
    ADDING PRODUCTION
    """

    if productions[msg_sender].get(payload['data']['id'], -1) == -1:
        productions[msg_sender][payload['data']['id']] = []

    users[msg_sender]['tokens'].append(token_id)
    productions[msg_sender][payload['data']['id']].append(new_production)
    msg = "production from user " + msg_sender + " was inserted at " + str(len(productions[msg_sender]) - 1) + ". token id: " + str(token_id)
    rollup.voucher(create_nft(msg_sender, True))
    rollup.notice("0x" + str(msg).encode('utf-8').hex())
    LOGGER.debug("Echoing in type 1")
    return True


"""
User Input
"""
@json_router.advance({"type": 2}) #create an user
def user_input(rollup: Rollup, data: RollupData) -> bool:
    payload = data.json_payload()
    
    msg_sender = str(data.metadata.msg_sender).lower()

    if products.get(msg_sender, 0) != 0:
        msg = "User already exists"
        rollup.report("0x" + str(msg).encode('utf-8').hex())
        return False
    
    products[msg_sender] = []
    productions[msg_sender] = {}
    
    try: 
        users[msg_sender] = {
            "id": len(users),
            "address": msg_sender,
            "tokens": [],
            "cnpj": payload['data']['cnpj'],
            "corporate_name": payload['data']['corporate_name'],
            "fantasy_name": payload['data']['fantasy_name'],
            "open_date": payload['data']['open_date'],
            "size": payload['data']['size'],
            "juridical_nature": payload['data']['juridical_nature'],
            "MEI": payload['data']['MEI'],
            "simple": payload['data']['simple'],
            "type": payload['data']['type'],
            "situation": payload['data']['situation'],
        }

    except Exception as e:
        msg = "There are missing values in the payload. Error: " + str(e)
        rollup.report("0x" + str(msg).encode('utf-8').hex())
        return False

    LOGGER.debug("Echoing in type 3 data was inserted")
    msg = "User " + msg_sender + " was inserted with id " + str(users[msg_sender]['id'])
    rollup.notice("0x" + str(msg).encode('utf-8').hex())

    return True



"""
Dapp Address
"""
@url_router.inspect('address/')
def get_address(rollup: Rollup, data: RollupData) -> bool:
    msg = "{" + f"'contract': {str(dapp_address.address)}" + '}'
    rollup.report('0x' + msg.encode('utf-8').hex())
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
def get_products(rollup: Rollup, params: URLParameters) -> bool:
    msg_sender = params.path_params.get('address', "").lower()
    rollup.report('0x' + str(products.get(msg_sender, [])).encode('utf-8').hex())
    return True

@url_router.inspect('products/{address}/{product_id}')
def get_product(rollup: Rollup, params: URLParameters) -> bool:
    msg_sender = params.path_params.get('address', "").lower()
    product_id = int(params.path_params.get('product_id', 0))
    selected_products = products.get(msg_sender, [])
    if len(selected_products) <= product_id :
        rollup.report('0x' + "[]".encode('utf-8').hex())
        return True
    
    rollup.report('0x' + str(selected_products[product_id]).encode('utf-8').hex())
    return True

"""
INSPECT USERS TOKEN IDS
"""
@url_router.inspect('users')
def get_users(rollup: Rollup, params: URLParameters) -> bool:
    users_id = list(users.keys())
    rollup.report('0x' + str(users_id).encode('utf-8').hex())
    return True


@url_router.inspect('user/{address}')
def get_users(rollup: Rollup, params: URLParameters) -> bool:
    msg_sender = params.path_params.get('address', "").lower()
    rollup.report('0x' + str(users.get(msg_sender, {})).encode('utf-8').hex())
    return True


@url_router.inspect('tokens/{address}')
def get_tokens(rollup: Rollup, params: URLParameters) -> bool:
    msg_sender = params.path_params.get('address', "").lower()
    rollup.report('0x' + str(users.get(msg_sender, {'tokens': []}).get('tokens', [])).encode('utf-8').hex())
    return True

"""
INSPECT PRODUCTIONS
"""
@url_router.inspect('productions/{address}')
def get_productions(rollup: Rollup, params: URLParameters) -> bool:
    msg_sender = params.path_params.get('address', "").lower()
    ids = list(productions.get(msg_sender, {}).keys())
    rollup.report('0x' + str(ids).encode('utf-8').hex())
    return True


@url_router.inspect('productions/{address}/{product_id}')
def get_productions_from_a_product(rollup: Rollup, params: URLParameters) -> bool:
    msg_sender = params.path_params.get('address', "").lower()
    id = int(params.path_params.get('product_id', 0))
    requested_production = str( productions.get(msg_sender, {}).get(id, []) )
    rollup.report('0x' + requested_production.encode('utf-8').hex())
    return True


@url_router.inspect('production/{address}/{product_id}/{production_id}')
def get_productions_from_a_product(rollup: Rollup, params: URLParameters) -> bool:
    msg_sender = params.path_params.get('address', "").lower()
    id = int(params.path_params.get('product_id', 0))
    production_id = int(params.path_params.get('production_id', 0))
    one_productions = productions.get(msg_sender, {})
    all_productions = one_productions.get(id, -1)
    if all_productions == -1:
        all_productions = one_productions.get(str(id), [])

    if len(all_productions) <= production_id :
        msg = "{" + "'id': {}, 'product_id': {}, 'token_id': -1, 'steps': [], 'n_skus': 0".format(production_id, id) + "}"
        rollup.report('0x' + msg.encode('utf-8').hex())
        return False
    
    requested_production = str(all_productions[production_id])
    rollup.report('0x' + requested_production.encode('utf-8').hex())
    return True

if __name__ == '__main__':
    dapp.run()