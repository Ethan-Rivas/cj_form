# cjForm

Small Angular form directive intended to handle submission and server validation errors,
as well as boilerplate from reusing form field's layouts.

## Usage

```
<cj-form path="/api/v1/registration"
  [ng-model="user"]
  [errors="userErrors"]
  [success="redirect"]
  [validation-errors="showErrors"]
  [cj-form-field-template="/cj-form/cj-form-field-template.html">

  <cj-form-field attribute="email"
    [type="text"]
    [label="Email"]
    [template="/cj-form/cj-form-field-custom-template.html"]>

    <label ng-bind="label"></label>
    <input type="text" ng-model="value">

    <ul ng-show="errors.length > 0">
     <li ng-repeat="error in errors" ng-bind="error.message"></li>
    </ul>
  </cj-form-field>

</cj-form>
```

being:

- `path`: API gateway where to `POST` the form's data to.

- `ng-model`: If you need to preload the form or to use the entered data outside
the form, you can provide a `$scope` variable to two-way bind the data.

- `errors`: Same as in `ng-model`. User it if you need the errors array available
outside the form.

- `success`: Callback function to be called when data is correctly saved and server
returns status `200`. `$http`'s `response` will be passed as argument.

- `validation-errors`: Callback function to be called when data is not saved
because of validation errors and server returns status `422`. `$http`'s `response`
will be passed as argument.

- `cj-form-field-template`: Form Field template's url. You can assign a template
for either the entire form or each `cj-form-field` individually. However, is it
mandatory to define at least one.

And then, for each individual `cj-form-field`:

- `attribute`: The attribute to two-way bind data entered by user. For example, if
`cj-form`'s `ng-model="user"` and `attribute="email"`, data will be saved in
`$scope.user.email`.

- `type`, `label`: Will be passed to be available inside the `cj-form-field`'s template.

- `template`: Template for this specific `cj-form-field`. In case you need a different
one from the `cj-form`'s `cj-form-field-template`.

 Example of `cj-form-field-template`:

```
<div ng-class="{'error': errors.length > 0}" class="form-field">
  <label class="col-md-6" ng-bind="label"></label>

  <input class="col-md-6" ng-attr-type="{{type}}" ng-model="value">

  <ul class="error-messages col-md-12">
    <li ng-repeat="error in errors" ng-bind="error"></li>
  </ul>
</div>
```
