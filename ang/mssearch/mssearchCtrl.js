(function(angular, $, _) {

  angular.module('mssearch').config(function($routeProvider) {
      $routeProvider.when('/mssearch', {
        controller: 'MssearchmssearchCtrl',
        templateUrl: '~/mssearch/mssearch.html',

        // If you need to look up data when opening the page, list it out
        // under "resolve".
        resolve: {
          
        }
      });
    }
  );

  // The controller uses *injection*. This default injects a few things:
  //   $scope -- This is the set of variables shared between JS and HTML.
  //   crmApi, crmStatus, crmUiHelp -- These are services provided by civicrm-core.
  //   myContact -- The current contact, defined above in config().
  angular.module('mssearch').controller('MssearchmssearchCtrl', function($scope, crmApi, crmUiAlert,crmStatus, crmUiHelp) {
    // The ts() and hs() functions help load strings for this module.
    var ts = $scope.ts = CRM.ts('mssearch');
    var hs = $scope.hs = crmUiHelp({file: 'CRM/mssearch/mssearchCtrl'}); // See: templates/CRM/mssearch/mssearchCtrl.hlp

	$scope.retMemberships = []; 
  $scope.relDateObject={}; 
  $scope.selectedFromDate =null;
  $scope.selectedToDate =null;
        
        //Custom API (please see RelativeDate.php inside API folder for implementation) 
        //API call to retrieve relative dates.
        crmApi('RelativeDate', 'getrelativedates', {
         magicword : 'magic'
        }).then(function(data){
        $scope.relDateObject= data;
		});
    
    $scope.search = function() {

      if($scope.selectedFromDate === null ||$scope.selectedToDate===null){
         crmUiAlert({text: 'Please select both start and end dates', title: '', type: 'error'});
         return;
      }
    
    //Custom API (please see RelativeDateConverter.php in API folder)- 
    //Converts relative dates to absolute dates and returns the search results.
   crmApi('RelativeDateConverter', 'convertrelativedates', {
         magicword : 'magic',
         from: $scope.selectedFromDate,
         to : $scope.selectedToDate,
        }).then(function(members){
          console.log('before',members);
          // UI is not able to transverse the nested properties.
          // shortens nested property names
          renameProperty(members.values);
          if(members.values.length ==0){
             crmUiAlert({text: 'No data found with selected cirteria', title: 'No Data found.', type: 'error'});
          }
          $scope.retMemberships = members.values;
        });
    };
    $scope.dateChange = function(startDate,endDate){
      $scope.selectedFromDate= startDate;
      $scope.selectedToDate= endDate;
    };

      //Shotens nested property name.
      // Is there any way to  alias the column names when calling PHP or javacript APIs?
     function renameProperty (arrayObj) {
    for (var i = 0; i < arrayObj.length; i++) {
        arrayObj[i]['description'] = arrayObj[i]['membership_type_id.description'];
        arrayObj[i]['name'] = arrayObj[i]['contact_id.display_name'];
        delete arrayObj[i]['membership_type_id.description'];
        delete arrayObj[i]['contact_id.display_name'];
    }
   
    }
});
})(angular, CRM.$, CRM._);
