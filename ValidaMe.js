/*!
 * ValidaMe
 *
 * ValidaMe it's a simple js form validation who integrates
 * The most popular CSS Frameworks.
 *
 * Actually Integrates:
 *
 * - Foundation 6
 * - Foundation 5
 * - Bootstrap 3.3.6
 * --------------------------------------------------------
 *
 * @author Mauricio Beltran <mauricio.beltran@usolix.cl>
 * @version 0.4.0
 * @license GPL v2.0
 *
 */

var ValidaMe = {}

/**
 * Library configuration
 * @type {Object}
 */
ValidaMe.configuration = {
    mark: 'data-type',
    frame: 'Foundation'
}


ValidaMe.init = function(custom_config) {
    for (var i in custom_config) {
        ValidaMe.configuration[i] = custom_config[i];
    }

    /**
     * Group of verified radio
     * @type {Array}
     */
    ValidaMe.radio_verified = new Array();

    /**
     * Group of verified checkbox
     * @type {Array}
     */
    ValidaMe.checkbox_verified = new Array();

    /**
     * Response of tthe actual validation
     * @type {Boolean}
     */
    ValidaMe.state = true;
}

/**
 * Supported RegEx
 * @type {Object}
 */
ValidaMe.expressions = {
    number: /^[\-]{0,1}[0-9]+$/,
    lower_text_only: /^[a-z]+$/,
    text: '',
    weight: '',
    text_only: /^[a-zA-Z\ \.\,\;\'ñÑáéíóúÁÉÍÓÚüÜ]+$/,
    name: /^[a-zA-Z\ \'ñÑáéíóúÁÉÍÓÚüÜ]+$/,
    email: /^[a-z]*[a-zA-Z0-9\_\-\.]+\@([a-z0-9]+(\.)*)+(\.[a-z]{1,3})+$/,
    password: /.*^(?=.{4,10})(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/,
    address: /^[a-zA-Z0-9\ \,\#\'\°ñÑáéíóúÁÉÍÓÚüÜ']+$/,
    date: /^[0-9]{2}[\-\/]{1}[0-9]{2}[\-\/]{1}[0-9]{4}$/
}

/**
 * Supported default errors
 * @type {Object}
 */
ValidaMe.common_errors = {
    number: 'Enter a valid number',
    lower_text_only: 'You must enter only lower case text',
    text: '',
    text_only: 'Invalid characters',
    name: 'You must enter name base text',
    direccion: 'You must enter a valid address',
    email: 'You must enter a valid email',
    password: 'Your password doesn\'t fullfill minimun requirements (4 minimun, 10 maximun, at least one lower case char, one upper case char, one number and one special character)',
    date: 'Invalid date format (dd-mm-aaaa or dd/mm/aaaa)',
    empty: 'This field cannot be empty',
    select: 'You must select a valid option',
    checkbox: 'You must check one of them',
    radio: 'You must check one of them',
    select: 'You must select one option'
};

/**
 * Main method
 * @return {Boolean} true if pass, false otherwise
 */
ValidaMe.validate = function() {
    ValidaMe.init();
    ValidaMe.cleanError();
    $(document).find('[' + ValidaMe.configuration.mark + ']').each(function() {
        ValidaMe.checkElement($(this));
    });
    if (ValidaMe.state == false) {
        ValidaMe.focusError();
    };
    return ValidaMe.state;
}

/**
 * Check the element
 * @param  {Object} element Html element
 * @return {Void}
 */
ValidaMe.checkElement = function(element) {
    var element_implement = element[0].localName;
    var element_type = element[0].type;
    if (element_implement == 'select') {
        ValidaMe.verifySelect(element);
    } else if (element_type == 'radio') {
        ValidaMe.verifyRadio(element);
    } else if (element_type == 'checkbox') {
        ValidaMe.verifyCheckbox(element);
    } else if (element_type == 'textarea') {
        ValidaMe.verifyInput(element);
    } else if (element_implement == 'input') {
        ValidaMe.verifyInput(element);
    };
}

/**
 * Begin validation process of a checkbox, setting state
 * @param  {Object} element Html element
 * @return {Void}
 */
ValidaMe.verifyCheckbox = function(element) {
    var type = element.attr(ValidaMe.configuration.mark);
    var checkbox_name = element[0].name;
    if (ValidaMe.checkbox_verified.indexOf(checkbox_name) == -1) {
        ValidaMe.checkbox_verified.push(checkbox_name);
        var checkbox_checked = false;
        $('[name="' + checkbox_name + '"]').each(function() {
            if ($(this).is(":checked")) {
                checkbox_checked = true;
            };
        });

        if (!checkbox_checked) {
            ValidaMe.printError(element, type);
            ValidaMe.state = false;
        };
    };
}

/**
 * Begin validation process of a radio, setting state
 * @param  {Object} element Html element
 * @return {Void}
 */
ValidaMe.verifyRadio = function(element) {
    var type = element.attr(ValidaMe.configuration.mark);
    var radio_name = element[0].name;
    if (ValidaMe.radio_verified.indexOf(radio_name) == -1) {
        ValidaMe.radio_verified.push(radio_name);
        var radio_checked = false;
        $('[name="' + radio_name + '"]').each(function() {
            if ($(this).is(":checked")) {
                radio_checked = true;
            };
        });

        if (!radio_checked) {
            ValidaMe.printError(element, type);
            ValidaMe.state = false;
        };
    };
},

/**
 * Verify the select state
 * @param  {Object} element Html object
 * @return {Void}
 */
ValidaMe.verifySelect = function(element) {
    var type = element.attr(ValidaMe.configuration.mark);
    if (element.val() == 0) {
        ValidaMe.printError(element, type);
        ValidaMe.state = false;
    };
},

/**
 * Verify a standar input
 * @param  {Object} element Html element
 * @return {Void}
 */
ValidaMe.verifyInput = function(element) {
    var content = element.val().trim();
    var type = element.attr(ValidaMe.configuration.mark);
    try {
        ValidaMe.verifyEmpty(content, element);
        ValidaMe.verifyType(element);
    } catch (err) {
        ValidaMe.state = err;
    }
},

/**
 * Verify if the element is empty
 * @param  {String} content content of the input
 * @param  {Object} element Html element
 * @return {Void}
 */
ValidaMe.verifyEmpty = function(content, element) {
    if (content.length == 0) {
        ValidaMe.printError(element, 'empty');
        throw false;
    };
},

/**
 * Verify the type value of an input
 * @param  {Object} element Html element
 * @return {Void}
 */
ValidaMe.verifyType = function(element) {
    var content = element.val().trim();
    var type = element.attr(ValidaMe.configuration.mark);
    if (!content.match(ValidaMe.expressions[type])) {
        ValidaMe.printError(element, type);
        throw false;
    };
},

/**
 * Main method of print error
 * @param  {Object} element    Html element
 * @param  {String} type_error Type of error fired
 * @return {Void}
 */
ValidaMe.printError = function(element, type_error) {
    eval('ValidaMe.printError' + ValidaMe.configuration.frame + '(element, type_error)');
},

/**
 * Clean justified errors
 * @return {Void}
 */
ValidaMe.cleanError = function() {
    eval('ValidaMe.cleanError' + ValidaMe.configuration.frame + '()');
},

/**
 * Focus on the first error fired
 * @return {Void}
 */
ValidaMe.focusError = function() {
    eval('ValidaMe.focusError' + ValidaMe.configuration.frame + '()');
},

/**
 * Print error in Foundation 5 style
 * @param  {object} element    html object
 * @param  {string} type_error type to validate
 * @return {void}            
 */
ValidaMe.printErrorFoundation5 = function(element, type_error) {
    var error_message = ValidaMe.common_errors[type_error];

    if (element[0].type == 'radio' || element[0].type == 'checkbox') {
        $(element).first().parent().append("<small class='error'>Error: " + error_message + "</small>");
    } else {
        $(element).parent().addClass("error");
        $(element).parent().parent().append("<small class='error'>Error: " + error_message + "</small>");
    }
},


/**
 * Clean the generated error
 * @return {void}
 */
ValidaMe.cleanErrorFoundation5 = function() {
    $("label").removeClass("error");
    $("small").remove();
},

/**
 * Focus on the very first error
 * @return {boolean} false
 */
ValidaMe.focusErrorFoundation5 = function() {
    $('html, body').animate({
        scrollTop: ($('.error').first().offset().top)
    }, 500);
    return false;
}

/**
 * Print error in Foundation 6 style
 * @param  {object} element    html object
 * @param  {string} type_error type to validate
 * @return {void}            
 */
ValidaMe.printErrorFoundation = function(element, type_error) {
    var error_message = ValidaMe.common_errors[type_error];
    $(element).parent().addClass("is-invalid-label");
    $(element).addClass("is-invalid-input");
    $(element).parent().append("<span class='form-error is-visible'>Error: " + error_message + "</span>");
}

/**
 * Clean the generated error
 * @return {void}
 */
ValidaMe.cleanErrorFoundation = function() {
    $("label, fieldset").removeClass("is-invalid-label");
    $("input, textarea, select").removeClass("is-invalid-input");
    $(".form-error").remove();
}

/**
 * Focus on the very first error
 * @return {boolean} false
 */
ValidaMe.focusErrorFoundation = function() {
    $('html, body').animate({
        scrollTop: ($('.is-invalid-label').first().offset().top)
    }, 500);
    return false;
}

/**
 * Print error in Bootstrap 3 style
 * @param  {object} element    html object
 * @param  {string} type_error type to validate
 * @return {void}            
 */
ValidaMe.printErrorBootstrap = function(element, type_error) {
    var error_message = ValidaMe.common_errors[type_error];
    if (type_error == 'checkbox') {
        $(element).parent().parent().addClass("has-error");
        $(element).parent().parent().append("<label class='control-label' for='inputError'>" + error_message + "</label>");
    } else if (type_error == 'radio') {
        var radio_name = element[0].name;
        $('[name="' + radio_name + '"]').parent().parent().addClass("has-error");
        $('[name="' + radio_name + '"]:last').parent().parent().append("<label class='control-label' for='inputError'>" + error_message + "</label>");
    } else {
        $(element).parent().addClass("has-error");
        $(element).parent().append("<label class='control-label' for='inputError'>" + error_message + "</label>");
    }
}

/**
 * Clean the generated error
 * @return {void}
 */
ValidaMe.cleanErrorBootstrap = function(element) {
    $("label, div").removeClass("has-error");
    $(".control-label").remove();
}

/**
 * Focus on the very first error
 * @return {boolean} false
 */
ValidaMe.focusErrorBootstrap = function() {
    $('html, body').animate({
        scrollTop: ($('.has-error').first().offset().top)
    }, 500);
    return false;
}