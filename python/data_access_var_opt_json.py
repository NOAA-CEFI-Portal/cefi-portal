"""Script to on cron job to auto genearte 
the variable dropdown options in data access tab
on the cefi portal
"""
import os
import json
import numpy as np
from var_list_create import find_ncfiles_info_hist_run,find_ncfiles_info_forecast


if __name__ == '__main__':
    regions = ['northwest_atlantic']
    data_types = ['hist_run','forecast']

    DATAROOT = os.environ.get("PROJECTS")
    CODEROOT = os.environ.get("MYHOME")
    OPENDAP_ROOT = 'http://psl.noaa.gov/thredds/dodsC'

    for region in regions:
        for data_type in data_types:
            # check database
            dirpath1 = f'{DATAROOT}CEFI/regional_mom6/{region}/{data_type}/'
            if data_type == 'hist_run':
                dict_ncfile_info = find_ncfiles_info_hist_run(
                    dirpath1,
                    tdim_name='time',
                    opendap_root_url=OPENDAP_ROOT,
                    exclude_static = True,
                    output_format ='dictionary'
                )
                var_name = dict_ncfile_info['Variable_Name']
                long_name = dict_ncfile_info['Long_Name']
                var_freq = dict_ncfile_info['Output_Frequency']
            elif data_type == 'forecast':
                dict_ncfile_info = find_ncfiles_info_forecast(
                    dirpath1,
                    idim_name='init',
                    opendap_root_url=OPENDAP_ROOT
                )
                var_name = dict_ncfile_info['Variable_Name']
                var_name_unique = list(np.unique(var_name))
                ind_list = []

                # get unique index
                for ind,var in enumerate(var_name):
                    if var == var_name_unique[0]:
                        ind_list.append(ind)
                        var_name_unique.pop(0) # pop first element in var_name_unique
                        if var_name_unique == []:
                            break
                # remove anom
                no_anom_ind_list = []
                for ind in ind_list:
                    if 'anom' not in var_name[ind]:
                        no_anom_ind_list.append(ind)

                var_name = [dict_ncfile_info['Variable_Name'][ind] for ind in no_anom_ind_list]
                long_name = [dict_ncfile_info['Long_Name'][ind] for ind in no_anom_ind_list]
                var_freq = ["monthly"] * len(long_name) # force monthly for forecast
            
            dict_opt = {}
            dict_opt['var_values'] = var_name
            dict_opt['var_options'] = long_name
            dict_opt['var_freqs'] = var_freq
            # dict to json
            json_data = json.dumps(dict_opt, indent=4)

            # output json format to browser
            webserver_dir = f'{os.environ.get("HTTPTEST")}cefi_portal/'
            with open(f'{webserver_dir}data_option_json/data_access_{region}_{data_type}.json', "w", encoding='UTF-8') as json_file:
                json_file.write(json_data)

