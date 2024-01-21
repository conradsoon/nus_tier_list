import requests
import random
import time

# Replace with the base URL of your API
base_url = "http://nustierlistv1.conradsoon.me:4000"

while True:
    try:
        # Request a random comparison
        response = requests.get(f"{base_url}/comparison")
        response.raise_for_status()
        comparisons = response.json()

        if len(comparisons) < 2:
            print("Insufficient comparisons available. Waiting for more...")
            time.sleep(1)  # Wait for more comparisons
            continue

        # Randomly choose which ID is better
        better_id = random.choice([comparisons[0]["id"], comparisons[1]["id"]])
        other_id = comparisons[0]["id"] if better_id == comparisons[1]["id"] else comparisons[1]["id"]

        # Send a POST request with the result
        payload = {"id1": other_id, "id2": better_id, "better_id": better_id}
        response = requests.post(f"{base_url}/comparison", params=payload)
        response.raise_for_status()

        print(f"Comparison completed: {better_id} is better than {other_id}")

        # Wait for 100ms before the next comparison
        time.sleep(0.1)

    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        # Wait for a while before retrying after an error
        time.sleep(1)
    except (ValueError, IndexError):
        print("Invalid response from the server. Waiting for more...")
        time.sleep(1)
