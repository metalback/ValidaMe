/*!
 * ValidaMe
 *
 * ValidaMe it's a simple js form validation who integrates
 * The most popular CSS Frameworks.
 *
 * Actually Integrates:
 * 
 * - Foundation 6
 * - Bootstrap 3.3.6
 * --------------------------------------------------------
 * 
 * @author Mauricio Beltran <mauricio.beltran@usolix.cl>
 * @version 0.3.0
 * @license GPL v2.0
 *
 */

var ValidaMe = function(custom_config)
{
    /**
     * Library configuration
     * @type {Object}
     */
    var configuration = {
        mark:'data-type',
        frame:'Foundation'
    };

    for(var i in custom_config) {
        configuration[i] = custom_config[i];
    }

    /**
     * Supported RegEx
     * @type {Object}
     */
    var expressions = {
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
    };

    /**
     * Supported default errors
     * @type {Object}
     */
    var common_errors = {
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
     * Group of verified radio
     * @type {Array}
     */
    var radio_verified = new Array();

    /**
     * Group of verified checkbox
     * @type {Array}
     */
    var checkbox_verified = new Array();

    /**
     * Response of tthe actual validation
     * @type {Boolean}
     */
    var state = true;         

    /**
     * Main method
     * @return {Boolean} true if pass, false otherwise
     */
    this.validate = function()
    {     
        cleanError();         
        $(document).find('['+configuration.mark+']').each(function() {
            checkElement($(this));
        });
        if (state==false) {
            focusError();
        };
        return state;
    }

    /**
     * Check the element
     * @param  {Object} element Html element
     * @return {Void}
     */
    var checkElement = function(element)
    {
        var element_implement = element[0].localName;
        var element_type = element[0].type;
        if (element_implement=='select') {
            verifySelect(element);
        } else if(element_type=='radio') {
            verifyRadio(element);
        } else if(element_type=='checkbox') {
            verifyCheckbox(element);
        } else if(element_type=='textarea') {
            verifyInput(element);
        } else if (element_implement=='input') {
            verifyInput(element);
        };        
    }

    /**
     * Begin validation process of a checkbox, setting state
     * @param  {Object} element Html element
     * @return {Void}
     */
    var verifyCheckbox = function(element)
    {
        var type = element.attr(configuration.mark);
        var checkbox_name = element[0].name;
        if (checkbox_verified.indexOf(checkbox_name)==-1) {
            checkbox_verified.push(checkbox_name);
            var checkbox_checked = false;
            $('[name="'+checkbox_name+'"]').each(function(){
                if ($(this).is(":checked")) {
                    checkbox_checked = true;
                };
            });

            if (!checkbox_checked) {
                printError(element, type);
                state = false;
            };
        };        
    }

    /**
     * Begin validation process of a radio, setting state
     * @param  {Object} element Html element
     * @return {Void}
     */
    var verifyRadio = function(element)
    {
        var type = element.attr(configuration.mark);
        var radio_name = element[0].name;
        if (radio_verified.indexOf(radio_name)==-1) {
            radio_verified.push(radio_name);
            var radio_checked = false;
            $('[name="'+radio_name+'"]').each(function(){
                if ($(this).is(":checked")) {
                    radio_checked = true;
                };
            });

            if (!radio_checked) {
                printError(element, type);
                state = false;
            };
        };        
    }

    /**
     * Verify the select state
     * @param  {Object} element Html object
     * @return {Void}
     */
    var verifySelect = function(element)
    {
        var type = element.attr(configuration.mark);
        if (element.val()==0) {
            printError(element, type);
            state = false;
        };
    }

    /**
     * Verify a standar input
     * @param  {Object} element Html element
     * @return {Void}
     */
    var verifyInput = function(element)
    {
        var content = element.val().trim();
        var type = element.attr(configuration.mark);
        try {
            verifyEmpty(content, element);
            verifyType(element);
        } catch (err) {
            state = err;
        }
    }

    /**
     * Verify if the element is empty
     * @param  {String} content content of the input
     * @param  {Object} element Html element
     * @return {Void}
     */
    var verifyEmpty = function(content, element)
    {
        if (content.length==0) {
            printError(element, 'empty');            
            throw false;
        };
    }

    /**
     * Verify the type value of an input
     * @param  {Object} element Html element
     * @return {Void}
     */
    var verifyType = function(element) 
    {
        var content = element.val().trim();
        var type = element.attr(configuration.mark);
        if (!content.match(expressions[type])) {
            printError(element, type);
            throw false;
        };
    }

    /**
     * Main method of print error
     * @param  {Object} element    Html element
     * @param  {String} type_error Type of error fired
     * @return {Void}
     */
    var printError = function(element, type_error)
    {
        eval('printError'+configuration.frame+'(element, type_error)');
    }

    /**
     * Clean justified errors
     * @return {Void}
     */
    var cleanError = function()
    {
        eval('cleanError'+configuration.frame+'()');
    }

    /**
     * Focus on the first error fired
     * @return {Void}
     */
    var focusError = function(){
       eval('focusError'+configuration.frame+'()');
    }

    var printErrorFoundation = function(element, type_error)
    {
        var error_message = common_errors[type_error];
        $(element).parent().addClass("is-invalid-label");
        $(element).addClass("is-invalid-input");
        $(element).parent().append("<span class='form-error is-visible'>Error: "+error_message+"</span>");
    }

    var cleanErrorFoundation = function()
    {
        $("label, fieldset").removeClass("is-invalid-label");
        $("input, textarea, select").removeClass("is-invalid-input");
        $(".form-error").remove();
    }

    var focusErrorFoundation = function()
    {
        $('html, body').animate({
            scrollTop: ($('.is-invalid-label').first().offset().top)
        },500);
        return false;
    }

    var printErrorBootstrap = function(element, type_error)
    {
        var error_message = common_errors[type_error];
        if (type_error=='checkbox') {
            $(element).parent().parent().addClass("has-error");
            $(element).parent().parent().append("<label class='control-label' for='inputError'>"+error_message+"</label>");
        } else if(type_error=='radio'){
            var radio_name = element[0].name;
            $('[name="'+radio_name+'"]').parent().parent().addClass("has-error");
            $('[name="'+radio_name+'"]:last').parent().parent().append("<label class='control-label' for='inputError'>"+error_message+"</label>");
        } else {
            $(element).parent().addClass("has-error");
            $(element).parent().append("<label class='control-label' for='inputError'>"+error_message+"</label>");
        }        
    }

    var cleanErrorBootstrap = function(element)
    {
        $("label, div").removeClass("has-error");
        $(".control-label").remove();
    }

    var focusErrorBootstrap = function()
    {
        $('html, body').animate({
            scrollTop: ($('.has-error').first().offset().top)
        },500);
        return false;
    }
}