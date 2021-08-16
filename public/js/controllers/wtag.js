angular.module('todoController', ['ui.bootstrap'])
.controller('wtagController', ['$scope','$http','Todos','$uibModal', function($scope, $http, Todos, $sce,$uibModal) {
        $scope.loading = true;
  

        // DELETE ==================================================================
        // delete a todo after checking it
        $scope.link = "https://s3.ap-south-1.amazonaws.com/toch-mumbai/video_analysis/3192366/0ec55db1-c0c3-4eb6-987f-57a449eed4b6.json";
        $scope.frames = [];
        $scope.apimsg = "";
        $scope.loadJson = function() {
            $scope.apimsg = "Loading JSON ....";
            Todos.getJ($scope.link).success(function(data) {
                //console.log(data)
                $scope.frames = [];
                $scope.frames = data;
                $scope.apimsg = "";
                $scope.$apply();
            });
        };
       
        $scope.saveJson = function(){
                $scope.apimsg = "Saving JSON ....";
                var param = {};
                param.body = $scope.frames;
                param.key = $scope.link.replace("https://s3.ap-south-1.amazonaws.com/toch-mumbai/","");
                Todos.upload_tags(param).success(function(data) {
                        //alert(data);
                        console.log(data);
                        $scope.apimsg = "JSON Saved";
                        $scope.hidemsg();
                });
        }   
        $scope.hidemsg = function(){
            setTimeout(function(){
                $scope.apimsg = "";
                $scope.$apply();
            },3000);
        }
    

}]);