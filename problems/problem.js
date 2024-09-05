var main_container = angular.module('main_app',[]);

main_container.service('searchBar', function(){
    var searchText=''
    return {
        getSearch : function(){
            return searchText;
        },
        setSearch : function(txt){
            searchText=txt;
        },
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

main_container.controller("problemsList", ['$scope','$http', 'searchBar', function($scope, $http, searchBar){
    $scope.bySearch = function(){
        return searchBar.getSearch();
    };
    $scope.show_solved_problems=function(){
        checkBox=document.getElementById("show_solved_problems").checked
        // console.log(checkBox)
        $http.post('http://localhost:8888/problems',{ischecked:checkBox})
        .then((res)=>{
            $scope.listOfproblems = res.data[0];
            // console.log(res.data);
        });
    }
    $http.post('http://localhost:8888/problems',{ischecked:false})
    .then((res)=>{
        $scope.listOfproblems = res.data[0];
        $scope.color=[]
        $scope.listOfproblems.forEach((x)=>{
            if(res.data[1].includes(x.problem_no)){
                $scope.color.push('rgb(3, 143, 8)');
            }
            else{
                $scope.color.push(null);
            }
        })
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

main_container.controller('fileUpload',($scope)=>{
    $scope.uploadCode = function(problemId){
        var fileInput = document.getElementById('uploadCode');
        var file = fileInput.files[0];
        const id = problemId;
        // console.log(file.name,id)
        if(!file){
            alert("Please upload code file.");
            return;
        }
        var formData = new FormData();
        formData.append('file', file);
        formData.append('problemId', id);


        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:8888/submitCode', true);

        xhr.onload = function(){
            if (xhr.status === 200) {
                // console.log(xhr.responseText)
                alert("Code submitted successfully... Check Submissions");
            }
            else{
                alert("Failed to upload code. Please try again later.");
            }
        };
        xhr.onerror = function() {
            alert("Failed to upload code. Please try again later.");
        };
        xhr.send(formData);
    }
})