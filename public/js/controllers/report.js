angular.module('todoController', ['ui.bootstrap'])

	// inject the Todo service factory into our controller
	.controller('mainController', ['$scope','$http','Todos','$uibModal', function($scope, $http, Todos, $sce,$uibModal) {
		$scope.loading = true;

        $scope.todo = {};
        $scope.frames = [];
        $scope.loadReport = function(id){
            $scope.content_id = id;
            $scope.isVisible = true;
            Todos.gettodo($scope.content_id).success(function(response) {
                $scope.todo = response;
                //console.log($scope.todo);
                if ($scope.todo.json_url != undefined) {
                    $scope.editJson($scope.todo.json_url);    
                }
                $scope.isVisible = false;
            }).error(function(error) {});
        }
        
        $scope.labels = []
        $scope.loadMainReport = function(id){
            $scope.content_id = id;
            $scope.isVisible = true;
            Todos.gettodo($scope.content_id).success(function(response) {
                $scope.todo = response;
                $scope.json_url = response.json_url;
                if ($scope.todo.json_url != undefined) {
                    $scope.editJson($scope.todo.json_url);    
                }
                $scope.isVisible = false;
            }).error(function(error) {});

            let params = {};
            params.email = "admin@jl.com";
            Todos.get_label(params).success(function(data) {
                if(data && data.data){
                    $scope.labels = data.data && data.data.labels;
                }
            }).error(function(error) {});
        }

        $scope.selectImage = function(index){
            $scope.selected_imageIndex = index;
        }

		// DELETE ==================================================================
		// delete a todo after checking it
		$scope.stringJson = {};
		$scope.editJson = function(link) {
			Todos.getJ(link).success(function(data) {
				$scope.frames = data;
            });
		};

    $scope.setasdone = function(){
        if (confirm("Are you sure ?"))
       {
           var isEdit = $scope.todo.status;
           var params = { content_id:$scope.content_id, isEdit:isEdit };
           Todos.setasdone(params).success(function(data) {
                alert(data);
            });
       }
    }

    $scope.json_url = "";    
	$scope.savejson = function(){
        const params = {
            reviewStatus: "Done",
            id: $scope.todo._id
        }
        if ($scope.json_url.trim().length != 0) {
            var stringJson = JSON.stringify($scope.frames);
            var obj = { body:stringJson, link:$scope.json_url };
            Todos.upload(obj).success(function(data) {
                    Todos.save_report_json(params).success(function(data){
                        
                    })
                    alert(data);
            });
        }
    }	
    
    $scope.LoadJSON = function(){
        Todos.getJ($scope.json_url).success(function(data) {
            $scope.frames = data;
        });
    }



	}]);    

    
    
