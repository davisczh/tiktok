import csv
from collections import defaultdict

input_file = 'Online Sales Data.csv'
output_file = 'processed_data.csv'

# Initialize dictionaries to store unique values
unique_values = defaultdict(set)

# Read input and write output
with open(input_file, 'r') as infile, open(output_file, 'w', newline='') as outfile:
    reader = csv.DictReader(infile)
    fieldnames = ['ID', 'Category', 'Name', 'Units Sold', 'Unit Price']
    writer = csv.DictWriter(outfile, fieldnames=fieldnames)
    
    writer.writeheader()
    
    for row in reader:
        processed_row = {
            'ID': row['Transaction ID'],
            'Category': row['Product Category'],
            'Name': row['Product Name'],
            'Units Sold': row['Units Sold'],
            'Unit Price': row['Unit Price']
        }
        
        writer.writerow(processed_row)
        
        # Collect unique values
        for key, value in processed_row.items():
            unique_values[key].add(value)

# Print unique values for each column
print("Unique values in each column:")
for column, values in unique_values.items():
    print(f"{column}: {values}")