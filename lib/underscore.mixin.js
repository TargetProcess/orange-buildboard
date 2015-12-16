Meteor.startup(()=> {
    _.mixin({
        or(...functions){
            return function (...args) {
                return _.foldl(functions, (r, f)=>r || f(...args), false);
            }
        },
        and(...functions){
            return function (...args) {
                return _.foldl(functions, (r, f)=>r && f(...args), true);
            }
        },
        not(f){
            return function (...args) {
                return !(f(...args))
            }
        }
    });
});