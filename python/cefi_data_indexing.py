"""Script to on cron job to auto genearte 
the variable list provided in the cefi portal

need to use "regional-mom6" package
$ conda activate regional-mom6

ex:
/Projects/CEFI/regional_mom6/cefi_portal/northwest_atlantic/full_domain/hindcast/daily/raw/r20230519/
    0      1        2          3              4               5            6      7     8     9

"""
import os
import json
import xml.etree.ElementTree as ET
import jinja2
import xarray as xr
from mom6.data_structure import portal_data

def dict_to_xml(tag, dict_obj):
    """converting dictionary to xml output

    Parameters
    ----------
    tag : str
        tag for the entire dataset
    dict_obj : dict
        dictionary to convert

    Returns
    -------
    xml element
        xml root element to be written to output
    """
    elem = ET.Element(tag)
    for k, v in dict_obj.items():
        child = dict_to_xml(k, v) if isinstance(v, dict) else ET.Element(k, text=v)
        elem.append(child)
    return elem

def find_ncfiles_info(
    base_dir: str='/Projects/CEFI/regional_mom6/cefi_portal',
    opendap_root_url: str='http://psl.noaa.gov/thredds/dodsC',
)->dict:
    """Get meta data from data itself.
    This function is designed for cefi data structure
    and naming.

    Parameters
    ----------
    base_dir : str
        The string provide the base path to
        the CEFI data (need to include cefi_portal level).
    opendap_root_url : str
        The root url that will put in front of the `base_dir`]
        that helps contructed the complete opendap URL

    Returns
    -------
    dict
        all meta data of individual netcdf file that is under the dirpath
        seperated by {'folder path' : {'filename': dict_info}}
    """

    # recursively find data under the root dir
    dict_end_points = {}
    for root, _, files in os.walk(base_dir):
        # reach end point when there are files contained
        # (!!!break if there are file store in any layer before end point)
        if len(files)!=0:
            # create one dict for one end point
            dict_end_points[root] = {}
            # make file in order when looping
            for file in sorted(files):
                if 'static.nc' not in file:
                    ncfile = os.path.join(root, file)
                    ds = xr.open_dataset(ncfile,chunks={})

                    # create one dict for one file
                    dict_end_points[root][file] = {}

                    # List all global attributes
                    global_attributes = ds.attrs

                    # find all cefi attributes
                    for attr, value in global_attributes.items():
                        # rule out the attr add by gfdl team
                        if 'cefi_' in attr and 'cefi_archive_version_ens' not in attr:
                            dict_end_points[root][file][attr] = value
                        else:
                            pass

                    if not dict_end_points[root][file]:
                        # remove empty dict (file that does not have cefi_attrs)
                        del dict_end_points[root][file]
                    else:
                        # temp solution to create variable
                        variable = dict_end_points[root][file]['cefi_filename'].split('.')[0]
                        dict_end_points[root][file]['cefi_variable'] = variable
                        try:
                            dict_end_points[root][file]['cefi_unit'] = ds[variable].attrs['units']
                        except KeyError:
                            # for varibles that does not have unit (ex: dp_fac factor in mom6)
                            dict_end_points[root][file]['cefi_unit'] = 'N/A'
                        dict_end_points[root][file]['cefi_long_name'] = ds[variable].attrs['long_name']
                        dict_end_points[root][file]['cefi_opendap'] = os.path.join(
                            opendap_root_url,
                            root[1:],
                            ds.attrs['cefi_filename']
                        )

    return dict_end_points

def regroup_ncfiles_info(
    dict_cefi_available:dict,
    structure_cut: str='experiment_type'
)->dict:
    """The function regroup the dict generated
    from find_ncfiles_info based on the level indicated by 
    `structure_cut`

    starting from top_directory in order dir list
     /Project/CEFI/regional_mom6/cefi_portal/
        0       1       2            3

    Parameters
    ----------
    dict_cefi_available : dict
        the netcdf info get from the `find_ncfiles_info`

    structure_cut : str
        the str representing the cefi data structure level naming
        checkout the ordered level in 
        `portal_data.DataStructureAttrOrder.dir_order`

    Returns
    -------
    dict
        the netcdf info regroup based on the level indicated by 
        `structure_cut`
    """
    # index of the top_directory in cefi data structure in absolute path
    rel_level = 3

    # get level number of experiment type in absolute path
    structure_cut_num = portal_data.DataStructureAttrOrder.dir_order.index(structure_cut)
    structure_cut_num += rel_level  # determined the indexes of cefi data structure

    # get cut path based on structure_cut level
    list_all = list(dict_cefi_available.keys())
    list_cut = []
    for path in list_all:
        path_structure = path.split('/')
        path_structure = list(filter(None, path_structure))
        cut_path = '/'+'/'.join(path_structure[:structure_cut_num+1])
        list_cut.append(cut_path)

    # find unique path based on structure_cut level by using set
    list_unique = list(set(list_cut))

    # initialize the dict represent unique level with empty set for all values
    dict_unique = {}
    for unique_path in list_unique:
        dict_unique[unique_path] = {}

    # loop all cut dir and append the dict based on cut dir name
    for n,cut_path in enumerate(list_cut):
        # add path that does not already exist in the each cut path (set is always unique)
        dict_unique[cut_path].update(dict_cefi_available[list_all[n]])

    return dict_unique


if __name__ == '__main__':

    dataroot = os.path.join(os.environ.get("PROJECTS"),'CEFI/regional_mom6/cefi_portal')
    coderoot = os.environ.get("MYHOME")
    local_dir = f'{coderoot}cefi_portal/' # testing locally
    webserver_dir = f'{os.environ.get("HTTPTEST")}cefi_portal/' # testing on webserver
    opendap_root = 'http://psl.noaa.gov/thredds/dodsC'

    # get the information for all file in dict
    dict_cefi_all = find_ncfiles_info(base_dir=dataroot,opendap_root_url=opendap_root)

    # get regrouped dictionary based on structure cut
    dict_cefi_all = regroup_ncfiles_info(
        dict_cefi_available = dict_cefi_all,
        structure_cut = 'experiment_type'
    )

    # get all dirpath that has files
    for dirpath, dict_files in dict_cefi_all.items():
        # get all files that are under dirpath
        dict_all_info = {}
        for filename, dict_file_info in dict_files.items():
            for key, val in dict_file_info.items():
                dict_all_info.setdefault(key, []).append(val)

        # Load your Jinja2 template
        template_dir = f'{coderoot}cefi_portal/python/jinja/'
        loader = jinja2.FileSystemLoader(template_dir)
        env = jinja2.Environment(loader=loader)

        template = env.get_template('cefi_data_indexing_template.html')

        # reorder the dict before html rendering (maneully determined)
        leading_keys = [
            'cefi_filename',
            'cefi_variable',
            'cefi_long_name',
            'cefi_unit',
            'cefi_output_frequency',
            'cefi_grid_type'
        ]
        remaining_keys = [key for key in dict_all_info if key not in leading_keys]
        reordered_keys = leading_keys + remaining_keys
        dict_all_info = {key: dict_all_info[key] for key in reordered_keys}

        # Render the template with your data
        html = template.render(data = dict_all_info)

        # creata like-cefi-filename structure to name the index file
        cefi_filename_list = dirpath.split('/')
        cefi_filename_list = list(filter(None, cefi_filename_list))
        # cefi_filename_list = dict_all_info['cefi_filename'][0].split('.')[1:1+6] # hard code due to filename strucutre
        file_name_info = ".".join(cefi_filename_list)

        with open(
            f'{webserver_dir}data_index/cefi_data_indexing.{file_name_info}.html',
            'w',
            encoding='UTF-8'
        ) as f:
            f.write(html)

        with open(
            f'{local_dir}data_index/cefi_data_indexing.{file_name_info}.html',
            'w',
            encoding='UTF-8'
        ) as f:
            f.write(html)

        # reformat to json
        keys = list(dict_all_info.keys())
        list_len = len(dict_all_info[keys[0]])
        dict_ncfile_json = {}
        for i in range(list_len):
            item_dict = {}
            for item_name, item_list in dict_all_info.items():
                item_dict[item_name] = item_list[i]
            dict_ncfile_json[f'data{i+1}'] = item_dict
        json_data = json.dumps(dict_ncfile_json, indent=4)

        # output json format to browser
        with open(
            f'{webserver_dir}data_index/cefi_data_indexing.{file_name_info}.json',
            "w",
            encoding='UTF-8'
        ) as json_file:
            json_file.write(json_data)

        with open(
            f'{local_dir}data_index/cefi_data_indexing.{file_name_info}.json',
            "w",
            encoding='UTF-8'
        ) as json_file:
            json_file.write(json_data)

        # reformat to xml
        xml_root = dict_to_xml(f'{file_name_info}', dict_ncfile_json)
        tree = ET.ElementTree(xml_root)
        # output xml format to browser
        tree.write(
            f'{webserver_dir}data_index/cefi_data_indexing.{file_name_info}.xml',
            encoding='utf-8',
            xml_declaration=True
        )
        tree.write(
            f'{local_dir}data_index/cefi_data_indexing.{file_name_info}.xml',
            encoding='utf-8',
            xml_declaration=True
        )
