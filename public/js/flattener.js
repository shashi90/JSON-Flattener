var imageApp = angular.module('flattenerApp', ['ngSanitize', 'me-lazyload']).controller('flattenerAppCtl', function($scope, $http, $timeout) {

	$scope.uploadJSON = function() {
        jQuery('.upload-json-file').click();
    }

    $scope.inputJSON;
    $scope.jsonFiles = [];

    $scope.JSONUpload = function(event) {
    	jQuery(".spinner, #ajax-popup-bg").show();
        JSON_UPLOADER.upload(event, function(json, jsonFiles) {
        	$scope.resultJSON = JSON.stringify(json, null, 4);
            console.log(jsonFiles)
            $scope.jsonFiles = jsonFiles;
            $scope.inputJSON = "";
        	$scope.$apply();
        	jQuery(".spinner, #ajax-popup-bg").hide();
        });
    }

    $scope.validateJSON = function() {
        if(!$scope.inputJSON) {
            jQuery('#inputJSON-alert').html("Please Enter JSON data");
            jQuery('#inputJSON-alert').fadeIn();
            $timeout(function(){
                jQuery('#inputJSON-alert').fadeOut();
            }, 2000)
            return false;
        }

        try {
            JSON.parse($scope.inputJSON);
        } catch (e) {
            jQuery('#inputJSON-alert').html("Please Enter Valid JSON data");
            jQuery('#inputJSON-alert').fadeIn();
            $timeout(function(){
                jQuery('#inputJSON-alert').fadeOut();
            }, 2000)
            return false;
        }

        return true;
    }

    $scope.flattenJSON = function() {
        if(!$scope.validateJSON())
            return;

        $scope.resultJSON = undefined;
        jQuery(".spinner, #ajax-popup-bg").show();
        $http({
            method: "POST",
            url: "/flatten",
            data: JSON.parse($scope.inputJSON),
        }).then(function(res) {
            if(res && res.data && res.data.status == 1) {
                $scope.resultJSON = JSON.stringify(res.data.jsonObj, null, 4);
                $scope.jsonFiles = [];
                jQuery(".spinner, #ajax-popup-bg").hide();
            }
        }, function(err) {
            console.log(err);
        })
    }

    $scope.resultJSONStyle = function() {
        if($scope.jsonFiles.length > 0) {
            return {"height": "calc(100vh - 260px)"}
        } else {
            return {"height": "calc(100vh - 130px)"}
        }
    }
});