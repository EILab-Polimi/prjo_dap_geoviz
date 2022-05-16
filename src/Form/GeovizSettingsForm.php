<?php
/**
 * @file
 * Configuration form for dab functionalities
 */
namespace Drupal\geoviz\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Configure dab settings for this site.
 */
class GeovizSettingsForm extends ConfigFormBase {

  /**
   * Config settings.
   *
   * @var string
   */
  const SETTINGS = 'geoviz.settings';

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'geoviz_admin_settings';
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      static::SETTINGS,
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config(static::SETTINGS);

    // We can use mosquitto name like an ip since it is resolved like the ip
    // taken from mosquitto service in the running stack
    $form['qgis_server_dev_url'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Qgis server development url'),
      '#default_value' => (empty($config->get('qgis_server_dev_url'))) ? 'http://localhost:9003' : $config->get('qgis_server_dev_url'),
    ];
    $form['qgis_server_prod_url'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Qgis server production url / docker'),
      '#default_value' => (empty($config->get('qgis_server_prod_url'))) ? 'http://localhost:9003' : $config->get('qgis_server_prod_url'),
    ];
    $form['qgis_server_sel'] = array(
      '#type' => 'radios',
      '#title' => $this->t('Select Environment'),
      '#default_value' => (empty($config->get('qgis_server_sel'))) ? 0 : $config->get('qgis_server_sel'),
      '#options' => array(
        0 => $this->t('Development'),
        1 => $this->t('Production'),
      ),
    );
    $form['qgis_server_map'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Qgis map'),
      '#default_value' => (empty($config->get('qgis_server_map'))) ? '/project/waterPortfolio_v3.qgs' : $config->get('qgis_server_map'),
    ];

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    // Retrieve the configuration.
    $this->configFactory->getEditable(static::SETTINGS)
      // Set the submitted configuration setting.
      ->set('qgis_server_dev_url', $form_state->getValue('qgis_server_dev_url'))
      ->set('qgis_server_prod_url', $form_state->getValue('qgis_server_prod_url'))
      ->set('qgis_server_sel', $form_state->getValue('qgis_server_sel'))
      ->set('qgis_server_map', $form_state->getValue('qgis_server_map'))
      ->save();

    parent::submitForm($form, $form_state);
  }

}
