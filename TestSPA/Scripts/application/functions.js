function helpy($http, $q) {
    this.ajaxGet = function (url, params) {
        var deferred = $q.defer();
        $http({
            method: "Get",
            url: url,
            params: params
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (data) {
            deferred.reject(data);
        });
        return deferred.promise;
    }

    this.ajaxDel = function (url, data) {
        var deferred = $q.defer();
        $http({
            method: "DELETE",
            headers : {
              'Content-Type': 'application/json'  
            },
            url: url,
            data: data
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (data) {
            deferred.reject(data);
        });
        return deferred.promise;
    }

    this.ajaxPost = function (url, data) {
        var deferred = $q.defer();
        $http({
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            url: url,
            data: data
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (data) {
            deferred.reject(data);
        });
        return deferred.promise;
    }

    this.ajaxPut = function (url, data) {
        var deferred = $q.defer();
        $http({
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            url: url,
            data: data
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (data) {
            deferred.reject(data);
        });
        return deferred.promise;
    }

    this.updatedQuery = function(queryOptions) {
        var query = this.queryOptions;
        if (queryOptions != null && queryOptions != undefined) {
            for (var prop in queryOptions)
                if (query.hasOwnProperty(prop))
                    query[prop] = queryOptions[prop];
        }
        query['skip'] = query.page * query.take;
        return query;
    }

    this.convertToEntity = function(model, mapping) {
        var entity = {};
        for (var prop in model) {
            entity[mapping[prop]] = model[prop];
        }
        return entity;
    }

    this.convertFromEntity = function(entity, mapping) {
        var model = {};
        for (var prop in entity) {
            model[prop] = entity[mapping[prop]];
        }
        return model;
    }
}
