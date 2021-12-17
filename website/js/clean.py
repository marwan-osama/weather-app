import json
from json import encoder
from typing import Counter

with open("D:\\Projects\\front-end projects\\weather app\\citiesModified.json", "r", encoding="utf-8") as file:
    data = json.load(file)

cleared_data = []
counter = 0
for city in data:
    if not city.lower() in cleared_data:
        cleared_data.append(city.lower())
    counter += 1
    print(f"{counter}/{len(data)}")
with open("D:\\Projects\\front-end projects\\weather app\\citiesModified.json", "w", encoding="utf-8") as file:
    file.write(json.dumps(cleared_data, ensure_ascii=False))
