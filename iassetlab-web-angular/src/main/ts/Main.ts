///<reference path="../lib/DefinitelyTyped/angularjs/angular.d.ts"/>
var assetLabModule:ng.IModule = angular.module("IAssetLab", []);
assetLabModule.config(
    function($routeProvider:ng.IRouteProviderProvider) {
        $routeProvider.when(
                "/",
                <ng.IRoute>{
                    action:'home'
                }
            ).
            otherwise(<ng.IRoute>{redirectTo:'/'});
    }
);
assetLabModule.controller(
    "IAssetLabController",
    function($scope:ng.IScope, $route:ng.IRouteService, $routeParams:any) {
        console.log("creating controller");
        $scope.$on(
            "$routeChangeStart",
            function($event:ng.IAngularEvent, $data:{$route:ng.IRoute;}) {
                console.log("x");
                $event.preventDefault();
                console.log("prevented?");
            }
        );
        $scope.$on(
            "$routeChangeSuccess",
            function($event:ng.IAngularEvent, $data:{$route:ng.IRoute;}) {
                console.log("rendering "+$data.$route.action);

            }
        );
    }
);
