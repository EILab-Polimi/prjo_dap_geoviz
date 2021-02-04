/**
 * @file
 * JavaScript for map insertion.
 */

(function ($) {

  Drupal.behaviors.OlMap = {
    attach: function (context, settings) {
      console.log('Drupal.behaviors.OlMap');

      $('#map', context).once('OlMap').each(function() {
        var mapCenter = [952345.995,5770164.701];
        var mapZoom = 8;

        /* Base maps */
    		var osm = new ol.layer.Tile({
    					source: new ol.source.OSM({
    					"url": "http://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"})
    					});
    		osm.set('name','osm')

        var baseGroup = new ol.layer.Group({
                                            layers: [osm]
                                          });

        var view = new ol.View({
  						// projection: 'EPSG:4326',
  						center: mapCenter,
  						zoom: mapZoom
  			})

  			// console.log('MAP LAYERS');
  			// console.log(QgisWMSLayers);
  			// mapLayers.push(QgisWMSLayers);

  			// console.log(mapLayers);

  			var map = new ol.Map({
  				// layers: [baseGroup,irr_meth,soiluse,awc,appl_eff,conv_eff,lyr_catasto,lyr_campi, lyr_acque],
  				// layers: [baseGroup,lyr_catasto],
  				// layers: QgisWMSLayers,
  				layers: baseGroup,
  				target: 'map',
  				view: view
  			});
      });

    }
  };

})(jQuery);
