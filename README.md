# VIOT
Vegetation Indices Over Time (VIOT): Functions process satellite imagery for NDVI, EVI, SAVI, DVI calculation in MODIS, Landsat 9, Sentinel-2. Interactive UI generates time series charts.

These codes provide functions to process satellite imagery and calculate vegetation indices such as NDVI, EVI, SAVI, and DVI for MODIS, Landsat 9, and Sentinel-2 images in Google Earth Engine. They also include a user interface for interactive selection of a point on the map to generate time series charts of these indices.

MODIS Functions:

maskMODIS: Masks clouds in MODIS images using the QC band.
computeNDVI, computeEVI, computeSAVI, computeDVI: Compute NDVI, EVI, SAVI, and DVI for MODIS images.
createVegetationIndexChart: Create a chart of vegetation indices over time for a selected point on the map using MODIS images.
Landsat 9 Functions:

maskLandsat: Masks clouds in Landsat 9 images using the QA_PIXEL band.
computeNDVI, computeEVI, computeSAVI, computeDVI: Compute NDVI, EVI, SAVI, and DVI for Landsat 9 images.
createVegetationIndexChart: Create a chart of vegetation indices over time for a selected point on the map using Landsat 9 images.
Sentinel-2 Functions:

maskSentinel2: Masks clouds in Sentinel-2 images using the QA60 band.
computeNDVI, computeEVI, computeSAVI, computeDVI: Compute NDVI, EVI, SAVI, and DVI for Sentinel-2 images.
createVegetationIndexChart: Create a chart of vegetation indices over time for a selected point on the map using Sentinel-2 images.
Each set of functions is followed by the initialization of UI elements for date selection and a panel to display the chart and user instructions. The Map.onClick function allows users to select a point on the map to generate the vegetation index chart.

Overall, these codes provide a comprehensive toolset for processing and visualizing vegetation indices from different satellite platforms, offering valuable insights into vegetation dynamics over time.
