import os
import glob

def create_symlink_to_latest(base_dir:str):
    """create a symlink to the latest directory
    in the parent directory of the base directory

    Parameters
    ----------
    base_dir : str
        the base directory to start the search
    """
    # Walk through all directories and subdirectories in the base directory
    for root,_,_ in os.walk(base_dir):
        # Find all netCDF files in the current directory
        netcdf_files = glob.glob(os.path.join(root, '*.nc'))
        if netcdf_files:
            # Find the newest created directory in the immediate parent of root
            parent_dir = os.path.dirname(root)

            # store all release directories beside latest
            all_release_dirs = []
            for d in os.listdir(parent_dir):
                if os.path.isdir(os.path.join(parent_dir, d)) and d != 'latest':
                    all_release_dirs.append(d)

            # if the list exists find the latest directory
            if all_release_dirs:
                latest_dir = max(
                    all_release_dirs,
                    key=lambda d: os.path.getctime(os.path.join(parent_dir, d))
                )
                latest_path = os.path.join(parent_dir, 'latest')
                # create the symlink
                if os.path.islink(latest_path) or os.path.exists(latest_path):
                    os.remove(latest_path)
                os.symlink(os.path.join(parent_dir, latest_dir), latest_path)
                print(f"Created symlink: {os.path.join(parent_dir, latest_dir)} -> {latest_path}")

if __name__ == "__main__":
    # Define the base directory to start the search
    BASE_DIRECTORY = '/Projects/CEFI/regional_mom6/cefi_portal/'
    create_symlink_to_latest(BASE_DIRECTORY)

    # Define the base directory to start the search
    DERIVE_BASE_DIRECTORY = '/Projects/CEFI/regional_mom6/cefi_derivative/'
    create_symlink_to_latest(DERIVE_BASE_DIRECTORY)
