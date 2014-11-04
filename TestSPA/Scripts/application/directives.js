﻿'use strict';

app.directive('appVersion', [
    'version', function(version) {
        return function(scope, element, attrs) {
            element.text(version);
        };
    }
]);

app.directive('simpleSelect', function() {
    return {
        restrict: 'A',
        link: function link(scope, element, attrs) {
            $(element).select2({
                minimumResultsForSearch: -1
            });
        }
    };
});

app.directive('lookup', function() {
    return {
        restrict: 'E',
        replace: true,
        template: '<input type="hidden" />',
        scope: {
            minimumInputLength: '=minInputLength',
            enableSearch: '=enableSearch',
            query: '=query',
            value: '=value'
        },
        link: function link(scope, element, attrs) {
            $(element).select2({
                minimumInputLength: scope.minimumInputLength,
                minimumResultsForSearch: typeof scope.enableSearch === 'undefined' ? undefined : (scope.enableSearch ? undefined : -1),
                allowClear: true,
                query: function (options) {
                    scope.query(options.term, options.page, options.callback);
                    //options.term
                    //options.page
                    //options.callback(result)
                    //result { [{ id, text }, ...], more }
                }
            });
            scope.$watch('value', function (val) {
                if (typeof val === 'undefined') return;

                $(element).select2('data', { id: val.Id, text: val.Name });
            });
        }
    };
});

app.directive('datePicker', function() {
    return {
        restrict: 'A',
        scope: {
            value: '=value'
        },
        link: function link(scope, element, attrs) {
            $(element).datepicker({
                format: 'dd/mm/yyyy',
                autoclose: true,
                todayHighlight: true
            });

            scope.$watch('value', function (val) {
                if (typeof val === 'undefined') return;

                $(element).datepicker('update', val);
                scope.value = $(element).datepicker('getDate');
            });

            //$(element).datepicker().on('changeDate', function (e) { scope.value = e.date; scope.$digest(); });

        },
    };
});