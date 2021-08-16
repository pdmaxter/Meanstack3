angular.module('todoController', ['ui.bootstrap'])

	// inject the Todo service factory into our controller
	.controller('mainController', ['$scope','$http','Todos','$uibModal', function($scope, $http, Todos, $sce,$uibModal) {
		$scope.formData = {};
		$scope.loading = true;
		$scope.users = []; //declare an empty array
  
        $scope.isLoggedIn = false;
        $scope.user = {};
        $scope.user.email = "";
        $scope.user.password = "";
        $scope.current_page = 1;
        $scope.records_per_page = 10;

        $scope.login = function(){
            if ($scope.user.email.trim().length == 0) {
                alert("Please enter email address");
                return;
            }
            if ($scope.user.password.trim().length == 0) {
                alert("Please enter password");
                return;
            }
            var param = {};
            param.email = $scope.user.email;
            param.password = $scope.user.password;
            Todos.login(param).success(function(data) {
                if (data.success) {
                    $scope.user.email = "";
                    $scope.user.password = "";
                    $scope.isLoggedIn = true;
                    window.localStorage.isLoggedIn = "true";
                    $scope.get_queue();
                }else{
                    alert(data.message);
                }
            });
        }
        $scope.logout = function(){
            $scope.isLoggedIn = false;   
            window.localStorage.isLoggedIn = "false";
        }
        if (window.localStorage.isLoggedIn != undefined) {
            if (window.localStorage.isLoggedIn == "true") {
                $scope.isLoggedIn = true;
            }else{
                $scope.isLoggedIn = false;
            }
        }
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

		// GET =====================================================================
		// when landing on the page, get all todos and show them
		// use the service to get all the todos
        $scope.isedited = "pending";
        $scope.assignedTo = "";

        $scope.queues = [];
        $scope.get_queue = function(){
            Todos.get_queue().success(function(data) {
                $scope.queues = data;
                if ($scope.queues.length > 0 && $scope.assignedTo == "") {
                    $scope.assignedTo = $scope.queues[0].queueId;
                }
                if ($scope.todos.length == 0) {
                    $scope.getData();
                }
            });
        }
        if ($scope.isLoggedIn) {
            $scope.get_queue();
        }

		$scope.getData = function() {
            var params = {};
            params.page = $scope.current_page;
            params.isedited = $scope.isedited;
            params.assignedTo = $scope.assignedTo;
            /* this is for user edit page */
            $scope.userEditPage(params);
            /* this is for user edit page */

		    Todos.get(params).success(function(data) {
				$scope.todos = data.data;
				$scope.loading = false;
			});
		}

        $scope.email_address = '';
        $scope.loadEmailReport = function(email){
            $scope.email_address = email;
        }
        
        $scope.all_todos = []
        $scope.userEditPage = function(params) {
            setTimeout(() => {
                params.email = $scope.email_address
                Todos.get_all_todos(params).success(function(data) {
                	$scope.all_todos = data.data;
                	$scope.loading = false;
                });
            }, 500);
        }

        $scope.states = {};
        $scope.states.totalvideo = 0;
        $scope.states.donevideo = 0;
        $scope.states.remainingvideo = 0;
        $scope.states.discardvideo = 0 ;

        $scope.getStates = function() {
            Todos.getStates().success(function(data) {
                $scope.states = data;
                $scope.loading = false;
                $scope.updateList();
            });
        }
        $scope.getStates();
        
        $scope.user_total_done = 0;
        $scope.user_total_pending = 0;
        $scope.get_user_status = function(){
            if($scope.email_address !== ""){
                const params = {
                    email: $scope.email_address
                }
                Todos.get_user_status(params).success(function(data) {
                    if(data){
                        $scope.user_total_done = data.doneUserVideo;
                        $scope.user_total_pending = data.pendingVideo
                        $scope.loading = false;
                        $scope.updateList();
                    }
                });
            }
        }
        setTimeout(() => {
            $scope.get_user_status();
        }, 500);
        
        $scope.updateList = function(){
            $scope.getData();
        }

        $scope.updateAssign = function(){
            $scope.getData();   
        }

        $scope.in_sec = 30;
        setInterval(function(){
            $scope.in_sec = $scope.in_sec - 1;
            if ($scope.in_sec == 0) {
                $scope.in_sec = 30;
                $scope.getStates();
                $scope.get_queue();
                $scope.get_user_status();
            }
            $scope.$apply();
        },1000);

        //alert(document.domain);
        $scope.import_file = function(){
            var domain = document.domain;
            if (domain.indexOf("150.238.18.183") > -1) {
              domain = "150.238.18.183";
            }
            if (domain.indexOf("150.238.18.188") > -1) {
              domain = "150.238.18.188";
            }
            if (domain.indexOf("169.56.143.216") > -1) {
              domain = "169.56.143.216";
            }
            Todos.importFile(domain).success(function(data) {
                alert(data);
            });
        }
		// CREATE ==================================================================
		// when submitting the add form, send the text to the node API
		$scope.createTodo = function() {

			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			if ($scope.formData.text != undefined) {
				$scope.loading = true;

				// call the create function from our service (returns a promise object)
				Todos.create($scope.formData)
					.success(function(data) {
						$scope.loading = false;
						$scope.formData = {}; // clear the form so our user is ready to enter another
						$scope.todos = data; // assign our new list of todos
					});
			}
		};

		// DELETE ==================================================================
		// delete a todo after checking it
		$scope.stringJson = {};
		$scope.editJson = function(link, id) {
			console.log(link,id)
			$scope.loading = true;
			// var link = "http://150.238.18.188:4000/"+l
			Todos.getJ(link).success(function(data) {
				console.log(data)
				$scope.stringJson = data;
				$scope.name = link;
				$scope.content_id = id;
				$('#myModal').modal('show');
            });
		};

    $scope.setasdone = function(content_id,isEdit){
        if (confirm("Are you sure ?"))
       {
           var params = { content_id:content_id, isEdit:isEdit };
           Todos.setasdone(params).success(function(data) {
                alert(data);
                $scope.getStates();
            });
       }
    }    
	$scope.savejson = function(){
       console.log($scope.stringJson)
            let nam = $scope.name.split('/')
            //console.log(nam)
            var obj = {key:nam[nam.length-1], content_id:$scope.content_id, body:$scope.stringJson}
            Todos.upload(obj)
				// if successful creation, call our get function to get all the new todos
				.success(function(data) {
					alert(data)
					$scope.content_id=''
					$scope.stringJson=''
					$scope.getData($scope.current_page)
				})
    //         AWS.config.update({ accessKeyId: $scope.creds.access_key, secretAccessKey: $scope.creds.secret_key });
    //   // AWS.config.region = 's3.ap-south-1.amazonaws.com';
    //   // AWS.config.region = 'ap-south-1';
    //   AWS.config.update({region: 's3-ap-south-1.amazonaws.com'});
    //   // var s3 = new AWS.S3();
    //   var bucket = new AWS.S3({ params: { Bucket: 'sonyliv-creditjson-toch' } });
    //       uniqueFileName = "updated_json/"+nam[2];
    //     // // var josnObj = JSON.parse(angular.toJson($scope.ai_object))
    //     // var mainObj = {}
    //     // mainObj.Star_Credits = {}
    //     // mainObj.Star_Credits = josnObj
    //     // console.log("arr",mainObj)
    //     var params = { 
    //         Key: uniqueFileName,
    //         ContentType: "application/json", 
    //         Body:$scope.stringJson,
    //         ServerSideEncryption: 'AES256',
    //         ACL:"private-read"
    //     };
    //     console.log(params)
    }	
		// $scope.addProductModel = function(){
  //       $scope.modalAIOptionsInstance = $uibModal.open({
  //           templateUrl: 'addPRoduct.html',
  //           scope: $scope,
  //           backdrop: 'static',
  //           keyboard: false
  //       });
  //   }
    
    //  $scope.creds = {
    //     access_key: 'AKIAYXZT5LCLIYPNSMN4',
    //     secret_key: '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'
    // }
    //     $scope.savejson = function(){
    //    console.log($scope.stringJson)
    //         let nam = $scope.name.split('/')
    //         console.log(nam)
    //         AWS.config.update({ accessKeyId: $scope.creds.access_key, secretAccessKey: $scope.creds.secret_key });
    //   // AWS.config.region = 's3.ap-south-1.amazonaws.com';
    //   // AWS.config.region = 'ap-south-1';
    //   AWS.config.update({region: 's3-ap-south-1.amazonaws.com'});
    //   // var s3 = new AWS.S3();
    //   var bucket = new AWS.S3({ params: { Bucket: 'sonyliv-creditjson-toch' } });
    //       uniqueFileName = "updated_json/"+nam[2];
    //     // // var josnObj = JSON.parse(angular.toJson($scope.ai_object))
    //     // var mainObj = {}
    //     // mainObj.Star_Credits = {}
    //     // mainObj.Star_Credits = josnObj
    //     // console.log("arr",mainObj)
    //     var params = { 
    //         Key: uniqueFileName,
    //         ContentType: "application/json", 
    //         Body:$scope.stringJson,
    //         ServerSideEncryption: 'AES256',
    //         ACL:"private-read"
    //     };
    //     console.log(params)
    //     bucket.putObject(params, function(err, data) {
    //       if(err) {
    //         // There Was An Error With Your S3 Config
    //         console.log(err);
    //         return false;
    //       }
    //       else {
    //           alert("successfully saved!")
    //        } 
    //     })
    //     }

    $scope.label = '';
    $scope.labels = []
    $scope.open_label = function(isOpen){
        let params = {};
        params.email = "admin@jl.com";
        Todos.get_label(params).success(function(data) {
            if(data && data.data){
                $scope.labels = data.data && data.data.labels;
            }
        });
        $('#addLabelModel').modal('show');
    }

    $scope.add_label = function(){
        if($scope.label !== '' && ($scope.label).trim() !== ''){
            let labelArr = $scope.labels;
            labelArr.push($scope.label);
            $scope.labels = labelArr;
            $scope.label = '';
        }
    }

    $scope.save_labels = function(){
        $('#addLabelModel').modal('hide');
        let params = {};
        params.email = "admin@jl.com";
        params.labels = $scope.labels;
        Todos.add_label(params).success(function(data) {
        //    console.log('dddd==>> ', data)
        });
    }
    
    $scope.delete_label = function(dlt_label){
        let value = $scope.labels
        let index = -1;

        for(let i=0; i<value.length; i++){
            if(value[i] === dlt_label){
                index = i;
            }
        }

        if (index !== -1) {
            value.splice(index, 1);
        }
        $scope.labels = value;
    }

    $scope.user_email = ''
    $scope.usersList = []
    $scope.open_user_model = function(isOpen){
        Todos.get_add_users().success(function(data) {
            if(data && data.data){
                $scope.usersList = data.data
            }
        });
        $('#addUserModel').modal('show');
    }

    $scope.add_user = function(isOpen){
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,5}$/i.test($scope.user_email)) {
            alert('Please enter valid email address...');
        }else{
            $('#addUserModel').modal('hide');
            const params = {
                email: $scope.user_email
            }
            Todos.add_user(params).success(function(data) {
                $scope.user_email = ''
            });
        }
    }

    $scope.delete_user_by_id = function(userId){
        
    }

    $scope.delete_processingVideo = function(item){
        const params = {
            id: item._id,
            status: "failed"
        }
        Todos.delete_processing_video(params).success(function(data){
            if(data.success){
                $scope.getData();
                alert("Status updated successfully...")
            }
        })
    }
    
    $scope.re_processing_video = function(item){
        const params = {
            id: item._id,
            status: "pending"
        }
        Todos.re_processing_video(params).success(function(data){
            if(data.success){
                $scope.getData();
                alert("Yes gone for re-processing...")
            }
        })
    }

}]);