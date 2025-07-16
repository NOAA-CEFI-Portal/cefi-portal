"""
Create NOSQL database for cefi data tree
in json format BASIC version

need a json file to indivate the needed data

"""
import os
import json
import glob
import xarray as xr
from cefi_data_tree import sort_dict_keys_at_level, add_to_dict

def get_basic_variable_list(basic_list="cefi_basic_list.json"):
    """
    Reads cefi_basic_list.json and returns a set of all variable names needed.
    """
    with open(basic_list, "r", encoding="utf-8") as basic_list_json:
        dict_basic_list = json.load(basic_list_json)

    return collect_variable_keys(dict_basic_list)

def collect_variable_keys(d, path=None, result=None):
    """
    Recursively collect all variable paths from a nested dict/list structure.
    Each path is a list of keys ending with the variable name.
    """
    if path is None:
        path = []
    if result is None:
        result = []
    if isinstance(d, dict):
        for k, v in d.items():
            collect_variable_keys(v, path + [k], result)
    elif isinstance(d, list):
        for var in d:
            result.append(path + [var])
    return result


if __name__ == '__main__':
    # Define the directories to store the json files
    coderoot = os.environ.get("MYHOME")
    local_dir = f'{coderoot}cefi_portal/' # git repo
    webserver_dir = f'{os.environ.get("HTTPTEST")}cefi_portal/' # webserver

    # Define the root directories to search for files
    root_dirs = [
        '/Projects/CEFI/regional_mom6/cefi_portal/'
    ]

    # read basic list
    basic_variable_list = get_basic_variable_list(
        basic_list=os.path.join(local_dir,"python","cefi_basic_list.json")
    )
      
    # dictionary to store the data tree
    dict_data_tree = {}

    # walk through only the listed variables
    for variable in basic_variable_list:
        file_path = os.path.join(
            root_dirs[0],
            variable[0],
            'full_domain',
            variable[1],
            variable[2],
            variable[3],
            'latest',
            variable[4]+'.*.nc'
        )
        files = glob.glob(file_path)
        if not files:
            print(f'{variable} variable not found in the data path {file_path}')
            continue

        for file_path in files:
            with xr.open_dataset(file_path,chunks={}) as ds:
                cefi_category = ds.attrs['cefi_ori_category']
                cefi_variable = ds.attrs['cefi_variable']
                cefi_lname = ds[cefi_variable].attrs['long_name']
                # create path segments start from the root
                #  removing the empty first segment
                #  and the last segment which is the filename
                path_segs = file_path.split('/')[1:-1]
                # path_segs.append(f'{cefi_category}') # add the category
                cefi_filename = file_path.split('/')[-1]
                path_segs.append(f'{cefi_lname} ({cefi_variable})') # add the variable name
                path_segs.append(cefi_variable) # add the variable name short only
                path_segs.append(cefi_filename) # add the filename
                add_to_dict(
                    dict_data_tree,
                    path_segs,
                    {
                        'cefi_filename': cefi_filename,
                        'cefi_variable': cefi_variable,
                        'cefi_long_name': cefi_lname,
                        'cefi_init_date' : ds.attrs['cefi_init_date'],
                        'cefi_date_range' : ds.attrs['cefi_date_range'],
                        'cefi_ensemble_info' : ds.attrs['cefi_ensemble_info'],
                        'cefi_forcing' : ds.attrs['cefi_forcing']
                    }
                )
    # Sort keys at level 10 (category + long name) alphabetically
    dict_data_tree = sort_dict_keys_at_level(dict_data_tree, level=10, sort_key=str.lower)

    # Sort keys at level 11 (variable + long name) alphabetically
    dict_data_tree = sort_dict_keys_at_level(dict_data_tree, level=11, sort_key=str.lower)

    # dump the dictionary to a json file
    json_data = json.dumps(dict_data_tree, indent=4)

    # output json format to browser
    with open(
        f'{webserver_dir}data_option_json/cefi_data_tree_basic.json',
        "w",
        encoding='UTF-8'
    ) as json_file:
        json_file.write(json_data)

    with open(
        f'{local_dir}data_option_json/cefi_data_tree_basic.json',
        "w",
        encoding='UTF-8'
    ) as json_file:
        json_file.write(json_data)