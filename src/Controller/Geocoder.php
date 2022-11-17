<?php

// When a New order has been completed then write a record in the wis_order_temp table
// If this is called with a

namespace Drupal\geoviz\Controller;

use Drupal\Core\Controller\ControllerBase;
// use \Drupal\Core\Entity\EntityDefinitionUpdateManager;
// use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
/**
 * An example controller.
 */
class Geocoder extends ControllerBase {

  /**
   * Returns a render-able array for a test page.
   */
  public function nominatim() {
    $search = $_GET["search"];

    // drupal_set_message(print_r($search,TRUE));
    // \Drupal::messenger()->addMessage(print_r($search,TRUE));
    \Drupal::logger('geoviz')->notice($search);
    // Get the parameters exploded by space
    $list = explode(' ', $search);

    
//     {
//     "place_id": 123031010,
//     "licence": "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright",
//     "osm_type": "way",
//     "osm_id": 78114896,
//     "boundingbox": [
//         "-34.8734847",
//         "-34.8725574",
//         "-56.0863356",
//         "-56.0855426"
//     ],
//     "lat": "-34.8729688",
//     "lon": "-56.0858838",
//     "display_name": "Potenza, Carrasco Norte, Montevidéu, Montevideo, 11403, Uruguai",
//     "class": "highway",
//     "type": "residential",
//     "importance": 0.19999999999999998,
//     "address": {
//         "road": "Potenza",
//         "neighbourhood": "Carrasco Norte",
//         "suburb": "Carrasco Norte",
//         "city": "Montevidéu",
//         "state": "Montevideo",
//         "ISO3166-2-lvl4": "UY-MO",
//         "postcode": "11403",
//         "country": "Uruguai",
//         "country_code": "uy"
//     },
//     "geojson": {
//         "type": "LineString",
//         "coordinates": [
//             [
//                 -56.0855464,
//                 -34.8734847
//             ],
//             [
//                 -56.0855426,
//                 -34.8734577
//             ],
//             [
//                 -56.0855459,
//                 -34.8734081
//             ],
//             [
//                 -56.0855726,
//                 -34.8733452
//             ],
//             [
//                 -56.0856646,
//                 -34.8731881
//             ],
//             [
//                 -56.0857131,
//                 -34.8731253
//             ],
//             [
//                 -56.0858838,
//                 -34.8729688
//             ],
//             [
//                 -56.0862096,
//                 -34.8726962
//             ],
//             [
//                 -56.0862751,
//                 -34.8726471
//             ],
//             [
//                 -56.0863008,
//                 -34.8726112
//             ],
//             [
//                 -56.0863356,
//                 -34.8725574
//             ]
//         ]
//     }
// }

    return new JsonResponse([ 'data' => 'test', 'method' => 'GET', 'status'=> 200]);
  }

  /**
   * Returns a render-able array for a test page.
   */
  public function nominatim_extended() {

    return new JsonResponse([ 'data' => 'test', 'method' => 'GET', 'status'=> 200]);
  }

}
