// // analysis type
// ctypes = [];
// ctypes[0] = "Any";
// ctypes[1] = "Accumulated precipitation";
// ctypes[2] = "Anomaly";
// ctypes[3] = "Climatology";
// ctypes[4] = "Compare two datasets";
// ctypes[5] = "Composite (average)";
// ctypes[6] = "Correlation";
// ctypes[7] = "ENSO relationships";
// ctypes[8] = "Individual value";
// ctypes[9] = "Ocean/Atmosphere time-series relationships";
// ctypes[10] = "Data subsetting";
// ctypes[11] = "Time-series";
// ctypes[12] = "Regression";
// ctypes[13] = "Seasonal Forecast";
// ctypes[14] = "Time-section plots (Hovmoller)";
// ctypes[15] = "Wavelet analysis";
// ctypes[16] = "Sub seasonal forecast";
// ctypes[17] = "Trajectory";
// ctypes[18] = "Data Distributions";
// ctypes[19] = "Animations";
// ctypes[20] = "Profiles";
// ctypes[21] = "Maps";

// dataset
cdata = [];
cdata[0] =  [ 1, "Any"];
cdata[11] = [ 2, "Alaska Climate Integrated Modeling (ACLIM data)"];
cdata[7] =  [ 3, "AMIPS"];
cdata[8] =  [ 4, "ARGO Floats"];
cdata[2] =  [ 5, "CMIP5"];
cdata[3] =  [ 6, "CMIP6"];
cdata[13] = [ 7, "Coupled Models"];
cdata[14] = [ 8, "GLORYS"];
cdata[1] =  [ 9, "ICOADS"];
cdata[9] =  [10, "NOAA ERSST V5"];
cdata[4] =  [11, "NOAA GODAS"];
cdata[12] = [12, "NOAA OI SST"];
cdata[10] = [13, "North American Multi-Model Ensemble (NMME)"];
cdata[6] =  [14, "TAO Array"];
cdata[5] =  [15, "CMIP3"];


// time scale
ctime = [];
ctime[0] = "Any";
ctime[1] = "Sub Daily";
ctime[2] = "Daily";
ctime[3] = "Pentad";
ctime[4] = "Weekly";
ctime[5] = "Monthly";
ctime[6] = "Seasonal";
ctime[7] = "Annual";
ctime[8] = "Decadal";
ctime[9] = "Century";

// // time range
// crange = [];
// crange[0] = "Any";
// crange[1] = "Current Values";
// crange[2] = "Post 2020";
// crange[3] = "Post 1900";
// crange[4] = "Pre 1900";
// crange[5] = "Full Year";
// crange[6] = "Future";

// variables
cvars = [];
cvars[0]  = [  1, "Any", "atm"];
cvars[32] = [  2, "Clouds", "atm"];
cvars[16] = [  3, "Evaporation", "atm"];
cvars[18] = [  4, "OLR", "atm"];
cvars[17] = [  5, "Potential Temperature", "atm"];
cvars[12] = [  6, "Precipitation", "atm"];
cvars[1]  = [  7, "Sea Surface Temperature (SST)", "ocn"];
cvars[2]  = [  8, "Sea Level Height", "ocn"];
cvars[3]  = [  9, "Sea Level Pressure (SLP)", "ocn"];
cvars[4]  = [ 10, "Surface Pressure", "ocn"];
cvars[20] = [ 11, "Surface Temperature", "ocn"];
cvars[22] = [ 12, "Surface Winds", "ocn"];
cvars[15] = [ 13, "Wind Stress", "ocn"];
cvars[21] = [ 14, "20C Isotherm", "ocn"];
cvars[26] = [ 15, "Bathymetry", "ocn"];
cvars[31] = [ 16, "Bottom Temperature", "ocn"];
cvars[5]  = [ 17, "Currents", "ocn"];
cvars[35] = [ 18, "Density", "ocn"];
cvars[33] = [ 19, "Heat Content", "ocn"];
cvars[7]  = [ 20, "Heat Fluxes", "ocn"];
cvars[10] = [ 21, "Mixed Layer Depth", "ocn"];
cvars[6]  = [ 22, "Salinity", "ocn"];
cvars[13] = [ 23, "Sea-Ice", "ocn"];
cvars[8]  = [ 24, "Tidal", "ocn"];
cvars[19] = [ 25, "Upwelling Indices", "ocn"];
cvars[11] = [ 26, "Waves", "ocn"];
cvars[9]  = [ 27, "Chlorphyll", "ocn"];
cvars[36] = [ 28, "Coral", "ocn"];
cvars[14] = [ 29, "Fish", "ocn"];
cvars[37] = [ 30, "Sea Mammals", "ocn"];
cvars[24] = [ 31, "Algal Blooms", "ocn"];
cvars[23] = [ 32, "Kelp and Seagrasses", "ocn"];
cvars[27] = [ 33, "Zooplankton", "ocn"];
cvars[28] = [ 34, "Phytoplankton", "ocn"];
cvars[25] = [ 35, "Carbon", "ocn"];
cvars[30] = [ 36, "Nitrates", "ocn"];
cvars[29] = [ 37, "Oxygen", "ocn"];
cvars[34] = [ 38, "DNA", "ocn"];
cvars[38] = [ 39, "Atmosphere Variables", "ocn"];
cvars[39] = [ 40, "Ocean Surface Variables", "ocn"];
cvars[40] = [ 41, "Subsurface Ocean Variables", "ocn"];
cvars[41] = [ 42, "Chemical Variables", "ocn"];
cvars[42] = [ 43, "Marine Animal Variables", "ocn"];
cvars[43] = [ 44, "Fish", "ocn"];
cvars[44] = [ 45, "Marine Plant Variables", "ocn"];


// product types
cproduct = [];
cproduct[0]  = [ 1, "Any"];
cproduct[17] = [ 2, "Analysis Tools"];
cproduct[8]  = [ 3, "Animations"];
cproduct[12] = [ 4, "Code Repository"];
cproduct[11] = [ 5, "Data Guides/Repositories"];
cproduct[15] = [ 6, "Educational"];
cproduct[18] = [ 7, "ERDDAP Installations"];
cproduct[6]  = [ 8, "Forecasts"];
cproduct[4]  = [ 9, "Gridded Analysis"];
cproduct[14] = [10, "Image/Animation Repository"];
cproduct[13] = [11, "Index Time-series"];
cproduct[9]  = [12, "In-situ"];
cproduct[16] = [13, "International Data Repositories"];
cproduct[5]  = [14, "Interactive Plotting Pages"];
cproduct[3]  = [15, "Reanalysis"];
cproduct[10] = [16, "Remote Sensing"];
cproduct[7]  = [17, "Stations"];
cproduct[1]  = [18, "Values: Current"];
cproduct[2]  = [19, "Values: Historic"];
cproduct[19] = [20, "Reports"];


// topics types
ctopics = [];
ctopics[0]  = [ 1, "Any"];
ctopics[12] = [ 2, "Air-Sea Interaction"];
ctopics[3]  = [ 3, "AMOC"];
ctopics[10] = [ 4, "Arctic"];
ctopics[6]  = [ 5, "Climate Change"];
ctopics[7]  = [ 6, "Climate Indices"];
ctopics[14] = [ 7, "Coastal Processes"];
ctopics[16] = [ 8, "Economics"];
ctopics[1]  = [ 9, "ENSO"];
ctopics[8]  = [10, "Extremes"];
ctopics[17] = [11, "Gulf Stream"];
ctopics[11] = [12, "Hurricanes"];
ctopics[15] = [13, "Inundation"];
ctopics[9]  = [14, "Marine Heat Waves"];
ctopics[2]  = [15, "MJO"];
ctopics[4]  = [16, "PDO"];
ctopics[5]  = [17, "Sea Level"];
ctopics[13] = [18, "Upwelling"];
ctopics[18] = [19, "Wind Energy"];
ctopics[19] = [20, "Indicators"];
ctopics[20] = [21, "Resiliency"];
ctopics[21] = [22, "Algae Blooms"];



// Observing Platforms
cplatforms = [];
cplatforms[0] = "Any";
cplatforms[1] = "Buoy";
cplatforms[2] = "Platform";
cplatforms[3] = "Ship";
cplatforms[4] = "Airplane";
cplatforms[5] = "Satellite";
cplatforms[6] = "Floats";
cplatforms[7] = "CTDs";
cplatforms[8] = "Saildrone";
cplatforms[9] = "Drones";
cplatforms[10] = "Gliders";
cplatforms[11] = "Radar";
cplatforms[12] = "River Gauge";
cplatforms[13] = "Stations";
cplatforms[14] = "Surface Drifters";
cplatforms[15] = "Wave Gliders";

// Regions
cregions = [];
cregions[0] =  [  1, "Any"];
cregions[17] = [  2, "Alaska"];
cregions[4] =  [  3, "Arctic Ocean"];
cregions[1] =  [  4, "Atlantic Ocean"];
cregions[5] =  [  5, "Bering Sea"];
cregions[7] =  [  6, "California"];
cregions[11] = [  7, "Florida"];
cregions[16] = [  8, "Northern Hemisphere"];
cregions[15] = [  8, "Global"];
cregions[14] = [  9, "Hawaii"];
cregions[3] =  [ 10, "Indian Ocean"];
cregions[13] = [ 11, "LMEs"];
cregions[19] = [ 12, "Louisiana"];
cregions[10] = [ 13, "Maine"];
cregions[8] =  [ 14, "Oregon"];
cregions[21] = [ 15, "Pacific Islands"];
cregions[2] =  [ 16, "Pacific Ocean"];
cregions[9] =  [ 17, "Washington"];
cregions[6] =  [ 18, "US: Coastal"];
cregions[20] = [ 19, "US: CONUS"];
cregions[12] = [ 20, "US: East Coast"];
cregions[18] = [ 21, "US: West Coast"];

// Organizations
corgs = [];
corgs[0] =  [  1, "Any"];
corgs[23] = [  2, "NOAA (Any)"];
corgs[3] =  [  3, "NOAA AOML"];
corgs[12] = [  4, "NOAA: Center for Operational Oceanographic Products and Services"];
corgs[20] = [  5, "NOAA Coastwatch"];
corgs[16] = [  6, "NOAA CPC"];
corgs[13] = [  7, "NOAA Data"];
corgs[22] = [  8, "NOAA Exploration"];
corgs[14] = [  9, "NOAA Fisheries"];
corgs[21] = [ 10, "NOAA GFDL"];
corgs[19] = [ 11, "NOAA Integrated Ecosystem Assessment"];
corgs[11] = [ 12, "NOAA IRI"];
corgs[6] =  [ 13, "NOAA NCEI"];
corgs[5] =  [ 14, "NOAA NESDIS"];
corgs[4] =  [ 15, "NOAA NOS"];
corgs[2] =  [ 16, "NOAA PMEL"];
corgs[1] =  [ 17, "NOAA PSL"];
corgs[17] = [ 18, "NOAA Tides and Currents"];
corgs[7] =  [ 19, "NCAR/UCAR"];
corgs[10] = [ 20, "NASA"];
corgs[15] = [ 21, "IOOS: Integrated Ocean Observing System"];
corgs[24] = [ 22, "AOOS:  Alaska Ocean Observing System "];
corgs[9] =  [ 23, "UCSD: University of California at San Diego"];
corgs[8] =  [ 24, "U Hawaii"];
corgs[18] = [ 25, "Other"];






