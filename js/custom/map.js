/**
 * @file
 * JavaScript for map insertion.
 */

(function ($) {


  Drupal.behaviors.OlMap = {
    attach: function (context, settings) {
      // console.log('Drupal.behaviors.OlMap');

      // @ layerStrategy : 1 == vengono costruite source ol.source.ImageWMS
      //                        inserite in layer lo.layer.Image
      //                      new ol.layer.Image({
      //                          source: new ol.source.ImageWMS({
      //                 : 0 == vengono costruite source ol.layer.Tile
      var layerStrategy = 1;

      var legend = 1;

      // var qgsUrl = 'http://localhost:8086/cgi-bin/qgis_mapserv.fcgi';
      // var qgsMap = '/var/www/qgs/vergante_web_materiale.qgs';

      var qgsUrl = 'http://qgis.demo:8086/cgi-bin/qgis_mapserv.fcgi';
      // var qgsUrl = 'http://qgis.demo/cgi-bin/qgis_mapserv.fcgi';
      // var qgsUrl = 'http://localhost:8086/cgi-bin/qgis_mapserv.fcgi';
      // var qgsUrl = 'http://local.d8mapping.it:8086/cgi-bin/qgis_mapserv.fcgi';
      var qgsMap = '/var/www/qgs/WP4/waterPortfolio.qgz';


      $('#map', context).once('OlMap').each(function() {

        console.log('Drupal.behaviors.OlMap');

        // var mapCenter = [952345.995,5770164.701];
        var mapCenter = [1833763.52, 5021650.70];
        // 5021650.70 1833763.52
        // 41.063082, 16.472978
        var mapZoom = 8;

        // TEST WMS GetCapabilities
        $.ajax({
            type: 'GET',
            url: qgsUrl + '?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities&map=' + qgsMap,
            success: parseGetCapabilities,
            // complete: setGCjsonObject,
        });

        // Success function callback for the ajax call
        function parseGetCapabilities (data, textStatus, jqXHR) {

          // console.log(data);
          // console.log(jqXHR.responseText);
          var capability = jqXHR.responseText;
          // console.log(capability);

          // Using OL parser
          var jsonCap = new ol.format.WMSCapabilities().read(capability);
          console.log(jsonCap);
          // var result = parser.read(data);
          // var capability = result.Capability;

          // console.log(capability);
          //
          // var jsonCap = new WMSCapabilities().parse(capability);
          // console.log(jsonCap);

          $.each( jsonCap, function( key, value ) {
            console.log( key + ": " + value );
          });
          // Get the extent form the getCapability result the EPSG:3857 bbox
          // console.log(capability.Layer.BoundingBox);
        }

        // / Fixed reversed variable -TESTING
        // var reversed = [{"id":"17","path":"17","type":"group","Name":"Territorio"},
        //                 {"id":"19","path":"17.19","type":"layer","Name":"Aree_di_scarico","parent":"17"},
        //                 {"id":"18","path":"17.18","type":"layer","Name":"Parcheggi_Distributori","parent":"17"},
        //                 {"id":"14","path":"14","type":"group","Name":"Fuori_Servizio"},
        //                 {"id":"16","path":"14.16","type":"layer","Name":"Automezzo_parcheggio","parent":"14"},
        //                 {"id":"15","path":"14.15","type":"layer","Name":"Automezzo_distributore","parent":"14"},
        //                 {"id":"9","path":"9","type":"group","Name":"Materiali_doppi"},
        //                 {"id":"13","path":"9.13","type":"layer","Name":"vetro-umido","parent":"9"},
        //                 {"id":"12","path":"9.12","type":"layer","Name":"verde-umido","parent":"9"},
        //                 {"id":"11","path":"9.11","type":"layer","Name":"secco-umido","parent":"9"},
        //                 {"id":"10","path":"9.10","type":"layer","Name":"lattine-umido","parent":"9"},
        //                 {"id":"1","path":"1","type":"group","Name":"Materiali_singoli"},
        //                 {"id":"8","path":"1.8","type":"layer","Name":"vetro","parent":"1"},
        //                 {"id":"7","path":"1.7","type":"layer","Name":"verde","parent":"1"},
        //                 {"id":"6","path":"1.6","type":"layer","Name":"umido","parent":"1"},
        //                 {"id":"5","path":"1.5","type":"layer","Name":"secco","parent":"1"},
        //                 {"id":"4","path":"1.4","type":"layer","Name":"lattine","parent":"1"},
        //                 {"id":"3","path":"1.3","type":"layer","Name":"plastica","parent":"1"},
        //                 {"id":"2","path":"1.2","type":"layer","Name":"carta","parent":"1"}]
// Allocazione Deficit Invasi,Sorgenti,Pozzi: portata emunta,Invasi,Grandi_Vettori,Domanda idrica Consorzi Irrigui,Confine regionale
        var reversed = [{"id":"6","path":"6","type":"layer","Name":"Allocazione Deficit Invasi","parent":"1"},
                        {"id":"5","path":"5","type":"layer","Name":"Sorgenti","parent":"1"},
                        {"id":"4","path":"4","type":"layer","Name":"Pozzi: portata emunta","parent":"1"},
                        {"id":"3","path":"3","type":"layer","Name":"Invasi","parent":"1"},
                        {"id":"3","path":"3","type":"layer","Name":"Grandi_Vettori","parent":"1"},
                        {"id":"2","path":"2","type":"layer","Name":"Domanda idrica Consorzi Irrigui","parent":"1"},
                        {"id":"1","path":"1","type":"layer","Name":"Confine regionale","parent":"1"},
                        {"id":"1","path":"1","type":"layer","Name":"Confine regionale","parent":"1"}
                        ]
        var qgisLayers = OlgetTree(reversed);

        /**/
        /* Base maps */
        /**/
    		var osm = new ol.layer.Tile({
    					source: new ol.source.OSM({
    					"url": "http://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"})
    					});
    		osm.set('name','osm')

        // TODO multple base maps

        // Add baseMaps to the base Group
        var baseGroup = new ol.layer.Group({
                                            layers: [osm]
                                          });
        /**/
        /* END Base maps */
        /**/


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
  				// layers: [baseGroup,prgpr3],
  				// layers: QgisWMSLayers,
  				// layers: baseGroup,
          layers: [baseGroup],
  				target: 'map',
  				view: view
  			});

        // Add Qgis layers to the map
        // $.each(qgisLayers, function(key, val){
        //   map.addLayer(val);
        // });


        // Default implementation
        // var layerSwitcher = new ol.control.LayerSwitcher({
        //         tipLabel: 'Legenda', // Optional label for button
        //         groupSelectStyle: 'group' // Can be 'children' [default], 'group' or 'none'
        // });
        // map.addControl(layerSwitcher);


        var layerSwitcher = new window['ol']['control']['LayerSwitcher']({
          tipLabel: 'Legenda', // Optional label for button
          groupSelectStyle: 'group' // Can be 'children' [default], 'group' or 'none'
        });

        map.addControl(layerSwitcher);
        // var toc = document.getElementById("layers");
        // ol.control.LayerSwitcher.renderPanel(map,
				// 	toc, {groupSelectStyle: 'children',
				// 				legendInLine: legend,
				// 				layerStrategy: layerStrategy });
        //
        // $('#layers > ul > li.layer-switcher-fold > button').trigger('click')	;


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

      function OlgetTree(array) {
        var o = {};

        // console.log(array);
        // Inject propierties
        array.forEach(({ id, path, type, Name }) => {
            var parents = path.split('.');
            var	parent = parents[parents.length - 2];

            // console.log('--- Parents ' + parents);
            // console.log('ID '+ id +' Name '+ Name);

            // if (o[parent] !== undefined){
            //   console.log('PARENT ' + parent + ' Name '+ o[parent].Name);
            // }

            // console.log(o[parent]);

            if(type == "group") {
                var innerLayers = [];
                // var olGroup = new ol.layer.Group({ layers: [] });
                var olGroup = new ol.layer.Group({ });
                olGroup.set('name', Name);
                olGroup.set('title', Name);
                olGroup.set('fold', 'close');
                // o[id].my = olGroup;
                Object.assign(o[id] = o[id] || olGroup, { id, type, Name });

                o[parent] = o[parent] || {'AA' : 'A'};
                o[parent].children = o[parent].children || [];
                o[parent].children.push(o[id]);
                // o[parent].children.unshift(o[id]);

                if (o[parent].getLayers){
                  innerLayers = o[parent].getLayers();
                  innerLayers.push(olGroup);
                  // innerLayers.splice(0, 0, olGroup);
                  if (innerLayers instanceof ol.Collection){
                    // set the layer collection of the grouplayer
                    o[parent].setLayers(innerLayers);
                  }
                }
                // bindInputs(Name, olGroup);
            } else {
                var innerLayers = [];

                if(layerStrategy == 1){
                  var simpLayer = new ol.layer.Image({
                    // visible: true,
                    // visible: false,
                    source: new ol.source.ImageWMS({
                      url: qgsUrl + '?map=' + qgsMap,
                      params: {'LAYERS': Name},
                      ratio: 1,
                      serverType: 'qgis'
                    })
                  });

                } else {
                  var simpLayer = new ol.layer.Tile({
                    // visible: true,
                    // visible: false,
                    source: new ol.source.TileWMS({
                      url: qgsUrl + '?map=' + qgsMap,
                      params: {'LAYERS': Name, 'TILED': true},
                      // params: {'LAYERS': Name, 'TILED': true, 'FILTER': Name+':"durata" IN ( 15029 )'},
                    })
                  });
                }

                // ??? TODO ???
                // console.log(simpLayer.getSource());

                simpLayer.set('name', Name);
                simpLayer.set('title', Name);
                // simpLayer.set('opacity', 1);

                Object.assign(o[id] = o[id] || simpLayer, { id, type, Name });
                o[parent] = o[parent] || {'AA' : 'B'};
                o[parent].children = o[parent].children || [];
                o[parent].children.push(o[id]);
                // o[parent].children.unshift(o[id]);
                // o[parent].get('layers').array_.push(simpLayer);

                // console.log(o[parent]);
                innerLayers = o[parent].getLayers();
                innerLayers.push(simpLayer);

                // if (o[parent] instanceof ol.Collection) {
                //   innerLayers = o[parent].getLayers();
                //   innerLayers.push(simpLayer);
                // } else {
                // 	innerLayers.push(simpLayer);
                // }


                // innerLayers.splice(0, 0, simpLayer);
                if (innerLayers instanceof ol.Collection){
                  // set the layer collection of the grouplayer
                  o[parent].setLayers(innerLayers);
                }
                // bindInputs(Name, simpLayer);
            }

            // console.log(o);
            // debugger;

        });
        return o.undefined.children;
      }

    }
  };

})(jQuery);
