Vue.component('mymenu', {
  data: function () {
    return this.setDefault();
  },
  methods: {
    setDefault: function () {
      return {
        onoff: true,
        menuToggleStatus: false,
        menu: [
          {
            id: 'layers',
            title: GL.lang.panel.mymenu.layers,
            icon: 'albums-outline',
            submenu:[]
          },
          {
            id: 'vectorlayer',
            title: GL.lang.panel.mymenu.vector,
            icon: 'add-outline',
            submenu:[]
          },
          {
            id: 'layerservice',
            title: GL.lang.panel.mymenu.layerservice,
            icon: 'layers-outline',
            submenu:[

              {
                id: 'wfs',
                title: GL.lang.panel.mymenu.wfs,
                icon: 'add-outline',
                submenu:[]
              },
              {
                id: 'wms',
                title: GL.lang.panel.mymenu.wms,
                icon: 'add-outline',
                submenu:[]
              },
              {
                id: 'wmts',
                title: GL.lang.panel.mymenu.wmts,
                icon: 'add-outline',
                submenu:[]
              },
              {
                id: 'wfst',
                title: GL.lang.panel.mymenu.wfst,
                icon: 'add-outline',
                submenu:[]
              },
              {
                id: 'xyz',
                title: GL.lang.panel.mymenu.xyz,
                icon: 'add-outline',
                submenu:[]
              },
              {
                id: 'pbf',
                title: GL.lang.panel.mymenu.pbf,
                icon: 'add-outline',
                submenu:[]
              },
              {
                id: 'mvt',
                title: GL.lang.panel.mymenu.mvt,
                icon: 'add-outline',
                submenu:[]
              },
            ]
          },
          {
            id: 'maps',
            title: GL.lang.panel.mymenu.maps,
            icon: 'map-outline',
            submenu:[
              {
                id: 'streetmaps',
                title: GL.lang.panel.mymenu.streetmaps,
                icon: 'chevron-forward-outline',
                submenu:[]
              },
              {
                id: 'satellitemaps',
                title: GL.lang.panel.mymenu.satellitemaps,
                icon: 'chevron-forward-outline',
                submenu:[]
              },
              {
                id: 'specialmaps',
                title: GL.lang.panel.mymenu.specialmaps,
                icon: 'chevron-forward-outline',
                submenu:[]
              },
              {
                id: 'offlinemaps',
                title: GL.lang.panel.mymenu.offlinemaps,
                icon: 'chevron-forward-outline',
                submenu:[]
              },
              {
                id: 'ownmaps',
                title: GL.lang.panel.mymenu.ownmaps,
                icon: 'chevron-forward-outline',
                submenu:[]
              }
            ]
          },
          {
            id: 'loadfile',
            title: GL.lang.panel.mymenu.fileload,
            icon: 'cloud-upload-outline',
            submenu:[
              {
                id: 'fileupload',
                title: GL.lang.panel.mymenu.fileupload,
                icon: 'cloud-upload-outline',
                submenu:[]
              },
              {
                id: 'ownfiles',
                title: GL.lang.panel.mymenu.ownfiles,
                icon: 'folder-outline',
                submenu:[]
              },
              {
                id: 'systemfiles',
                title: GL.lang.panel.mymenu.systemfiles,
                icon: 'file-tray-stacked-outline',
                submenu:[]
              },
            ]
          },
          {
            id: 'tools',
            title: GL.lang.panel.mymenu.tools,
            icon: 'cog-outline',
            submenu:[
              {
                id: 'terrain-profile',
                title: GL.lang.panel.mymenu.terrainprofile,
                icon: 'bar-chart-outline',
                submenu:[]
              },
              {
                id: 'gps-track',
                title: GL.lang.panel.mymenu.gpstracking,
                icon: 'locate-outline',
                submenu:[]
              },
              {
                id: 'navigation',
                title: GL.lang.panel.mymenu.navigation,
                icon: 'navigate-outline',
                submenu:[]
              },
              {
                id: 'aplication',
                title: GL.lang.panel.mymenu.aplication,
                icon: 'location-outline',
                submenu:[]
              },
            ]
          },
          
          {
            id: 'calculating',
            title: GL.lang.panel.mymenu.calculating,
            icon: 'calculator-outline',
            submenu:[
              {
                id: 'lengths',
                title: GL.lang.panel.mymenu.lengths,
                icon: 'analytics-outline',
                submenu:[]
              },
              {
                id: 'area',
                title: GL.lang.panel.mymenu.area,
                icon: 'square-outline',
                submenu:[]
              },
              {
                id: 'transform',
                title: GL.lang.panel.mymenu.transform,
                icon: 'repeat-outline',
                submenu:[]
              },
              {
                id: 'temelodev2',
                title: GL.lang.panel.mymenu.temelodev2,
                icon: 'golf-outline',
                submenu:[]
              },
              {
                id: 'twopoints',
                title: GL.lang.panel.mymenu.twopoints,
                icon: 'git-merge-outline',
                submenu:[]
              },
              {
                id: 'walkingarea',
                title: GL.lang.panel.mymenu.walkingarea,
                icon: 'disc-outline',
                submenu:[]
              },
              {
                id: 'bufferarea',
                title: GL.lang.panel.mymenu.bufferarea,
                icon: 'radio-outline',
                submenu:[]
              },
            ]
          },
          {
            id: 'querydata',
            title: GL.lang.panel.mymenu.querydata,
            icon: 'search-outline',
            submenu:[
              {
                id: 'spatial',
                title: GL.lang.panel.mymenu.spatial,
                icon: 'chevron-forward-outline',
                submenu:[]
              },
              {
                id: 'textquery',
                title: GL.lang.panel.mymenu.textquery,
                icon: 'chevron-forward-outline',
                submenu:[]
              }
            ]
          },
          {
            id: 'export',
            title: GL.lang.panel.mymenu.exportmap,
            icon: 'print-outline',
            submenu:[]
          },
          {
            id: 'language',
            title: GL.lang.panel.mymenu.language,
            icon: 'language-outline',
            submenu:[]
          }
        ]
      }
    },
    open: function () {
      this.onoff = true;
    },
    close: function (e) {
      this.onoff = false;
    },
    menuToggle: function (statusparam) {
      GL.titresim();
      status = typeof statusparam !== 'undefined' ? statusparam : !this.menuToggleStatus;
      if (status == "true") {
        $("#sidebarPanel").modal('show');
        this.menuToggleStatus = true;
      } else {
        $("#sidebarPanel").modal('hide');
        this.menuToggleStatus = false;
      }

    },
    panelAc: function (menuid, e) {
      e.preventDefault();
      GL.titresim();
      switch (menuid) {
        case 'wmts': {
          addwmts.$children[0].open();
          break;
        }
        case 'xyz': {
          addxyz.$children[0].open();
          break;
        }
        case 'wms': {
          addwms.$children[0].open();
          break;
        }
        case 'wfs': {
          addwfs.$children[0].open();
          break;
        }
        case 'vectorlayer': {
          createvectorlayer.$children[0].open();
          break;
        }
        case 'temelodev2': {
          destinationpoint.$children[0].open();
          break;
        }
        case 'transform': {
          coordinatetransform.$children[0].open();
          break;
        }
        case 'layers': {
          layerbox.$children[0].open();
          break;
        }
        case 'gps-track': {
          gpstrack.$children[0].open();
          break;
        }
        case 'terrain-profile': {
          terrainprofile.$children[0].open();
          break;
        }
        case 'export': {
          exportmap.$children[0].open();
          break;
        }
        case 'fileupload': {
          fileupload.$children[0].open();
          break;
        }
        case 'lengths': {
          mydialog.$children[0].open({
            header:'Uzunluk Ölçü Birimleri',
            content:'<div class="input-wrapper" style="text-align: left; width: 100%;"><label class="label" for="unit1">Birim Listesi</label><select id="unit1" class="form-control custom-select"><option>Metre</option><option>Inch</option><option>Derece</option></select></div>',
            callback:function(a){
              if(a.type=="ok"){
                
                var secim = $("#"+a.modal.id).find("#unit1").val();
                GL.onay("Şimdi Uzunluk Çizimine Başlayabilirsiniz");
                GL.bilgi("Uzunluk ölçümü için <b>"+secim+'</b> ölçü birimi kullanılacak');
                GL.draw.start("LineString","measure",function(geojson,layerId){
                  GL.distance(geojson,secim);
                });
              }
              if(a.type=="close"){
                GL.bilgi("Uzunluk ölçüm işlemi iptal edilmiştir");
              }
          }});
          break;
        }
        case 'twopoints': {
          distancecalculate.$children[0].open();
          break;
        }
        case 'area':{
          GL.onay("Şimdi Alan Çizimine Başlayabilirsiniz");
          GL.draw.start("Polygon","measure",function(geojson,layerId){
            GL.area(geojson);
          });
          }
      }
      this.menuToggle(false);
    },
    darkMode: function () {
      GL.titresim();
      var darkmodeCheck = localStorage.getItem("hippoDarkModeActive");
      if (darkmodeCheck === 1 || darkmodeCheck === "1") {
        if ($("body").hasClass("dark-mode-active")) {
          $("body").removeClass("dark-mode-active");
        }
        localStorage.setItem("hippoDarkModeActive", "0");
        GL.config.darkMode = false;
        basemaps.$children[0].setActive('streets-v11');
        //GL.map.setStyle('mapbox://styles/mapbox/streets-v11');
      } else {
        $("body").addClass("dark-mode-active");
        localStorage.setItem("hippoDarkModeActive", "1");
        GL.config.darkMode = true;
        basemaps.$children[0].setActive('dark-v10');
        //GL.map.setStyle('mapbox://styles/mapbox/dark-v10');
      }
      myfooter.$children[0].$forceUpdate();
      myheader.$children[0].logoChange();
      this.menuToggle(false);
    }
  },
  template: '<div v-if="onoff">' +
    '<div class="modal fade panelbox panelbox-left" id="sidebarPanel" tabindex="-1" role="dialog">' +
    '<div class="modal-dialog" role="document">' +
    '<div class="modal-content">' +

    '<div class="modal-body p-0">' +

    //profil
    '<div class="profileBox" style="background:#4caf50;">' +
    '<div class="image-wrapper">' +
    '<img src="./src//img/users/alikilic.png" alt="image" class="imaged rounded">' +
    '</div>' +
    '<div class="in">' +
    '<strong>Ali KILIÇ</strong>' +
    '<div class="text-muted"> <ion-icon name="location"></ion-icon> Ankara </div>' +
    '</div>' +
    '<a href="javascript:;" class="close-sidebar-button" data-dismiss="modal" @click="menuToggle"> <ion-icon name="close"></ion-icon> </a>' +
    '</div>' +

    //menu
    //'<nav class="active"><ul class="sidebar1"><li class="active"><a href="#homeSubmenu" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle collapsed"> Home </a> <ul id="homeSubmenu" class="list-unstyled collapse" style=""><li><a href="#">Home 1</a></li> <li><a href="#">Home 2</a></li> <li><a href="#">Home 3</a></li></ul></li> <li><a href="#"> About </a> <a href="#pageSubmenu" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle collapsed"> Pages </a> <ul id="pageSubmenu" style="" class="list-unstyled collapse"><li><a href="#">Page 1</a></li> <li><a href="#">Page 2</a></li> <li><a href="#">Page 3</a></li></ul></li> <li><a href="#"> Portfolio </a></li> <li><a href="#"> FAQ </a></li> <li><a href="#"> Contact </a></li></ul></nav>' +
    '<ul style="list-style: none; padding: 0;">'+
      '<li v-for="(item,sira) in menu" >'+

        '<div v-if="item.submenu.length==0" class="accordion2" style="width: 100%; border:none;" :id="item.id">'+
          '<div class="item">'+
            '<div class="accordion2-header">'+
              '<button  @click="panelAc(item.id,$event)" class="btn collapsed" type="button" data-toggle="collapse" :data-target="\'#accordion\'+sira">'+
                '<ion-icon :name="item.icon" style="margin-right: 25px; color: #4caf50;"></ion-icon> {{item.title}} </button>'+
            '</div>'+
          '</div>'+
        '</div>'+

        '<div v-if="item.submenu.length>0" class="accordion" style="width: 100%; border:none;" :id="item.id">'+
        '<div class="item">'+
          '<div class="accordion-header">'+
            '<button class="btn collapsed" type="button" data-toggle="collapse" :data-target="\'#accordion\'+item.id"> '+
              '<ion-icon :name="item.icon" style="margin-right: 25px; color: #4caf50;"></ion-icon> {{item.title}} </button>'+
          '</div>'+
          '<div :id="\'accordion\'+item.id" class="accordion-body collapse" :data-parent="\'#accordion\'+item.id">'+
            '<ul class="listview flush transparent no-line image-listview mt-2" style="margin-top: 0 !important;">'+
              '<li v-for="item2 in item.submenu">' +
              '<a @click="panelAc(item2.id,$event)" v-if="item2.submenu.length==0" href="#" style="padding: 0; padding-left: 25px; min-height: 35px;"  class="item" >' +
              '<div class="icon-box"> <ion-icon :name="item2.icon"></ion-icon> </div>' +
              '<div class="in"> <div>{{item2.title}}</div> </div>' +
              '</a>' +
              '</li>' +
            '</ul>'+
          '</div>'+
          '</div>'+
        '</div>'+
      '</li>'+
      
    '</ul>'+
    
    '<ul class="listview flush transparent no-line image-listview mt-2">' +
    //gece modu
      '<li>' +
      '<div class="item">' +
      '<div class="icon-box"> <ion-icon style="color: #4caf50;" name="moon-outline"></ion-icon> </div>' +
      '<div class="in">' +
      '<div>{{GL.lang.panel.mymenu.darkmode}}</div>' +
      '<div class="custom-control custom-switch" >' +
      '<input type="checkbox" :checked="GL.config.darkMode" class="custom-control-input" @change="darkMode" id="darkmodesidebar">' +
      '<label class="custom-control-label" for="darkmodesidebar"></label>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</li>' +
    '</ul>' +

    '</div>' +

    '<div class="sidebar-buttons">' +
    '<a href="javascript:;" @click="panelAc(\'profil\',$event)" class="button"> <ion-icon name="person-outline"></ion-icon> </a>' +
    '<a href="javascript:;" @click="panelAc(\'downloads\',$event)" class="button"> <ion-icon name="archive-outline"></ion-icon> </a>' +
    '<a href="javascript:;" @click="panelAc(\'settings\',$event)" class="button"> <ion-icon name="settings-outline"></ion-icon> </a>' +
    '<a href="javascript:;" @click="panelAc(\'exit\',$event)" class="button"> <ion-icon name="log-out-outline"></ion-icon> </a>' +
    '</div>' +

    '</div>' +
    '</div>' +
    '</div>' +
    '</div>'
});

var mymenu = new Vue({
  el: '#mymenu'
});