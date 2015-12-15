BuildBoardAccounts = new Mongo.Collection('accounts');
Tasks = new Mongo.Collection('tasks');
Branches = new Mongo.Collection('branches');



currentAccountName = ()=> {
    return Router.current().params.account;
};