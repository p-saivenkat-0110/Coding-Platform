var main_container = angular.module('main_app',[]);

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

main_container.controller('profile_details',($scope,$http)=>{
    $http.post('http://localhost:8888/profile_name')
    .then((res)=>{
        const user_info = res.data[0];
        $scope.profile_img = user_info.profileIMG;
        $scope.user_info=[
            {
                label: "Email",
                type : "text",
                name : "emailInProfile",
                id   : "emailInProfile",
                value: user_info.Email
            },
            {
                label: "Username",
                type : "text",
                name : "usernameInProfile",
                id   : "usernameInProfile",
                value: user_info.Username
            }
        ]

        $scope.solved_problems = user_info.overall_solved_problems_count.total

        $scope.solvedPartition=[
            {
                type : "Easy",
                count: user_info.overall_solved_problems_count.easy
            },
            {
                type : "Medium",
                count: user_info.overall_solved_problems_count.medium
            },
            {
                type : "Hard",
                count: user_info.overall_solved_problems_count.hard
            }
        ]
    });
    
});

main_container.controller('profile_info', ($scope,$http)=>{
    $http.post('http://localhost:8888/profile_name')
    .then((res)=>{
        const user_info = res.data[0];
        // console.log(user_info)
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