import {ReactiveVar} from 'meteor/reactive-var';
import {ReactiveDict} from 'meteor/reactive-dict';
import {Template} from 'meteor/templating';
import {AutoForm} from 'meteor/aldeed:autoform';
import {Roles} from  'meteor/alanning:roles';
import {alertify} from 'meteor/ovcharik:alertifyjs';
import {sAlert} from 'meteor/juliancwirko:s-alert';
import {fa} from 'meteor/theara:fa-helpers';
import {lightbox} from 'meteor/theara:lightbox-helpers';
import {_} from 'meteor/erasaur:meteor-lodash';
import {$} from 'meteor/jquery';
import {TAPi18n} from 'meteor/tap:i18n';
import 'meteor/theara:template-states';

// Lib
import {createNewAlertify} from '../../../../core/client/libs/create-new-alertify.js';
import {renderTemplate} from '../../../../core/client/libs/render-template.js';
import {destroyAction} from '../../../../core/client/libs/destroy-action.js';
import {displaySuccess, displayError} from '../../../../core/client/libs/display-alert.js';

// Component
import '../../../../core/client/components/loading.js';
import '../../../../core/client/components/tabular-action.js';
import '../../../../core/client/components/form-footer.js';

// Collection
import {ItemsSchema} from '../../api/collections/order-items.js';
import {Order} from '../../api/collections/order.js';

// Declare template
var itemsTmpl = Template.Simple_orderItems,
    editItemsTmpl = Template.Simple_orderItemsEdit;


// Local collection
// let itemsCollection = new Mongo.Collection(null);
var itemsCollection;

// Page
import './order-items.html';

itemsTmpl.onCreated(function () {
    // Create new  alertify
    createNewAlertify('item');

    // Data context
    let data = Template.currentData();
    itemsCollection = data.itemsCollection;

    this.myState = new ReactiveDict();
    this.myState.setDefault({
        qty: 0,
        price: 0,
        total: 0
    });

    // Template state
    this.state('tmpAmount', 0);

    this.autorun(()=> {
        let tmpAmount = math.round(this.myState.get('qty') * this.myState.get('price'), 2);
        this.state('tmpAmount', tmpAmount);
    });
});

itemsTmpl.onRendered(function () {
});

itemsTmpl.helpers({
    schema(){
        return ItemsSchema;
    },
    disabledAddItemBtn: function () {
        const instance = Template.instance();
        if (instance.state('tmpAmount') <= 0) {
            return {disabled: true};
        }

        return {};
    },
    itemsList: function () {
        let getItems = itemsCollection.find();

        return getItems;
    },
    total: function () {
        const instance = Template.instance();
        let getItems = itemsCollection.find();
        let total = 0;
        getItems.forEach((obj)=> {
            total += obj.amount;
        });
        instance.myState.set('total', total);

        return total;
    },
    keyArgs(index, name){
        return `items.${index}.${name}`;
    }
});

itemsTmpl.events({
    'change [name="tmpId"]': function (event, instance) {
        instance.$('[name="tmpQty"]').val('');
        instance.$('[name="tmpPrice"]').val('');
        instance.$('[name="tmpAmount"]').val('');

        instance.myState.set('qty', '');
        instance.myState.set('price', '');
    },
    'keyup [name="tmpQty"],[name="tmpPrice"]': function (event, instance) {
        var qty = instance.$('[name="tmpQty"]').val();
        var price = instance.$('[name="tmpPrice"]').val();
        qty = _.isEmpty(qty) ? 0 : parseInt(qty);
        price = _.isEmpty(price) ? 0 : parseFloat(price);

        instance.myState.set('qty', qty);
        instance.myState.set('price', price);
    },
    'click .js-add-item': function (event, instance) {
        let itemId = instance.$('[name="tmpId"]').val();
        let qty = parseInt(instance.$('[name="tmpQty"]').val());
        let price = math.round(parseFloat(instance.$('[name="tmpPrice"]').val()), 2);
        let amount = math.round(qty * price, 2);

        // Check exist
        let exist = itemsCollection.findOne({itemId: itemId});
        if (exist) {
            qty += parseInt(exist.qty);
            amount = math.round(qty * price, 2);

            itemsCollection.update(
                {itemId: itemId},
                {$set: {qty: qty, price: price, amount: amount}}
            );
        } else {
            itemsCollection.insert({
                itemId: itemId,
                qty: qty,
                price: price,
                amount: amount
            });
        }
    },
    // 'click .js-plus-item': function (event, instance) {
    //     let thisObj = $(event.currentTarget);
    //     let parents = thisObj.parents('tr.item-list');
    //     let name = parents.find('.js-itemId').html();
    //     let qtyIn = parseInt(parents.find('.js-qty-in').html()) + 1;
    //     let qtyOut = parseInt(parents.find('.js-qty-out').html());
    //     let qty = qtyIn - qtyOut;
    //     let price = parseFloat(parents.find('.js-price').html());
    //     let amount = qty * price;
    //
    //     itemsCollection.update(
    //         {name: name},
    //         {$set: {qtyIn: qtyIn, qty: qty, amount: amount}}
    //     );
    // },
    // 'click .js-minus-item': function (event, instance) {
    //     let thisObj = $(event.currentTarget);
    //     let parents = thisObj.parents('tr.item-list');
    //     let name = parents.find('.js-itemId').html();
    //     let qtyIn = parseInt(parents.find('.js-qty-in').html());
    //     let qtyOut = parseInt(parents.find('.js-qty-out').html()) + 1;
    //     let qty = qtyIn - qtyOut;
    //     let price = parseFloat(parents.find('.js-price').html());
    //     let amount = qty * price;
    //
    //     // Check qty
    //     if (qty > 0) {
    //         itemsCollection.update(
    //             {name: name},
    //             {$set: {qtyOut: qtyOut, qty: qty, amount: amount}}
    //         );
    //     } else {
    //         destroyAction(
    //             itemsCollection,
    //             {name: name},
    //             {title: 'Item', item: name}
    //         );
    //     }
    // },
    'click .js-update-item': function (event, instance) {
        let thisObj = $(event.currentTarget);
        let parents = thisObj.parents('div.row.item');
        let itemId = _.trim(parents.find('.js-itemId').html());

        alertify.item(fa('pencil', TAPi18n.__('simple.order.itemLbl')), renderTemplate(editItemsTmpl, {itemId: itemId}));
    },
    'click .js-destroy-item': function (event, instance) {
        let thisObj = $(event.currentTarget);
        let parents = thisObj.parents('div.row.item');
        let itemId = _.trim(parents.find('.js-itemId').html());

        destroyAction(
            itemsCollection,
            {itemId: itemId},
            {title: TAPi18n.__('simple.order.itemLbl'), item: itemId}
        );
    },
    // 'click .js-destroy-item': function (event, instance) {
    //     let thisObj = $(event.currentTarget);
    //     let parents = thisObj.parents('div.row.item');
    //     let itemId = parents.find('.js-itemId').val();
    //
    //     destroyAction(
    //         itemsCollection,
    //         {itemId: itemId},
    //         {title: 'Item', item: itemId}
    //     );
    // },
    // 'keyup .js-qty,.js-price': function (event, instance) {
    //     let thisObj = $(event.currentTarget);
    //     let itemId = thisObj.parents('div.row.item').find('.js-itemId').val();
    //     let qty = thisObj.parents('div.row.item').find('.js-qty').val();
    //     let price = thisObj.parents('div.row.item').find('.js-price').val();
    //     let amount = qty * price;
    //
    //     itemsCollection.update(
    //         {itemId: itemId},
    //         {$set: {qty: qty, price: price, amount: amount}}
    //     );
    // }
});


// Edit
editItemsTmpl.onCreated(function () {
    this.state('amount', 0);
});

editItemsTmpl.helpers({
    schema(){
        return Order.itemsSchema;
    },
    data: function () {
        let data = Template.currentData();
        let itemId = data.itemId;
        let instance = Template.instance();
        let getItem = itemsCollection.findOne({itemId: itemId});

        instance.state('amount', getItem.amount);

        return getItem;
    }
});

editItemsTmpl.events({
    'keyup [name="qty"],[name="price"]': function (event, instance) {
        let qty = instance.$('[name="qty"]').val();
        let price = instance.$('[name="price"]').val();
        qty = _.isEmpty(qty) ? 0 : parseInt(qty);
        price = _.isEmpty(price) ? 0 : parseFloat(price);
        let amount = qty * price;

        instance.state('amount', amount);
    }
});

let hooksObject = {
    onSubmit: function (insertDoc, updateDoc, currentDoc) {
        this.event.preventDefault();
        this.done(null, insertDoc);
    },
    onSuccess: function (formType, result) {
        itemsCollection.update(
            {itemId: result.itemId},
            {$set: {qty: result.qty, price: result.price, amount: result.amount}}
        );

        alertify.item().close();
        displaySuccess();
    },
    onError: function (formType, error) {
        displayError(error.message);
    }
};
AutoForm.addHooks(['Simple_orderItemsEdit'], hooksObject);
