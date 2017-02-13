angular.module("mapp")
    .controller("guideCtrl", function () {
        setTimeout(function () {
            var myswiper = new Swiper('#guide-swiper')
        }, 10)
        //var myScroll = new IScroll("#scroll")
    })
    .controller("indexCtrl", function ($state) {
        $state.go("index.home")
    })
    .controller("homeCtrl", function ($scope, myHttp) {
        //json‰÷»æ
        myHttp.then(function (data) {
            //[{1,2},{3,4},{4,5}]
            $scope.arr = []
            $scope.data = data.data.data;
            var len = Math.ceil($scope.data.length)
            for (var i = 0; i < len; i++) {
                $scope.arr[i] = [];
                $scope.arr[i].push($scope.data[i * 2])
                $scope.arr[i].push($scope.data[i * 2 + 1])
            }

        });
        //swiper“≥√Ê«–ªª1
        setTimeout(function () {
            var myswiper2 = new Swiper('#first-swiper', {
                onSlideChangeStart: function (swiper) {
                    var indexs = swiper.activeIndex;
                    //console.log(indexs)
                    $("#first-nav").children().eq(indexs).addClass("active").siblings().removeClass("active")
                }
            });
            $("#first-nav").children().on("click", function () {
                $(this).addClass("active").siblings().removeClass("active")
                myswiper2.slideTo($(this).index())
            });


            //swiper »»µ„“≥£¨πÿ◊¢“≥ «–ªª
            var myswiper1 = new Swiper('#home-swiper', {
                onSlideChangeStart: function (swiper) {
                    var indexs = swiper.activeIndex;
                    //console.log(indexs)
                    $("#nav").children().eq(indexs).addClass("active").siblings().removeClass("active")
                }
            });
            $("#nav").children().on("click", function () {
                $(this).addClass("active").siblings().removeClass("active")
                myswiper1.slideTo($(this).index())
            })
        }, 10)


    });

/* app.controller("firstCtrl", function () {
 var myScroll = new IScroll("#scroll")
 })*/




