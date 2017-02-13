angular.module("mapp").factory("myHttp", ["$http", function ($http) {
    return $http.get("./livelist.json")

}])