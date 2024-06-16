# Vegetation Indices Over Time (VIOT)
Description:

Vegetation Indices Over Time (VIOT) is a set of functions designed to process satellite imagery and calculate key vegetation indices, including NDVI, EVI, SAVI, and DVI, using data from MODIS, Landsat 9, and Sentinel-2 satellites. These functions are implemented in Google Earth Engine (GEE) and are accompanied by an interactive user interface (UI) for selecting a location on the map and generating time series charts of these indices.

Features:

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
Usage:

The provided functions can be used to analyze vegetation dynamics over time, allowing researchers and environmental scientists to gain insights into ecosystem health, land cover changes, and agricultural monitoring.

Installation:

To use VIOT, simply copy the provided functions into the Google Earth Engine Code Editor and run the script. Ensure you have the necessary permissions and data access in GEE.
