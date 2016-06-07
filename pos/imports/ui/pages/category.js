import {Template} from 'meteor/templating';
import {AutoForm} from 'meteor/aldeed:autoform';
import {Roles} from  'meteor/alanning:roles';
import {alertify} from 'meteor/ovcharik:alertifyjs';
import {sAlert} from 'meteor/juliancwirko:s-alert';
import {fa} from 'meteor/theara:fa-helpers';
import {lightbox} from 'meteor/theara:lightbox-helpers';
import {TAPi18n} from 'meteor/tap:i18n';
import {ReactiveTable} from 'meteor/aslagle:reactive-table';


// Lib
import {createNewAlertify} from '../../../../core/client/libs/create-new-alertify.js';
import {reactiveTableSettings} from '../../../../core/client/libs/reactive-table-settings.js';
import {renderTemplate} from '../../../../core/client/libs/render-template.js';
import {destroyAction} from '../../../../core/client/libs/destroy-action.js';
import {displaySuccess, displayError} from '../../../../core/client/libs/display-alert.js';
import {__} from '../../../../core/common/libs/tapi18n-callback-helper.js';

// Component
import '../../../../core/client/components/loading.js';
import '../../../../core/client/components/column-action.js';
import '../../../../core/client/components/form-footer.js';

// Collection
import {Categories} from '../../api/collections/category.js';

// Tabular
import {CategoryTabular} from '../../../common/tabulars/category.js';

// Page
import './category.html';

// Declare template
let indexTmpl = Template.Pos_category,
    actionTmpl = Template.Pos_categoryAction,
    newTmpl = Template.Pos_categoryNew,
    editTmpl = Template.Pos_categoryEdit,
    showTmpl = Template.Pos_categoryShow;


// Index
indexTmpl.onCreated(function () {
    // Create new  alertify
    createNewAlertify('category', {size: 'lg'});
    createNewAlertify('categoryShow');

    // Reactive table filter
    this.filter = new ReactiveTable.Filter('pos.categoryByBranchFilter', ['branchId']);
    this.autorun(()=> {
        this.filter.set(Session.get('currentBranch'));
    });
});

indexTmpl.helpers({
    tabularTable(){
        return CategoryTabular;
    },
    selector() {
        return {branchId: Session.get('currentBranch')};
    },
    tableSettings(){
        let i18nPrefix = 'pos.category.schema';

        reactiveTableSettings.collection = 'pos.reactiveTable.category';
        reactiveTableSettings.filters = ['pos.categoryByBranchFilter'];
        reactiveTableSettings.fields = [
            {
                key: '_id',
                label: __(`${i18nPrefix}._id.label`),
                sortOrder: 0,
                sortDirection: 'asc'
            },
            {key: 'name', label: __(`${i18nPrefix}.name.label`)},
            {key: 'description', label: __(`${i18nPrefix}.description.label`)},
            {key: '_parent.name', label: __(`${i18nPrefix}.parent.label`)},
            {
                key: '_id',
                label(){
                    return fa('bars', '', true);
                },
                headerClass: function () {
                    let css = 'text-center col-action';
                    return css;
                },
                tmpl: actionTmpl, sortable: false
            }
        ];

        return reactiveTableSettings;
    }
});

indexTmpl.events({
    'click .js-create' (event, instance) {
        alertify.category(fa('plus', TAPi18n.__('pos.category.title')), renderTemplate(newTmpl));
    },
    'click .js-update' (event, instance) {
        alertify.category(fa('pencil', TAPi18n.__('pos.category.title')), renderTemplate(editTmpl, this));
    },
    'click .js-destroy' (event, instance) {
        destroyAction(
            Categories,
            {_id: this._id},
            {title: TAPi18n.__('pos.category.title'), itemTitle: this._id}
        );
    },
    'click .js-display' (event, instance) {
        alertify.categoryShow(fa('eye', TAPi18n.__('pos.category.title')), renderTemplate(showTmpl, this));
    }
});

// New
newTmpl.helpers({
    collection(){
        return Categories;
    }
});

// Edit
editTmpl.onCreated(function () {
    this.autorun(()=> {
        this.subscribe('pos.category', {_id: this.data._id});
    });
});

editTmpl.helpers({
    collection(){
        return Categories;
    },
    data () {
        let data = Categories.findOne(this._id);
        return data;
    }
});

// Show
showTmpl.onCreated(function () {
    this.autorun(()=> {
        this.subscribe('pos.category', {_id: this.data._id});
    });
});

showTmpl.helpers({
    i18nLabel(label){
        let i18nLabel = `pos.category.schema.${label}.label`;
        return i18nLabel;
    },
    data () {
        let data = Categories.findOne(this._id);
        return data;
    }
});

// Hook
let hooksObject = {
    onSuccess (formType, result) {
        if (formType == 'update') {
            alertify.category().close();
        }
        displaySuccess();
    },
    onError (formType, error) {
        displayError(error.message);
    }
};

AutoForm.addHooks([
    'Pos_categoryNew',
    'Pos_categoryEdit'
], hooksObject);
