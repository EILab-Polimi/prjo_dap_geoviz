<?php

// When a New order has been completed then write a record in the wis_order_temp table
// If this is called with a

namespace Drupal\geoviz\Controller;

use Drupal\Core\Controller\ControllerBase;
// use \Drupal\Core\Entity\EntityDefinitionUpdateManager;
// use Symfony\Component\HttpFoundation\Response;

/**
 * An example controller.
 */
class Dashboard extends ControllerBase {

  /**
   * Returns a render-able array for a test page.
   */
  public function graph() {

    $build = [
      // '#theme' => 'message_water_request',
      '#theme' => 'wp4_graph',
      '#attached' => [
        'library' => [
          'geoviz/plotlyjs',
          'geoviz/graph'
        ]
      ],
    ];
    return $build;

  }

  /**
   * Returns a render-able array for a test page.
   */
  public function dashboard() {

    $config = \Drupal::config('geoviz.settings');

    if ($config->get('qgis_server_sel') == 0){
      $QgisUrl = $config->get('qgis_server_dev_url');
    } else {
      $QgisUrl = $config->get('qgis_server_prod_url');
    }

    $QgisMap = $config->get('qgis_server_map');

    $build = [
      // '#theme' => 'message_water_request',
      '#theme' => 'wp4_map',
      '#attached' => [
        'library' => [
          'geoviz/openlayers',
          // 'openlayers/openlayers',
          // 'openlayers/openlayers-drupal',
          // TODO wms-capabilites https://www.npmjs.com/package/wms-capabilities
          // is not necessary - Openlayers implements the same
          // 'geoviz/wms-capabilities',
          // 'geoviz/geoviz.customcontrol',
          // 'geoviz/geoviz.customcontrol.LayerSwitcher',
          // 'openalyers/openlayers',
          'geoviz/ol-layerswitcher',
          'geoviz/ol-geocoder',
          'geoviz/dashboard'
        ],
        'drupalSettings' => [
          'geoviz' => [
              'qgis_url' => $QgisUrl,
              'qgis_map' => $QgisMap,
          ]
        ]

      ],
    ];
    return $build;

  }

}
