angular.module('starter.service', []).service('appService', function($ionicLoading, $ionicPopup) {
    // Use the below URL for Production Server
    this.url = "http://35.165.106.122:3000/api/"
    // Use the below URL for local Testing
    //this.url = "http://192.168.0.105:3000/api/"
    return {
        url: this.url,
        showLoading: function() {
            $ionicLoading.show().then(function() {});
        },
        hideLoading: function() {
            $ionicLoading.hide().then(function() {});
        },
        showAlert: function(template,scope){
            console.log(template)
            $ionicPopup.alert({
                cssClass:'errorAlert',
                templateUrl: template,
                scope:scope,
                okText:"Dismiss",
                okType:"button-assertive"
            }).then(function(res) {
                
            });
        }
    }
});