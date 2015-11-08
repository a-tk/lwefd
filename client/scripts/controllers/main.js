(function () {
  'use strict';


  /**
   * @ngdoc function
   * @name simpleBlogApp.controller:MainCtrl
   * @description
   * # MainCtrl
   * Controller of the simpleBlogApp
   */
  angular.module('simpleBlogApp')
    .controller('MainCtrl', function ($scope, $http, BlogModel) {
      var vm = this;
      vm.title = 'TestTitle';
      vm.posts = [];
      vm.activate = activate();
      vm.addPost = addPost;
      vm.addComment = addComment;
      vm.deletePost = deletePost;

      function addPost (post) {
        if (post && post.title && post.author && post.content) {
          BlogModel.addPost(post);
          BlogModel.getPosts(populatePosts);
        }
      }

      function addComment (postId, comment) {
        if (postId && comment && comment.author && comment.content) {
          BlogModel.addComment(postId, comment);
          BlogModel.getPosts(populatePosts);
        }
      }

      function deletePost(postId) {
        BlogModel.deletePost(postId);
        BlogModel.getPosts(populatePosts);
      }

      function populatePosts(posts) {
        vm.posts = posts.data;
      }

      function activate() {
        BlogModel.getPosts(populatePosts);
      }
    });
})();
