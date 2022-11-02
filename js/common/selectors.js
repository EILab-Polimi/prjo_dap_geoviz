/**
 * @file
 * JavaScript for graph insertion.
 */

(function ($) {


  Drupal.behaviors.Common = {
    attach: function (context, settings) {

      console.log(context);
      console.log(settings);
      // console.log(Drupal.behaviors.Common);

      Drupal.behaviors.Common.FastApiUrl = settings.geoviz.fastapi_url

      Drupal.behaviors.Common.Selectors = {}
      Drupal.behaviors.Common.Selectors.WPP = Drupal.behaviors.Common.Selectors.WPP || 0
      Drupal.behaviors.Common.Selectors.SCEN = Drupal.behaviors.Common.Selectors.SCEN || 0

      /**
      //  Get portfolios/WPP list to fill the select box and set selected
      */
      Drupal.behaviors.Common.getPortfolios = function (){
        $.ajax({
            type: 'GET',
            // url: 'http://localhost:8008/portfolios',
            url: Drupal.behaviors.Common.FastApiUrl+'/portfolios',
            success: parseJson,
            // complete: setGCjsonObject,
        });

        // Success function callback for the ajax call
        function parseJson (data, textStatus, jqXHR) {
          // console.log(data);
          // console.log(JSON.parse(data));
          var portfolios = JSON.parse(data);
          var out = '';
          $.each(portfolios.id, function( index, value ) {
            console.log(portfolios.label[index]);
            console.log(Drupal.behaviors.Common.Selectors.WPP);
            // TODO use id[index] to set selected
            // if (portfolios.id[index] == Drupal.behaviors.Common.Selectors.WPP) {
            if (portfolios.label[index] == Drupal.behaviors.Common.Selectors.WPP) {
              out += '<option selected value="'+portfolios.id[index]+'">'+portfolios.label[index]+'</option>'
            } else {
              out += '<option value="'+portfolios.id[index]+'">'+portfolios.label[index]+'</option>'
            }
          });
          $('#wpp').append(out);

          // Fill cards if we are on outline page
          if(settings.path.currentPath == 'dap_out_infograph') {

            /**
            // fill the explanation Cards
            **/
            $.each(portfolios.descr_plan[Drupal.behaviors.Common.Selectors.WPP].cards, function( index, card ){

              var cards = '';
              var graph = '';
              var map = '';

              cards += '<div class="col d-flex align-items-stretch">'+
                       '<div class="card mb-3 shadow" style="min-width: -webkit-fill-available;">'+
                         '<div class="card-body px-4">'+
                         '<div class="d-flex justify-content-start align-items-center mb-2">'+
                                   '<div class="me-2">'+
                                   '<span class="fa-stack fa-2x">'+
                                     '<i class="fa-solid fa-circle fa-stack-2x"></i>'+
                                     '<i class="'+ card.icon +' fa-stack-1x fa-inverse"></i>'+
                                   '</span>'+
                                   '</div>'+
                                   '<div>'+
                                   '<h5 class="card-title">'+ card.title +'</h5>'+
                                   '</div>'+
                           '</div>'+
                                 '<div class="card-text">'+
                                    card.body +
                                 '</div>'+
                                 '<div class="card-text">'+
                                    '<a href="#rowcard_'+index+'" class="stretched-link">More</a>' +
                                 '</div>'+
                         '</div>'+
                       '</div>'+
                     '</div>';

                if ( card.hasOwnProperty('chart_api') && card.hasOwnProperty('item_type') ) {
                  graph += '<div id="rowcard_'+index+'" class="row mt-3" style="scroll-margin-top: 100px;">'+
                              '<p ></p>'+
                              '<div class="col">'+
                                '<div class="card">'+
                                  '<div class="card-header">'+
                                  '</div>'+
                                  '<div class="card-body">'+
                                    '<div id="outl_g'+index+'" data-plot_id="'+card.item_type+'" data-plot_type="'+card.chart_api+'" data-scen="opt" data-exp="nonserve" data-loc="opt" class="dap_plot"></div>'+
                                  '</div>'+
                                '</div>'+
                              '</div>'+
                            '</div>';
                } else if (card.hasOwnProperty('map')){
                  // Insert map instead of graph

                  // Chiamiamo una funzione che passa il nome del progetto qgis
                  //

                  // Drupal.behaviors.OLCommon.SetUp('outl_m'+index, card.map)

                  map += '<div id="rowcard_'+index+'" class="row mt-3" style="scroll-margin-top: 100px;">'+
                              '<div class="col">'+
                                '<div class="card">'+
                                  '<div class="card-header">'+
                                  card.title +
                                  '</div>'+
                                  '<div class="card-body">'+
                                    '<div id="outl_m'+index+'" data-qgis_map="'+card.map+'" data-scen="opt" data-exp="nonserve" data-loc="opt" class="dap_map" style="height:400px;"></div>'+
                                  '</div>'+
                                '</div>'+
                              '</div>'+
                            '</div>';


                }

                // Fill cards with explanations
                $('#expl_cards').append(cards);
                // fill map
                $('#outline_charts').append(map);
                // fill charts
                $('#outline_charts').append(graph);

            });
            Drupal.behaviors.OutlineInfograph.FillChMa(data, textStatus, jqXHR);
          }
        }
      }


      // Get the list of scenarios and tranform it to "&scenF=s&scenF=f" for append to url
      Drupal.behaviors.Common.getScenarios = function () {
        $.ajax({
          type: 'GET',
          url: Drupal.behaviors.Common.FastApiUrl+'/scenarios',
          success: function(data, textStatus, jqXHR){
            console.log(JSON.parse(data));
            var scenarios = JSON.parse(data)
            var out = '';
            $.each(scenarios.id, function( index, value ) {
              if (scenarios.label[index] == Drupal.behaviors.Common.Selectors.SCEN) {
                out += '<option selected value="'+scenarios.id[index]+'">'+scenarios.label[index]+'</option>'
              } else {
                out += '<option value="'+scenarios.id[index]+'">'+scenarios.label[index]+'</option>'
              }
            });
            $('#scen').append(out);
          }
         });
      }

////// MAIN
      $('#scen').once().each(function() {
        // get selected wpp from url params && set in behaviors
        var urlParams = new URLSearchParams(window.location.search);
        console.log(urlParams.get('scen'));
        if (urlParams.get('scen') !== null) {
          Drupal.behaviors.Common.Selectors.SCEN = urlParams.get('scen');
        }
        // get list of scenarios
        Drupal.behaviors.Common.getScenarios();

        $( "#scen" ).change(function() {
          if(settings.path.currentPath == 'geoviz_test_dashboard') {
            Drupal.behaviors.Common.Selectors.SCEN = this.value
            // Reset Drupal.behaviors.OlMap.ApplyFilter to False
            Drupal.behaviors.OlMap.ApplyFilter = false;
            // Call the function to filter the layers
            Drupal.behaviors.OlMap.filterLayers(Drupal.behaviors.OlMap.Map);
          }
        })

      });

      $('#wpp').once().each(function() {
        // get selected wpp from url params && set in behaviors
        var urlParams = new URLSearchParams(window.location.search);
        console.log(urlParams.get('wpp'));
        if (urlParams.get('wpp') !== null) {
          Drupal.behaviors.Common.Selectors.WPP = urlParams.get('wpp');
        }
        // get and set Portfolios list in the WPP selectbox
        Drupal.behaviors.Common.getPortfolios()

        $( "#wpp" ).change(function() {
          if(settings.path.currentPath == 'geoviz_test_dashboard') {
            Drupal.behaviors.Common.Selectors.WPP = this.value
            // Reset Drupal.behaviors.OlMap.ApplyFilter to False
            Drupal.behaviors.OlMap.ApplyFilter = false;
            // Call the function to filter the layers
            Drupal.behaviors.OlMap.filterLayers(Drupal.behaviors.OlMap.Map);
          } else if (settings.path.currentPath == 'dap_out_infograph') {
            // Fill graph and charts
          }
        })

      });


    }
  };

})(jQuery);
