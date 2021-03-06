(function () {
  'use strict';


  /**
   * @ngdoc service
   * @name lwefd.DbService
   * @description
   * # DbService
   * Service in the LWEFD, interface for server API.
   */
  angular.module('lwefd')
    .service('DbService', function ($http) {
      var DbService = {
        addProduct: addProduct,
        getProducts: getProducts,
        getProductSummary: getProductSummary,
        updateProductName: updateProductName,
        deleteProduct: deleteProduct,
        deleteJob: deleteJob,
        deleteRun: deleteRun,
        getJobs: getJobs,
        getRuns: getRuns,
        setForwardUrl: setForwardUrl,
        setRelayNumbers: setRelayNumbers,
        setControlLimits: setControlLimits
      };

      return DbService;

      function addProduct(productName, callback, errorCallback) {
        $http.get('api/create/' + productName).then(callback, errorCallback);
      }

      function getProducts(callback) {
        $http.get('api/getProducts').then(callback,
        function (err) {
          console.log(err);
        });
      }

      function getProductSummary(pid, callback, errorCallback) {
        $http.get('api/' + pid + '/summary').then(callback, errorCallback);
      }

      function updateProductName (id, name, callback, errorCallback) {
        $http.get('api/' + id + '/update/productName/' + name).then(callback, errorCallback);
      }

      function deleteProduct(id, callback, errorCallback) {
        $http.get('api/' + id + '/delete/product').then(callback, errorCallback);
      }

      function deleteJob(pid, jid, callback, errorCallback) {
        $http.get('api/' + pid + '/delete/job/' + jid).then(callback, errorCallback);
      }

      function deleteRun(pid, jid, rid, callback, errorCallback) {
        $http.get('api/'+pid +'/delete/job/'+jid+'/run/' + rid).then(callback, errorCallback);
      }

      function getJobs(id, callback, errorCallback) {
        $http.get('api/' + id + '/jobs').then(callback, errorCallback);
      }

      function getRuns(prodId, id, limit, beginSelectionDate, endSelectionDate, callback, errorCallback) {
        if ((beginSelectionDate === undefined || beginSelectionDate === null) ||
          (endSelectionDate === undefined || endSelectionDate === null)) {
          $http.get('api/' + prodId + '/jobs/' + id + '/' + limit).then(callback, errorCallback);
        } else {
          $http.get('api/' + prodId + '/jobs/' + id + '/range/' + beginSelectionDate + '/' + endSelectionDate).then(callback, errorCallback);
        }
      }

      function setForwardUrl(pid, url, callback, errorCallback) {
        var data = '{"forwardUrl" : "'+url + '"}';
        $http.post('api/' + pid + '/update/forwardUrl', data).then(callback, errorCallback);
      }

      function setRelayNumbers(pid, relayMapping, callback, errorCallback) {
        var data = '{"relayMapping" : "' + relayMapping + '"}';
        $http.post('api/' + pid + '/update/relayMapping', data).then(callback, errorCallback);
      }

      function setControlLimits(pid, jid, upperControlLimit, lowerControlLimit, callback, errorCallback) {
        var data = '{"upperControlLimit" : ' + upperControlLimit + ', "lowerControlLimit": ' + lowerControlLimit + '}';
        $http.post('api/' + pid + '/update/controlLimits/' + jid, data).then(callback, errorCallback);
      }
    });
})();
