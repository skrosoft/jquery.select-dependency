/* Copyright (c) 2016 Vincent Guyard (vguyard@onaxis.cl) http://www.onaxis.cl
 * Licensed under GPL (http://www.opensource.org/licenses/gpl-2.0.php)
 * Use only for non-commercial usage.
 */

(function($)
{
	jQuery.fn.SelectDependency = function(options)
	{
		var defaults = {
			onchange: function(){},
            all_value: "-1",
            show_all: false
		};

		var opts = $.extend(defaults, options);

        if (this.filter('[data-sd_group]').size()){
            return this; // At least one of theses select are alweady working with Select Dependency
        }

        // Asign an ID to the group of select
        document.group_id = document.group_id ? document.group_id + 1 : 1;
        this.data('sd_group', document.group_id).attr('data-sd_group', document.group_id);

		this.each(function(){

			this.SelectDependencyBackup = $(this).clone();

			$(this).on('change', function(){

                // lock check
                if ($('body').hasClass('sd_lock'))	return;
                if (!$(this).data('impact'))    return;

                // locking
                $('body').addClass('sd_lock');

                /************** MAIN FUNCIONALITY ***********/

                var current = $(this);
                var all = $('[data-sd_group=' + current.data('sd_group') + ']');

                // restore backup on all list keeping values
                all.each(function(){
                    var value = $(this).val();
                    $(this).html(this.SelectDependencyBackup.html());
                    $(this).val(value);
                });

                // refresh value of all list that was impacting this element
                if (defaults.show_all)  all.each(function(){
                    var impact = $(this).data('impact');
                    if (!impact)    return;
                    var value_impact = current.find('option:selected').data(impact);
                    if (!value_impact)  return;
                    $(this).val(value_impact);
                });

                // If we select "ALL", we just reset all the list
                if (defaults.show_all && current.val() == defaults.all_value)
                    return $('body').removeClass('sd_lock');

                // remove unless options
                all.find('option[data-' + current.data('impact') + '][data-' + current.data('impact') + '!=' + current.val() + ']').remove();

                /********************************************/

                // calling the callback
                $.proxy(defaults.onchange, this)();

                // unlocking
                $('body').removeClass('sd_lock');

			});

		}).first().trigger('change');

        return this;
	}
})(jQuery);