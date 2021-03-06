import {Meteor} from  'meteor/meteor';
import {_} from 'meteor/erasaur:meteor-lodash';

// Collection
import {Branch} from '../../../../core/imports/api/collections/branch.js';
import {Categories} from '../../api/collections/category.js'

let getCategoryIdsForExclusion = function (array, categories) {
    if (categories != null) {
        categories.forEach(function (c) {
            array.push(c._id);
            let cats = Categories.find({parentId: c._id});
            if (cats != null) {
                return getCategoryIdsForExclusion(array, cats);
            }
        });
    }
    return array;
};
let pushToList = function (array, obj) {
    var str = "";
    for (let i = 0; i < obj.level * 3; i++) {
        str += "&nbsp;";
    }
    array.push({
        label: Spacebars.SafeString(str + obj.name),
        value: obj._id
    });
    return array;
};
let getCategoryList = function (selector, array, categories, alreadyUse) {
    if (categories != null) {
        categories.forEach(function (c) {
            array = pushToList(array, c);
            /* var str = "";
             for (var i = 0; i < c.level * 3; i++) {
             str += "&nbsp;";
             }
             array.push({
             label: Spacebars.SafeString(str + (c.level + 1) + '. ' + c.name),
             value: c._id
             });*/
            alreadyUse.push(c._id);
            selector.parentId = c._id;
            let cats = Categories.find(selector);
            if (cats != null) {
                return getCategoryList(selector, array, cats, alreadyUse);
            }
        });
    }
    return array;
};

export const SelectOpts = {
    branch: function (selectOne = true) {
        let list = [];
        if (selectOne) {
            list.push({label: "(Select One)", value: ""});
        }

        Branch.find()
            .forEach(function (obj) {
                list.push({label: obj.enName, value: obj._id});
            });

        return list;
    },
    gender: function () {
        return [
            {label: "(Select One)", value: ""},
            {label: "Male", value: "M"},
            {label: "Female", value: "F"}
        ];
    },
    category: function (param) {
        Meteor.subscribe('pos.category');
        var list = [];
        if (param != false) {
            let label = param != null ? param : "(Select One)";
            list.push({label: label, value: ""});
        }
        var categoryId = Session.get('CategoryIdSession');
        var selector = {};
        if (categoryId != null) {
            let arr = [categoryId];
            let categories = Categories.find({parentId: categoryId});
            arr = getCategoryIdsForExclusion(arr, categories);
            selector._id = {$not: {$in: arr}};
        }

        let alreadyUse = [];
        Categories.find(selector, {sort: {level: 1}}).forEach(function (obj) {
            if (alreadyUse.indexOf(obj._id) == -1) {
                pushToList(list, obj);
                selector.parentId = obj._id;
                let categories = Categories.find(selector);
                list = getCategoryList(selector, list, categories, alreadyUse);
            }
        });
        return list;
    }
};