angular.module('todoService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Todos', ['$http',function($http) {
		return {
			gettodo: function(contentId) {
				return $http.get('/api/todo?videoId='+contentId);
			},
			setasdone : function(params) {
				return $http.post('/api/setasdone',params);
			},
			login : function(params) {
				return $http.post('/api/user/login',params);
			},
			importFile : function(domain) {
				return $http.get('/api/import/file?ip_address='+domain);
			},
			getStates : function() {
				return $http.get('/api/states');
			},
			get : function(params) {
				return $http.post('/api/todos',params);
			},
			filtertodos : function(params) {
				return $http.post('/api/filter/todos',params);
			},
			create : function(todoData) {
				return $http.post('/api/todos', todoData);
			},
			getJ : function(link) {
				return $http.get(link);
			},
			upload : function(obj) {
				return $http.post('/api/upload',obj);
			},
			upload_tags : function(obj) {
				return $http.post('/api/post_tags',obj);
			},
			// Queue apis 
			create_queue : function(obj){
				return $http.post('/api/queue/create',obj);
			},
			edit_queue : function(obj){
				return $http.post('/api/queue/edit',obj);
			},
			get_queue : function(){
				return $http.get('/api/queue/get');
			},
			add_label: function(obj){
				return $http.post('/api/queue/add_labels', obj);
			},
			get_label: function(obj){
				return $http.post('/api/queue/get_labels', obj);
			},
			save_report_json: function(obj){
				return $http.post('/api/queue/update_review_status', obj);
			},
			add_user: function(obj){
				return $http.post('/api/queue/add_new_user', obj);
			},
			get_add_users: function(){
				return $http.get('/api/queue/get_new_user');
			},
			get_all_todos: function(obj){
				return $http.post('/api/get_all/todos', obj);
			},
			get_user_status: function(obj){
				return $http.post('/api/get_user_states', obj);
			},
			re_processing_video: function(obj){
				return $http.post('/api/todo/re_processing_video', obj);
			},
			delete_processing_video: function(obj){
				return $http.post('/api/todo/delete_processing_video', obj);
			}

		}
	}]);