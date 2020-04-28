Vue.component('myheader', {
	data:function(){
		return this.setDefault();
  },
  mounted:function() {
    document.getElementById('geocoder').appendChild(GL.geocoder.onAdd(GL.map));
  },
  methods:{
      setDefault:function(){
          return {
              onoff:true,
              closebutton:false,
              leftMenuIcon:'menu-outline',
              logo:GL.config.darkMode==true ? './src/img/logo/gislayer_logo_dark.png':'./src/img/logo/gislayer_logo_light.png'
          }
      },
      open:function(){
        this.onoff = true;
      },
      close:function(e){
        this.onoff = false;
      },
      logoChange:function(){
        if(GL.config.darkMode==true){
          this.logo = './src/img/logo/gislayer_logo_dark.png';
        }else{
          this.logo = './src/img/logo/gislayer_logo_light.png';
        }
      },
      leftMenuClick:function(){
        GL.titresim();
      },
      searchButonClick:function(){
        var that = this;
        GL.titresim();
        var a = $("#search").hasClass("show");
        if (a) {
            $("#search").removeClass("show");
            this.closebutton=false;
        }
        else {
            $("#search").addClass("show");
            $("#search .form-control").focus();
            setTimeout(function(){
              that.closebutton=true;
            },300);
            
        }
      }
  },
  template:
  '<div v-if="onoff">'+
    //header
    '<div class="appHeader">'+
      '<div class="left">'+
        '<a href="#" class="headerButton" data-toggle="modal" data-target="#sidebarPanel" @click="leftMenuClick"><ion-icon :name="leftMenuIcon"></ion-icon> </a>'+
      '</div>'+
      '<div class="pageTitle">'+
        '<img :src="logo" alt="GISLayer Logo" class="logo">'+
      '</div>'+
      '<div class="right">'+
        '<a href="#" class="headerButton" @click="searchButonClick"> <ion-icon name="search-outline" role="img" class="md hydrated" aria-label="search outline"></ion-icon> </a>'+
      '</div>'+
    '</div>'+

    //searchbox
    '<div id="search" class="appHeader">'+
      '<div id="geocoder" style="width: calc(100% - 30px);">'+
      '<a href="javascript:;" v-if="closebutton" @click="searchButonClick" style="right: 5px; top: 13px; position: fixed;" class="ml-1 close toggle-searchbox"> <ion-icon name="close-circle"></ion-icon> </a>'+
    '</div>'+

  '</div>'
  });

var myheader = new Vue({ el: '#myheader' });