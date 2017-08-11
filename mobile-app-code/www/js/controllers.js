  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  angular.module('starter.controllers', [])
      //---------------------------------Home Controller---------------------------------//
      .controller('HomeCtrl', function($scope, $timeout, $state, $rootScope, $ionicLoading, $http, appService) {
          //console.log("Home")
          $rootScope.pending = [];
          appService.showLoading();
          $rootScope.todayrechargeList = localStorage.getItem('todayrechargeList');
          $http.get(appService.url+'getOperatorAndCircleDetail/',{timeout: 5000}).success(function(response){
              //console.log(response)
              $rootScope.operators = response.codes['operatorCode'];
              $rootScope.circles = response.codes['circleCode'];
              $rootScope.rechargeType = response.codes['typeCode'];
              if (localStorage.getItem('isLoggedIn') == 'true') {
              appService.hideLoading();
              $rootScope.loggedIn = true
              $state.go('dashboard');
          } else {
              appService.hideLoading();
              $rootScope.loggedIn = false
              $state.go('login');
          }

          }).error(function(response){
                $state.go('noNetwork')
                appService.hideLoading();
                //console.log(response);
          })
          
      })
      //------------------------------------Login Controller----------------------------------//
      .controller('LoginCtrl', function($scope, $rootScope, $http, $ionicSideMenuDelegate, $ionicLoading, appService, $state) {
          //console.log("LoginCtrl");
      })
      //------------------------------------Dashboard Controller------------------------------//
      .controller('DashboardCtrl', function($state, $window, $scope, $http, $stateParams, $ionicLoading, $ionicModal, $http, $rootScope, $ionicLoading, $filter, appService, $ionicPopup, circleService) {
          $scope.loginData = {};
          if (localStorage.getItem('isLoggedIn') == 'true') {}
            else{
                //console.log("asdfsf")
                $rootScope.isLoggedIn = false;
            }
          $scope.getCodeInfo = function($event){
            num = document.getElementsByName("phoneNo")[0].value;
            if(num.length === 4){
              circleService.findCode(num);
              if(circleService.findCode(num).operator != ""){
                $scope.rechargeForm.operator = circleService.findCode(num).operator+"";
              }
              if(circleService.findCode(num).circle){
                $scope.rechargeForm.circle = circleService.findCode(num).circle+"";
              }
            }
          }
          $scope.doLogin = function() {
              appService.showLoading()
              $http.post(appService.url + 'authenticate/', $scope.loginData).success(function(response) {
                  if (response.success == true) {
                      //console.log(response)
                      //console.log("Success")
                      $rootScope.loggedIn = true;
                      localStorage.setItem("user_role",response.user_role);
                      $rootScope.userRole = localStorage.getItem('user_role');
                      localStorage.setItem("margin",response.user_margin);
                      $rootScope.margin = localStorage.getItem('margin');
                      $rootScope.user_balance = response.user_balance;
                      localStorage.setItem('isLoggedIn', true)
                      localStorage.setItem('access_token', response.token)
                      localStorage.setItem('userId', response.user_id)
                      $state.go('dashboard')
                        /*if(response.user_total_amount >= 0 && response.user_total_amount < 100000){
                            localStorage.setItem("margin",2.2)
                        }else if(response.user_total_amount >= 100000 && response.user_total_amount < 200000){
                            localStorage.setItem("margin",2.5)
                        }else if(response.user_total_amount >= 200000){
                            localStorage.setItem("margin",2.75)
                        }*/
                      //console.log(response.token)
                  } else {
                    $scope.loginErrorCode = response.errorCode;
                    appService.showAlert('templates/error_login.html',$scope)
                  }
                  //console.log(response)
                  appService.hideLoading()
              }).error(function(response) {
                  appService.showAlert('templates/error_alert_noserver.html', $scope);
                  appService.hideLoading();
              })
          }
          $scope.rechargeForm = {};
          $scope.noResponseRecharge = [];
          $scope.rechargeResponseList = [];
          //console.log(appService.url)
          $scope.retryNetwork = function(){
            $state.go('app');
          }
          $scope.getBalance = function(){
            var config = {
                        timeout: 7000,
                        headers: {
                            'x-access-token': localStorage.getItem('access_token')
                        }
                    }
                $http.get(appService.url+'getBalance/'+ localStorage.getItem('userId'),config).success(function(response){
                  $rootScope.user_balance = response.user_balance;
                  localStorage.setItem('margin',response.user_margin);
                  $rootScope.margin = localStorage.getItem('margin');
                  localStorage.setItem("user_role",response.user_role);
                  $rootScope.userRole = localStorage.getItem('user_role');
                  /*if(response.user_total_amount >= 0 && response.user_total_amount < 100000){
                    localStorage.setItem("margin",2.2)
                  }else if(response.user_total_amount >= 100000 && response.user_total_amount < 200000){
                    localStorage.setItem("margin",2.5)
                  }else if(response.user_total_amount >= 200000){
                    localStorage.setItem("margin",2.75)
                  }*/
                  //console.log(response)
                  appService.hideLoading();
                }).error(function(response){
                  //console.log(response)
                  appService.hideLoading();
                });
          }

          var showResponse = function(className,data,resMsg) {
              var elem = angular.element(document.querySelector("#responseMsg"));
              $scope.responseData = data;
              $scope.responseData.msg = resMsg;
              elem.removeClass('responseMsg')
              elem.addClass(className)
              setTimeout(function() {
                  elem.addClass('responseMsg')
                  elem.removeClass(className)
              }, 3000);
          }
          var confirmAndProceed = function() {

            $scope.rechargeFormType = $filter('filter')($rootScope.rechargeType, {code: $scope.rechargeForm.type}, true)[0].name
            $scope.rechargeFormOperator = $filter('filter')($rootScope.operators, {code: $scope.rechargeForm.operator}, true)[0].name
            $scope.rechargeFormCircle = $filter('filter')($rootScope.circles, {code: $scope.rechargeForm.circle}, true)[0].name
            var confirmPopup = $ionicPopup.confirm({
            scope: $scope,
            cssClass: 'confirmBox',
            templateUrl: 'templates/confirm_recharge.html',
            okText: 'Recharge',
            okType: 'button-balanced',
            cancelText: 'Cancel',
            cancelType: 'button-assertive'
            });
            confirmPopup.then(function(res) {
              if (res) {
              $rootScope.pending.push($scope.rechargeForm);
              //console.log("pending",$rootScope.pending);
                    $rootScope.user_balance = Number($rootScope.user_balance) - Number($scope.rechargeForm.amount) + ((Number($scope.rechargeForm.amount)*localStorage.getItem('margin'))/100)               
                  var config = {
                      headers: {
                          'x-access-token': localStorage.getItem('access_token')
                      }
                  }
                  $scope.userId = localStorage.getItem('userId')
                  $scope.userNumId = localStorage.getItem('userNumId')
                  rechargeData = $scope.rechargeForm
                  $http.post(appService.url + 'recharge/', {
                      rechargeData: rechargeData,
                      userId: localStorage.getItem('userId'),
                      userNumId: localStorage.getItem('userNumId')
                  }, config).success(function(response, status) {
                        if(response.success){
                            //console.log("asdffsa")
                            if(response.data.apiData.status == "3" || response.data.apiData.status == "5"){
                                //console.log("af")
                                showResponse('errorResponse',response.data.requestBody,"Failed.");
                                //console.log($rootScope.user_balance)
                                $rootScope.user_balance = Number($rootScope.user_balance) + Number(response.data.requestBody.rechargeData['amount']) - ((Number(response.data.requestBody.rechargeData['amount'])*localStorage.getItem('margin'))/100)
                                //console.log($rootScope.user_balance)
                            }
                            if(response.data.apiData.status == "1"){
                                showResponse('successResponse',response.data.requestBody," Successfull.");
                            }else if(response.data.apiData.status == "2"){
                                //console.log("Pend")
                                showResponse('pendingResponse',response.data.requestBody," Pending.");
                            }
                        }
                        else{
                            if(response.isDisputed){
                                $scope.errorRechargeData = response.data.requestBody.rechargeData;
                                appService.showAlert('templates/disputed_error.html',$scope);
                            }else{
                                if(response.doRefund){
                                    //console.log(response)
                                    $scope.errorRechargeData = response.data.requestBody.rechargeData;
                                    $rootScope.user_balance = Number($rootScope.user_balance) + Number(response.data.requestBody.rechargeData['amount']) - ((Number(response.data.requestBody.rechargeData['amount'])*localStorage.getItem('margin'))/100)
                                    appService.showAlert('templates/dorefund_error.html',$scope);
                                }
                            }

                        }
                        var tempRechargeData = response.data.requestBody.rechargeData;
                        for(let i=0;i<$rootScope.pending.length;i++){
                            if($rootScope.pending[i].phoneNumber == tempRechargeData.phoneNumber && $rootScope.pending[i].phoneNumber == tempRechargeData.phoneNumber && $rootScope.pending[i].phoneNumber == tempRechargeData.phoneNumber){
                                $rootScope.pending.splice(i,1);
                                break;
                            }
                        }
                        $scope.tempRechargeList.push($scope.rechargeForm)
                        localStorage.setItem('todayrechargeList', JSON.stringify($scope.tempRechargeList))
                        $scope.rechargeForm.phoneNumber = "";
                        $scope.rechargeForm.amount = "";
                        $scope.rechargeForm.operator = "1";
                        $scope.rechargeForm.circle = "1";
                        $scope.rechargeForm.type = "prepaid/mobile";
                        //console.log("pending",$rootScope.pending);
                        //console.log(response);
                  }).error(function(response, status, statusText, headers, config) {
                        $scope.rechargeForm.phoneNumber = "";
                        $scope.rechargeForm.amount = "";
                        $scope.rechargeForm.operator = "1";
                        $scope.rechargeForm.circle = "1";
                        $scope.rechargeForm.type = "prepaid/mobile";
                      appService.showAlert('templates/error_alert_noserver.html', $scope);
                      appService.hideLoading();
                      //console.log("Error", headers)
                      //console.log(headers.data.rechargeData)
                      ////console.log(response.status)
                  })
              } else {
                
              }
            });
          }
          //function for checking the 10 min rule before making a recharge request
          $scope.check10MinRule = function() {
            if($rootScope.user_balance >= $scope.rechargeForm.amount){
              $scope.tempRechargeList = []
              //console.log("Check 4 min rule",$scope.rechargeForm);
              $scope.rechargeForm.recharge_date = new Date();
              $scope.tenMinute = true;
              if (localStorage.getItem('todayrechargeList') != null) {
                  $scope.rechargeList = JSON.parse(localStorage.getItem('todayrechargeList'));
                  angular.forEach($scope.rechargeList, function(value, key) {
                      var now_date = new Date().getTime();
                      var dd = new Date(value.recharge_date)
                      dd = dd.getTime();
                      if( (now_date - dd) / 60000 < 5){
                        $scope.tempRechargeList.push(value);
                        if(value.phoneNumber == $scope.rechargeForm.phoneNumber && value.amount == $scope.rechargeForm.amount){
                          $scope.tenMinute = false;
                        }
                      }
                  });
              } else {
                  localStorage.setItem('todayrechargeList',"[]");
              }
              //console.log("kuch to hai",$scope.tempRechargeList);
              if (!$scope.tenMinute) {
                  appService.showAlert("templates/error_alert_10min.html", $scope);
                  //console.log("Ruk ja bhai")
              } else {
                  //console.log("Jaane do aage bhai")
                  confirmAndProceed();
              }
              //console.log($scope.tenMinute)
            }
            else{
              appService.showAlert("templates/error_balance.html",$scope);
            }
          }
          //function for getting the recharge History
          $scope.getRechargeHistory = function() {
              appService.showLoading();
              var config = {
                  timeout: 7000,
                  headers: {
                      'x-access-token': localStorage.getItem('access_token')
                  }
              }
              $http.get(appService.url + 'history/' + localStorage.getItem('userId'), config).success(function(response, status) {
                  appService.hideLoading();
                  $scope.earning = 0;
                  if (response.success) {
                    ////console.log(response.data)
                      $scope.rechargeHistory = response.data;
                      angular.forEach($scope.rechargeHistory,function(value,index){
                        $scope.earning = $scope.earning + Number(value.recharge_amount);
                      });
                  } else {
                      //console.log("Hello World")
                  }
              }).error(function(response) {
                  appService.showAlert('templates/error_alert_noserver.html', $scope);
                  appService.hideLoading();
                  //console.log(response)
              })
          }
          $scope.getTodayRecharge = function() {
              appService.showLoading();
              var config = {
                  headers: {
                      'x-access-token': localStorage.getItem('access_token')
                  }
              }
              $http.get(appService.url + 'todayrecharge/' + localStorage.getItem('userId'), config).success(function(response, status) {
                  appService.hideLoading();
                  if (response.success) {
                      $scope.todayRecharge = response.data;
                  } else {
                      
                      //console.log("Hello World")
                  }
              }).error(function(response) {
                  appService.showAlert('templates/error_alert_noserver.html', $scope);
                  appService.hideLoading();
                  //console.log(response.status)
              })
          }
          $scope.getEarnings =function(){

            var config = {
                  headers: {
                      'x-access-token': localStorage.getItem('access_token')
                  }
              }
              $http.get(appService.url +"getEarnings/"+localStorage.getItem('userId'), config).success(function(response, status) {
                  appService.hideLoading();
                  if (response.success) {
                      $scope.total_amount = response.user_total_amount;
                      $scope.myEarnings = response.earnings
                        
                  } else {
                      //console.log("Hello World")
                  }
              }).error(function(response) {
                  appService.showAlert('templates/error_alert_noserver.html', $scope);
                  appService.hideLoading();
                  //console.log(response.status)
              })

          }
          $scope.accountDetails = function() {
              var config = {
                  headers: {
                      'x-access-token': localStorage.getItem('access_token')
                  }
              }
              $http.get(appService.url + 'account/'+localStorage.getItem('userId'), config).success(function(response, status) {
                  appService.hideLoading();
                  if (response.success) {
                      $scope.accountDetails = response.data;
                      //console.log(response.data)
                  } else {
                      //console.log("Hello World")
                  }
              }).error(function(response) {
                  appService.showAlert('templates/error_alert_noserver.html', $scope);
                  appService.hideLoading();
                  //console.log(response.status)
              })
          }
          $scope.getStatus = function(id,type) {
              //console.log(id)
              appService.showLoading();
              var config = {
                  headers: {
                      'x-access-token': localStorage.getItem('access_token')
                  }
              }
              $http.get(appService.url + 'rechargestatus/' + id, config).success(function(response, status) {
                  appService.hideLoading();
                  if (response.success) {
                    //console.log(response.response._id);
                    if(type == "history"){
                        for(let i=0;i<$scope.rechargeHistory.length;i++){
                            if($scope.rechargeHistory[i]['recharge_api_trnid'] === response.response._id){
                                //console.log("Hola");
                                $scope.rechargeHistory[i]['recharge_status'] = response.response.status;
                                if(response.response.status === "3"){

                                    $rootScope.user_balance = $rootScope.user_balance + response.response.dr - ((Number(response.response.dr)*localStorage.getItem('margin'))/100);
                                }else{

                                }
                                break;
                            }
                        }
                    }else if(type == 'today'){
                        for(let i=0;i<$scope.todayRecharge.length;i++){
                            if($scope.todayRecharge[i]['recharge_api_trnid'] === response.response._id){
                                //console.log("Hola");
                                $scope.todayRecharge[i]['recharge_status'] = response.response.status;
                                if(response.response.status === "3"){
                                    $rootScope.user_balance = $rootScope.user_balance + response.response.dr - ((Number(response.response.dr)*localStorage.getItem('margin'))/100);
                                }else{

                                }
                                break;
                            }
                        }

                    }
                      
                      //console.log(response);
                  } else {
                      //console.log("Hello World")
                  }
              }).error(function(response) {
                  appService.showAlert('templates/error_alert_noserver.html', $scope);
                  appService.hideLoading();
                  //console.log(response.status)
              })
          }
          $rootScope.logout = function() {
              $rootScope.isLoggedIn= false;
              localStorage.setItem('isLoggedIn', false)
              localStorage.removeItem('access_token')
              ////console.log("logout")
              $state.go('app')
          }
          if ($state.current.name === 'history') {
              //console.log("history")
              $scope.getRechargeHistory();
              //$scope.getAjaxHistory();
          }
          if ($state.current.name === 'todayRecharge') {
              //console.log("today")
              $scope.getTodayRecharge();
          }
          if ($state.current.name === 'account') {
              //console.log("Account");
              $scope.accountDetails();
          }
          if($state.current.name === "earnings"){
            $scope.getEarnings();
          }
          if($state.current.name === "dashboard"){
            appService.showLoading();
            $scope.getBalance();
          }
          //console.log("Dashboard Controller")
      });