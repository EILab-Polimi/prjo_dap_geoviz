/**
 * @file
 * JavaScript for map insertion.
 */

(function ($) {


  Drupal.behaviors.OlGevizGeocoder = {
    attach: function (context, settings) {

      // Drupal.behaviors.OlMap.Map = Drupal.behaviors.OlMap.Map || {};

      // attach behavior to the search box item
      $('#gvz_search', context).once().each(function() {
        console.log("Behavior attached");
        var _myStroke = new ol.style.Stroke({
        					   color : 'blue',
        					   width : 3
        					});

  			var	_myFill = new ol.style.Fill({
  				   color: 'rgba(0, 0, 255, 0.1)'
  				});

  			var	myStyle = new ol.style.Style({
  				   stroke : _myStroke,
  				   fill : _myFill
  				 });


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
  						// console.log('handleResponse layer_switcher.js');
  						// console.log(results);

              // console.log(JSON.parse(results['data']));
              var ret = JSON.parse(results['data'])
              // console.log(typeof(ret));

              // if($.isEmptyObject(ret)) console.log('empty');
              // if($.isEmptyObject(ret)) return 'empty';
              // if (!results.length) return 'empty';

              // Object.fromEntries(Object.entries(ret).map(([k, v]) => [k, v * v]))

              var arr = []
              $.each( ret.id, function( key, value ) {
                // console.log( key  );
                // console.log( value );
                var obj = {
                  lon: ret.lon[key],
                  lat: ret.lat[key],
                  address: {
                    name: ret.descr[key]
                  },
                  geojson: ret.st_asgeojson[key]
                }
                arr.push(obj)
              });

              // console.log(arr);
              return (arr)
							// return ret.map(ret => ({
							// 	lon: ret.lon,
							// 	lat: ret.lat,
							// 	// polygonpoints: result.polygonpoints,
							// 	address: {
							// 		name: ret.display_name,
							// 		// geojson: result.geojson,
							// 		// road: result.address.road || '',
							// 		// houseNumber: result.address.house_number || '',
							// 		// postcode: result.address.postcode,
							// 		// city: result.address.city || result.address.town,
							// 		// state: result.address.state,
							// 		// country: result.address.country,
							// 	},
							// 	geojson: ret.geojson,
							// 	// original: {
							// 	// 	formatted: result.display_name,
							// 	// 	details: result.address,
							// 	// },
							// 	bbox: ret.bbox,
							// }));
  					}
  		    };
  		  }


    				/**
    				// custom provider nominatim
    				*/
    				var provider = geoVizPostgres({
        			// url: '//t0.ads.astuntechnology.com/open/search/osopennames/',
    					// url: '/nominatim/geoviz', // drupal url to get reponse from controller old implementation with database change inside the controller
              url: settings.path.baseUrl+'api/fastapi/geocoder',
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

            /**
            // The Geocoder instance
            // here we can set the provider to use
    				*/
            Drupal.behaviors.OlGevizGeocoder.geocoder = new Geocoder('nominatim', {
    				  // provider: 'osm',
    					provider: provider,
    					origin: 'geoviz',
    				  // key: '__some_key__',
    				  lang: 'pt-BR', //en-US, fr-FR
    				  // placeholder: 'Cerca per indirizzo e numero civico',
    				  targetType: 'text-input',
    				  limit: 5,
    				  keepOpen: true,
    					debug: true,
    					polygonStyle: myStyle,
    					// featureStyle: myStyle,
    					target: document.querySelector('#gvz_search'),
    					type: 'normal'
    				});

            //Listen when an address is chosen
            Drupal.behaviors.OlGevizGeocoder.geocoder.on('addresschosen', function(evt) {
              console.log(evt);
              var tpoint = evt.feature;
              console.log(tpoint.getGeometry());
              // tpf.setStyle(myStyle);
              // if()
              // content.innerHTML = '<p>'+evt.address.formatted+'</p>';
              console.log(evt.coordinate);
              overlay.setPosition(evt.coordinate);

              Drupal.behaviors.OlMap.Map.on('click', function(event) {
                      var pixel = event.pixel;
                      displayFeatureInfo(pixel, evt.coordinate);
                      // overlay.setPosition(evt.coordinate);
              });
            });

              // console.log(Drupal.behaviors.OlMap.Map);
              // Drupal.behaviors.OlMap.Map.addControl(geocoder);
    				  // Drupal.behaviors.OlMap.Map.addControl(geocoder_extended);

      });

    }
  };

})(jQuery);
