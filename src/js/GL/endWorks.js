(function (global) { 
  global.onload = function () {            
      /*document.body.onkeydown = function (e) {
          debugger;
          var elm = e.target.nodeName.toLowerCase();
          if (e.which === 8 && (elm !== 'input' && elm  !== 'textarea')) {
              e.preventDefault();
          }
          // stopping event bubbling up the DOM tree..
          e.stopPropagation();
      };*/

      /*global.onhashchange = function() {
        debugger;
       }*/

       window.addEventListener('popstate', function(event) {
         debugger;
        // The popstate event is fired each time when the current history entry changes.

        mydialog.$children[0].open({
          header:'Uygulamadan Çıkış',
          content:'Uygulamadan çıkmak mı istiyorsunuz?',
          buttons:[
            {id:'evet',title:'Çıkış Yap',callback:function(a){
              debugger;
              window.close();
            }},
            {id:'hayir',title:'Hayır',callback:function(a){
              debugger;
              history.pushState(null, null, window.location.pathname);
            }}
          ]
        });   
    }, false);
  }

})(window);