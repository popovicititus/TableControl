'use strict';
var app = angular.module('app', ['ngRoute', 'ngSanitize', 'gc']);

app.config([
    '$routeProvider', function($routeProvider) {
        $routeProvider.
            when('/project-list', { templateUrl: 'Scripts/app/views/project-index.html', controller: 'ProjectsController' }).
            when('/project-view', { templateUrl: 'Scripts/app/views/project-view.html', controller: 'ProjectViewController' }).
            when('/project-edit', { templateUrl: 'Scripts/app/views/project-edit.html', controller: 'ProjectEditController' }).
            when('/project-new', { templateUrl: 'Scripts/app/views/project-new.html', controller: 'ProjectNewController' }).
            otherwise({ redirectTo: '/project-list' });
    }
]);