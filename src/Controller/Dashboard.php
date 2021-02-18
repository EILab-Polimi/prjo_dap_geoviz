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
  public function dashboard() {

    // \Drupal::service('entity_field.manager')->getFieldDefinitions(ENTITY_TYPE_ID, BUNDLE_ID);
    $info = \Drupal::service('entity_field.manager')->getFieldDefinitions('openlayers_control', 'openlayers_control');

    // dpm($info);
    if(!array_key_exists('options', $info)) { // NON esiste la key se la rimuoviamo dalla entity Openlayers_Control.php
      // dpm($info);
    }

    // https://techblog.stefan-korn.de/content/remove-base-field-custom-content-entity-drupal-8
    // Questo servizio (getFieldStorageDefinition) ricava se il campo è definito a livello di entity
    // E' possibile che il campo sia definito ma non presente nel db
    // Per poterlo rimuovere (uninstallFieldStorageDefinition) è necessario che il campo esista a database
    $update_manager = \Drupal::service('entity.definition_update_manager');
    // $definition = $update_manager->getFieldStorageDefinition('machine_name', 'openlayers_control');
    $definition = $update_manager->getFieldStorageDefinition('options_test', 'openlayers_control');
    // $update_manager->uninstallFieldStorageDefinition($definition);

    dpm($definition);

    // $entity_type = 'openlayers_control';
    // // Using the storage controller (recommended).
    // $entity = \Drupal::entityTypeManager()->getStorage($entity_type)->load(14);
    //
    // // dpm($entity);
    // dpm($entity->getFields());
    // dpm($entity->get('options')->getValue());

    $node = node_load(24);
    // kint($node->bundle());
    // \Drupal::logger('geoviz')->notice('@type: inserted %title.',
    //       array(
    //           '@type' => $node->bundle(),
    //           '%title' => $node->getTitle(),
    //       ));


    $build = [
      '#theme' => 'message_water_request',
      '#attached' => [
        'library' => [
          'geoviz/openlayers',
          // 'openlayers/openlayers',
          // 'openlayers/openlayers-drupal',
          // TODO wms-capabilites is not necessary - Openlayers implements the same
          // 'geoviz/wms-capabilities',
          // 'geoviz/geoviz.customcontrol',
          // 'geoviz/geoviz.customcontrol.LayerSwitcher',
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
