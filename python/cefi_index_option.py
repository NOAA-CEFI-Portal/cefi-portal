import os
import glob
import json
import xarray as xr
from mom6.data_structure import portal_data

def data_structure_seperation(
        abs_dir:str,
        rel_top_dir:str,
        seperate_structure_type:str = "experiment_type"
    ):
    """
    this function grab the data structure before the seperate structure type
    so the naming of the option file can get those infomation

    data structure
    top_directory/region/subdomain/experiment_type/output_frequency/grid_type/release/

    Parameters
    ----------
    abs_dir : str
        the absolute path
    rel_top_dir : str
        the relative top directory of the data structure
        ex: cefi_portal or cefi_derivative
    seperate_structure_type : str, optional
        options are  "top_directory", "region", "subdomain",
        "experiment_type", "output_frequency", "grid_type",
        "release", by default "experiment_type".
    """
    # seperate abs_dir path based on rel_top_dir
    top_dir, rel_top_dir, _ = abs_dir.partition(rel_top_dir)

    # number of directory from in abs_top_dir
    ndir_top_dir = len(top_dir.strip('/').split('/'))

    # index of seperation directory type
    index_seperation = portal_data.DataStructureAttrOrder.dir_order.index(seperate_structure_type)

    # total number of directories before seperation directory type
    ndir_before_seperation = ndir_top_dir+1+index_seperation

    # all dir before seperation directory
    abs_dir_list = abs_dir.strip('/').split('/')
    abs_top_dir = os.path.join(*abs_dir_list[:ndir_before_seperation])

    # all dir after the seperation including the seperation level
    rel_sep_dir = os.path.join(*abs_dir_list[ndir_before_seperation:])

    return [abs_top_dir,rel_sep_dir]

def find_index_files(
        root_dir,
        rel_top_dir:str,
        seperate_structure_type:str = "experiment_type"
    ):
    netcdf_files = []
    parent_dirs = []
    child_dirs = []
    # Traverse the directory tree
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Check if the current directory is named 'indexes'
        if os.path.basename(dirpath) == 'indexes':
            # find dir seperation
            [abs_top_dir,rel_sep_dir] = data_structure_seperation(
                abs_dir=dirpath,
                rel_top_dir=rel_top_dir,
                seperate_structure_type = seperate_structure_type
            )
            # Find all NetCDF files in the 'indexes' directory
            nc_files = glob.glob(os.path.join(dirpath, '*.nc'))
            # Get absolute paths of the NetCDF files
            nc_files_abs = [os.path.abspath(nc_file) for nc_file in nc_files]
            netcdf_files.append(nc_files_abs)
            parent_dirs.append(abs_top_dir)
            child_dirs.append(rel_sep_dir)

    return netcdf_files,parent_dirs,child_dirs

if __name__ == '__main__':
    dataroot = os.path.join(os.environ.get("PROJECTS"),'CEFI/regional_mom6/cefi_derivative')
    coderoot = os.environ.get("MYHOME")
    local_dir = f'{coderoot}cefi_portal/'   # testing on local 
    webserver_dir = f'{os.environ.get("HTTPTEST")}cefi_portal/' # on webserver

    index_files,pdirs,cdirs = find_index_files(
        dataroot,
        rel_top_dir = dataroot.strip("/").split('/')[-1],
        seperate_structure_type = "experiment_type"
    )

    dict_json_files = {}
    for ndir, pdir in enumerate(pdirs):
        filename_datastructure = '.'.join(pdir.strip("/").split('/'))
        if filename_datastructure not in dict_json_files:
            dict_json_files[filename_datastructure] = {'varname':[],'file':[],'longname':[]}
        for file in index_files[ndir]:
            ds = xr.open_dataset(file,chunks={})
            for var in list(ds.variables):
                if var not in list(ds.dims):
                    long_name = ds[var].attrs['long_name']
                else:
                    long_name = None
            varname = ds.attrs['cefi_varname']
            varlongname = long_name.split('-')[0].strip()
            dict_json_files[filename_datastructure]['varname'].append(varname)
            dict_json_files[filename_datastructure]['longname'].append(varlongname)
            dict_json_files[filename_datastructure]['file'].append(file)

    for output_json_file,data_info in dict_json_files.items():

        # data options in json
        json_options = json.dumps(data_info, indent=4)


        # output json format for data options other than experiment type
        with open(
            f'{webserver_dir}data_option_json/cefi_index_options.{output_json_file}.json',
            "w",
            encoding='UTF-8'
        ) as json_file:
            json_file.write(json_options)

        with open(
            f'{local_dir}data_option_json/cefi_index_options.{output_json_file}.json',
            "w",
            encoding='UTF-8'
        ) as json_file:
            json_file.write(json_options)
