# ValidaMe
Validame it's a simple and minimalist js validation librabry who integrates popular css frameworks 

# Requirements
- jQuery v2.1.4

# Supported Frameworks
- Foundation 6
- Bootstrap 3.3.6

# Implementation

- In your html input/textarea/select add the tag data-type with the supported type value:

Example:
<input type="number" data-type="number"> 

- On the JS implementation use something like this:

var Checker = new ValidaMe();
if(Checker.validate()) {
	// DO SOMETHING ON THE VALIDATED FORM
}

- See the examples

# Changelog
- 2015/11/28
- Added support to Foundation And Bootstrap