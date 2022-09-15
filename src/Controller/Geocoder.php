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
    \Drupal::messenger()->addMessage(print_r($search,TRUE));
    // Get the parameters exploded by space
    $list = explode(' ', $search);

    return new JsonResponse([ 'data' => 'test', 'method' => 'GET', 'status'=> 200]);
  }

  /**
   * Returns a render-able array for a test page.
   */
  public function nominatim_extended() {

    return new JsonResponse([ 'data' => 'test', 'method' => 'GET', 'status'=> 200]);
  }

}
