/**
 * Created by jeff on 9/6/2015.
 */

var app = angular.module('flapperNews', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: '/home.html',
                controller: 'MainController'
            })
            .state('posts', {
                url: '/posts/{id}',
                templateUrl: '/posts.html',
                controller: 'PostsController'
            });
        $urlRouterProvider.otherwise('home');
    }]);

app.factory('posts', [function () {
    var o = {
        posts: []
    };
    return o
}]);

app.controller('MainController', [
    '$scope',
    'posts',
    function ($scope, posts) {
        $scope.test = 'Hello world!';
        //$scope.posts = [
        //    {title: 'post 1', upvotes: 5},
        //    {title: 'post 2', upvotes: 2},
        //    {title: 'post 3', upvotes: 15},
        //    {title: 'post 4', upvotes: 9},
        //    {title: 'post 5', upvotes: 4}
        //];
        $scope.addPost = function () {
            if (!$scope.title || $scope.title === '') {
                return;
            }
            //$scope.posts.push({title: $scope.title, link: $scope.link, upvotes: 0});
            $scope.posts.push({
                title: $scope.title,
                link: $scope.link,
                upvotes: 0,
                //fake data for viewing pleasure
                comments: [
                    {author: 'Joe', body: 'Cool post!', upvotes: 0},
                    {author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
                ]
            });
            $scope.title = '';
            $scope.link = '';
        };
        $scope.incrementUpvotes = function (post) {
            post.upvotes += 1;
        };
        $scope.decrementUpvotes = function (post) {
            if (post.upvotes > 0) {
                post.upvotes -= 1;
            }
        };
        $scope.posts = posts.posts
    }])

    .controller('PostsController', [
        '$scope', '$stateParams', 'posts', function ($scope, $stateParams, posts) {
            $scope.post = posts.posts[$stateParams.id];
            $scope.addComment = function () {
                if ($scope.body === '') {
                    return;
                }
                $scope.post.comments.push({
                    body: $scope.body,
                    author: 'user',
                    upvotes: 0
                });
                $scope.body = '';
            }
        }
    ])
;
