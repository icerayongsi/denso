import pymongo
import time
from datetime import datetime

# Connection

db_conn = pymongo.MongoClient("mongodb://1.tcp.ap.ngrok.io:21113/")

db = db_conn["TPM"]

# -- 
 
# Global Varable

current_ts = int(time.time())

ts_query = current_ts * 1000

hour = 3600000
day = 86400000
week = 604800000
month = 2629743000
year = 31556926000

datas = []
max_datas = []

# ----

# Class I 0 - 15 , Class II 15 - 75 , Class III 75 - 300 , Class IV 300 - 10000

# Class I (A) 0 - 0.915 , (B) 0.915 - 2.3 , (C) 2.3 - 5.8 , (D) 5.8 - 45
# Class II (A) 0 - 1.46 , (B) 1.46 - 3.65 , (C) 3.65 - 9.15 , (D) 9.15 - 45
# Class III (A) 0 - 2.3 , (B) 2.3 - 5.8 , (C) 5.8 - 14.6 , (D) 14.6 - 45
# Class IV (A) 0 - 3.65 , (B) 3.65 - 9.15 , (C) 9.15 - 23, (D) 23 - 45

def analysis_ISO(power,data):
    if power >= 0 and power <= 15: power_class = 1 # Class I
    elif power > 15 and power <= 75: power_class = 2 # Class II
    elif power > 75 and power <= 300: power_class = 3 # Class III
    elif power > 300 and power <= 10000: power_class = 4 # Class IV
    else: return "ERR"

    if power_class == 1:
        if data >= 0 and data <= 0.915: return "Good"
        elif data > 0.915 and data <= 2.3: return "Satisfactory"
        elif data > 2.3 and data <= 5.8: return "Unatisfactory"
        elif data > 5.8 and data <= 45: return "Unacceptable"
        else: return "ERR"

    if power_class == 2:
        if data >= 0 and data <= 1.46: return "Good"
        elif data > 1.46 and data <= 3.65: return "Satisfactory"
        elif data > 3.65 and data <= 9.15: return "Unatisfactory"
        elif data > 9.15 and data <= 45: return "Unacceptable"
        else: return "ERR"

    if power_class == 3:
        if data >= 0 and data <= 2.3: return "Good"
        elif data > 2.3 and data <= 5.8: return "Satisfactory"
        elif data > 5.8 and data <= 14.6: return "Unatisfactory"
        elif data > 14.6 and data <= 45: return "Unacceptable"
        else: return "ERR"

    if power_class == 4:
        if data >= 0 and data <= 3.65: return "Good"
        elif data > 3.65 and data <= 9.15: return "Satisfactory"
        elif data > 9.15 and data <= 23: return "Unatisfactory"
        elif data > 23 and data <= 45: return "Unacceptable"
        else: return "ERR"

def analyze(collection,last_by,field,power):

    if power >= 0 and power <= 15: power_class = "Class I"
    elif power > 15 and power <= 75: power_class = "Class II"
    elif power > 75 and power <= 300: power_class = "Class III"
    elif power > 300 and power <= 10000: power_class = "Class IV"
    #else: return "ERR"

    count = 0
    Good = 0
    Satisfactory = 0
    Unatisfactory = 0
    Unacceptable = 0
    ERR = 0

    data = db[collection].find({"times" : {"$gte" :  ts_query - last_by, "$lte" : ts_query}},{"_id" : 0 , "data." + field : 1})

    for element in data:
        count += 1
        analysis_ISO(power,element["data"][0][field])
        datas.append(analysis_ISO(power,element["data"][0][field]))
        max_datas.append(element["data"][0][field])

    for element in datas:
        if element == "Good":
            Good += 1
        elif element == "Satisfactory":
            Satisfactory += 1
        elif element == "Unatisfactory":
            Unatisfactory += 1
        elif element == "Unacceptable":
            Unacceptable += 1
        else:
            ERR += 1

    print("\nFROM DATE : " + str(datetime.fromtimestamp((ts_query - last_by) // 1000)) + " TO " + str(datetime.fromtimestamp((ts_query) // 1000)) + "\n")

    print("Power : " + str(power) + " kW = " + power_class + "\n")
    print("Good : " + str(Good))
    print("Satisfactory : " + str(Satisfactory))
    print("Unatisfactory : " + str(Unatisfactory))
    print("Unacceptable : " + str(Unacceptable))
    print("Error : " + str(ERR))

    print("\nAll data is : " + str(count) + ", Max data is : " + str(max(max_datas)) + " (" + analysis_ISO(power,max(max_datas)) + ")\n")


if __name__ == "__main__":

    analyze("22060050",day + (hour * 2),"Vibrator_1_1",100)