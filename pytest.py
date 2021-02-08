from random import random
import json
import time

def function():
    a = {}

    a["one"] = random()
    a["two"] = random()
    a["three"] = random()

    return a

if __name__ == '__main__':
    var = function()
    time.sleep(1000);
    print(json.dumps(var)); 