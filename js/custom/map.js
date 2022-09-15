/**
 * @file
 * JavaScript for map insertion.
 */

(function ($) {


  Drupal.behaviors.OlMap = {
    attach: function (context, settings) {
      // console.log('Drupal.behaviors.OlMap');

      Drupal.behaviors.OlMap.Map = Drupal.behaviors.OlMap.Map || {};
      Drupal.behaviors.OlMap.FEATURE_COUNT = Drupal.behaviors.OlMap.FEATURE_COUNT || 10;

      Drupal.behaviors.OlMap.overGroup = Drupal.behaviors.OlMap.overGroup || {}
      Drupal.behaviors.OlMap.overLayers = Drupal.behaviors.OlMap.overLayers || {}

      // @ layerStrategy : 1 == vengono costruite source ol.source.ImageWMS
      //                        inserite in layer lo.layer.Image
      //                      new ol.layer.Image({
      //                          source: new ol.source.ImageWMS({
      //                 : 0 == vengono costruite source ol.layer.Tile
      var layerStrategy = 1;

      var legend = 1;

      /* Localhost development */
      // var qgsUrl = 'http://qgis.demo:8086/cgi-bin/qgis_mapserv.fcgi';
      // var qgsMap = '/var/www/qgs/WP4/waterPortfolio.qgz';



      // TODO guarda linea 9 openlayers.drupal.js
      $('#map', context).once().each(function() {

        /* Demo */
        // console.log(settings);
        // var qgsUrl = 'https://lab19.kdev.it:8086/cgi-bin/qgis_mapserv.fcgi';
        // http://localhost:9003/?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities
        var qgsUrl = settings.geoviz.qgis_url;
        // var qgsMap = '/var/www/qgs/WP4/waterPortfolio.qgz';
        var qgsMap = settings.geoviz.qgis_map;

        // console.log('Drupal.behaviors.OlMap');

        // var mapCenter = [952345.995,5770164.701];
        var mapCenter = [1833763.52, 5021650.70];
        // 5021650.70 1833763.52
        // 41.063082, 16.472978
        // var mapZoom = 7.5;
        var mapZoom = 8;

        // Instantiate the map
          var view = new ol.View({
    						// projection: 'EPSG:4326',
    						center: mapCenter,
    						zoom: mapZoom
    			})
    			// var olMap = new ol.Map({
          Drupal.behaviors.OlMap.Map = new ol.Map({
            layers: [],
    				target: 'map',
    				view: view
    			});

          // Create the empty baseGroup and get it's layers
          // var baseGroup = new ol.layer.Group({
          //   'title': 'Basemaps',
          //   layers: [],
          // })
          // var baseLayers = baseGroup.getLayers();

          // Create the empty mainGroupContainer and get it's layers
          var mainGroupContainer = new ol.layer.Group({
            'title': 'All Layers',
            layers: [],
            // fold: 'open',
          })
          var overLayers = mainGroupContainer.getLayers();

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
          // console.log(jsonCap);

          // jsonCap.Service
          // jsonCap.version
          // $.each( jsonCap.Capability.Layer, jsonTreeString);
          console.log("CAPABILITIES");
          console.log(jsonCap.Capability.Layer.Layer.reverse());
          $.each( jsonCap.Capability.Layer.Layer.reverse(), jsonTreeString);

          // Get the extent form the getCapability result the EPSG:3857 bbox
          // console.log(capability.Layer.BoundingBox);
        }

        // recursive function to create json tree
        function jsonTreeString(key, val) {
          Drupal.behaviors.OlMap.Level = Drupal.behaviors.OlMap.Level || 0;
          console.log("GRUPPO / LIVELLO "+ Drupal.behaviors.OlMap.Level);
          console.log('---- jsonTreeString ---- ' + key);
          console.log(val);
          // // TODO to be tested for layer groups
          // Drupal.behaviors.OlMap.overGroup[key] = new ol.layer.Group({
          //   'title': val.title,
          //   layers: [],
          //   // fold: 'open',
          // })
          // Drupal.behaviors.OlMap.overLayers[key] = Drupal.behaviors.OlMap.overGroup[key].getLayers();

          if (val.Layer instanceof Array) {
            console.log("ENTERED ITERATION");
            Drupal.behaviors.OlMap.Level = key;
            // TODO to be tested for layer groups
            Drupal.behaviors.OlMap.overGroup[key] = new ol.layer.Group({
              'title': val.title,
              layers: [],
              // fold: 'open',
            })
            Drupal.behaviors.OlMap.overLayers[key] = Drupal.behaviors.OlMap.overGroup[key].getLayers();

            $.each(val.Layer, jsonTreeString);
          } else {
              var t = new ol.layer.Image({
                // visible: true,
                // visible: false,
                  type: 'layer',
                  title: val.Title,
                  source: new ol.source.ImageWMS({
                    url: qgsUrl + '?map=' + qgsMap,
                    // params: {'LAYERS': val.Name},
                    params: {'LAYERS': val.Title},
                    ratio: 1,
                    serverType: 'qgis'
                  })
                })

              console.log('pushing layer' + val.Title + ' in '+ Drupal.behaviors.OlMap.Level);
              Drupal.behaviors.OlMap.overLayers[Drupal.behaviors.OlMap.Level].push(t);
          }

        }

        function setGCjsonObject (data, textStatus, jqXHR) {
          // Create the empty baseGroup and get it's layers
          var baseGroup = new ol.layer.Group({
            'title': 'Basemaps',
            layers: [],
          })
          var baseLayers = baseGroup.getLayers();

          baseLayers.push(
            new ol.layer.Tile({
              // A layer must have a title to appear in the layerswitcher
              title: 'OSM',
              // Again set this layer as a base layer
              type: 'base',
              visible: true,
              source: new ol.source.OSM({
                // url: 'https://tiles.wmflabs.org/bw-mapnik/${z}/${x}/${y}.png',
                // url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'
                // crossOrigin: 'http://tile.openstreetmap.org'
              })
            }),
          );
          baseLayers.push(
            new ol.layer.Tile({
              title: 'Stamen',
              type: 'base',
              source: new ol.source.Stamen({
                layer: 'toner-lite',
              }),
            })
          );
          // console.log(overLayers);
          // console.log();

/////////////////// Hard coded for Sept 09 2022 - School
          var fakeG1 = new ol.layer.Group({
            'title': 'fakeG1',
            layers: [
              new ol.layer.Group({
                'title': 'Uno',
                layers: Drupal.behaviors.OlMap.overLayers[0],
                // fold: 'open',
              }),
              new ol.layer.Group({
                'title': 'Due',
                layers: Drupal.behaviors.OlMap.overLayers[1],
                // fold: 'open',
              }),

            ]
            // fold: 'open',
          })

          var overLayersG1 = fakeG1.getLayers();
          mainGroupContainer.setLayers(overLayersG1)
///////////////////

          // $.each( Drupal.behaviors.OlMap.overGroup, function(key,val){
          //   console.log(key);
          //   console.log(val);
          //   // overGroup.setLayers(val)
          //   overGroup.setLayers(Drupal.behaviors.OlMap.overLayers)
          // });

          baseGroup.setLayers(baseLayers);

          Drupal.behaviors.OlMap.Map.addLayer(baseGroup);
          Drupal.behaviors.OlMap.Map.addLayer(mainGroupContainer);


          Drupal.behaviors.OlMap.Map.addControl(Drupal.behaviors.OlGevizGeocoder.geocoder)
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
          // var toc = document.getElementById("layers");
          // ol.control.LayerSwitcher.renderPanel(olMap,
          // 	toc, { //groupSelectStyle: 'children',
          // 				//legendInLine: legend,
          // 				//layerStrategy: layerStrategy
          //       });
          //
          // $('#layers > ul > li.layer-switcher-fold > button').trigger('click')	;

          /**
          / Layer switcher component - ilpise fork
          **/
          var toc = document.getElementById("layers");
          ol.control.LayerSwitcher.renderPanel(Drupal.behaviors.OlMap.Map,
            toc, {groupSelectStyle: 'children',
                  legendInLine: legend,
                  layerStrategy: layerStrategy });

          $('#layers > ul > li.layer-switcher-fold > button').trigger('click')	;


          // Change mouse pointer when on map and the info-tab is selected
          Drupal.behaviors.OlMap.Map.getViewport().addEventListener('mouseover', function(evt){
              // console.info('in');
              // console.log($('#info-tab').attr("class"));
              if ($('#info').hasClass("active")){
                $(this).css( 'cursor', 'crosshair' );
              } else {
                $(this).css( 'cursor', 'default' );
              }
          }, false);

          // Feature info behavior
          Drupal.behaviors.OlMap.Map.on('singleclick', function(evt) {
              // console.log(evt);
              console.log('singleclick');
              var li = '';
              var tabPane = '';
              var viewResolution = /** @type {number} */ (view.getResolution());

              Drupal.behaviors.OlMap.Map.forEachLayerAtPixel(evt.pixel, function(layer) {
                  // console.log(evt.pixel);
                  // console.log(layer.get('type'));
                  // console.log(layer.getKeys());
                  // console.log(layer.getProperties());
                  // var id = layer.get('id');
                  // console.log(id);
                  // var title = layer.get('title');
                  // console.log('Title');
                  // console.log(title);

                  // Add tematismo only for layers (exclude base layers)
                  // console.log(layer.getProperties());
                  // console.log(layer.getProperties().type);
                  if (layer.getProperties().type !== 'base' && layer.getProperties().type == 'layer'){
                    // console.log('type layer');
                    wmsSource = layer.getSource();

                    // console.log(wmsSource.ol_uid);
                    // console.log(wmsSource.getKeys());
                    // console.log(wmsSource.getProperties());
                    //	https://docs.qgis.org/3.4/en/docs/user_manual/working_with_ogc/server/services.html#getfeatureinfo

                      var url = wmsSource.getFeatureInfoUrl(
                        evt.coordinate, viewResolution, 'EPSG:3857',
                        {
                          // 'INFO_FORMAT': 'text/html'
                          // 'INFO_FORMAT': 'text/plain'
                          'INFO_FORMAT': 'text/xml',
                          // 'INFO_FORMAT': 'application/json'
                          'FI_POINT_TOLERANCE': 16,
                          'FI_LINE_TOLERANCE': 8,
                          'FI_POLYGON_TOLERANCE': 4,
                          'FEATURE_COUNT': Drupal.behaviors.OlMap.FEATURE_COUNT
                        });
                      if (url) {
                        // console.log(url);
                        fetch(url)
                          .then(function (response) {
                            // console.log(response);
                            return response.text();
                          })
                          .then(function (xml) {
                            // console.log(xml);
                            parser = new DOMParser();
                            // xmlDoc = parser.parseFromString(xml, "text/xml");
                            var xmlDoc = $.parseXML( xml );
                            var xml = $( xmlDoc );
                            var layer = xml.find( "Layer" );
                            var feature = xml.find( "Feature" );

                            // console.log(layer);
                            console.log(feature.length);
                            if(feature.length > 0){
                              // console.log(wmsSource.ol_uid);
                              var title = xml.find( "Layer" ).attr('name');
                              var machineName = title.replace(/\s/g, '');
                              // var html;
                              // console.log(title);
                              // console.log('FEATURE');
                              // console.log(feature);

                              // var panel_group = '<div class="panel-group">';
                              var table = '';
                              // var accord = '';
                              xml.find("Feature").each(function (key) {
                                // console.log(key);
                                // console.log('Feature');
                                // console.log($(this));
                                // console.log(typeof $(this));
                                // console.log($(this).attr('id'));
                                // console.log($(this).get(0));
                                // console.log($(this).context);

                                if (key == 0) {
                                  var infirst = 'in';
                                } else {
                                  var infirst = '';
                                }

                                var featureId = "feature-"+$(this).attr('id');

                                table += '<div class="card">'+
                                            '<div class="card-header">'+
                                              '<h6 class="panel-title">'+
                                                '<a data-bs-toggle="collapse" data-bs-parent="#infocontent-'+machineName+'" href="#'+featureId+'">'+featureId+'</a>'+
                                              '</h6>'+
                                            '</div>'+
                                            '<div id="'+featureId+'" class="panel-collapse collapse '+infirst+'" style="max-height: 40vh; overflow: auto;">'+
                                '<table class="table table-striped">';
                                $(this).find("Attribute").each(function () {
                                  // console.log($(this).attr('name'));
                                  // console.log($(this).attr('value'));
                                  if($(this).attr('name').toLowerCase() == 'foto'){
                                    table += '<tr><td><b>'+$(this).attr('name')+'</b></td><td><img class="img-responsive open-img" src="'+$(this).attr('value')+'"/></td></tr>';
                                  } else if ($(this).attr('name').toLowerCase() == 'link'){
                                    table += '<tr><td><b>'+$(this).attr('name')+'</b></td><td><a href="'+$(this).attr('value')+'">'+$(this).attr('name')+'</a></td></tr>';
                                  } else {
                                    table += '<tr><td><b>'+$(this).attr('name')+'</b></td><td>'+$(this).attr('value')+'</td></tr>';
                                  }
                                });
                                table += '</table></div></div>';

                              });

                              // var panel_group = '<div class="panel-group">'+table+'</div>';
                                li += '<div class="form-check">'+
                                        '<input data-bs-toggle="tab" data-bs-target="#infotab-'+machineName+'" class="form-check-input" type="radio" role="tab" name="radiolayer">'+
                                        '<label class="form-check-label">'+ title +'</label>'+
                                        '</div>';

                                tabPane += '<div class="tab-pane" id="infotab-'+machineName+'">'+
                                                // '<p>'+title+'</p>'+
                                                '<div class="panel-group" id="infocontent-'+machineName+'">'+table+'</div>'+
                                                // '<div id="infocontent-'+title+'">'+panel_group+'</div>'+
                                            '</div>';


                            }

                            var content = '<h5>Selected layers:</h5>';
                                content += li;
                                content += '<hr/>'
                                content += '<h5>Informations:</h5><div class="tab-content ">';
                                content += tabPane;
                                content += '</div>';

                            // Reset info element
                            document.getElementById('info-wrap').innerHTML = '';

                            document.getElementById('info-wrap').innerHTML = content;

                            $('input[name="radiolayer"]').click(function () {
                                //jQuery handles UI toggling correctly when we apply "data-target" attributes and call .tab('show')
                                //on the <li> elements' immediate children, e.g the <label> elements:
                                console.log('radio clicked');


                                // if($(this).val() === "yes") {
                                //   $('#collapseOne').collapse('show');
                                // } else {
                                //   $('#collapseOne').collapse('hide');
                                // }

                                console.log($(this).attr("data-bs-target"));
                                var target = $(this).attr("data-bs-target");

                                // $(target).toggle();
                                $(target).show();

                                // console.log($(this));
                                // console.log( $(''+$(this).attr("data-bs-target")+'').attr() )
                                // $(this).attr("data-target").toggle();
                                // $(this).attr("data-target").addClass('active');
                                // $(this).closest('label').trigger('click');
                                // $(this).closest('label').tab('show');
                                // $(this).tab('show');
                                // $(this).closest('label').attr("data-target").tab('show');
                            });

                            $('#info-wrap > div > input').first().trigger('click');
                            // $('#info-list > li > div > label > input').first().trigger('click');

                            // $('img.open-img').click(function (){
                            //   var img = '<img class="img-responsive" style="margin:auto;" src="'+$(this).attr('src')+'"/>'
                            //   $('#imagecontainer').html(img);
                            //   $('#imgTitle').html();
                            //
                            //   $('#imageModal').modal('show');
                            // });

                          });
                      }
                  }
              });
            });

        }

        // var setStart = $( "#slider-range" ).slider( "value" );
        // $( "#amount" ).val( setStart );
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

      // $('#slider-range', context).once('OlMap').each(function() {
      //   $( "#slider-range" ).slider({
      //         range: false,
      //         // min: Number(mint),
      //         min : 2025,
      //         max: 2074,
      //         // step: 86400*7, // TODO se setti lo step a una settimana le date min max non vengono refreshate in modo corretto quando si slida
      //         step: 1,
      //         // values: [ Number(mint), Number(mint)+(86400*7)],
      //         // value: Number(mint),
      //         value: 2025,
      //         slide: function( event, ui ) {
      //           // return (ui.values[1] - ui.values[0] > 86400*7);
      //
      //           // console.log('ui value ' + ui.value);
      //           $( "#amount" ).val(ui.value);
      //         }
      //   });
      //
      //   $( "#amount" ).val(2025);
      //
      // });

    }
  };

})(jQuery);
