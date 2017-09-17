# ValidaMe
Validame it's a simple and minimalist js validation librabry who integrates popular css frameworks 

# Requirements
- jQuery v2.1.4

# Supported Frameworks
- Foundation 6
- Fondation 5 
- Bootstrap 3.3.6

# Implementation

- In your html input/textarea/select add the tag data-type with the supported type value:

- Example:

`<input type="number" data-type="number">`

- On the JS implementation use something like this:

`if(ValidaMe.validate()) {
// DO SOMETHING ON THE VALIDATED FORM
}`

- See the examples

# Supported data-type

* number
* lower_text_only
* text
* text_only
* name
* direccion
* email
* password
* date
* empty
* select
* checkbox
* radio
* select

# Changelog
- 2017/09/17
- Added support to Foundation 5
- Changing the library to Singleton, to a better integration.
- 2015/11/28
- Added support to Foundation And Bootstrap