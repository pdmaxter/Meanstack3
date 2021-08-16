angular.module('todoController', ['ui.bootstrap'])

	// inject the Todo service factory into our controller
	.controller('mainController', ['$scope','$http','Todos', function($scope, $http, Todos) {
		$scope.queues = []; //declare an empty array

		$scope.getQueues = function() {
		    Todos.get_queue().success(function(data) {
				$scope.queues = data;
			});
		}
		
        $scope.queue = {};
        $scope.create_queue = function() {
            Todos.create_queue().success(function(data) {
                $scope.getQueues();
            });
        }
        $scope.get_status = function(_status){
            return (_status == 1) ? 'Running' : 'Stopped';
        }
        setInterval(function(){
            $scope.getQueues();
        },5000);

        $scope.UpdateQueue = function(queue){
            queue.status = (queue.status == 1) ? 2 : 1;
            var parma = queue;
            Todos.edit_queue(parma).success(function(data) {
                $scope.getQueues();
            });
        }

        $scope.getQueues();
	}]);