// Monitoring Vegetation Indices
// Function to mask clouds in Sentinel-2 images
function maskSentinel2(image) {
    var qa = image.select('QA60');
    var cloudBitMask = 1 << 10;
    var cirrusBitMask = 1 << 11;
    var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
        .and(qa.bitwiseAnd(cirrusBitMask).eq(0));
    return image.updateMask(mask);
}

// Function to compute NDVI for Sentinel-2 images
function computeNDVI_S2(image) {
    var ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI');
    return image.addBands(ndvi);
}

// Function to compute EVI for Sentinel-2 images
function computeEVI_S2(image) {
    var evi = image.expression(
        '2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))', {
        'NIR': image.select('B8'),
        'RED': image.select('B4'),
        'BLUE': image.select('B2')
    }).rename('EVI');
    return image.addBands(evi);
}

// Function to compute SAVI for Sentinel-2 images
function computeSAVI_S2(image) {
    var savi = image.expression(
        '((NIR - RED) / (NIR + RED + 0.5)) * 1.5', {
        'NIR': image.select('B8'),
        'RED': image.select('B4')
    }).rename('SAVI');
    return image.addBands(savi);
}

// Function to compute DVI for Sentinel-2 images
function computeDVI_S2(image) {
    var dvi = image.expression(
        'NIR - RED', {
        'NIR': image.select('B8'),
        'RED': image.select('B4')
    }).rename('DVI');
    return image.addBands(dvi);
}

// Function to mask clouds in Landsat 9 images
function maskLandsat(image) {
    var qa = image.select('QA_PIXEL');
    var cloud = qa.bitwiseAnd(1 << 5).eq(0);
    return image.updateMask(cloud);
}

// Function to compute NDVI for Landsat 9 images
function computeNDVI_L9(image) {
    return image.addBands(image.normalizedDifference(['SR_B5', 'SR_B4']).rename('NDVI'));
}

// Function to compute EVI for Landsat 9 images
function computeEVI_L9(image) {
    return image.addBands(
        image.expression(
            '2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))', {
            'NIR': image.select('SR_B5'),
            'RED': image.select('SR_B4'),
            'BLUE': image.select('SR_B2')
        }).rename('EVI')
    );
}

// Function to compute SAVI for Landsat 9 images
function computeSAVI_L9(image) {
    return image.addBands(
        image.expression(
            '((NIR - RED) / (NIR + RED + 0.5)) * 1.5', {
            'NIR': image.select('SR_B5'),
            'RED': image.select('SR_B4')
        }).rename('SAVI')
    );
}

// Function to compute DVI for Landsat 9 images
function computeDVI_L9(image) {
    return image.addBands(
        image.expression(
            'NIR - RED', {
            'NIR': image.select('SR_B5'),
            'RED': image.select('SR_B4')
        }).rename('DVI')
    );
}

// Function to mask clouds in MODIS images
function maskMODIS(image) {
    var quality = image.select('QC_500m');
    var mask = quality.bitwiseAnd(1 << 0).eq(0); // Bit 0: internal cloud flag
    return image.updateMask(mask);
}

// Function to compute NDVI for MODIS images
function computeNDVI_MODIS(image) {
    var ndvi = image.normalizedDifference(['sur_refl_b02', 'sur_refl_b01']).rename('NDVI');
    return image.addBands(ndvi);
}

// Function to compute EVI for MODIS images
function computeEVI_MODIS(image) {
    var evi = image.expression(
        '2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))', {
        'NIR': image.select('sur_refl_b02'),
        'RED': image.select('sur_refl_b01'),
        'BLUE': image.select('sur_refl_b03')
    }).rename('EVI');
    return image.addBands(evi);
}

// Function to compute SAVI for MODIS images
function computeSAVI_MODIS(image) {
    var savi = image.expression(
        '((NIR - RED) / (NIR + RED + 0.5)) * 1.5', {
        'NIR': image.select('sur_refl_b02'),
        'RED': image.select('sur_refl_b01')
    }).rename('SAVI');
    return image.addBands(savi);
}

// Function to compute DVI for MODIS images
function computeDVI_MODIS(image) {
    var dvi = image.expression(
        'NIR - RED', {
        'NIR': image.select('sur_refl_b02'),
        'RED': image.select('sur_refl_b01')
    }).rename('DVI');
    return image.addBands(dvi);
}

// Function to create a chart of vegetation indices over time
function createVegetationIndexChart(startDate, endDate, point, dataset) {
    var collection;
    var scale;
    if (dataset === 'Sentinel-2') {
        collection = ee.ImageCollection('COPERNICUS/S2')
            .filterBounds(point)
            .filterDate(startDate, endDate)
            .map(maskSentinel2)
            .map(computeNDVI_S2)
            .map(computeEVI_S2)
            .map(computeSAVI_S2)
            .map(computeDVI_S2);
        scale = 10;
    } else if (dataset === 'Landsat 9') {
        collection = ee.ImageCollection('LANDSAT/LC09/C02/T1_L2')
            .filterBounds(point)
            .filterDate(startDate, endDate)
            .map(maskLandsat)
            .map(computeNDVI_L9)
            .map(computeEVI_L9)
            .map(computeSAVI_L9)
            .map(computeDVI_L9);
        scale = 30;
    } else if (dataset === 'MODIS') {
        collection = ee.ImageCollection('MODIS/006/MOD09GA')
            .filterBounds(point)
            .filterDate(startDate, endDate)
            .map(maskMODIS)
            .map(computeNDVI_MODIS)
            .map(computeEVI_MODIS)
            .map(computeSAVI_MODIS)
            .map(computeDVI_MODIS);
        scale = 500;
    }

    return ui.Chart.image.series({
        imageCollection: collection.select(['NDVI', 'EVI', 'SAVI', 'DVI']),
        region: point,
        reducer: ee.Reducer.mean(),
        scale: scale
    }).setOptions({
        title: 'Vegetation Indices Over Time (' + dataset + ')',
        vAxis: { title: 'Index Value' },
        hAxis: { title: 'Date' },
        lineWidth: 1,
        pointSize: 3,
        series: {
            0: { color: 'red' }, // NDVI
            1: { color: 'green' }, // EVI
            2: { color: 'blue' }, // SAVI
            3: { color: 'purple' } // DVI
        }
    });
}

// Initialize UI elements
var startDateBox = ui.Textbox({
    placeholder: 'YYYY-MM-DD',
    value: '2023-01-01',
    style: { width: '150px' }
});

var endDateBox = ui.Textbox({
    placeholder: 'YYYY-MM-DD',
    value: '2023-12-31',
    style: { width: '150px' }
});

var datasetSelect = ui.Select({
    items: ['Sentinel-2', 'Landsat 9', 'MODIS'],
    value: 'Sentinel-2',
    style: { width: '150px' }
});

var instructionLabel = ui.Label('Click on the map to get vegetation index time series:');
var locationLabel = ui.Label('');

// Create a panel to hold the widgets
var firstRow = ui.Panel({
    widgets: [instructionLabel, locationLabel],
    layout: ui.Panel.Layout.flow('horizontal'),
    style: {margin: '5px'}
});

var secondRow = ui.Panel({
    widgets: [startDateBox, endDateBox, datasetSelect],
    layout: ui.Panel.Layout.flow('horizontal'),
    style: {margin: '5px'}
});


var panel = ui.Panel({
    widgets: [firstRow, secondRow],
    layout: ui.Panel.Layout.flow('vertical'),
    style: { width: '100%', height: '350px', position: 'bottom-center'}
});

// Function to update the chart based on user inputs
function updateChart(lon, lat) {
    // Get user-defined start and end dates
    var startDate = startDateBox.getValue();
    var endDate = endDateBox.getValue();
    var dataset = datasetSelect.getValue();

    // Define the clicked point
    var point = ee.Geometry.Point(lon, lat);

    // Update the location label
    var location = 'lon: ' + lon.toFixed(2) + ' ' +
        'lat: ' + lat.toFixed(2);
    locationLabel.setValue(location);

    // Add a red dot to the map where the user clicked
    Map.layers().set(1, ui.Map.Layer(point, { color: 'FF0000' }));

    // Create and add the vegetation index chart to the panel
    var chart = createVegetationIndexChart(startDate, endDate, point, dataset);
    panel.clear(); // Clear previous content of the panel
    panel.add(firstRow)
          .add(secondRow)
          .add(chart); // Add the chart to the panel
}

// Set a callback function for when the user clicks the map
Map.onClick(function (coords) {
    updateChart(coords.lon, coords.lat);
});

// Load and display initial vegetation index data based on initial date inputs
var startDate = startDateBox.getValue();
var endDate = endDateBox.getValue();
var dataset = datasetSelect.getValue();

var initialCollection;
if (dataset === 'Sentinel-2') {
    initialCollection = ee.ImageCollection('COPERNICUS/S2')
        .filterDate(startDate, endDate)
        .map(maskSentinel2)
        .map(computeNDVI_S2)
        .map(computeEVI_S2)
        .map(computeSAVI_S2)
        .map(computeDVI_S2);
} else if (dataset === 'Landsat 9') {
    initialCollection = ee.ImageCollection('LANDSAT/LC09/C02/T1_L2')
        .filterDate(startDate, endDate)
        .map(maskLandsat)
        .map(computeNDVI_L9)
        .map(computeEVI_L9)
        .map(computeSAVI_L9)
        .map(computeDVI_L9);
} else if (dataset === 'MODIS') {
    initialCollection = ee.ImageCollection('MODIS/006/MOD09GA')
        .filterDate(startDate, endDate)
        .map(maskMODIS)
        .map(computeNDVI_MODIS)
        .map(computeEVI_MODIS)
        .map(computeSAVI_MODIS)
        .map(computeDVI_MODIS);
}

Map.addLayer(
    initialCollection.median(),
    { bands: ['NDVI'], min: 0, max: 1, palette: ['99c199', '006400', 'c7c7c7'] },
    'Vegetation Indices (' + dataset + ')'
);

// Configure the map
Map.setCenter(-94.84497, 39.01918, 6);
Map.style().set('cursor', 'crosshair');

// Add the panel to the ui.root
Map.add(panel);
