"""
Create NOSQL database for cefi data tree
in json format

including the static files!

"""
import os
import json
import xarray as xr


def add_to_dict(data_dict, keys, value):
    """Recursively add keys to the dictionary."""
    if len(keys) == 1:
        data_dict[keys[0]] = value
    else:
        if keys[0] not in data_dict:
            data_dict[keys[0]] = {}
        add_to_dict(data_dict[keys[0]], keys[1:], value)

if __name__ == '__main__':

    root_dirs = [
        '/Projects/CEFI/regional_mom6/cefi_portal/'
    ]

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
                        path_segs.append(cefi_category)            # add the category
                        path_segs.append(file_path.split('/')[-1]) # add the filename
                        add_to_dict(
                            dict_data_tree,
                            path_segs,
                            {
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
                            path_segs.append(cefi_category) # add the category
                            path_segs.append(file_path.split('/')[-1]) # add the filename
                            add_to_dict(
                                dict_data_tree,
                                path_segs,
                                {
                                    'cefi_variable': cefi_variable,
                                    'cefi_long_name': cefi_lname,
                                    'cefi_init_date' : ds.attrs['cefi_init_date'],
                                    'cefi_date_range' : ds.attrs['cefi_date_range'],
                                    'cefi_ensemble_info' : ds.attrs['cefi_ensemble_info'],
                                    'cefi_forcing' : ds.attrs['cefi_forcing']
                                }
                            )

    # dump the dictionary to a json file
    with open('cefi_data_tree.json', 'w', encoding='utf-8') as f:
        json.dump(dict_data_tree, f, indent=4)
