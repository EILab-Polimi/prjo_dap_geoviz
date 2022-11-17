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


      Drupal.behaviors.OlMap.ApplyFilter = Drupal.behaviors.OlMap.ApplyFilter || false;
      // @ layerStrategy : 1 == vengono costruite source ol.source.ImageWMS
      //                        inserite in layer lo.layer.Image
      //                      new ol.layer.Image({
      //                          source: new ol.source.ImageWMS({
      //                 : 0 == vengono costruite source ol.layer.Tile
      var layerStrategy = 1;

      var legend = 0;


      // TODO guarda linea 9 openlayers.drupal.js
      $('#map', context).once().each(function() {

        var qgsUrl = settings.path.baseUrl+'api/QgisServer';
        var qgsMap = settings.geoviz.qgis_map;

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
          // console.log("CAPABILITIES");
          // console.log(jsonCap.Capability.Layer.Layer.reverse());
          $.each( jsonCap.Capability.Layer.Layer.reverse(), jsonTreeString);
          // $.each( jsonCap.Capability.Layer.Layer, jsonTreeString);

          // TODO
          // Get the extent form the getCapability result the EPSG:3857 bbox
          // console.log(capability.Layer.BoundingBox);

        }

        // recursive function to create json tree
        function jsonTreeString(key, val) {
          Drupal.behaviors.OlMap.GroupID = Drupal.behaviors.OlMap.GroupID || 0;
          // console.log("GROUP ID "+ Drupal.behaviors.OlMap.GroupID);
          // console.log('---- jsonTreeString ---- ' + key);
          // console.log(val);

          if (val.Layer instanceof Array) {
            // console.log("ENTERED ITERATION");
            // Reverse the array of layers
            // This is to have the order in Legend like in Qgis desktop project
            val.Layer.reverse()

            // Set the GroupID globally to fill the array
            Drupal.behaviors.OlMap.GroupID = key;

            // Create the group with GroupID - the GroupID does not change in recursion
            Drupal.behaviors.OlMap.overGroup[Drupal.behaviors.OlMap.GroupID] = new ol.layer.Group({
              'title': val.Title,
              layers: [],
            })
            Drupal.behaviors.OlMap.overLayers[Drupal.behaviors.OlMap.GroupID] = Drupal.behaviors.OlMap.overGroup[Drupal.behaviors.OlMap.GroupID].getLayers();

            // Call recursion
            $.each(val.Layer, jsonTreeString);
          } else {
              var t = new ol.layer.Image({
                  type: 'layer',
                  title: val.Title,
                  source: new ol.source.ImageWMS({
                    url: qgsUrl + '?map=' + qgsMap,
                    params: {'LAYERS': val.Title},
                    ratio: 1,
                    serverType: 'qgis'
                  })
                })

              Drupal.behaviors.OlMap.overLayers[Drupal.behaviors.OlMap.GroupID].push(t);
          }
          Drupal.behaviors.OlMap.overLayers[Drupal.behaviors.OlMap.GroupID] = Drupal.behaviors.OlMap.overGroup[Drupal.behaviors.OlMap.GroupID].getLayers();

        }

        function setGCjsonObject (data, textStatus, jqXHR) {
          // Create the empty baseGroup and get it's layers
          var baseGroup = new ol.layer.Group({
            'title': 'Basemaps',
            layers: [],
            // type: 'base'
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
              title:'Esri - World Topo Map',
              type: 'base',
              source: new ol.source.XYZ({
                attributions:
                  'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
                  'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
                url:
                  'https://server.arcgisonline.com/ArcGIS/rest/services/' +
                  'World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
              }),
            }),
          );
          baseLayers.push(
            new ol.layer.Tile({
              title:'Esri - World Imagery',
              type: 'base',
              source: new ol.source.XYZ({
                attributions:
                  'Tiles &copy; <a href="https://services.arcgisonline.com/ArcGIS/' +
                  'rest/services/World_Imagery/MapServer">ArcGIS</a>',
                url:
                  'https://server.arcgisonline.com/ArcGIS/rest/services/' +
                  'World_Imagery/MapServer/tile/{z}/{y}/{x}',
              }),
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


          baseGroup.setLayers(baseLayers);

          // Add base layers
          Drupal.behaviors.OlMap.Map.addLayer(baseGroup);
          // Add overlays
          $.each(Drupal.behaviors.OlMap.overGroup, function(k,v){
              Drupal.behaviors.OlMap.Map.addLayer(v);
          })

          /**
          / ADD Geocoder Controller
          */
          Drupal.behaviors.OlMap.Map.addControl(Drupal.behaviors.OlGevizGeocoder.geocoder)

          /**
          / Layer switcher component - ilpise fork
          **/
          var toc = document.getElementById("layers");

          ol.control.LayerSwitcher.renderPanel(Drupal.behaviors.OlMap.Map,
            toc, {reverse: true,
                  groupSelectStyle: 'children',
                  legendInLine: legend,
                  layerStrategy: layerStrategy });

          /**
          / Default implementation for LayerSwitcher
          **/
          // var layerSwitcher = new ol.control.LayerSwitcher({
          //         tipLabel: 'Legenda', // Optional label for button
          //         // groupSelectStyle: 'group' // Can be 'children' [default], 'group' or 'none'
          //         groupSelectStyle: 'children',
          // });
          // Drupal.behaviors.OlMap.Map.addControl(layerSwitcher);


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
                  if (layer.getProperties().type !== 'base' && layer.getProperties().type == 'layer'){
                    // console.log('type layer');
                    wmsSource = layer.getSource();

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
                            // Layer name
                            return response.text();
                          })
                          .then(function (xml) {
                            // console.log(xml);
                            parser = new DOMParser();
                            // xmlDoc = parser.parseFromString(xml, "text/xml");
                            var xmlDoc = $.parseXML( xml );
                            var xml = $( xmlDoc );
                            console.log(xml);
                            var layer = xml.find( "Layer" );
                            console.log(layer);
                            var feature = xml.find( "Feature" );
                            console.log(feature);


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

                                if (key == 0) {
                                  var infirst = 'in';
                                } else {
                                  var infirst = '';
                                }

                                console.log($(this).attr('id'));

                                var featureId = "feature-"+$(this).attr('id').replace(/[ "'()@]/g,"_");
                                // var featureId = "feature-"+$(this).attr('id').replace(/[^a-zA-Z0-9 ]/g,"_");

                                table += '<div class="card">'+
                                            '<div class="card-header">'+
                                              '<h6 class="panel-title">'+
                                                '<a data-bs-toggle="collapse" data-bs-parent="#infocontent-'+machineName+'" href="#'+featureId+'">'+featureId+'</a>'+
                                              '</h6>'+
                                            '</div>'+
                                            '<div id="'+featureId+'" class="panel-collapse collapse '+infirst+'" style="max-height: 40vh; overflow: auto;">'+
                                '<table class="table table-striped">';
                                $(this).find("Attribute").each(function () {
                                  console.log($(this).attr('name'));
                                  console.log($(this).attr('value'));
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
                                content += '<div class="nav nav-tabs flex-column" role="tablist">';
                                content += li;
                                content += '</div>';
                                // content += '<hr/>'
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

                                console.log($(this).attr("data-bs-target"));
                                var target = $(this).attr("data-bs-target");

                                // $(target).toggle();
                                $(target).show();
                            });

                            $('#info-wrap > div > input').first().trigger('click');

                          });
                      }
                  }
              });
            });


          /**
          / EXTENT
          / https://gis.stackexchange.com/questions/240372/how-do-i-get-all-the-layer-vectors-added-to-a-map-in-openlayers-3
          */
          // //Create an empty extent that we will gradually extend
          // var extent = ol.extent.createEmpty();
          //
          // // Uguale al FILTERING ma senza arrow function
          // Drupal.behaviors.OlMap.Map.getLayers().forEach(function(layer) {
          //   console.log(layer);
          //     //If this is actually a group, we need to create an inner loop to go through its individual layers
          //     if(layer instanceof ol.layer.Group) {
          //         layer.getLayers().forEach(function(groupLayer) {
          //             //If this is a vector layer, add it to our extent
          //             if (layer instanceof ol.layer.Vector) {
          //               console.log('Vector');
          //               ol.extent.extend(extent, groupLayer.getSource().getExtent());
          //             } else if (layer instanceof ol.layer.Image) {
          //               console.log(layer.get('title'));
          //               ol.extent.extend(extent, groupLayer.getSource().getExtent());
          //             } else if(layer instanceof ol.layer.Group) {
          //               console.log('--- Group ---');
          //               layer.getLayers().forEach(function(groupLayer) {
          //                 console.log(layer.get('title'));
          //               })
          //
          //             }
          //         });
          //     } else if (layer instanceof ol.layer.Vector || layer instanceof ol.layer.Image){
          //        ol.extent.extend(extent, layer.getSource().getExtent());
          //     }
          // });
          //
          // //Finally fit the map's view to our combined extent
          // // Drupal.behaviors.OlMap.Map.getView().fit(extent, Drupal.behaviors.OlMap.Map.getSize());


          /**
          / FILTERING
          */
          console.log(Drupal.behaviors.OlMap.Map.getLayers());
          Drupal.behaviors.OlMap.filterLayers(Drupal.behaviors.OlMap.Map);

          console.log("I think is Synk");
          Drupal.behaviors.OlMap.ApplyFilter = false;

        }

      });


      /**
      / Recursive function to cycle on all the nested layers
      */
      Drupal.behaviors.OlMap.filterLayers = function (obj) {
        console.log(obj);
        if (obj.get('title') == 'Evaluation Indicators'){
          console.log(" ---- ooooooooo -----  ");
          Drupal.behaviors.OlMap.ApplyFilter = true;
        }
        obj.getLayers().forEach(function(layer) {
          // console.log(layer.get('title') );
          // console.log(layer.type);
          if(layer instanceof ol.layer.Group) {
            // Recursion on groups to get layers
            Drupal.behaviors.OlMap.filterLayers(layer)
          } else if(layer instanceof ol.layer.Image && Drupal.behaviors.OlMap.ApplyFilter) {
            // console.log(layer.get('title'));
            var source = layer.getSource();
            var params = source.getParams();
            // console.log(source);
            // console.log(params);
            params.FILTER = ''+layer.get('title')+':"exp_id" = '+Drupal.behaviors.Common.Selectors.WPP+' AND "scen_id" = '+Drupal.behaviors.Common.Selectors.SCEN;
            source.updateParams(params);
          }
        });
      }

    }
  };

})(jQuery);
