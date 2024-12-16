"""Script to generate available data options
after experiemt type (set in `structure_cut`)

need to use "regional-mom6" package
$ conda activate regional-mom6


"""
import os
import json
from collections import defaultdict
from cefi_data_indexing import find_ncfiles_info,regroup_ncfiles_info
from mom6.data_structure import portal_data


def get_unique_options(
    dict_cefi_available:dict,
    structure_cut: str='experiment_type'
)-> dict:
    """get unique directory option based on 
    data availibility generated from `find_ncfiles_info`
    or regrouped by `regroup_ncfiles_info`

    starting from top_directory in order dir list
     /Project/CEFI/regional_mom6/cefi_portal/
        0       1       2            3
    
    Parameters
    ----------
    dict_cefi_all : dict
        dcitionary containing all available data
        generated from `find_ncfiles_info`

    Returns
    -------
    dict
        available options with key is the level number 
        and value is the actual list of available dirname
    """
    # index of the top_directory in cefi data structure in absolute path
    rel_level = 3

    # get level number of experiment type in absolute path
    structure_cut_num = portal_data.DataStructureAttrOrder.dir_order.index(structure_cut)
    structure_cut_num += rel_level  # determined the indexes of cefi data structure

    # initialize a set to deal with uniqueness
    # (dict set can only have unique key
    #  and value with set of unique element)
    dictset_level_options = defaultdict(set)

    # find all available paths
    paths = list(dict_cefi_available.keys())

    # loop through available paths to store subdir options
    for path in paths:
        components = path.strip("/").split("/")
        for level, component in enumerate(components):
            # only store subdir(level) starting from `structure_cut` level
            if level >= structure_cut_num:
                subdir_num = level-structure_cut_num # relevel to start from 0
                dictset_level_options[subdir_num].add(component)

    return {subdir_num: sorted(options) for subdir_num, options in dictset_level_options.items()}

def get_variable_options(dict_cefi_available:dict)->dict:
    """generate

    Parameters
    ----------
    dict_cefi_available : dict
        the available files in the dict genearted by 
        `find_ncfiles_info`

    Returns
    -------
    dict
        dictionary include the available unique variable options
    """
    # initialize the dict with empty set as value to deal with duplication when add
    dict_var_options = defaultdict(list)
    for _,dict_file_infos in dict_cefi_available.items():
        for _,dict_file_info in dict_file_infos.items():
            variable_name = dict_file_info['cefi_variable']
            variable_long_name = dict_file_info['cefi_long_name']
            variable_freqs = dict_file_info['cefi_output_frequency']
            dict_var_options['var_values'].append(variable_name)
            dict_var_options['var_options'].append(variable_long_name)
            dict_var_options['var_freqs'].append(variable_freqs)

    # Step 1: Find unique elements in list1
    # Removing duplicates while preserving order
    unique_options = list(dict.fromkeys(dict_var_options['var_options']))

    # Step 2: Create a new list2 that only contains elements corresponding to unique values in list1
    unique_names = []
    freq = []
    ori_unique_options = unique_options.copy()

    for ii in range(len(dict_var_options['var_options'])):
        if dict_var_options['var_options'][ii] in unique_options:
            unique_names.append(dict_var_options['var_values'][ii])
            freq.append(dict_var_options['var_freqs'][ii])

            # Remove the element after using it
            unique_options.remove(dict_var_options['var_options'][ii])

    dict_var = {}
    dict_var['var_values'] = unique_names
    dict_var['var_options'] = ori_unique_options
    dict_var['var_freqs'] = freq

    # sorting based on the long name
    # zip the lists that need to sorted together
    combined = zip(
        dict_var["var_options"],
        dict_var["var_values"]
    )
    # sort based on the first list
    sorted_combined = sorted(combined, key=lambda x: x[0])
    # unzip back into two lists
    dict_var["var_options"],dict_var["var_values"] = (
        map(list, zip(*sorted_combined))
    )

    return dict_var


if __name__ == '__main__':
    structure_cut_name = 'experiment_type'
    dataroot = os.path.join(os.environ.get("PROJECTS"),'CEFI/regional_mom6/cefi_portal')
    coderoot = os.environ.get("MYHOME")
    webserver_dir = f'{coderoot}cefi_portal/'
    # webserver_dir = f'{os.environ.get("HTTPTEST")}cefi_portal/'
    opendap_root = 'http://psl.noaa.gov/thredds/dodsC'

    # get the information for all file in dict
    dict_cefi_all = find_ncfiles_info(base_dir=dataroot,opendap_root_url=opendap_root)

    # get regrouped dictionary based on structure cut
    dict_cefi_all = regroup_ncfiles_info(
        dict_cefi_available = dict_cefi_all,
        structure_cut = structure_cut_name
    )

    # get all dirpath that has files
    dict_structure_cut = {}
    structure_cut_subdirs = []
    for dirpath, dict_files in dict_cefi_all.items():

        # creata like-cefi-filename structure to name the option json file
        cefi_filename_list = dirpath.strip("/").split('/')
        file_name_info = ".".join(cefi_filename_list)

        # for structure cut option json file
        structure_cut_subdirs.append(cefi_filename_list[-1])
        file_name_structure_cut = ".".join(cefi_filename_list[:-1])

        # get available data under each dirpath
        dict_cefi_exp = find_ncfiles_info(
            base_dir=dirpath,
            opendap_root_url=opendap_root
        )

        # get all unique options in each structure level
        dict_options = get_unique_options(dict_cefi_exp)

        # get ordered attribute name based on data structure level
        list_dir_order = portal_data.DataStructureAttrOrder.dir_order
        # get level number of structure_cut_name in relative path
        cut_level_index = list_dir_order.index(structure_cut_name)
        list_dir_order = list_dir_order[cut_level_index:]

        # data options in json
        dict_data_options = {}
        for i, dirname in enumerate(list_dir_order):
            dict_data_options[dirname] = dict_options[i]
        json_options = json.dumps(dict_data_options, indent=4)

        # output json format for data options other than experiment type
        with open(
            f'{webserver_dir}data_option_json/cefi_data_options.{file_name_info}.json',
            "w",
            encoding='UTF-8'
        ) as json_file:
            json_file.write(json_options)

        # get all unique variable options in under all experiement_type
        #  this is assuming under all experiement type there should be
        #  almost having the same variable options. if not the website
        #  will response with data not available
        dict_var_opts = get_variable_options(dict_cefi_exp)
        json_var_options =json.dumps(dict_var_opts, indent=4)

        # output json format for variable options
        with open(
            f'{webserver_dir}data_option_json/cefi_var_options.{file_name_info}.json',
            "w",
            encoding='UTF-8'
        ) as json_file:
            json_file.write(json_var_options)

    dict_structure_cut[structure_cut_name] = sorted(structure_cut_subdirs)
    json_structure_cut_options =json.dumps(dict_structure_cut, indent=4)

    # output json format for the experiement type options
    with open(
        f'{webserver_dir}data_option_json/'+
        f'cefi_{structure_cut_name}_options.{file_name_structure_cut}.json',
        "w",
        encoding='UTF-8'
    ) as json_file:
        json_file.write(json_structure_cut_options)
