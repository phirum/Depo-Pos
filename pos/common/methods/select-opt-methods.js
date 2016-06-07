import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {_} from 'meteor/erasaur:meteor-lodash';
import {moment} from  'meteor/momentjs:moment';

// Collection
import {Customer} from '../../imports/api/collections/customer.js';
import {Item} from '../../imports/api/collections/item.js';
import {Order} from '../../imports/api/collections/order.js';
import {Categories} from '../../imports/api/collections/category';

export let SelectOptMethods = {};

SelectOptMethods.customer = new ValidatedMethod({
    name: 'pos.selectOptMethods.customer',
    validate: null,
    run(options) {
        if (!this.isSimulation) {
            this.unblock();

            let list = [], selector = {};
            let searchText = options.searchText;
            let values = options.values;
            let params = options.params || {};

            if (searchText && params.branchId) {
                selector = {
                    $or: [
                        {_id: {$regex: searchText, $options: 'i'}},
                        {name: {$regex: searchText, $options: 'i'}}
                    ],
                    branchId: params.branchId
                };
            } else if (values.length) {
                selector = {_id: {$in: values}};
            }

            let data = Customer.find(selector, {limit: 10});
            data.forEach(function (value) {
                let label = value._id + ' : ' + value.name;
                list.push({label: label, value: value._id});
            });

            return list;
        }
    }
});

SelectOptMethods.item = new ValidatedMethod({
    name: 'pos.selectOptMethods.item',
    validate: null,
    run(options) {
        if (!this.isSimulation) {
            this.unblock();

            let list = [], selector = {};
            let searchText = options.searchText;
            let values = options.values;

            if (searchText) {
                selector = {
                    $or: [
                        {_id: {$regex: searchText, $options: 'i'}},
                        {name: {$regex: searchText, $options: 'i'}}
                    ]
                };
            } else if (values.length) {
                selector = {_id: {$in: values}};
            }

            let data = Item.find(selector, {limit: 10});
            data.forEach(function (value) {
                let label = value._id + ' : ' + value.name;
                list.push({label: label, value: value._id});
            });

            return list;
        }
    }
});

SelectOptMethods.order = new ValidatedMethod({
    name: 'pos.selectOptMethods.order',
    validate: null,
    run(options) {
        if (!this.isSimulation) {
            this.unblock();

            let list = [], selector = {};
            let searchText = options.searchText;
            let values = options.values;

            if (searchText) {
                selector = {
                    _id: {$regex: searchText, $options: 'i'},
                    branchId: params.branchId
                };
            } else if (values.length) {
                selector = {_id: {$in: values}};
            }

            let data = Order.find(selector, {limit: 10});
            data.forEach(function (value) {
                let label = value._id + ' | Date: ' + moment(value.orderDate).format('DD/MM/YYYY');
                list.push({label: label, value: value._id});
            });

            return list;
        }
    }
});

SelectOptMethods.category = new ValidatedMethod({
    name: 'pos.selectOptMethods.category',
    validate: null,
    run(options) {
        if (!this.isSimulation) {
            this.unblock();

            let list = [], selector = {};
            let searchText = options.searchText;
            let values = options.values;

            if (searchText) {
                selector = {
                    _id: {$regex: searchText, $options: 'i'},
                    branchId: params.branchId
                };
            } else if (values.length) {
                selector = {_id: {$in: values}};
            }

            let data = Categories.find(selector, {limit: 10});
            data.forEach(function (value) {
                list.push({label: value.name, value: value._id});
            });

            return list;
        }
    }
});
/*

let getCategoryIdsForExclusion = function (array, categories) {
    if (categories != null) {
        categories.forEach(function (c) {
            array.push(c._id);
            var cats = Categories.find({parentId: c._id});
            if (cats != null) {
                return getCategoryIdsForExclusion(array, cats);
            }
        });
    }
    return array;
};
let pushToList = function (array, obj) {
    var str = "";
    for (var i = 0; i < obj.level * 3; i++) {
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
            /!* var str = "";
             for (var i = 0; i < c.level * 3; i++) {
             str += "&nbsp;";
             }
             array.push({
             label: Spacebars.SafeString(str + (c.level + 1) + '. ' + c.name),
             value: c._id
             });*!/
            alreadyUse.push(c._id);
            selector.parentId = c._id;
            var cats = Categories.find(selector);
            if (cats != null) {
                return getCategoryList(selector, array, cats, alreadyUse);
            }
        });
    }
    return array;
};
*/
