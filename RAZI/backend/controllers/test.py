import sys
import json

# Function to add numbers and send the result
def add_numbers(a, b):
    result = a + b

    # Create a dictionary containing the result
    result_data = {'result': result}

    # Convert the dictionary to a JSON string
    result_json = json.dumps(result_data)

    # Print the JSON string to stdout
    print(result_json)
    sys.stdout.flush()

# Call the function to add numbers
add_numbers(5, 10)