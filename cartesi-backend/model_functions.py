import model_rf

def label_encoder(product_type_array):
    labels = {
        'polyester': 0,
        'nylon': 1,
        'recycled_poly': 2,
        'cotton': 3,
        'synthetic_blend': 4,
        'organic_cotton': 5,
        'microfiber': 6,
        'linen': 7,
        'tencel': 8,
        'viscose': 9,
        'wool': 10 
    }

    result = 0
    for product in product_type_array:
        product_name = str(product).lower().replace(" ", "_")
        if product_name in labels:
            result = labels[product_name]
            break
    return result

def encode_year(data):
    new_year = data - 2018
    return new_year if new_year >= 0 else 0

def transform(water_consumption, energy_consumption, product_type, production_year, number_of_items):
    product_type_encoded = label_encoder(product_type)
    production_year_encoded = encode_year(production_year)
    model_input = [water_consumption, energy_consumption, product_type_encoded, production_year_encoded, number_of_items]
    return model_rf.score(model_input)


