var register = function registerFragment(global) {

   var back = function back() {
     zs.content.loadFragment({controller: 'login',
                              fragment: 'login',
                              success: function() { console.log('Hello Login'); }
                            });
   }

   return {
      back: back
   }
}(window);