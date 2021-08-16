angular.module('todoController', ['ui.bootstrap'])

	// inject the Todo service factory into our controller
	.controller('mainController', ['$scope','$http','Todos','$uibModal', function($scope, $http, Todos, $sce,$uibModal) {
		
		$scope.loading = true;
		$scope.todos = []; //declare an empty array
  
        $scope.filename = "06022020_Input_Sheet_Chandragupta.xlsx";
        $scope.current_page = 1;
        $scope.records_per_page = 10;

        $scope.prevPage = function ()
        {
            if ($scope.current_page > 1) {
                $scope.current_page--;
                $scope.getData();
            }
        }

        $scope.nextPage = function ()
        {
                $scope.current_page++;
                $scope.getData();
        }

        $scope.getData = function() {
            var params = {};
            params.page = $scope.current_page;
            params.filename = $scope.filename;

            Todos.filtertodos(params).success(function(data) {
                $scope.todos = [];
                $scope.todos = data.data;
                $scope.loading = false;
            });
        }
        $scope.getData();

        $scope.changeFileName = function(){
            $scope.getData();
        }

        
		

	}]);