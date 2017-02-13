var app = angular.module("mapp", ["ui.router"]);
app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("guide");
    $stateProvider.state("guide", {
        url: "/guide",
        templateUrl: "./tpl/guide.html",
        controller: "guideCtrl"
    })
        .state("index", {
            url: "/index",
            templateUrl: "./tpl/index.html",
            controller: "indexCtrl"
        })
        .state("index.home", {
            url: "/index.home",
            templateUrl: "./tpl/home.html",
            controller:"homeCtrl"

        })
        .state("index.first", {
            url: "/index.first",
            templateUrl: "./tpl/first.html",
            controller: "firstCtrl"

        })
        .state("index.find", {
            url: "/index.find",
            templateUrl: "./tpl/find.html"
        })
        .state("index.me", {
            url: "/index.me",
            templateUrl: "./tpl/me.html"
        })
        .state("index.exit", {
            url: "/index.exit",
            templateUrl: "./tpl/exit.html"
        })


});


