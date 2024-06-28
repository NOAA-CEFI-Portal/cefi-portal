import pandas as pd
from jinja2 import Environment, FileSystemLoader

# Load data from Excel into a pandas DataFrame
df = pd.read_excel('NWA12_ocean_ice_cobalt_diags.xlsx')

# Load your Jinja2 template
env = Environment(loader=FileSystemLoader('.'))
template = env.get_template('var_list_template.html')

# Render the template with your data
html = template.render(data=df.to_dict(orient='records'))
