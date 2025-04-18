// ---------- Utility Functions ---------- //

// Normalize vegetation index image
function Normalize_index(index, geometry, scale) {
  var index_name = ee.String(index.bandNames().get(0));
  var minMax = index.reduceRegion({
    reducer: ee.Reducer.minMax(),
    geometry: geometry,
    scale: scale,
    maxPixels: 1e9
  });
  var Min = ee.Number(minMax.get(index_name.cat('_min')));
  var Max = ee.Number(minMax.get(index_name.cat('_max')));
  return index.subtract(Min).divide(Max.subtract(Min)).rename('Normalized');
}

// ---------- Dataset Configurations ---------- //

var datasets = {
  'Sentinel-2': {
    collection: 'COPERNICUS/S2_SR_HARMONIZED',
    bands: { NIR: 'B8', RED: 'B4', BLUE: 'B2' },
    scale: 100,
    mask: function (image) {
      var qa = image.select('QA60');
      var cloud = qa.bitwiseAnd(1 << 10).eq(0)
                    .and(qa.bitwiseAnd(1 << 11).eq(0));
      return image.updateMask(cloud);
    }
  },
  'Landsat 9': {
    collection: 'LANDSAT/LC09/C02/T1_L2',
    bands: { NIR: 'SR_B5', RED: 'SR_B4', BLUE: 'SR_B2' },
    scale: 100,
    mask: function (image) {
      var qa = image.select('QA_PIXEL');
      return image.updateMask(qa.bitwiseAnd(1 << 5).eq(0));
    }
  },
  'MODIS': {
    collection: 'MODIS/006/MOD09GA',
    bands: { NIR: 'sur_refl_b02', RED: 'sur_refl_b01', BLUE: 'sur_refl_b03' },
    scale: 100,
    mask: function (image) {
      return image.updateMask(image.select('QC_500m').bitwiseAnd(1 << 0).eq(0));
    }
  }
};

// ---------- Vegetation Index Computation ---------- //

function computeIndices(image, bands) {
  var ndvi = image.normalizedDifference([bands.NIR, bands.RED]).rename('NDVI');
  var evi = image.expression(
    '2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))', {
      'NIR': image.select(bands.NIR),
      'RED': image.select(bands.RED),
      'BLUE': image.select(bands.BLUE)
  }).rename('EVI');
  var savi = image.expression(
    '((NIR - RED) / (NIR + RED + 0.5)) * 1.5', {
      'NIR': image.select(bands.NIR),
      'RED': image.select(bands.RED)
  }).rename('SAVI');
  var dvi = image.expression('NIR - RED', {
    'NIR': image.select(bands.NIR),
    'RED': image.select(bands.RED)
  }).rename('DVI');

  return image.addBands([
    ndvi.unitScale(-1, 1).clamp(0, 1),
    evi.unitScale(-1, 1).clamp(0, 1),
    savi.unitScale(-1, 1).clamp(0, 1),
    dvi.unitScale(-10000, 10000).clamp(0, 1)
  ]);
}

// ---------- UI Components ---------- //

var startDateBox = ui.Textbox({
  placeholder: 'YYYY-MM-DD', value: '2023-01-01',
  style: { width: '150px' }
});
var endDateBox = ui.Textbox({
  placeholder: 'YYYY-MM-DD', value: '2023-12-31',
  style: { width: '150px' }
});
var datasetSelect = ui.Select({
  items: Object.keys(datasets), value: 'Sentinel-2',
  style: { width: '150px' }
});

var instructionLabel = ui.Label('Click on the map to get vegetation index time series:');
var locationLabel = ui.Label('');

var firstRow = ui.Panel([instructionLabel, locationLabel], ui.Panel.Layout.flow('horizontal'), { margin: '5px' });
var secondRow = ui.Panel([startDateBox, endDateBox, datasetSelect], ui.Panel.Layout.flow('horizontal'), { margin: '5px' });
var panel = ui.Panel([firstRow, secondRow], ui.Panel.Layout.flow('vertical'), {
  width: '100%', height: '350px', position: 'bottom-center'
});

// ---------- Chart Creation Function ---------- //

function createVegetationIndexChart(startDate, endDate, point, datasetKey) {
  var ds = datasets[datasetKey];
  var collection = ee.ImageCollection(ds.collection)
    .filterBounds(point)
    .filterDate(startDate, endDate)
    .map(ds.mask)
    .map(function (img) { return computeIndices(img, ds.bands); });

  return ui.Chart.image.series({
    imageCollection: collection.select(['NDVI', 'EVI', 'SAVI', 'DVI']),
    region: point,
    reducer: ee.Reducer.mean(),
    scale: ds.scale
  }).setOptions({
    title: 'Vegetation Indices Over Time (' + datasetKey + ')',
    vAxis: { title: 'Index Value' },
    hAxis: { title: 'Date' },
    lineWidth: 1,
    pointSize: 3,
    series: {
      0: { color: 'red' },
      1: { color: 'green' },
      2: { color: 'blue' },
      3: { color: 'purple' }
    }
  });
}

// ---------- Interaction Logic ---------- //

function updateChart(lon, lat) {
  var startDate = startDateBox.getValue();
  var endDate = endDateBox.getValue();
  var datasetKey = datasetSelect.getValue();
  var point = ee.Geometry.Point(lon, lat);

  locationLabel.setValue('lon: ' + lon.toFixed(2) + ', lat: ' + lat.toFixed(2));
  Map.layers().set(1, ui.Map.Layer(point, { color: 'FF0000' }));

  var chart = createVegetationIndexChart(startDate, endDate, point, datasetKey);
  panel.clear();
  panel.add(firstRow).add(secondRow).add(chart);
}

Map.onClick(function (coords) {
  updateChart(coords.lon, coords.lat);
});

// ---------- Initial Map Layer ---------- //

var startDate = startDateBox.getValue();
var endDate = endDateBox.getValue();
var datasetKey = datasetSelect.getValue();
var ds = datasets[datasetKey];

var initialCollection = ee.ImageCollection(ds.collection)
  .filterDate(startDate, endDate)
  .map(ds.mask)
  .map(function (img) { return computeIndices(img, ds.bands); });

Map.addLayer(initialCollection.median(), {
  bands: ['NDVI'],
  min: 0, max: 1,
  palette: ['99c199', '006400', 'c7c7c7']
}, 'Vegetation Indices (' + datasetKey + ')');

// ---------- Final Setup ---------- //

Map.setCenter(-94.84497, 39.01918, 6);
Map.style().set('cursor', 'crosshair');
Map.add(panel);
