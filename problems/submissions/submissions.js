var main_container = angular.module('main_app',[]);

main_container.service('key', function(){
    var KEY=''
    return {
        getKey : function(){
            return KEY;
        },
        setKey : function(txt){
            console.log(txt)
            KEY=txt;
        }
    };
});

main_container.controller('header', ['$scope','key','$window', function($scope,key,$window){
    $scope.problemKEY=function(){
        window.location.href = '../'.concat(key.getKey()).concat('.html')
    }
}])

main_container.controller("menuBarCtrl",($scope)=>{
    $scope.menu = [
        {
            name: "Home",
            link: "/home.html"
        },
        {
            name: "Problems",
            link: "/problems/"
        },
        {
            name: "Contests",
            link: "/contests/"
        }
    ];
});

main_container.controller("submissionsList", ['$scope','$http','$location','key', function($scope, $http, $location,key){
    var problemKEY = ($location.$$absUrl).split("=")[1];
    key.setKey(problemKEY)
    $http.post('http://localhost:8888/submissions', {key : problemKEY})
    .then((res)=>{
        $scope.listOfsubmissions = res.data[problemKEY];
    });
}]);

main_container.controller('profile_info', ($scope,$http)=>{
    $http.post('http://localhost:8888/profile_name')
    .then((res)=>{
        const user_info = res.data[0];
        $scope.username = user_info.Username;
        $scope.profile_img = user_info.profileIMG;
    });
    $scope.dropDown =false;
    $scope.showDropDown = function(){
        $scope.dropDown = !$scope.dropDown;
    }
    $scope.hideDropdown =function(){
        $scope.dropDown = false;
    }
    $scope.logout = function(){
        var pastDate = new Date();
        pastDate.setFullYear(pastDate.getFullYear() - 1);
        document.cookie = "Username=; expires=" + pastDate.toUTCString() + "; path=/";
    }
})