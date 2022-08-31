(function($){
    $(function(){
        $('#from').datetimepicker({
            "allowInputToggle": true,
            "showClose": true,
            "showClear": true,
            "showTodayButton": true,
            "format": "MM/DD/YYYY HH:mm:ss",
        });
        $('#to').datetimepicker({
            "allowInputToggle": true,
            "showClose": true,
            "showClear": true,
            "showTodayButton": true,
            "format": "MM/DD/YYYY HH:mm:ss",
        });
    });
})(jQuery);
