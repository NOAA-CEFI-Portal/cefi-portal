"""
Calculate the past 30 days mean MHW

Daily update is available if the oisst data is updated.
"""
import os
import sys
import glob
import warnings
import xarray as xr
import numpy as np
import cartopy.crs as ccrs
import cartopy.feature as cfeature
import matplotlib.pyplot as plt
import matplotlib.animation as animation
import matplotlib.image as image
from dask.distributed import Client


#################### Functions ##################
def plot_noaa_em(fig,set_ax=None):
    """
    Plotting the NOAA emblem on the plot
    """
    if set_ax is None:
        set_ax=[0,0,1,1]
    ax = fig.add_axes(set_ax)
    im = image.imread(f'{os.getenv("DATASETSPRIVATE")}/marinehw/noaa_web.png')
    ax.imshow(im, zorder=-1)
    ax.tick_params(
        axis='both',          # changes apply to the x-axis
        which='both',      # both major and minor ticks are affected
        bottom=False,      # ticks along the bottom edge are off
        top=False,         # ticks along the top edge are off
        left=False,
        right=False,
        labelleft=False,
        labelbottom=False) # labels along the bottom edge are off
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['bottom'].set_visible(False)
    ax.spines['left'].set_visible(False)

    return fig

def orthographic_us(da_var):
    """
    Plotting function for mhw near US at orthographic projection
    """
    level = np.arange(-2.5,2.5+0.5,0.5)

    fig2 = plt.figure(2,figsize=(10,10))
    ax2 = fig2.add_axes(
        [0.115,0.05,0.97,0.95],
        projection=ccrs.Orthographic(central_longitude=270, central_latitude=30.0)
    )

    im2 = [da_var.plot.pcolormesh(
        x='geolon',
        y='geolat',
        ax=ax2,
        levels=level,
        extend='both',
        cmap='RdBu_r',
        transform=ccrs.PlateCarree(central_longitude=0.)
    )]

    cb=im2[0].colorbar
    cb.remove()

    cbaxes=fig2.add_axes([0.115,0.1,0.8,0.01])
    cbar=fig2.colorbar(im2[0],cax=cbaxes,orientation='horizontal')
    cbar.set_ticks(level)
    cbar.set_ticklabels([f"{n:0.1f}" for n in level])
    cbar.ax.tick_params(labelsize=12,rotation=0)
    cbar.set_label(label='Sea Surface Temperature Anomaly($^o$C)',size=12, labelpad=15)

    ax2.set_global()
    # global_extent = ax2.get_extent(crs=ccrs.PlateCarree())
    # ax2.set_extent((-160, -40,20, 80), crs=ccrs.PlateCarree())

    ax2.coastlines(resolution='110m',linewidths=1)

    land = cfeature.NaturalEarthFeature(
        'physical', 'land', '110m',
        edgecolor='face',
        facecolor=cfeature.COLORS['land']
    )

    # states_provinces = cfeature.NaturalEarthFeature(
    #         category='cultural',
    #         name='admin_1_states_provinces_lines',
    #         scale='110m',
    #         facecolor='none')

    ax2.add_feature(land,color='lightgrey',linewidths=1)
    # ax2.add_feature(states_provinces,edgecolor='grey',linewidths=1)
    ax2.add_feature(cfeature.BORDERS,linewidths=0.1)
    # ax2.text(0.73, 0.01, text, fontsize=15, transform=ax2.transAxes)
    ax2.set_title("")

    fig2 = plot_noaa_em(fig2,set_ax=[0.8,0.8,0.15,0.15])
    # plt.close(fig2)

    return fig2, ax2, im2

def animate(i, im2, tt2, da_var, titles2):
    im2[0].set_array(da_var.isel(lead=i).values.ravel())
    tt2.set_text(titles2[i])
    return im2

if __name__ == '__main__':

    # start a local cluster
    client = Client(processes=False)
    warnings.simplefilter("ignore")

    varname = 'tos'
    iyear = 2025
    imonth = 7

    regions = [
        'northwest_atlantic'
    ]

    subdomains = ['full_domain']

    experiment_type = ['seasonal_forecast']

    output_frequency = ['monthly']
    
    grid_type = ['raw']

    release = ['r20250413']

    for region in regions:

        data_path = os.path.join(
            f'{os.getenv("PROJECTS")}CEFI/regional_mom6/cefi_portal/',
            region,
            subdomains[0],
            experiment_type[0],
            output_frequency[0],
            grid_type[0],
            release[0]
        )
        file_list = glob.glob(
            os.path.join(data_path,f'{varname}*.i{iyear:04d}{imonth:02d}.nc')
        )

        if len(file_list) == 1 :
            ds_tos = xr.open_dataset(file_list[0])
        else:
            sys.exit('more than one forecast file')

        ds_static = xr.open_dataset(
            os.path.join(data_path,'ocean_static.nc')
        )
        try:
            ds_static = ds_static.drop_vars(['time'])         # time dim not needed in ds_static
        except KeyError and ValueError:
            pass

        ds = xr.merge([ds_static,ds_tos])
        
        ds = ds.set_coords(['geolon','geolat'])

        da_mmm = ds[f'{varname}_anom'].mean(dim='member').compute()

        # change data long to 0-360
        da_mmm['geolon'] = da_mmm['geolon'].where(da_mmm['geolon']>0,other=da_mmm['geolon']+360.)
        # static geolon geolat has NaN which is not allowed in plotting
        da_mmm['geolon'] = da_mmm['geolon'].where(~da_mmm['geolon'].isnull(),other=0.)
        da_mmm['geolat'] = da_mmm['geolat'].where(~da_mmm['geolat'].isnull(),other=0.)

        ######################## plotting US ###########################

        fig1,ax1,im1 = orthographic_us(da_mmm.isel(lead=0))

        # create titles
        titles = []
        year = da_mmm['init.year'].data
        month = da_mmm['init.month'].data
        da_lead = xr.cftime_range(
            start=f'{year:04d}-{month:02d}', periods=12, freq='MS'
        )
        for l in range(12):
            lyear = da_lead[l].year
            lmonth = da_lead[l].month
            title = (
                f'Initial time : {year:04d}-{month:02d}-01\n'+
                f'Forecast time : {lyear:04d}-{lmonth:02d}-15'
            )
            titles.append(title)
        if len(title.split("\n")[0])<40:
            title_font = 15
        else :
            title_font = 12

        # create title template
        # ti = ax1.set_title(
        #     f'Initial time : {year:04d}-{month:02d}-01 \n Forecast time : {lyear:04d}-{lmonth:02d}-15', 
        #     color='black',
        #     weight='bold',
        #     size=title_font,
        #     pad=20
        # )

        # create text template
        tt = ax1.text(
            -0.1, 0.01,
            f' Initial time : {year:04d}-{month:02d}-01\nForecast time : {lyear:04d}-{lmonth:02d}-15',
            fontsize=title_font,
            transform=ax1.transAxes
        )

        leadtime_list = np.arange(0,12)
        ani = animation.FuncAnimation(
            fig1,
            animate,
            leadtime_list,
            interval=1000,
            fargs=(im1, tt, da_mmm, titles),
            blit=True,
            repeat = True
        )

        animation_filename = [
            varname,
            region,
            subdomains[0],
            experiment_type[0],
            output_frequency[0],
            grid_type[0]
        ]
        animation_filename = '.'.join(animation_filename)

        ani.save(
            f'{os.getenv("HTTPTEST")}cefi_portal/img/regions_gif/'
            f'{animation_filename}.gif',
            writer='pillow'
        )

        ani.save(
            f'{os.environ.get("MYHOME")}cefi_portal/img/regions_gif/'
            f'{animation_filename}.gif',
            writer='pillow'
        )
        # ani.save(
        #     'regional_mom6_tos_demo.gif',
        #     writer='pillow'
        # )
        # fig1.savefig(f'regional_mom6_{varname}_demo.png',
        #             dpi=300,
        #             facecolor='w',
        #             edgecolor='w',
        #             orientation='portrait',
        #             format=None,
        #             transparent=False,
        #             bbox_inches="tight",
        #             pad_inches=None
        # )
