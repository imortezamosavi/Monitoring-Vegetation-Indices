# Monitoring Vegetation Indices (MVI)

## Description

Monitoring Vegetation Indices (MVI) comprises a suite of functions designed to process satellite imagery and calculate essential vegetation indices, including NDVI, EVI, SAVI, and DVI. Leveraging data from MODIS, Landsat 9, and Sentinel-2 satellites, these functions are implemented within the Google Earth Engine (GEE) framework. The MVI also includes an interactive user interface (UI) for selecting locations on a map and generating time series charts of these indices.

## Features

### MODIS Functions

- **maskMODIS**: Masks clouds in MODIS images using the QC band.
- **computeNDVI**, **computeEVI**, **computeSAVI**, **computeDVI**: Calculate NDVI, EVI, SAVI, and DVI for MODIS images.
- **createVegetationIndexChart**: Generates a chart of vegetation indices over time for a selected point on the map using MODIS images.

### Landsat 9 Functions

- **maskLandsat**: Masks clouds in Landsat 9 images using the QA_PIXEL band.
- **computeNDVI**, **computeEVI**, **computeSAVI**, **computeDVI**: Calculate NDVI, EVI, SAVI, and DVI for Landsat 9 images.
- **createVegetationIndexChart**: Generates a chart of vegetation indices over time for a selected point on the map using Landsat 9 images.

### Sentinel-2 Functions

- **maskSentinel2**: Masks clouds in Sentinel-2 images using the QA60 band.
- **computeNDVI**, **computeEVI**, **computeSAVI**, **computeDVI**: Calculate NDVI, EVI, SAVI, and DVI for Sentinel-2 images.
- **createVegetationIndexChart**: Generates a chart of vegetation indices over time for a selected point on the map using Sentinel-2 images.

## Usage

The provided functions facilitate the analysis of vegetation dynamics over time, enabling researchers and environmental scientists to gain insights into ecosystem health, land cover changes, and agricultural monitoring.

## Installation

To utilize MVI, copy the provided functions into the Google Earth Engine Code Editor and execute the script. Ensure you have the necessary permissions and data access in GEE. Alternatively, click this [link](https://code.earthengine.google.com/?scriptPath=users%2Fmrmousaviian%2FSYD%3AMVI) to open the script directly in the Google Earth Engine Code Editor.

## Examples from the Code

Below are example charts generated using data from the three satellites:

### Sentinel-2

![Sentinel-2 Chart](https://github.com/imortezamosavi/Monitoring-Vegetation-Indices/blob/main/Sentinel.png)

### Landsat-9

![Landsat-9 Chart](https://github.com/imortezamosavi/Monitoring-Vegetation-Indices/blob/main/Landsat.png)

### MODIS

![MODIS Chart](https://github.com/imortezamosavi/Monitoring-Vegetation-Indices/blob/main/Modis.png)

By following these instructions, you can effectively use the MVI functions to conduct comprehensive vegetation monitoring and analysis.
