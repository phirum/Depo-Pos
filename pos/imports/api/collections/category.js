import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';

// Lib
import {__} from '../../../../core/common/libs/tapi18n-callback-helper.js';
import {SelectOpts} from '../../ui/libs/select-opts.js';

export const Categories = new Mongo.Collection("pos_categories");
Categories.schema = new SimpleSchema({
    name: {
        type: String,
        label: "Name",
        //unique: true,
        max: 200
    },
    description:{
        type:String,
        label:"Description",
        optional:true
    },
    parentId:{
        type:String,
        label:"Parent",
        optional:true,
        autoform: {
            type: 'universe-select',
            afFieldInput: {
                uniPlaceholder: 'Select One',
                optionsMethod: 'pos.selectOptMethods.category'
                /*optionsMethodParams: function () {
                    if (Meteor.isClient) {
                        let currentBranch = Session.get('currentBranch');
                        return {branchId: currentBranch};
                    }
                }*/
            }
        }
    },
    level:{
        type:Number,
        optional:true
    },
    _parent:{
        type:Object,
        blackbox:true,
        optional:true
    },
    _productCount:{
        type:Number,
        optional:true
    }
});

Meteor.startup(function () {
    Categories.schema.i18n("pos.category.schema");
    Categories.attachSchema(Categories.schema);
});