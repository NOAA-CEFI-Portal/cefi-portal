"""
Create NOSQL database for cefi data tree
in json format

including the static files!

"""
import os
import json
import xarray as xr


if __name__ == '__main__':

    # Define the root directories to search for files
    root_dirs = [
        '/Projects/CEFI/regional_mom6/cefi_portal/'
    ]
      
    # walk the data tree to check data file integrity
    for root_dir in root_dirs:
        for dirpath, dirnames, filenames in os.walk(root_dir):
            for filename in filenames:
                if filename.endswith('.nc') :
                    file_path = os.path.join(dirpath, filename)
                    try:
                        ds =  xr.open_dataset(file_path,chunks={})
                        ds.close()
                    except OSError:
                        print(f"Error opening file {file_path}")
                        continue
