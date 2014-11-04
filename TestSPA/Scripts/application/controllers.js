'use strict';

app.controller('ProjectsController', [
    '$scope', '$http', '$location', '$filter', 'projects', 'pager', 'selector', function($scope, $http, $location, $filter, projectsService, pager, selector) {
        $scope.new = function () {
            BeginNew();
        };

        $scope.edit = function() {
            BeginEdit();
        };

        $scope.refresh = function () {
            BeginLoad();
        };

        $scope.select_view = function(view) {
            $scope.currentView = view;
            BeginLoad();
        };

        $scope.page = function(page) {
            if (pager.Go(page))
                BeginLoad();
        };
        $scope.prev_page = function() {
            if (pager.GoPrev())
                BeginLoad();
        };
        $scope.next_page = function() {
            if (pager.GoNext())
                BeginLoad();
        };
        $scope.first_page = function() {
            if (pager.GoFirst())
                BeginLoad();
        };
        $scope.last_page = function() {
            if (pager.GoLast())
                BeginLoad();
        };
        $scope.page_size = function(size) {
            pager.PageSize = size;
            pager.Update($scope.rowCount);
            BeginLoad();
        };
        $scope.sort_field = function(sortField) {
            $scope.currentView.Sort(sortField);
            BeginLoad();
        };
        $scope.search = function() {
            var filter = null;
            if ($scope.searchText.trim().length == 0)
                filter = null;
            else
                filter = $scope.searchText.trim();
            if ($scope.filter != filter) {
                $scope.filter = filter;
                pager.GoFirst();
                BeginLoad();
            }
        };
        $scope.search_keypress = function(event) {
            if (event.charCode == 13)
                $scope.search();
        };
        $scope.select_all = function() {
            $scope.projects.forEach(function(item) { item.Selected = true; });
            selector.Mode('all', $scope.rowCount);
        };
        $scope.unselect_all = function() {
            $scope.projects.forEach(function(item) { item.Selected = false; });
            selector.Mode('none', $scope.rowCount);
        };
        $scope.selection_change = function() {
            selector.Update($scope.projects, $scope.rowCount);
        };
        $scope.display_field = function(item, field) {
            return field.Display(item, $scope.filter, $filter);
        };
        $scope.record_from = function() {
            if (pager.CurrentPage == -1)
                return 0;
            else
                return pager.CurrentPage * pager.PageSize;
        };
        $scope.record_to = function() {
            return $scope.record_from() + $scope.projects.length;
        };
        //Custom configuration
        $scope.Configure = function(configuration) {
            if (typeof configuration != 'undefined') {
                for (var prop in configuration)
                    if ($scope.hasOwnProperty(prop))
                        if (typeof $scope[prop] == "function") {
                            $scope[prop](configuration[prop]);
                        } else {
                            $scope[prop] = configuration[prop];
                        }
            }
            RefreshView();
        };

        $scope.delete = function() {
            projectsService.Delete($scope.projects.filter(function(row) {
                    return row.Selected;
                }).map(function(row) {
                    return row.Id;
                }))
                .then(BeginLoad, OnQueryError)
                .finally(RefreshView);
        };

        function Initialize() {
            $scope.isLoading = false;
            $scope.status = '';

            $scope.searchText = '';
            $scope.filter = null;
            $scope.views = [
                new View(
                {
                    Name: 'default',
                    Caption: 'Default',
                    Fields: [
                        new LinkField({ Name: 'Name', Caption: 'Project Name', Url: '#/project-view?id={Id}', Filterable: true }),
                        new Field({ Name: 'Start', Caption: 'Start', Format: { Filter: 'date', Format: 'EEEE, d MMM yyyy' }, SortIndex: 0, SortOrder: 'desc' }),
                        new Field({ Name: 'End', Caption: 'End', Format: { Filter: 'date', Format: 'EEEE, d MMM yyyy' } }),
                        new Field({ Name: 'Status', Caption: 'Status' })
                    ]
                }),
                new View({ Name: '-' }),
                new View(
                {
                    Name: 'active',
                    Caption: 'Active Projects',
                    Fields: [
                        new LinkField({ Name: 'Name', Caption: 'Project Name', Url: '#/project-view?id={Id}', Filterable: true }),
                        new Field({ Name: 'Start', Caption: 'Start', Format: { Filter: 'date', Format: 'EEEE, d MMM yyyy' }, SortIndex: 0, SortOrder: 'desc' }),
                        new Field({ Name: 'End', Caption: 'End', Format: { Filter: 'date', Format: 'EEEE, d MMM yyyy' } }),
                        new LinkField({ Name: 'Customer_Name', Caption: 'Customer', Url: '#/customer-view?id={?}', Filterable: true })
                    ],
                    Criteria: 'Status = 1'
                })
            ];
            $scope.currentView = $scope.views[0];

            $scope.pager = pager;
            $scope.selector = selector;

            $scope.rowCount = 0;
            $scope.projects = [];
        }

        function BeginLoad() {
            $scope.isLoading = true;
            $scope.status = 'loading project list...';
            $scope.rowCount = 0;

            try {
                var order = [];
                var orderFields = $scope.currentView.SortedFields();
                for (var f in orderFields)
                    order.push(Project.Mapping[orderFields[f].Name] + ' ' + orderFields[f].SortOrder);

                var filter = [];
                if ($scope.filter != null) {
                    var filterFields = $scope.currentView.FilterFields();
                    for (var f in filterFields)
                        filter.push({ Field: Project.Mapping[filterFields[f].Name], Value: $scope.filter });
                }

                projectsService.ReadPage({
                        filter: filter,
                        orderBy: order.join(', '),
                        page: pager.CurrentPage,
                        take: pager.PageSize
                    })
                    .then(OnProjectsRead, OnQueryError)
                    .finally(RefreshView);
            } catch (e) {
                //TODO handle it
                throw e;
            }
        }

        function OnProjectsRead(data) {
            var dataRows = data.Projects;
            var dataCount = data.Count;

            var items = [];
            var statuses = ['Planned', 'In progress', 'Completed', 'Cancelled'];
            dataRows.forEach(function(project) { items.push(new Project(project.Id, selector.IsSelected(project), project.Name, project.From, project.To, statuses[project.Status], project.Customer.Name)); });

            $scope.isLoading = false;
            $scope.status = 'finished loading ' + items.length + ' projects';
            $scope.rowCount = dataCount;
            $scope.projects = items;

            // update the pager
            pager.Update($scope.rowCount);
        }

        function OnQueryError(error) {
            $scope.status = 'error';
        }

        function RefreshView() {
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        }

        function BeginNew() {
            $scope.status = 'loading project...';
            $location.url('/project-new');
        }

        function BeginEdit() {
            $scope.isLoading = true;
            $scope.status = 'loading project...';

            projectsService.GetSelection(selector.GetMode(), selector.Items)
                .then(OnEdit, OnQueryError)
                .finally(RefreshView);
        }

        function OnEdit(data) {
            $scope.isLoading = false;
            $scope.status = 'finished loading id\'s';

            if (data.length > 0) {
                $location.url('/project-edit?id=' + data[0].toString());
            }
        }

        Initialize();
        BeginLoad(0, 10);
    }
]);

app.controller('ProjectViewController', [
    '$scope', '$http', '$routeParams', 'projects', function($scope, $http, $params, projectsService) {
        $scope.status = 'loading project ' + $params.id;

        projectsService.Get($params.id).
            then(OnProjectGet, OnQueryError)
            .finally(RefreshView);

        $scope.view = new DetailView({
            Name: 'ProjectEdit',
            Fields: {
                Name: new DetailViewField({
                    Name: 'Name',
                    Caption: 'Project Name:'
                }),
                Status: new DetailViewField({
                    Name: 'Status',
                    Caption: 'Status:'
                }),
                Start: new DetailViewField({
                    Name: 'Start',
                    Caption: 'Start Date:'
                }),
                End: new DetailViewField({
                    Name: 'End',
                    Caption: 'End Date:'
                }),
                Customer: new DetailViewField({
                    Name: 'Customer',
                    Caption: 'Customer:'
                })
            }
        });

        function OnProjectGet(data) {
            $scope.status = 'finished loading';
            $scope.project = data == undefined || data == {} ? null : data;
        }

        function OnQueryError(error) {
            $scope.status = error;
        }

        function RefreshView() {
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        }

    }
]);

app.controller('ProjectEditController', [
    '$scope', '$http', '$routeParams', '$filter', 'projects', 'customers', function($scope, $http, $params, $filter, projectsService, customersService) {

        function Initialize() {
            $scope.isLoading = false;
            $scope.status = '';

            $scope.update = function() {
                var entity = helper.convertToEntity($scope.project, Project.Mapping);
                projectsService.Update(entity);
            }

            $scope.view = new DetailView({
                Name: 'ProjectEdit',
                Fields: {
                    Name: new DetailViewField({
                        Name: 'Name',
                        Caption: 'Project Name:'
                    }),
                    Status: new DetailViewField({
                        Name: 'Status',
                        Caption: 'Status:'
                    }),
                    Start: new DetailViewField({
                        Name: 'Start',
                        Caption: 'Start Date:'
                    }),
                    End: new DetailViewField({
                        Name: 'End',
                        Caption: 'End Date:'
                    }),
                    Customer: new DetailViewField({
                        Name: 'Customer',
                        Caption: 'Customer:'
                    })
                }
            });

            $scope.lookupCustomers = function(term, page, callback) {
                var queryOptions = {
                    page: page - 1,
                    filter: term
                }
                customersService.ReadLookupPage(queryOptions, callback).
                    then(OnCustomersLookupRead, function() {})
                    .finally(function() {});
            };

            $scope.project = null;
            var helper = new helpy();
        }

        function BeginLoad() {
            $scope.isLoading = true;
            $scope.status = 'loading project ' + $params.id;

            projectsService.Get($params.id).
                then(OnProjectGet, OnQueryError)
                .finally(RefreshView);
        }

        function OnProjectGet(data) {
            $scope.status = 'finished loading';

            var item = data == undefined || data == {} ? null : data;
            if (item == null) {
                // error
            } else {
                $scope.project = new ProjectEditModel(item.Id, item.Name, $filter('date')(item.From, 'dd/mm/yyyy'), $filter('date')(item.To, 'dd/mm/yyyy'), item.Status, { Id: item.Customer.Id, Name: item.Customer.Name });
            }
        }

        function OnQueryError(error) {
            $scope.status = 'error';
        }

        function RefreshView() {
            $scope.isLoading = false;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        }

        function OnCustomersLookupRead(data) {
            var ary = [];
            data.results.forEach(function(item) { ary.push({ id: item.Id, text: item.Name }) });
            data.callback({ results: ary, more: data.more });
        }

        Initialize();
        BeginLoad();
    }
]);

app.controller('ProjectNewController', ['$scope', '$http', '$routeParams', '$filter', 'projects', 'customers', function ($scope, $http, $params, $filter, projectsService, customersService) {
        function Initialize() {
            $scope.isLoading = false;
            $scope.status = '';

            $scope.add = function () {
                var entity = helper.convertToEntity($scope.project, Project.Mapping);
                projectsService.Add(entity);
            }

            $scope.view = new DetailView({
                Name: 'ProjectEdit',
                Fields: {
                    Name: new DetailViewField({
                        Name: 'Name',
                        Caption: 'Project Name:'
                    }),
                    Status: new DetailViewField({
                        Name: 'Status',
                        Caption: 'Status:'
                    }),
                    Start: new DetailViewField({
                        Name: 'Start',
                        Caption: 'Start Date:'
                    }),
                    End: new DetailViewField({
                        Name: 'End',
                        Caption: 'End Date:'
                    }),
                    Customer: new DetailViewField({
                        Name: 'Customer',
                        Caption: 'Customer:'
                    })
                }
            });

            $scope.lookupCustomers = function (term, page, callback) {
                var queryOptions = {
                    page: page - 1,
                    filter: term
                }
                customersService.ReadLookupPage(queryOptions, callback).
                    then(OnCustomersLookupRead, function () { })
                    .finally(function () { });
            };

            $scope.project = null;
            var helper = new helpy();
            $scope.project = new ProjectEditModel();
            $scope.project.Start = $filter('date')(new Date(), 'dd/MM/yyyy');
            $scope.project.End = $filter('date')(new Date(), 'dd/MM/yyyy');
        }

        function BeginLoad() {
            $scope.isLoading = true;
            $scope.status = 'loading project ' + $params.id;
            RefreshView();
        }

        function RefreshView() {
            $scope.isLoading = false;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        }

        function OnCustomersLookupRead(data) {
            var ary = [];
            data.results.forEach(function (item) { ary.push({ id: item.Id, text: item.Name }); });
            data.callback({ results: ary, more: data.more });
        }

        Initialize();
        BeginLoad();
    }]);

function Project(id, selected, name, start, end, status, customer_name) {
    this.Id = id;
    this.Selected = selected;

    this.Name = name;
    this.Start = start;
    this.End = end;
    this.Status = status;
    this.Customer_Name = customer_name;
}

Project.Mapping = { Id: 'Id', Name: 'Name', Start: 'From', End: 'To', Status: 'Status', Customer_Name : 'Customer.Name' };

function ProjectEditModel(id, name, start, end, status, customer) {
    this.Id = id;

    this.Name = name;
    this.Start = start;
    this.End = end;
    this.Status = status;
    this.Customer = customer;

    this.StatusList = [];
}

//#region Views

function View(config) {
    this.Name = null;
    this.Caption = null;
    this.Style = {
        Stripped: true,
        Hover: true
    };

    this.Fields = [];
    this.Criteria = null;

    if (typeof config != 'undefined') {
        for (var prop in config)
            if (this.hasOwnProperty(prop))
                this[prop] = config[prop];
    }

    this.Sort = function (field) {
        for (var f in this.Fields) {
            var item = this.Fields[f];
            if (item === field) {
                item.SortIndex = 0;
                item.SortOrder = item.SortOrder == 'asc' ? 'desc' : 'asc';
            }
            else {
                item.SortIndex = -1;
                item.SortOrder = 'asc';
            }
        }
    };

    this.SortedFields = function () {
        var result = [];
        for (var f in this.Fields) {
            var item = this.Fields[f];
            if (item.SortIndex >= 0)
                result.push(item);
        }
        return result.sort(function (a, b) { return a.SortIndex - b.SortIndex; });
    };

    this.FilterFields = function () {
        var result = [];
        for (var f in this.Fields) {
            var item = this.Fields[f];
            if (item.Filterable)
                result.push(item);
        }
        return result;
    };
}

function Field(config) {
    this.Name = null;
    this.Caption = null;
    this.Format = null; // { Filter: '<date|currency|number|custom>', Format: '<format_string>' }
    this.Width = 0;
    this.Align = 'auto'; // 'auto', 'left', 'right'
    this.Style = {
        Color: null,
        Background: null
    };

    this.Sortable = true;
    this.Filterable = false;

    this.SortIndex = -1;
    this.SortOrder = 'asc'; // 'asc', 'desc'

    if (typeof config != 'undefined') {
        for (var prop in config)
            if (this.hasOwnProperty(prop))
                this[prop] = config[prop];
    }

    this.Display = function (item, highlight, $filter) {
        var value = item[this.Name];
        var display = '';

        if (this.Format == null)
            display = value.toString();
        else
            display = $filter(this.Format.Filter)(value, this.Format.Format);

        if (highlight != null)
            display = display.replace(highlight, '<span class=\'highlight\'>' + highlight + '</span>');

        return display;
    };
}

// Fields that are hyperlinks
function LinkField(config) {
    Field.apply(this); // extends Field class

    this.Url = '#';

    if (typeof config != 'undefined') {
        for (var prop in config)
            if (this.hasOwnProperty(prop))
                this[prop] = config[prop];
    }

    this.Super_Display = this.Display;
    this.Display = function (item, highlight, $filter) {
        return '<a href=\'' + replace(this.Url, item) + '\'>' + this.Super_Display(item, highlight, $filter) + '</a>';
    };

    function replace(text, item) {
        var result = text;
        for (var property in item)
            result = result.replace('{' + property + '}', item[property].toString());
        return result;
    }
}

//#endregion

//#region 

function DetailView(config) {
    this.Name = null;

    this.Fields = {};

    if (typeof config != 'undefined') {
        for (var prop in config)
            if (this.hasOwnProperty(prop))
                this[prop] = config[prop];
    }
}

function DetailViewField(config) {
    this.Name = null;
    this.Caption = null;
    this.Style = {
        Color: null,
        Background: null
    };

    if (typeof config != 'undefined') {
        for (var prop in config)
            if (this.hasOwnProperty(prop))
                this[prop] = config[prop];
    }
}

//#endregion