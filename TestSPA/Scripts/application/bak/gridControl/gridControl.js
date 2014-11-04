'use strict';

var gc = angular.module('gc', []);

gc.directive('gridControl', function () {
    return {
        replace: true,
        restrict: 'A',
        templateUrl: 'Scripts/app/gridControl/grid-control.html',
        controller: function() {
        }
    };
});

gc.directive('gridHeader', function () {
    return {
        replace: true,
        restrict: 'A',
        templateUrl: 'Scripts/app/gridControl/grid-header.html',
        controller: function () {
        }
    };
});

gc.directive('gridFooter', function () {
    return {
        replace: true,
        restrict: 'A',
        templateUrl: 'Scripts/app/gridControl/grid-footer.html',
        controller: function () {
        }
    };
});

gc.directive('gridBody', function () {
    return {
        replace: true,
        restrict: 'A',
        templateUrl: 'Scripts/app/gridControl/grid-body.html',
        controller: function () {
        }
    };
});

