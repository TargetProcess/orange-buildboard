let Rx = Npm.require('rx');
Events = new Rx.Subject();

notify = function ({item, modification}) {
    Events.onNext({item, modification});
};