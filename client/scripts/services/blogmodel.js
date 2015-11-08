(function () {
  'use strict';


  /**
   * @ngdoc service
   * @name simpleBlogApp.BlogModel
   * @description
   * # BlogModel
   * Service in the simpleBlogApp.
   */
  angular.module('simpleBlogApp')
    .service('BlogModel', function ($http) {
      var BlogModel = {
        getPosts: getPosts,
        addPost:addPost,
        deletePost: deletePost,
        addComment: addComment
      };

      return BlogModel;

      function getPosts(callback) {
        $http.get('api/getPosts').then(callback,
        function (err) {
          console.log(err);
        });
      }

      function addPost(post) {
        $http.post('api/addPost/', post).then(function (response) {
          console.log(response);
        }, function (response) {
          console.log(response);
        });
      }


      function addComment(postId, comment) {
        $http.post('api/addComment/'+ postId, comment).then(function (response) {
          console.log(response);
        }, function (response) {
          console.log(response);
        });
      }

      function deletePost(postId) {
        $http.get('api/deletePost/'+ postId).then(function (response) {
          console.log(response);
        }, function (response) {
          console.log(response);
        });
      }

    });
})();
