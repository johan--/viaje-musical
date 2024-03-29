'use strict';

angular.module('subregions').controller('SubregionsController', ['$scope', '$stateParams', '$location', 'subregionsConfig', 'Authentication', 'Subregions', 'fileupload', 'ngAudio',
	function($scope, $stateParams, $location, subregionsConfig, Authentication, Subregions, fileupload, ngAudio) {
		$scope.authentication = Authentication;
		
		//////////////// CREATE INSTRUMENT ////////////////
		$scope.create = function() {
			var picList = [];
			$scope.picList.forEach(function (pic, index) {	
				picList.push(pic.name); 
			});				

			var audioList = [];
			$scope.audioList.forEach(function (audio, index) {	
				audioList.push(audio.name); 
			});				
						
			var subregion = new Subregions({
				name: this.name,
				description: this.description,
				pics: picList,
				audio: audioList,
				pic: $scope.pic.value.name,
			});
			
			console.log(subregion);
			
			subregion.$save(function(response) {
				$location.path('admin/subregions/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
            
			this.name = '';
			this.description = '';
		};
		
		//////////////// DELETE INSTRUMENT ////////////////
		$scope.remove = function(subregion) {
			if (subregion) {
				subregion.$remove();

				for (var i in $scope.subregions) {
					if ($scope.subregions[i] === subregion) {
						$scope.subregions.splice(i, 1);
					}
				}
			} else {
				$scope.subregion.$remove(function() {
					$location.path('admin/subregions');
				});
			}
		};
		
		//////////////// EDIT INSTRUMENT ////////////////
		$scope.update = function() {
			var subregion = $scope.subregion;
			
			subregion.pic = $scope.pic.value.name;
			
			var picList = [];
			$scope.picList.forEach(function (pic, index) {	
				picList.push(pic.name); 
			});				
			
			subregion.pics = picList;
			
			var audioList = [];
			$scope.audioList.forEach(function (audio, index) {	
				audioList.push(audio.name); 
			});				
			
			subregion.audio = audioList;
			
			subregion.$update(function() {
				$location.path('admin/subregions/' + subregion._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		//////////////// LIST INSTRUMENT ////////////////
		$scope.find = function() {
			$scope.subregions = Subregions.query();
		};

		//////////////// VIEW INSTRUMENT ////////////////
		$scope.findOne = function() {
			var Subregion = Subregions.get({ subregionId: $stateParams.subregionId }, function()
			{
				var picList   = [];
				var audioList = [];
				$scope.subregion = Subregion;
				
				Subregion.pics.forEach(function( pic, index ) {
					var picFullData = {'path': subregionsConfig.PUBLIC_IMAGE_PATH + Subregion._id + '/', 'name': pic};
					picList.push( picFullData );
				});			
				$scope.picList = picList;				
				
				Subregion.audio.forEach(function( audio, index ) {
					var audioFullData = {'path': subregionsConfig.PUBLIC_AUDIO_PATH + Subregion._id + '/', 'name': audio};
					audioList.push( audioFullData );
				});			
				$scope.audioList = audioList;				
				$scope.pic.value = {'path': subregionsConfig.PUBLIC_IMAGE_PATH + Subregion._id + '/', 'name': Subregion.pic};
			});
		};
		
		//////////////// Media FileUpload ////////////////
		$scope.audioList = [];
		$scope.picList 	 = [];
		$scope.picPercent   = {value: parseInt(0), set: function(value){ this.value = value; }};
		$scope.audioPercent = {value: parseInt(0), set: function(value){ this.value = value; }};

		$scope.removeFile = function($file, type)
		{
			if(type === 'image')
				$scope.picList.splice($scope.picList.indexOf( $file ), 1);	
			
			if(type === 'audio')
				$scope.audioList.splice($scope.audioList.indexOf( $file ), 1);	
		};
								
		$scope.onFileSelect = function($files, type)
		{
			for (var i = 0; i < $files.length; i++) {
				var upl = fileupload.upload($files[i]);	
				if(type === 'image')
				{
					fileupload.progress(upl, $scope.picPercent);				
					fileupload.success(upl, $scope.picList);		
				}
				
				if(type === 'audio')
				{
					fileupload.progress(upl, $scope.audioPercent);				
					fileupload.success(upl, $scope.audioList);						
				}	
			}
		};

		//////////////// Marker FileUpload ////////////////
		$scope.pic = {value: "", set: function(value){ this.value = value; }};
		$scope.singlePicPercent = {value: parseInt(0), set: function(value){ this.value = value; }};

		$scope.removePic = function()
		{
			$scope.pic.value = false;
		};
								
		$scope.picSelect = function($files)
		{
			for (var i = 0; i < $files.length; i++) {
				var upl = fileupload.upload($files[i]);	
				fileupload.progress(upl, $scope.singlePicPercent);				
				fileupload.success(upl, $scope.pic);		
			}
		};
		
	}
]);
