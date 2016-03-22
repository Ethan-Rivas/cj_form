(function() {
  angular.module('cjForm', []).directive('cjForm', function($http, $compile) {
    return {
      replace: true,
      transclude: true,
      template: '<form ng-submit="post()" novalidate ng-transclude></form>',

      scope: {
        ngModel: '=',
        path: '@',
        errors: '=',
        onSuccess: '=?success',
        onValidationErrors: '=?validationErrors'
      },

      compile: function(tElement, tAttrs, transclude) {
        if (!tAttrs.ngModel) {
          tAttrs.$set('ngModel', 'model');
        }

        if (!tAttrs.errors) {
          tAttrs.$set('errors', 'errors');
        }
      },

      controller: function($scope, $element) {
        $scope.ngModel = $scope.ngModel || {};

        this.modelName  = $element.attr('ng-model');
        this.errorsName = $element.attr('errors');

        $scope.post = function() {
          $http.post($scope.path, $scope.ngModel).then(function(response) {
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
        return tAttrs.template || tElement.parent().attr('cj-form-field-template');
      },

      scope: {
        label: '@',
        type:  '@',
        value: '=',
        errors: '='
      },

      link: function(scope, element, attrs, cjForm) {
        if (attrs.attribute) {
          element.removeAttr('attribute');
          element.attr({
            value: [cjForm.modelName, attrs.attribute].join('.'),
            errors: [cjForm.errorsName, attrs.attribute].join('.')
          });

          $compile(element)(scope.$parent);
        }
      }
    }
  });
})();
