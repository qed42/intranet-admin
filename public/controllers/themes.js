'use strict';

angular.module('mean.mean-admin').controller('ThemesController', ['$scope', 'Global', '$rootScope', '$http',
  function($scope, Global, $rootScope, $http) {
    $scope.global = Global;
    $scope.themes = [];
    $scope.customThemes = [];
    $scope.init = function() {
      $http({
        method: 'GET',
        url: 'http://api.bootswatch.com/3/'
      }).
      success(function(data, status, headers, config) {
        $scope.themes = data.themes;
      }).
      error(function(data, status, headers, config) {

      });
      $http.get('admin/themes/customThemes').
      success(function(data, status, headers, config) {
        if (data)
          $scope.customThemes = data.config;
      }).
      error(function(data, status, headers, config) {
        alert('error');
        $('.progress-striped').hide();

      });
    };
    $scope.changeTheme = function(theme) {
      // Will add preview options soon
      // $('link').attr('href', theme.css);
      // $scope.selectedTheme = theme;
      $('.progress-striped').show();

      $http.get('/admin/themes?theme=' + theme.css).
      success(function(data, status, headers, config) {
        if (data)
          window.location.reload();
      }).
      error(function(data, status, headers, config) {
        alert('error');
        $('.progress-striped').hide();

      });
    };

    $scope.defaultTheme = function() {
      $http.get('/admin/themes/defaultTheme').
      success(function(data, status, headers, config) {
        if (data)
          window.location.reload();
      }).
      error(function(data, status, headers, config) {
        alert('error');
      });
    };
    $scope.changeCustomTheme = function(theme) {
      var theme_name = theme.name;
      // var theme_add = window.location.origin + theme.css;
      //Will add preview options soon
      // $('link').attr('href', theme.css);
      // $scope.selectedTheme = theme;
      // $('.progress-striped').show();
      // console.log(theme_add);
      // $http.get('/admin/themes?theme=' + theme_add).
      // success(function(data, status, headers, config) {
      //   if (data)
      //     console.log('true');
      //   window.location.reload();
      // }).
      // error(function(data, status, headers, config) {
      //   alert('error');
      //   $('.progress-striped').hide();
      //   console.log('false');

      // });
      if (theme === 'default') {
        $http.get('/admin/themes/custom_update?fileName=base/bootswatch_themes/red/red.css').
        success(function(output, status, headers, config) {
          window.location.reload();
          if (output)
            console.log(output);
        }).
        error(function(data, status, headers, config) {
          alert('error');
          $('.progress-striped').hide();
          console.log('false');

        });
        theme_name = 'red';
      } else {
        $http.get('/admin/themes/custom_update?fileName=' + theme.common_css).
        success(function(output, status, headers, config) {
          window.location.reload();
          if (output)
            console.log(output);
        }).
        error(function(data, status, headers, config) {
          alert('error');
          $('.progress-striped').hide();
          console.log('false');

        });
      }
      // update file for current theme variable
      $http.get('/admin/themes/set_theme?theme_name=' + theme_name).
      success(function(output, status, headers, config) {
        window.location.reload();
        if (output)
          console.log(output);
      }).
      error(function(data, status, headers, config) {
        alert('error');
        $('.progress-striped').hide();
        console.log('false');
      });
    };
  }
]);
