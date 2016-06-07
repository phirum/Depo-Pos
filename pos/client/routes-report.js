import {Meteor} from 'meteor/meteor';
import {Session} from 'meteor/session';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {FlowRouterTitle} from 'meteor/ostrio:flow-router-title';
import 'meteor/arillo:flow-router-helpers';
import 'meteor/zimme:active-route';
import 'meteor/theara:flow-router-breadcrumb';

// Lib
import {__} from '../../core/common/libs/tapi18n-callback-helper.js';

// Layout
import {Layout} from '../../core/client/libs/render-layout.js';
import '../../core/imports/ui/layouts/report/index.html';

// Group
let PosRoutes = FlowRouter.group({
    prefix: '/simple-pos',
    title: "POS",
    titlePrefix: 'POS > ',
    subscriptions: function (params, queryParams) {
//     this.register('files', Meteor.subscribe('files'));
    }
});

// Customer list
import '../imports/ui/reports/customer.js';
PosRoutes.route('/customer-report', {
    name: 'pos.customerReport',
    title: __('pos.customerReport.title'),
    action: function (params, queryParams) {
        Layout.main('Pos_customerReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: __('pos.customerReport.title'),
        icon: 'users',
        parent: 'pos.home'
    }
});

PosRoutes.route('/customer-report-gen', {
    name: 'pos.customerReportGen',
    title: __('pos.customerReport.title'),
    action: function (params, queryParams) {
        Layout.report('Pos_customerReportGen');
    }
});

// Order
import '../imports/ui/reports/order.js';
PosRoutes.route('/order-report', {
    name: 'pos.orderReport',
    title: __('pos.orderReport.title'),
    action: function (params, queryParams) {
        Layout.main('Pos_orderReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: __('pos.orderReport.title'),
        icon: 'cart-plus',
        parent: 'pos.home'
    }
});

PosRoutes.route('/order-report-gen', {
    name: 'pos.orderReportGen',
    title: __('pos.orderReport.title'),
    action: function (params, queryParams) {
        Layout.report('Pos_orderReportGen');
    }
});
