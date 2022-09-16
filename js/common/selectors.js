/**
 * @file
 * JavaScript for graph insertion.
 */

(function ($) {


  Drupal.behaviors.Common = {
    attach: function (context, settings) {

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
            if (portfolios.label[index] == Drupal.behaviors.Common.Selectors.WPP) {
              out += '<option selected value="'+portfolios.id[index]+'">'+portfolios.label[index]+'</option>'
            } else {
              out += '<option value="'+portfolios.id[index]+'">'+portfolios.label[index]+'</option>'
            }
          });
          $('#wpp').append(out);
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
          Drupal.behaviors.Common.Selectors.SCEN = this.value
          // Reset Drupal.behaviors.OlMap.ApplyFilter to False
          Drupal.behaviors.OlMap.ApplyFilter = false;
          // Call the function to filter the layers
          Drupal.behaviors.OlMap.filterLayers(Drupal.behaviors.OlMap.Map);
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
          Drupal.behaviors.Common.Selectors.WPP = this.value
          // Reset Drupal.behaviors.OlMap.ApplyFilter to False
          Drupal.behaviors.OlMap.ApplyFilter = false;
          // Call the function to filter the layers
          Drupal.behaviors.OlMap.filterLayers(Drupal.behaviors.OlMap.Map);
        })

      });


    }
  };

})(jQuery);
