AutoForm.addInputType("bootstrap-datetimepicker", {
    template: "afBootstrapDateTimePicker",
    valueOut: function () {
        if (!!this.data("DateTimePicker").date()) {
            var val = this.data("DateTimePicker").date().toDate();
            // console.log(val)
            return (val instanceof Date) ? val : this.val();
        }
    },
    valueConverters: {
        "string": function (val) {
            return (val instanceof Date) ? AutoForm.Utility.dateToDateStringUTC(val) : val;
        },
        "stringArray": function (val) {
            if (val instanceof Date) {
                return [AutoForm.Utility.dateToDateStringUTC(val)];
            }
            return val;
        },
        "number": function (val) {
            return (val instanceof Date) ? val.getTime() : val;
        },
        "numberArray": function (val) {
            if (val instanceof Date) {
                return [val.getTime()];
            }
            return val;
        },
        "dateArray": function (val) {
            if (val instanceof Date) {
                return [val];
            }
            return val;
        }
    }
});

Template.afBootstrapDateTimePicker.helpers({
    atts: function addFormControlAtts() {
        var atts = _.clone(this.atts);
        // Add bootstrap class
        atts = AutoForm.Utility.addClass(atts, "form-control");
        delete atts.dateTimePickerOptions;
        return atts;
    }
});

Template.afBootstrapDateTimePicker.rendered = function () {
    var $input = this.$('input');
    var data = this.data;

    // instanciate datepicker
    $input.datetimepicker(data.atts.dateTimePickerOptions);

    // set and reactively update values
    this.autorun(function () {
        var data = Template.currentData();

        // set field value
        if (data.value instanceof Date) {
            $input.data("DateTimePicker").date(data.value);
        } else if (typeof data.value === "string") {
            $input.data("DateTimePicker").date(moment(data.value).toDate());
        }

        // set start date if there's a min in the schema
        if (data.min instanceof Date) {
            // datepicker plugin expects local Date object, so convert UTC Date object to local
            var startDate = utcToLocal(data.min);
            $input.data("DateTimePicker").setMinDate(startDate);
        }

        // set end date if there's a max in the schema
        if (data.max instanceof Date) {
            // datepicker plugin expects local Date object, so convert UTC Date object to local
            var endDate = utcToLocal(data.max);
            $input.data("DateTimePicker").setMinDate(endDate);
        }
    });

};

Template.afBootstrapDateTimePicker.destroyed = function () {
    var dtp = this.$('input').data("DateTimePicker");
    if (dtp) {
        dtp.destroy();
    }
};

function utcToLocal(utcDate) {
    var localDateObj = new Date();
    localDateObj.setDate(utcDate.getUTCDate());
    localDateObj.setMonth(utcDate.getUTCMonth());
    localDateObj.setFullYear(utcDate.getUTCFullYear());
    localDateObj.setHours(0);
    localDateObj.setMinutes(0);
    localDateObj.setSeconds(0);
    localDateObj.setMilliseconds(0);
    return localDateObj;
}