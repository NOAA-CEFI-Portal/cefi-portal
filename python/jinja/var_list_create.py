import os
import glob
import jinja2
import json
import numpy as np
import xarray as xr
import xml.etree.ElementTree as ET


def dict_to_xml(tag, dict_obj):
    elem = ET.Element(tag)
    for key, val in dict_obj.items():
        child = dict_to_xml(key, val) if isinstance(val, dict) else ET.Element(key, text=val)
        elem.append(child)
    return elem

def find_ncfiles_info_forecast(
        dirpath: str,
        idim_name: str='init',
        opendap_root_url: str='http://psl.noaa.gov/thredds/dodsC'
    )->dict:
    """Get meta data from data itself.
    This function is designed for forecast file structure
    and naming.

    Parameters
    ----------
    dirpath : str
        The string provide the absolute path to
        the hist_run data.
    sdim_name : str, optional
        The initialization dimension name, by default 'init'
    ldim_name : str, optional
        The lead dimension name, by default 'lead'

    Returns
    -------
    dict
        the keys of the dictionary includes 
        'Varible Name', 'Output Frequency','Long Name',
        'Unit'. The values is a list of the corresponding info.

    """

    # find all files
    file_list = glob.glob(f'{dirpath}*.nc')
    file_list = sorted(file_list)

    # process one file at a time
    filename_list = []
    init_list = []
    var_list = []
    long_name_list = []
    unit_list = []
    opendap_list = []
    for file in file_list :
        ds = xr.open_dataset(file,chunks={})

        filename = file[len(dirpath):]


        # find file variable name
        variables = list(ds.keys())
        for var in variables:
            varname = var
            filename_list.append(filename)
            var_list.append(varname)

            # find initial month
            year = int(ds[f'{idim_name}.year'].data)
            month = int(ds[f'{idim_name}.month'].data)
            init_list.append(f'{year:04d}-{month:02d}')

            # find variable long name
            try:
                long_name_list.append(ds[varname].long_name)
            except AttributeError:
                long_name_list.append("No long_name provided in netCDF")

            # find variable unit
            try:
                unit_list.append(ds[varname].units)
            except AttributeError:
                unit_list.append('No unit provided in netCDF')

            # opendap url
            opendap_list.append(f'{opendap_root_url}{dirpath}{filename}')


    return {
        'Varible_Name':var_list,
        'Time_of_Initialization':init_list,
        'Long_Name':long_name_list,
        'Unit':unit_list,
        'File_Name':filename_list,
        'OPeNDAP_URL':opendap_list
    }


def find_ncfiles_info_hist_run(
        dirpath: str,
        tdim_name: str='time',
        opendap_root_url: str='http://psl.noaa.gov/thredds/dodsC'
    )->dict:
    """Get meta data from data itself.
    This function is designed for hist_run file structure
    and naming.

    Parameters
    ----------
    dirpath : str
        The string provide the absolute path to
        the hist_run data.
    tdim_name : str, optional
        The time dimension name, by default 'time'

    Returns
    -------
    dict
        the keys of the dictionary includes 
        'Varible Name', 'Output Frequency','Long Name',
        'Unit'. The values is a list of the corresponding info.

    """

    # find all files
    file_list = glob.glob(f'{dirpath}*.nc')
    file_list = sorted(file_list)

    # process one file at a time
    filename_list = []
    freq_list = []
    var_list = []
    long_name_list = []
    unit_list = []
    opendap_list = []
    for file in file_list :
        ds = xr.open_dataset(file,chunks={})

        filename = file[len(dirpath):]

        # find file frequency
        try:
            dt = ds[tdim_name].data[1]-ds[tdim_name].data[0]
            freq = None
            dt = dt/np.timedelta64(1,'D')  # unit days
            if np.abs(dt-1)<1 :
                freq_list.append('daily')
            elif np.abs(dt-28)<5 :
                freq_list.append('monthly')
            elif np.abs(dt-365)<2 :
                freq_list.append('annual')
            filename_list.append(filename)
        except IndexError:
            freq = 'static'

        # find file variable name
        variables = list(ds.keys())
        if freq == 'static':
            for var in variables:
                varname = var
                filename_list.append(filename)
                freq_list.append(freq)
                var_list.append(varname)

                # find variable long name
                long_name_list.append(ds[varname].long_name)

                # find variable unit
                try:
                    unit_list.append(ds[varname].units)
                except AttributeError:
                    unit_list.append('unitless')

                # opendap url
                opendap_list.append(f'{opendap_root_url}{dirpath}{filename}')
        else:
            ndim_list = []
            for var in variables:
                ndim_list.append(len(ds[var].dims))
            indmax = np.argmax(ndim_list)
            varname = variables[indmax]
            var_list.append(varname)

            # find variable long name
            long_name_list.append(ds[varname].long_name)

            # find variable unit
            unit_list.append(ds[varname].units)

            # opendap url
            opendap_list.append(f'{opendap_root_url}{dirpath}{filename}')

    return {
        'Varible_Name':var_list,
        'Output_Frequency':freq_list,
        'Long_Name':long_name_list,
        'Unit':unit_list,
        'File_Name':filename_list,
        'OPeNDAP_URL':opendap_list
    }

if __name__ == '__main__':
    regions = ['northwest_atlantic']
    data_types = ['hist_run','forecast']

    dataroot = os.environ.get("PROJECTS")
    coderoot = os.environ.get("MYHOME")
    opendap_root = 'http://psl.noaa.gov/thredds/dodsC'

    for region in regions:
        for data_type in data_types:
            # check database
            dirpath1 = f'{dataroot}CEFI/regional_mom6/{region}/{data_type}/'
            if data_type == 'hist_run':
                dict_ncfile_info = find_ncfiles_info_hist_run(
                    dirpath1,
                    tdim_name='time',
                    opendap_root_url=opendap_root
                )
            if data_type == 'forecast':
                dict_ncfile_info = find_ncfiles_info_forecast(
                    dirpath1,
                    idim_name='init',
                    opendap_root_url=opendap_root
                )
    

            # Load your Jinja2 template
            template_dir = f'{coderoot}cefi_portal/python/jinja/'
            loader = jinja2.FileSystemLoader(template_dir)
            env = jinja2.Environment(loader=loader)

            template = env.get_template('var_list_template.html')

            # Render the template with your data
            html = template.render(data = dict_ncfile_info)

            # output html to webserver
            webserver_dir = f'{os.environ.get("HTTPTEST")}cefi_portal/'
            with open(f'{webserver_dir}var_list_{region}_{data_type}.html', 'w', encoding='UTF-8') as f:
                f.write(html)

            # reformat to one item info concat for json better for possible xml extention
            keys = list(dict_ncfile_info.keys())
            list_len = len(dict_ncfile_info[keys[0]])
            dict_ncfile_json = {}
            for i in range(list_len):
                item_dict = {}
                for item_name, item_list in dict_ncfile_info.items():
                    item_dict[item_name] = item_list[i]
                dict_ncfile_json[f'data{i+1}'] = item_dict
            json_data = json.dumps(dict_ncfile_json, indent=4)

            # output json format to browser
            with open(f'{webserver_dir}var_list_{region}_{data_type}.json', "w", encoding='UTF-8') as json_file:
                json_file.write(json_data)

            root = dict_to_xml(f'{region}_{data_type}', dict_ncfile_json)
            tree = ET.ElementTree(root)
            tree.write(f'{webserver_dir}var_list_{region}_{data_type}.xml', encoding='utf-8', xml_declaration=True)

