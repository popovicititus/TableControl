'use strict';

app.value('version', '0.0.1');
app.service('projects', function ($http, $q) {
    this.baseUrl = '/api/Project';
    this.queryOptions = {
        page: 0,
        take: 10,
        orderBy: "Id",
        filter: ""
    };
    initializeHelpers = initializeHelpers.bind(this);
    initializeHelpers();

    this.Get = function (id) {
        return this.ajaxGet(this.baseUrl.concat('/Get'), { id: id });
    };

    this.GetSelection = function (mode, items) {
        if (mode == 'none') {
            var deferred = $q.defer();
            deferred.resolve(items);
            return deferred.promise;
        } else if (mode == 'all') {
            return this.ajaxGet(this.baseUrl.concat('/Selection'), { id: id }).then(function (data) {
                var def = $q.defer();
                var ary = [];
                data.forEach(function (item) { ary.push(item); });
                def.resolve(ary);
                return def.promise;
            });
        } else
            throw new Error('Invalid argument \'mode\'.');
    };

    this.Read = function (queryOptions) {
        var query = this.updatedQuery(queryOptions);
        return this.ajaxGet(this.baseUrl.concat('/All'), query);
    };

    this.ReadPage = function (queryOptions) {
        var query = this.updatedQuery(queryOptions);
        return this.ajaxGet(this.baseUrl.concat('/Read'), query);
    };

    this.Add = function (model) {
        return this.ajaxPut(this.baseUrl.concat('/Add'), model);
    };

    this.Update = function (model) {
        return this.ajaxPost(this.baseUrl.concat('/Update'), model);
    };

    this.Delete = function (ids) {
        return this.ajaxDel(this.baseUrl.concat('/Delete'), { ids: ids });
    };

    function initializeHelpers() {
        var helper = helpy.bind(this);
        var helperFunctions = new helper($http, $q);
        this.ajaxGet = helperFunctions.ajaxGet;
        this.ajaxPost = helperFunctions.ajaxPost;
        this.ajaxDel = helperFunctions.ajaxDel;
        this.ajaxPut = helperFunctions.ajaxPut;
        this.updatedQuery = helperFunctions.updatedQuery;
    };

});

app.service('customers', function ($http, $q) {
    this.queryOptions = {
        page: 0,
        take: 10,
        orderBy: "Id",
        filter: ""
    };

    initializeHelpers = initializeHelpers.bind(this);
    initializeHelpers();

    this.ReadLookupPage = function (queryOptions, callback) {
        this.baseUrl = '/api/Customer';
        var query = this.updatedQuery(queryOptions);

        return this.ajaxGet(this.baseUrl.concat('/ReadLookupPage'), query)
            .then(function (data) {
                var def = $q.defer();
                def.resolve({ results: data.Customers, more: (data.Count / 10 - 1) > queryOptions.page, callback: callback });
                return def.promise;
            });
    };

    function initializeHelpers() {
        var helper = helpy.bind(this);
        var helperFunctions = new helper($http, $q);
        this.ajaxGet = helperFunctions.ajaxGet;
        this.ajaxPost = helperFunctions.ajaxPost;
        this.ajaxDel = helperFunctions.ajaxDel;
        this.ajaxPut = helperFunctions.ajaxPut;
        this.updatedQuery = helperFunctions.updatedQuery;
    }
});

app.service('pager', function () {
    var __pages = 5;

    var _records = 0;

    this.PageSize = 10;
    this.PageSizeData = [10, 20, 50, 100];

    this.PagesCount = 0;
    this.FirstPage = -1;
    this.LastPage = -1;
    this.CurrentPage = -1;
    this.PreviousPage = -1;
    this.NextPage = -1;
    this.PagesData = [];

    this.CanPrev = function () { return _records > 0 && this.CurrentPage > 0; };
    this.Can = function (page) { return _records > 0 && page != this.CurrentPage && page >= this.FirstPage && page <= this.LastPage; };
    this.CanNext = function () { return _records > 0 && this.CurrentPage < this.LastPage; };

    // update pager after data load
    this.Update = function (records) {
        if (records <= 0) {
            this.PagesCount = 0;
            this.FirstPage = -1;
            this.LastPage = -1;
            this.CurrentPage = -1;
            this.PreviousPage = -1;
            this.NextPage = -1;
            this.PagesData = [];

            return;
        }

        this.PagesCount = Math.ceil(records / this.PageSize);
        this.FirstPage = 0;
        this.LastPage = this.PagesCount - 1;
        this.CurrentPage = this.CurrentPage == -1 ? 0 : (this.CurrentPage > this.PagesCount ? this.LastPage : this.CurrentPage);
        this.PreviousPage = this.CurrentPage - 1;
        this.NextPage = this.CurrentPage == this.LastPage ? -1 : this.CurrentPage + 1;
        this.PagesData = [];
        var start = Math.max(this.CurrentPage - Math.floor(__pages / 2), this.FirstPage);
        var end = Math.min(start + (__pages - 1), this.LastPage);
        start = Math.max(end - (__pages - 1), this.FirstPage);
        for (var i = start; i <= end; i++)
            this.PagesData.push(i);

        _records = records;
    };

    this.GoFirst = function () {
        if (!this.CanPrev()) return false;

        this.CurrentPage = this.FirstPage;
        this.PreviousPage = -1;
        this.NextPage = this.CurrentPage == this.LastPage ? -1 : this.CurrentPage + 1;
        return true;
    };

    this.GoLast = function () {
        if (!this.CanNext()) return false;

        this.CurrentPage = this.LastPage;
        this.PreviousPage = this.CurrentPage == this.FirstPage ? -1 : this.CurrentPage - 1;
        this.NextPage = -1;
        return true;
    };

    this.GoPrev = function () {
        if (!this.CanPrev()) return false;

        this.CurrentPage--;
        this.PreviousPage = this.CurrentPage == this.FirstPage ? -1 : this.CurrentPage - 1;
        this.NextPage = this.CurrentPage == this.LastPage ? -1 : this.CurrentPage + 1;
        return true;
    };

    this.GoNext = function () {
        if (!this.CanNext()) return false;

        this.CurrentPage++;
        this.PreviousPage = this.CurrentPage == this.FirstPage ? -1 : this.CurrentPage - 1;
        this.NextPage = this.CurrentPage == this.LastPage ? -1 : this.CurrentPage + 1;
        return true;
    };

    this.Go = function (page) {
        if (!this.Can(page)) return false;

        this.CurrentPage = page;
        this.PreviousPage = this.CurrentPage == this.FirstPage ? -1 : this.CurrentPage - 1;
        this.NextPage = this.CurrentPage == this.LastPage ? -1 : this.CurrentPage + 1;
        return true;
    };
});

app.service('selector', function () {
    var _mode = 'none'; // 'none' | 'all'

    this.Items = []; // contains selected or unselected Id's depending on the selection mode
    this.Selected = 0;

    this.Mode = function (mode, count) {
        if (mode == 'none') {
            _mode = 'none';
            this.Items.length = 0;

            this.Selected = 0;
        }
        else if (mode == 'all') {
            _mode = 'all';
            this.Items.length = 0;

            this.Selected = count;
        }
        else
            throw new Error('Invalid argument \'mode\'].');
    };

    this.GetMode = function () { return _mode; };

    this.Update = function (items, count) {
        if (_mode == 'none') {
            for (var i in items) {
                var item = items[i];
                var index = this.Items.indexOf(item.Id);

                if (item.Selected) {
                    if (index == -1)
                        this.Items.push(item.Id);
                }
                else {
                    if (index != -1)
                        this.Items.splice(index, 1);
                }
            }

            this.Selected = this.Items.length;
        }
        else if (_mode == 'all') {
            for (var i in items) {
                var item = items[i];
                var index = this.Items.indexOf(item.Id);

                if (item.Selected) {
                    if (index != -1)
                        this.Items.splice(index, 1);
                }
                else {
                    if (index == -1)
                        this.Items.push(item.Id);
                }
            }

            this.Selected = count - this.Items.length;
        }
    };

    this.IsSelected = function (item) {
        if (_mode == 'none') {
            return this.Items.indexOf(item.Id) != -1;
        }
        else if (_mode == 'all') {
            return this.Items.indexOf(item.Id) == -1;
        }
    };
});