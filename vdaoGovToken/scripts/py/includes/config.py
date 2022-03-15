import logging, os, sys
import pathlib
file_path = pathlib.Path(__file__).parent.resolve()

places = 1000000000000000000
pages = 10
harmony_api = "https://rpc.hermesdefi.io/"

def create_data_path(pth: str, data_path: str = "data") -> os.path:
    
    p = os.path.join(file_path, '..', data_path, pth)
    if not os.path.exists(p):
        os.mkdir(p)
    return p


create_data_path((""))
create_data_path(("logs"), "")

file_handler = logging.FileHandler(
    filename=os.path.join(file_path, '..', "logs", "rpc_data.log"))
stdout_handler = logging.StreamHandler(sys.stdout)
handlers = [file_handler, stdout_handler]

logging.basicConfig(level=logging.INFO,
                    format="%(message)s",
                    handlers=handlers)

log = logging.getLogger()