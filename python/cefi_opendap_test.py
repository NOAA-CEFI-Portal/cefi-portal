"""
This script is designed to test the opendap
access 

"""
import os
import sys
import requests


CATALOG_HEAD = 'https://psl.noaa.gov/thredds/catalog/'
REGIONAL_MOM6_PATH = 'Projects/CEFI/regional_mom6'

catalog_url = os.path.join(
    CATALOG_HEAD,
    REGIONAL_MOM6_PATH,
    'catalog.html'
)

try:
    html_response = requests.get(catalog_url, timeout=10)

    if html_response.status_code == 200:
        print("Success: URL responded with status 200.")
        sys.exit(0)  # Exit with status 0 (success)
    else:
        print(f"Error: URL responded with status {html_response.status_code}.")
        sys.exit(1)  # Exit with status 1 (non-success)
except requests.exceptions.RequestException as e:
    print(f"Error: Failed to connect to {catalog_url}. Exception: {e}")
    sys.exit(2)  # Exit with status 2 (connection failure)
