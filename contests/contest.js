var main_container = angular.module('main_app',[]);


main_container.service('searchBar', function(){
    var searchText=''
    return {
        getSearch : function(){
            return searchText;
        },
        setSearch : function(txt){
            searchText=txt;
        }
    };
});

main_container.controller('header', ['$scope', 'searchBar', function($scope, searchBar){
    $scope.search = '';
    $scope.bySearch = function(){
        searchBar.setSearch($scope.search);
    };
}]);

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

main_container.controller("contestsList",['$scope','$http', 'searchBar', function($scope, $http, searchBar){
    $http.post('http://localhost:8888/contests')
    .then((res)=>{
        $scope.listOfContests = res.data;
        // console.log(res.data);
    });

    $scope.bySearch = function(){
        return searchBar.getSearch();
    };
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