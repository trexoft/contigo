Vue.component('layerhistory', {
	data:function(){
		return this.setDefault();
  },
  methods:{
      setDefault:function(){
          return {
              onoff:false,
              tab1class:"",
              tab2class:"",
              tab3class:"",
              header:"Katalog Oluşturma/Geçmiş",
              pages:[{i:0,id:'tab1',title:'Harita',active:false,class:"tab-pane"},
                     {i:1,id:'tab2',title:'Katalog Oluştur',active:false,class:"tab-pane"},
                     {i:2,id:'tab3',title:'Geçmiş Katmanlar',active:false,class:"tab-pane"}],
              history:[],
              layers:[],
              layers2:[],
              activeLayers:[],
              catalogName:"",
              catalog:{
                "id":"",
                "name":"",
                "type":"gislayer-catalog-file",
                "center":[],
                "zoom":0,
                "pitch":0,
                "rotate":0,
                "basemap":{
                  "web":{
                    "url":"http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                  },
                  "mobile":{
                    "light":"mapbox://styles/mapbox/streets-v11",
                    "dark":"mapbox://styles/mapbox/dark-v10"
                  }
                },
                "darkMode":false,
                "layers":[]
              }
          }
      },
      open:function(){
        this.onoff = true;
        this.setPage('tab3');
        GL.touch.on('#layerhistory',function(event,direction){
          debugger;
          that.setPageDirection(direction);
        });

        if(localStorage.getItem('GL-LayerHistory')!=null){
          var dataa=localStorage.getItem('GL-LayerHistory');
          if(dataa.length>1){
              this.history=JSON.parse(dataa);
          }else{
              this.history.push(JSON.parse(dataa));
          }
        }

        for(var i=0;i<this.history.length;i++){
          var layerid=this.history[i].id;
          var found = GL.layerbox.getSource(layerid);
          if(found!=undefined){
            this.layers.push({name:this.history[i].name,id:layerid,active:true})
          }else{
            this.layers.push({name:this.history[i].name,id:layerid,active:false})
          }
        }
        

      },
      openCatalogCreation:function(){
        this.onoff = true;
        this.setPage('tab2');
        GL.touch.on('#layerhistory',function(event,direction){
          debugger;
          that.setPageDirection(direction);
        });

        if(localStorage.getItem('GL-LayerHistory')!=null){
          var dataa=localStorage.getItem('GL-LayerHistory');
          if(dataa.length>1){
              this.history=JSON.parse(dataa);
          }else{
              this.history.push(JSON.parse(dataa));
          }
        }

        for(var i=0;i<this.history.length;i++){
          var layerid=this.history[i].id;
          var found = GL.layerbox.getSource(layerid);
          if(found!=undefined){
            this.layers2.push({name:this.history[i].name,id:layerid,active:true,label:layerid+"2"})
          }else{
            this.layers2.push({name:this.history[i].name,id:layerid,active:false,label:layerid+"2"})
          }
        }
      },
      close:function(e){
        this.layers=[];
        this.history=[];
        this.onoff = false;
        this.firstCatalog();
        GL.touch.off('#layerhistory');
        this.pages.map(function(a){
          a.active=false;
          a.class="tab-pane";
        });
        $("#map").show();
      },
      setPage:function(pageId){
        var that = this;
        var activePage = this.pages.find(function(p){
          if(p.active==true){
            return p;
          }
        });

        var newPage = this.pages.find(function(p){
          if(p.id==pageId){
            return p;
          }
        });

        if(typeof activePage!=="undefined"){
          if(activePage.id==newPage.id){
            return false;
          }else{

            var activePageClass = "fadeOutRight";
            var newPageClass = "fadeInLeft";
            if(newPage.i>activePage.i){
              activePageClass="fadeOutLeft";
              newPageClass="fadeInRight";
            }

            this.pages[activePage.i].active=false;
            this.pages[newPage.i].active=true;
            this.pages[activePage.i].class="tab-pane animated3 "+activePageClass+" active";
            setTimeout(function(){
              that.pages[activePage.i].class="tab-pane";
              that.pages[newPage.i].class="tab-pane animated3 "+newPageClass+" active";
              that.doIt(newPage.id);
            },200);
          }
        }else{
          $("#map").hide();
          this.pages[newPage.i].active=true;
          this.pages[newPage.i].class="tab-pane animated3 fadeIn active"
        }
      },
      setPageDirection:function(direction){
        var activePage = this.pages.find(function (p) {
          if (p.active == true) {
            return p;
          }
        });
        var min = 0;
        var max = this.pages.length-1;
        var now = activePage.i;
        var artis = 0;
        if(direction=="right"){
          artis=-1;
        }else{
          artis=1;
        }
        var newnow = now+artis;
        if(newnow<min){
          newnow = min;
        }
        if(newnow>max){
          newnow = max;
        }
        var newPage = this.pages.find(function (p) {
          if (p.i == newnow) {
            return p;
          }
        });
        this.setPage(newPage.id);
  
      },
      doIt:function(tabId){
        switch(tabId){
          case 'tab1':{
            $("#map").show();
            break;
          }
          case 'tab2':{
            $("#map").hide();
            this.layers2=[];
            for(var i=0;i<this.history.length;i++){
              var layerid=this.history[i].id;
              var found = GL.layerbox.getSource(layerid);
              if(found!=undefined){
                this.layers2.push({name:this.history[i].name,id:layerid,active:true,label:layerid+"2"})
              }else{
                this.layers2.push({name:this.history[i].name,id:layerid,active:false,label:layerid+"2"})
              }
            }
            break;
          }
          case 'tab3':{
            $("#map").hide();
            this.layers=[];
            for(var i=0;i<this.history.length;i++){
              var layerid=this.history[i].id;
              var found = GL.layerbox.getSource(layerid);
              if(found!=undefined){
                this.layers.push({name:this.history[i].name,id:layerid,active:true})
              }else{
                this.layers.push({name:this.history[i].name,id:layerid,active:false})
              }
            }
            break;
          }
        }
      },
      getActive:function(id,i){
        if(this.layers[i].active==true){
          for(var j=0;j<this.history.length;j++){
            if(this.history[j].id==id){
              console.log(this.history[j]);
              GL.creteCatalogLayer(this.history[j])
            }
          }
        }else{
          for(var j=0;j<this.history.length;j++){
            if(this.history[j].id==id){
              if(this.history[j].geotype=="wms" || this.history[j].geotype=="xyz" || this.history[j].geotype=="wmts"){
                GL.removeRasterLayerByID(id);
              }else{
                GL.removeLayerByID(id);
              }
            }
          }
        }
      },
      downloadCatalog:function(){
        var that=this;
        if(this.catalogName==""){
          GL.uyari("Lütfen katalog adını giriniz");
        }else{
          // Get Map Settings
          var catalogID="GisLayerCatalog-"+Date.now();
          var center = GL.map.getCenter();
          var center2=[center.lng,center.lat];
          var zoom=GL.map.getZoom();
          var bearing=GL.map.getBearing();
          var pitch=GL.map.getPitch();
          var darkmode=GL.config.darkMode;

          var catalog=[];
          for(var i=0;i<this.layers2.length;i++){
              if(this.layers2[i].active==true){
                  var j=this.history.findIndex((lay) => lay.id==that.layers2[i].id);
                  catalog.push(this.history[j]);
              }
          }

          if(catalog.length==0){
            GL.uyari("Katalog içeriği boş olamaz");
          }else{
            this.catalog.name=this.catalogName;
            this.catalog.id=catalogID;

            this.catalog.center=center2;
            this.catalog.zoom=zoom;
            this.catalog.bearing=bearing;
            this.catalog.pitch=pitch;
            this.catalog.darkMode=darkmode;

            this.catalog.layers=catalog;

            console.log(this.catalog);
            var date=GL.getDate();
            download(JSON.stringify(this.catalog), "GisLayer-Catalog-"+date+".json", "text/plain");
            GL.bilgi("Katalog dosyası indirildi");
            this.firstCatalog();
          }
          
        }
        
        
      },
      firstCatalog:function(){
        this.catalog={
          "id":"",
          "name":"",
          "type":"gislayer-catalog-file",
          "center":[],
          "zoom":0,
          "pitch":0,
          "rotate":0,
          "basemap":{
            "web":{
              "url":"http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            },
            "mobile":{
              "light":"mapbox://styles/mapbox/streets-v11",
              "dark":"mapbox://styles/mapbox/dark-v10"
            }
          },
          "darkMode":false,
          "layers":[]
        };
      }
  },
  template:
  '<div v-if="onoff">'+

      '<div class="appHeader bg-primary text-light">'+
      '<div class="left">'+
          '<a href="javascript:;" class="headerButton goBack" @click="close">'+
              '<ion-icon name="chevron-back-outline"></ion-icon>'+
          '</a>'+
      '</div>'+
        '<div class="pageTitle">{{header}}</div>'+
        '<div class="right"></div>'+
      '</div>'+


        //header
      '<div class="extraHeader p-0">'+
          '<ul class="nav nav-tabs lined" role="tablist">'+
          '<li class="nav-item" v-for="(item,i) in pages">'+
                  '<a :class="item.active==true?\'nav-link active\':\'nav-link\'" @click="setPage(item.id)" href="#">'+
                      '{{item.title}}'+
                  '</a>'+
              '</li>'+
          '</ul>'+
      '</div>'+
    
          '<div id="appCapsule" class="extra-header-active" style="padding-top: 50px !important;">'+

            '<div class="tab-content mt-1">'+

            // tab2
            '<div :class="pages[1].class">'+
            '<div class="section full mt-1">'+
                '<div class="wide-block pt-2 pb-2">'+

                  '<div v-if="layers2.length>0" class="form-group boxed">'+
                        '<div class="input-wrapper">'+
                            '<label class="label" for="name5">Katalog Adı</label>'+
                            '<input type="text" class="form-control" id="name5" v-model="catalogName" placeholder="Oluşturulacak katalog adı">'+
                            '<i class="clear-input">'+
                                '<ion-icon name="close-circle"></ion-icon>'+
                            '</i>'+
                        '</div>'+
                  '</div>'+

                '<ul class="listview link-listview">'+
                  '<li v-for="(item,i) in layers2" style="padding:10px;">'+
                          '<div>{{item.name}}</div>'+
                          '<div class="custom-control custom-checkbox">'+
                            '<input type="checkbox" :id="item.label" class="custom-control-input" v-model="item.active">'+
                            '<label class="custom-control-label" :for="item.label"></label>'+
                          '</div>'+
                  '</li>'+
                '</ul>'+

                '<div v-if="layers2.length>0" class="form-group boxed">'+
                        '<div class="form-group basic">'+
                            '<div class="input-wrapper">'+
                            '<button @click="downloadCatalog" type="button" class="btn btn-primary btn-block">Katalog Oluştur</button>'+
                            '</div>'+
                        '</div>'+
                '</div>'+

                '</div>'+
            '</div>'+
            '</div>'+
              
            // tab3
            '<div :class="pages[2].class">'+
            '<div class="section full mt-1">'+
                '<div class="wide-block pt-2 pb-2">'+
  
                '<ul class="listview link-listview">'+
                  '<li v-for="(item,i) in layers" style="padding:10px;">'+
                          '<div>{{item.name}}</div>'+
                          '<div class="custom-control custom-switch">'+
                            '<button type="button" class="btn btn-text-primary">Sil</button>'+
                            '<input :id="item.id" @change="getActive(item.id,i)" type="checkbox" v-model="item.active" class="custom-control-input">'+
                                '<label :for="item.id" class="custom-control-label"></label>'+
                          '</div>'+
                  '</li>'+
                '</ul>'+
  
                '</div>'+
            '</div>'+
            '</div>'+

          '</div>'+
    '</div>'
  
  });

var layerhistory = new Vue({ el: '#layerhistory' });