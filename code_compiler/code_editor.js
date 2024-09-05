var main_container = angular.module('main_app',[]);

main_container.service('userCode',function(){
    var codeInput=''
    return {
        set_user_code : function(txt){
            codeInput = txt;
        },
        get_user_code : function(){
            return codeInput;
        }
    }
})

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

main_container.controller('code_editor',['$scope', 'userCode', function($scope, userCode){
    $scope.code='';
    $scope.codeChange = function(){
        userCode.set_user_code($scope.code);
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

main_container.controller('runORsubmit',['$scope','$http','userCode',function($scope, $http, userCode){
    $scope.language="c";
    $scope.get_code_to_submit = function(){
        const code_ = userCode.get_user_code();
        // console.log(code_);
        $http.post('http://localhost:8050/run', { program : code_, language : $scope.language})
        .then(function(res){
            console.log(res);
        }).catch((error)=>{
            console.error('Error:',error)
        })
    };
}]);