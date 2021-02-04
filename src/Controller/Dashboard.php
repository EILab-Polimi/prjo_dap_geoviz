<?php

// When a New order has been completed then write a record in the wis_order_temp table
// If this is called with a

namespace Drupal\geoviz\Controller;

use Drupal\Core\Controller\ControllerBase;
// use Symfony\Component\HttpFoundation\Response;

/**
 * An example controller.
 */
class Dashboard extends ControllerBase {

  /**
   * Returns a render-able array for a test page.
   */
  public function dashboard() {

    dpm('TEST')  ;

    $node = node_load(24);
    // kint($node->bundle());
    \Drupal::logger('geoviz')->notice('@type: inserted %title.',
          array(
              '@type' => $node->bundle(),
              '%title' => $node->getTitle(),
          ));


    $build = [
      '#theme' => 'message_water_request',
      '#attached' => [
        'library' => [
          'geoviz/openlayers',
          // 'openalyers/openlayers',
          'geoviz/ol-layerswitcher',
          'geoviz/ol-geocoder',
          'geoviz/dashboard'
        ]
      ],
    ];
    return $build;

  }

}
