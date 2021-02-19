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

      var qgsUrl = 'http://lab19.kdev.it:8086/cgi-bin/qgis_mapserv.fcgi';
      // var qgsUrl = 'http://qgis.demo/cgi-bin/qgis_mapserv.fcgi';
      // var qgsUrl = 'http://localhost:8086/cgi-bin/qgis_mapserv.fcgi';
      // var qgsUrl = 'http://local.d8mapping.it:8086/cgi-bin/qgis_mapserv.fcgi';
      var qgsMap = '/var/www/qgs/WP4/waterPortfolio.qgz';


      // TODO guarda linea 9 openlayers.drupal.js
      $('#map', context).once('OlMap').each(function() {

        console.log('Drupal.behaviors.OlMap');

        // var mapCenter = [952345.995,5770164.701];
        var mapCenter = [1833763.52, 5021650.70];
        // 5021650.70 1833763.52
        // 41.063082, 16.472978
        var mapZoom = 8;

        // Instantiate the map
          var view = new ol.View({
    						// projection: 'EPSG:4326',
    						center: mapCenter,
    						zoom: mapZoom
    			})
    			var olMap = new ol.Map({
            layers: [],
    				target: 'map',
    				view: view
    			});

          // Create the empty baseGroup and get it's layers
          var baseGroup = new ol.layer.Group({
            'title': 'Base',
            layers: [],
          })
          var baseLayers = baseGroup.getLayers();

          // Create the empty overGroup and get it's layers
          var overGroup = new ol.layer.Group({
            'title': 'Overlays',
            layers: [],
            fold: 'open',
          })
          var overLayers = overGroup.getLayers();

        // WMS GetCapabilities
        $.ajax({
            type: 'GET',
            url: qgsUrl + '?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities&map=' + qgsMap,
            success: parseGetCapabilities,
            complete: setGCjsonObject,
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

          // jsonCap.Service
          // jsonCap.version
          // $.each( jsonCap.Capability.Layer, jsonTreeString);
          $.each( jsonCap.Capability.Layer.Layer.reverse(), jsonTreeString);

          // Get the extent form the getCapability result the EPSG:3857 bbox
          // console.log(capability.Layer.BoundingBox);
        }

        // recursive function to create json tree
        function jsonTreeString(key, val) {
          console.log(key);
          console.log(val);
          // TODO to be tested for layer groups
          if (val.Layer instanceof Array) {
            $.each(val.Layer, jsonTreeString);
          } else {
            if(key > 3){
              // olMap.addLayer(

              var t = new ol.layer.Image({
                // visible: true,
                // visible: false,
                  title: val.Title,
                  source: new ol.source.ImageWMS({
                    url: qgsUrl + '?map=' + qgsMap,
                    params: {'LAYERS': val.Name},
                    ratio: 1,
                    serverType: 'qgis'
                  })
                })

              overLayers.push(t);
            }
            //  else {
            //   baseLayers.push(
            //
            //   );
            // }

          }

        }

        function setGCjsonObject (data, textStatus, jqXHR) {
          baseLayers.push(
            new ol.layer.Tile({
              // A layer must have a title to appear in the layerswitcher
              title: 'OSM',
              // Again set this layer as a base layer
              type: 'base',
              visible: true,
              source: new ol.source.OSM()
            })
          );
          console.log(overLayers);
          overGroup.setLayers(overLayers);
          baseGroup.setLayers(baseLayers);

          // olMap.addLayer([baseGroup, overGroup]);
          olMap.addLayer(baseGroup);
          olMap.addLayer(overGroup);

          /**
          / Default implementation for LayerSwitcher
          **/
          // var layerSwitcher = new ol.control.LayerSwitcher({
          //         tipLabel: 'Legenda', // Optional label for button
          //         // groupSelectStyle: 'group' // Can be 'children' [default], 'group' or 'none'
          // });
          // olMap.addControl(layerSwitcher);

          /**
          / LayerSwitcher instantiated using text to crete object
          **/
          // var layerSwitcher = new window['ol']['control']['LayerSwitcher']({
          //   tipLabel: 'Legenda', // Optional label for button
          //   // groupSelectStyle: 'group' // Can be 'children' [default], 'group' or 'none'
          // });
          // olMap.addControl(layerSwitcher);

          /**
          / LayerSwitcher in external dom element
          **/
          var toc = document.getElementById("layers");
          ol.control.LayerSwitcher.renderPanel(olMap,
          	toc, { //groupSelectStyle: 'children',
          				//legendInLine: legend,
          				//layerStrategy: layerStrategy
                });

          $('#layers > ul > li.layer-switcher-fold > button').trigger('click')	;

        }
        /**/
        /* Base maps */
        /**/
    		// var osm = new ol.layer.Tile({
    		// 			source: new ol.source.OSM({
    		// 			"url": "http://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"})
    		// 			});
    		// osm.set('name','osm')
        //
        // // TODO multple base maps
        //
        // // Add baseMaps to the base Group
        // var baseGroup = new ol.layer.Group({
        //                                     layers: [osm]
        //                                   });
        /**/
        /* END Base maps */
        /**/





      });


    }
  };

})(jQuery);
