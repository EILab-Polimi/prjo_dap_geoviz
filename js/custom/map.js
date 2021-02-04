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


    		var prgpr3 = new ol.layer.Tile({
    		      source: new ol.source.TileWMS({
    						      url: 'http://2.35.83.105:8084/cgi-bin/qgis_mapserv.fcgi?VERSION=1.3.0&map=/var/www/qgs/comVB_PrgVariante32.qgs',
    						      params: {'LAYERS': ['basepulitaPRG','PR3'], 'TILED': true},
    								}),
    					visible: false
    		});
        prgpr3.set('name','prgpr3')


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
  				layers: [baseGroup,prgpr3],
  				// layers: QgisWMSLayers,
  				// layers: baseGroup,
  				target: 'map',
  				view: view
  			});

        // Default implementation
        var layerSwitcher = new ol.control.LayerSwitcher({
                tipLabel: 'Légende', // Optional label for button
                groupSelectStyle: 'children' // Can be 'children' [default], 'group' or 'none'
        });
        map.addControl(layerSwitcher);

        // var toc = document.getElementById("layers");
        // ol.control.LayerSwitcher.renderPanel(map, toc);


        /**
  		   * Custom provider for Geviz Nominatim.
  		   * Factory function which returns an object with the methods getParameters
  		   * and handleResponse called by the Geocoder
  		   */
  		  function geoVizPostgres(options) {
  		    var url = options.url;
  				var params = options.params;
  		    return {
  					name : 'geoVizPostgres',
  		      /**
  		       * Get the url, query string parameters and optional JSONP callback
  		       * name to be used to perform a search.
  		       * @param {object} opt Options object with query, key, lang,
  		       * countrycodes and limit properties.
  		       * @return {object} Parameters for search request
  		       */
  					/**
  					// getParametrs viene chiamato in nominatim.js passando un object opt
  					// che contiene i parmetri
  					// query: q che contiene il testo da cercare
  			    }
  					**/

  		      getParameters: function(opt) {
  						// console.log(opt);
  		        return {
  		          url: url,
  		          // callbackName: 'callback',// se aggiungi la callback all url viene appeso ?callback= e ti va in pappa la url
  		          params: {
  		            search: opt.query,
  								polygon: params.polygon,
  								polygon_geojson: params.polygon_geojson,

  		          },
  		        };
  		      },
  		      /**
  		       * Given the results of performing a search return an array of results
  		       * @param {object} data returned following a search request
  		       * @return {Array} Array of search results
  		       */
  		      handleResponse: function(results) {
  		        // The API returns a GeoJSON FeatureCollection
  						console.log('handleResponse layer_switcher.js');
  						console.log(results);

  							if (!results.length) return 'empty';
  							return results.map(result => ({
  								lon: result.lon,
  								lat: result.lat,
  								// polygonpoints: result.polygonpoints,
  								address: {
  									name: result.display_name,
  									// geojson: result.geojson,
  									// road: result.address.road || '',
  									// houseNumber: result.address.house_number || '',
  									// postcode: result.address.postcode,
  									// city: result.address.city || result.address.town,
  									// state: result.address.state,
  									// country: result.address.country,
  								},
  								geojson: result.geojson,
  								// original: {
  								// 	formatted: result.display_name,
  								// 	details: result.address,
  								// },
  								bbox: result.bbox,
  							}));
  						}
  		    };
  		  }
        /**
				// custom provider nominatim
				*/
				var provider = geoVizPostgres({
    			url: '//t0.ads.astuntechnology.com/open/search/osopennames/',
					// url: '?q=nominatim/geoviz',
					params: {
						search: '',
						format: 'json',
						addressdetails: 1,
						limit: 10,
						countrycodes: '',
						'accept-language': 'en-US',
						polygon: 1,
						polygon_geojson: 1,
					},
  			});

				var geocoder = new Geocoder('nominatim', {
				  // provider: 'osm',
					provider: provider,
					origin: 'geoviz',
				  // key: '__some_key__',
				  lang: 'pt-BR', //en-US, fr-FR
				  placeholder: 'Cerca per indirizzo e numero civico',
				  targetType: 'text-input',
				  limit: 5,
				  keepOpen: true,
					debug: true,
					// polygonStyle: myStyle,
					// featureStyle: myStyle,
					target: document.querySelector('#gvz_search'),
					type: 'normal'
				});

      });

    }
  };

})(jQuery);
