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
                controller: 'MainController',
                resolve: {
                    postPromise: ['posts', function (posts) {
                        return posts.getAll();
                    }]
                }
            })
            .state('posts', {
                url: '/posts/{id}',
                templateUrl: '/posts.html',
                controller: 'PostsController',
                resolve: {
                    post: ['$stateParams', 'posts', function ($stateParams, posts) {
                        return posts.get($stateParams.id);
                    }]
                }
            });
        $urlRouterProvider.otherwise('home');
    }]);

app.factory('posts', ['$http', function ($http) {
    var o = {
        posts: []
    };
    o.getAll = function () {
        return $http.get('/posts').success(function (data) {
            angular.copy(data, o.posts);
        });
    };
    o.get = function (id) {
        return $http.get('/posts/' + id).then(function (res) {
            return res.data;
        });
    };
    o.create = function (post) {
        return $http.post('/posts', post).success(function (data) {
            o.posts.push(data);
        });
    };
    o.upvote = function (post) {
        return $http.put('/posts/' + post._id + '/upvote')
            .success(function (data) {
                post.upvotes += 1;
            });
    };
    o.downvote = function (post) {
        return $http.put('/posts/' + post._id + '/downvote')
            .success(function (data) {
                post.upvotes -= 1;
            });
    };
    o.addComment = function (id, comment) {
        return $http.post('/posts/' + id + '/comments', comment);
    };

    o.upvoteComment = function(post, comment) {
        return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/upvote')
            .success(function(data){
                comment.upvotes += 1;
            });
    };
    o.downvoteComment = function (post, comment) {
        return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/downvote')
            .success(function(data){
                comment.upvotes -= 1;
            })
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
            //$scope.posts.push({
            //    title: $scope.title,
            //    link: $scope.link,
            //    upvotes: 0,
            //    //fake data for viewing pleasure
            //    comments: [
            //        {author: 'Joe', body: 'Cool post!', upvotes: 0},
            //        {author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
            //    ]
            //});
            posts.create({
                title: $scope.title,
                link: $scope.link
            });
            $scope.title = '';
            $scope.link = '';
        };
        $scope.incrementUpvotes = function (post) {
            posts.upvote(post);
        };
        $scope.decrementUpvotes = function (post) {
            posts.downvote(post);
        };
        $scope.posts = posts.posts;


    }])

    .controller('PostsController', [
        '$scope', 'posts', 'post', function ($scope, posts, post) {
            $scope.post = post;
            //$scope.post = posts.posts[$stateParams.id];

            $scope.addComment = function () {
                if ($scope.body === '') {
                    return;
                }
                posts.addComment(post._id, {
                    body: $scope.body,
                    author: 'user',
                }).success(function (comment) {
                    $scope.post.comments.push(comment);
                });
                $scope.body = '';
            };
            $scope.incrementUpvotes = function(comment){
                posts.upvoteComment(post, comment);
            };
            $scope.decrementUpvotes = function(comment){
                posts.downvoteComment(post, comment);
            };


        }
    ])
;
