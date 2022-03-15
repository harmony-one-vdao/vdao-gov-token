
def save_js(fn: str, validators: list, amount_staked: list) -> None:
    """Generate a `constants.js` file and make the arrays available for deployment"""

    assert len(validators) == len(amount_staked), "Lengths must match!"

    cons = f"""
    validators_array = {validators}

    amount_staked_array =  {amount_staked}
    
    module.exports = {{ 
        validators_array: validators_array,
        amount_staked_array:amount_staked_array, 
        }}
    """

    with open(fn, "w") as f:
        f.write(cons)

# save_js(['asdasd', 'bdsbsbdsb'], ["1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","11111"])
