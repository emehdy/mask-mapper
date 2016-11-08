var app=angular.module("MaskView",['ui.router']);



app.config(function($stateProvider, $urlRouterProvider) {
   
  $urlRouterProvider.otherwise("/");
   
  $stateProvider

	.state('main', {
      url: "/", 
      templateUrl: "pages/main.html",
	  controller:'mainCtrl',
    })
	
});

app.controller("mainCtrl",function($scope,ImageMaper){
	$scope.html=""; 
	$scope.$on('ImageMaper.data',function(evt,data){
		$scope.mapper=data; 
	});
	imageMaper=new ImageMaper();
	imageMaper.start('image.jpg');
	$scope.addArea=function(shape){
		return imageMaper.addArea(shape);
	}
	$scope.removeArea=function($index){
		return imageMaper.removeArea($index);
	}
	$scope.setProperty=function($index,name){
		
		return imageMaper.setProperty($index,name,$scope.mapper.area[$index][name]);
	} 
	$scope.setActive=function($index){
		 
		imageMaper.setActive($index,$scope.mapper.state.areaIndex);
	} 
	$scope.asHTML=function( ){
		 
		$scope.html=imageMaper.asHTML();
	} 
	 
});



app.service('ImageMaper',function( $q,$rootScope)
{
	var mapper=function(options){
		this.options={};
		this.options.element= '.image-mapper' ;
		angular.extend(this.options,options);
		 
	};
	
	 
	mapper.prototype.updated=function (el)
	{
		$rootScope.$broadcast('ImageMaper.data',$(el).imageMapper("getData")); 
		
	}
	mapper.prototype.start=function (src)
	{
		var self=this;
		self.src=src;
		var el=self.options.element;
		$(el).imageMapper({
				src : self.src,
				event : {
					init : function () {
						self.updated(el);
					},
					update : function () {
						self.updated(el);
					},
					removeArea : function () {
						self.updated(el);
					}
				}
			});

	
	}
	mapper.prototype.addArea=function(shape)
	{
		var el=this.options.element;
		$(el).imageMapper('addArea',shape);
		 
	}
	mapper.prototype.removeArea=function(index)
	{
		var el=this.options.element;
		$(el).imageMapper('removeArea',index);
	}
	mapper.prototype.setProperty=function(index,name,value)
	{
		var el=this.options.element;
		$(el).imageMapper('setProperty',index,name,value);
	}
	mapper.prototype.setActive=function(index )
	{
		var el=this.options.element;
		$(el).imageMapper('setActive',index );
	}
	mapper.prototype.asHTML=function( )
	{
		var el=this.options.element;
		return $(el).imageMapper('asHTML');
	}
	
	return mapper;
});
	
	
	

 

	