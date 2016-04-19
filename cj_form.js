(function() {
  angular.module('cjForm', []).directive('cjForm', function($http, $compile) {
    return {
      replace: true,
      transclude: true,
      template: '<form ng-submit="post()" novalidate ng-transclude></form>',

      scope: {
        path: '@',
        method: '@?',
        wrapper: '@?',
        ngModel: '=',
        errors: '=',
        onSuccess: '=?success',
        onValidationErrors: '=?validationErrors'
      },

      controller: function($scope, $element) {
        $scope.ngModel = $scope.ngModel || {};

        this.modelName  = $element.attr('ng-model');
        this.errorsName = $element.attr('errors');

        $scope.post = function() {
          var params = {};

          // Wrap params if wrapper is present. Example: user[email]
          if ($scope.wrapper) {
            params[$scope.wrapper] = $scope.ngModel;
          } else {
            params = $scope.ngModel;
          }

          $http[$scope.method || 'post']($scope.path, params).then(function(response) {
            if ($scope.onSuccess) {
              $scope.onSuccess(response);
            }
          }, function(response) {
            if (response.status === 422) { // Validation errors
              $scope.errors = response.data;

              if ($scope.onValidationErrors) {
                $scope.onValidationErrors(response);
              }
            }
          });
        };
      }
    };

  }).directive('cjFormField', function($compile) {
    return {
      require: '^cjForm',
      replace: true,
      templateUrl: function(tElement, tAttrs) {
        var form = tElement.parent();
        while (form.prop('tagName') !== 'CJ-FORM') {
          form = form.parent();
        }

        return tAttrs.template || form.attr('cj-form-field-template');
      },

      scope: {
        label: '@',
        type:  '@',
        model: '=',
        attribute: '@',
        errors: '=',
        options: '=?'
      },

      compile: function(tElement, tAttrs, transclude) {
        var form = tElement.parent();
        while (form.prop('tagName') !== 'CJ-FORM') {
          form = form.parent();
        }

        var modelName  = form.attr('ng-model'),
            errorsName = form.attr('errors'),
            attrName   = tAttrs.attribute;

        tAttrs.$set('model', modelName);
        tAttrs.$set('errors', [errorsName, attrName].join('.'));
      }
    }
  });
})();
