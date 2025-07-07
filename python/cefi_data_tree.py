"""
Create NOSQL database for cefi data tree
in json format

including the static files!

"""
import os
import sys
import json
import xarray as xr


def sort_dict_keys_at_level(data_dict, level, sort_key=None):
    """
    Sort the keys of a dictionary at a specific level.

    Parameters
    ----------
    data_dict : dict
        The dictionary to modify.
    level : int
        The level at which to sort the keys (0 for top-level, 1 for one level deeper, etc.).
    sort_key : callable, optional
        A function to determine the sort order. For example, use `str.lower` for case-insensitive sorting.
        If None, the keys are sorted in ascending order.

    Returns
    -------
    dict
        A new dictionary with the keys at the specified level sorted.

    """
    if level == 0:
        # Sort the top-level keys
        sorted_keys = sorted(data_dict.keys(), key=sort_key)
        return {key: data_dict[key] for key in sorted_keys}
    else:
        # Recursively traverse the dictionary to the desired level
        for key, value in data_dict.items():
            if isinstance(value, dict):
                data_dict[key] = sort_dict_keys_at_level(value, level - 1, sort_key)
        return data_dict


def add_to_dict(data_dict, keys, value):
    """Recursively add keys to the dictionary."""
    if len(keys) == 1:
        data_dict[keys[0]] = value
    else:
        if keys[0] not in data_dict:
            data_dict[keys[0]] = {}
        add_to_dict(data_dict[keys[0]], keys[1:], value)

if __name__ == '__main__':
    # Define the directories to store the json files
    coderoot = os.environ.get("MYHOME")
    local_dir = f'{coderoot}cefi_portal/' # git repo
    webserver_dir = f'{os.environ.get("HTTPTEST")}cefi_portal/' # webserver

    # Define the root directories to search for files
    root_dirs = [
        '/Projects/CEFI/regional_mom6/cefi_portal/'
    ]

    # define category dictionary
    cefi_category_dict =  {
        'ocean_cobalt_btm': 'Bottom COBALT variables',
        'ocean_cobalt_fluxes_int': 'Level intergrated COBALT fluxes',
        'ocean_cobalt_tracers_instant': 'Instantaneous COBALT tracers',
        'ocean_cobalt_daily': 'Daily COBALT variables',
        'ocean_cobalt_tracers_int': 'Level integrated COBALT tracers',
        'ocean_cobalt_daily_2d': 'Daily 2D COBALT variables',
        'ocean_cobalt_rates_year_z': 'Annual 3D COBALT rates',
        'ocean_cobalt_tracers_month': 'Monthly COBALT tracers',
        'ocean_cobalt_fdet_100': '100m depth COBALT fdet',
        'ocean_cobalt_sfc': 'Surface COBALT variables',
        'ocean_cobalt_tracers_month_z': 'Monthly 3D COBALT tracers',
        'ocean_cobalt_omip_sfc': 'OMIP surface COBALT variables',
        'ocean_cobalt_omip_2d': 'OMIP 2D COBALT variables',
        'ocean_cobalt_omip_daily': 'OMIP daily COBALT variables',
        'ocean_cobalt_omip_tracers_month_z': 'OMIP monthly 3D COBALT tracers',
        'ocean_cobalt_omip_rates_year_z': 'OMIP annual 3D COBALT rates',
        'ocean_daily': 'Daily ocean variables',
        'ocean_monthly': 'Monthly ocean variables',
        'ocean_annual': 'Annual ocean variables',
        'ocean_monthly_z': 'Monthly 3D ocean variables',
        'ocean_annual_z': 'Annual 3D ocean variables',
        'ice_monthly': 'Monthly sea ice variables',
        'ice_daily': 'Daily sea ice variables',
        'static': 'Static variables and model grids',
    }
      
    # dictionary to store the data tree
    dict_data_tree = {}

    for root_dir in root_dirs:
        for dirpath, dirnames, filenames in os.walk(root_dir):
            for filename in filenames:
                if filename.endswith('.nc') :
                    file_path = os.path.join(dirpath, filename)
                    # categorize the static files
                    if 'static' in filename :
                        cefi_category = 'static'
                        cefi_variable = filename[:-3]
                        cefi_lname = f'{cefi_variable} fields'
                        # create path segments start from the root
                        #  removing the empty first segment
                        #  and the last segment which is the filename
                        path_segs = file_path.split('/')[1:-1] 
                        path_segs.append(f'{cefi_category} ({cefi_category_dict[cefi_category]})') # add the category
                        cefi_filename = file_path.split('/')[-1]
                        path_segs.append(f'{cefi_variable} ({cefi_lname})') # add the variable name
                        path_segs.append(cefi_variable) # add the variable name short only
                        path_segs.append(cefi_filename) # add the filename
                        add_to_dict(
                            dict_data_tree,
                            path_segs,
                            {
                                'cefi_filename': cefi_filename,
                                'cefi_variable': cefi_variable,
                                'cefi_long_name': cefi_lname,
                                'cefi_init_date': 'N/A',
                                'cefi_date_range': 'N/A',
                                'cefi_ensemble_info': 'N/A',
                                'cefi_forcing': 'N/A'
                            }
                        )
                    # categorize the rest of the files
                    else:
                        with xr.open_dataset(file_path,chunks={}) as ds:
                            cefi_category = ds.attrs['cefi_ori_category']
                            cefi_variable = ds.attrs['cefi_variable']
                            cefi_lname = ds[cefi_variable].attrs['long_name']
                            # create path segments start from the root
                            #  removing the empty first segment
                            #  and the last segment which is the filename
                            path_segs = file_path.split('/')[1:-1]
                            try:
                                path_segs.append(f'{cefi_category} ({cefi_category_dict[cefi_category]})') # add the category
                            except KeyError:
                                # force failure if the category is not found
                                sys.exit('Error: Category not found in cefi_category_dict. Please check the category name in the file attributes. Or a new category is not added in the cefi_category_dict.')
                            cefi_filename = file_path.split('/')[-1]
                            path_segs.append(f'{cefi_variable} ({cefi_lname})') # add the variable name
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
        f'{webserver_dir}data_option_json/cefi_data_tree.json',
        "w",
        encoding='UTF-8'
    ) as json_file:
        json_file.write(json_data)

    with open(
        f'{local_dir}data_option_json/cefi_data_tree.json',
        "w",
        encoding='UTF-8'
    ) as json_file:
        json_file.write(json_data)