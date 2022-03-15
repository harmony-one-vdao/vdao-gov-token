from wsgiref.validate import validator
from requests import post, get
import json
from datetime import datetime
import logging, os, sys, csv
from collections import namedtuple

from create_const_js import save_js
from includes.config import *
from one_to_eth import convert_one_to_hex


def create_named_tuple_from_dict(d: dict) -> tuple:
    v = namedtuple("Validator",
                   [d.replace("-", "_")
                    for d in d["validator"].keys()])(*d["validator"].values())
    e = namedtuple("Epoch",
                   [d.replace("-", "_") for d in d.keys()])(*d.values())
    return v, e


def rpc_v2(method: str, params: list) -> dict:
    d = {
        "jsonrpc": "2.0",
        "method": method,
        "params": params,
        "id": 1,
    }
    try:
        r = post(harmony_api, json=d)
        data = r.json()["result"]
    except KeyError:
        log.info(r)
        data = []
    return data


def yield_data(num_pages: int = 100) -> tuple:
    i = 0
    while 1:
        data = rpc_v2("hmy_getAllValidatorInformation", [i])
        if not data or i == num_pages:
            log.info(f"NO MORE DATA.. ENDING ON PAGE {i + 1}.")
            break
        for d in data:
            v, e = create_named_tuple_from_dict(d)
            yield v, e
        i += 1


def save_csv(fn: str, data: list, header: list, inc: int = 1) -> None:
    try:
        with open(fn,
                  "w",
                  newline="",
                  encoding="utf-8") as csvfile:
            w = csv.DictWriter(csvfile, fieldnames=header, delimiter=",")
            w.writeheader()
            for x in data:
                w.writerow(x)
    except PermissionError:  # file is open, rename and try again.
        save_csv(f"{inc}-{fn}", data, header, inc=inc + 1)


def parse_data():
    now = datetime.now().strftime("%d-%m-%y")
    csv_data = []
    validators = []
    amounts = []
    for y in yield_data(num_pages=pages):
        v, e = y

        if e.active_status == "active":
            address = convert_one_to_hex(v.address)
            w = {
                "One Address": v.address,
                "0xAddress": address,
                "StakedWei": e.total_delegation,
                "StakedONE": f"{round(float(e.total_delegation) / places):,}",
            }
            if w not in csv_data:
                csv_data.append(w)
                validators.append(address)
                amounts.append(f"{e.total_delegation}")

    file_path = pathlib.Path(__file__).parent.resolve()
    fn = os.path.join(file_path, "data", f"{now}.csv")

    save_csv(
        fn,
        csv_data,
        [x for x in csv_data[0].keys()],
    )

    js_fn = os.path.join(file_path, '..', "js", "constants.js")
    save_js(js_fn, validators, amounts)

if __name__ == "__main__":
    parse_data()
