var login = function loginFragment(global) {

   var loginMeIn = function loginMeIn() {
     zs.content.loadFragment({controller: 'dashboard',
                              fragment: 'dashboard',
                              success: function() { console.log('Hello Dashboard'); }
                            });
   },
   
   register = function register() {
     zs.content.loadFragment({controller: 'register',
                              fragment: 'register',
                              success: function() { console.log('Hello register page'); }
                            });
   }

   return {
      loginMeIn : loginMeIn ,
      register: register
   }
}(window);