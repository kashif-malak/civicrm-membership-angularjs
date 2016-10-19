<?php

/**
 * RelativeDateConverter.Convertrelativedates API specification (optional)
 * This is used for documentation and validation.
 *
 * @param array $spec description of fields supported by this API call
 * @return void
 * @see http://wiki.civicrm.org/confluence/display/CRMDOC/API+Architecture+Standards
 */
function _civicrm_api3_relative_date_converter_Convertrelativedates_spec(&$spec) {
  $spec['magicword']['api.required'] = 1;
}

/**
 * RelativeDateConverter.Convertrelativedates API
 *
 * @param array $params
 * @return array API result descriptor
 * @see civicrm_api3_create_success
 * @see civicrm_api3_create_error
 * @throws API_Exception
 */
function civicrm_api3_relative_date_converter_Convertrelativedates($params)
 {
  //convert date from relative to abs.
  $from = relativeToAbs($params['from']);
  $to = relativeToAbs($params['to']);

  //Get data from DB and return to the caller.
   $result = civicrm_api3('Membership', 'get', array(
  'sequential' => 1,
  'return' => array("contact_id.display_name", "membership_type_id.description", "contact_id", "end_date", "start_date"),
  'start_date' => array('BETWEEN' => array($from[0], $from[1])),
  'end_date' => array('BETWEEN' => array($to[0], $to[1])),
 
  ));
 return $result;
  }
 function relativeToAbs($relative) 
    {
        if ($relative) {
            $split = CRM_Utils_System::explode('.', $relative, 3);
            $dateRange = CRM_Utils_Date::relativeToAbsolute($split[0],  $split[1]);
            $from = substr($dateRange['from'], 0, 8);
            $to = substr($dateRange['to'], 0, 8);
            return array($from, $to);
        }
        return null;
    }



