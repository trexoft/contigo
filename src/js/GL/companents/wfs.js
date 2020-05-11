Vue.component('addwfs', {
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
              header:"WFS Servisi Ekleme",
              pages:[{i:0,id:'tab1',title:'Harita',active:false,class:"tab-pane"},
                     {i:1,id:'tab2',title:'Servis Ekle',active:false,class:"tab-pane"},
                     {i:2,id:'tab3',title:'Geçmiş',active:false,class:"tab-pane"}],
              layerName:"",
              url:"",
              servicelayer:"",
              versions:{selected:"1.0.0",data:[{name:"1.0.0", value:"1.0.0"},{name:"1.1.0",value:"1.1.0"},{name:"2.0.0",value:"2.0.0"}]},
              history:[],
              layers:[]
          }
      },
      open:function(){
        this.onoff = true;
        this.setPage('tab2');
        GL.touch.on('#addwfs',function(event,direction){
          debugger;
          that.setPageDirection(direction);
        });
      },
      close:function(e){
        this.onoff = false;
        GL.touch.off('#addwfs');
        this.pages.map(function(a){
          a.active=false;
          a.class="tab-pane";
        });
        $("#map").show();
        GL.wfsUrl="";
        GL.wfslayerName="";
        GL.wfsVersion="";
        GL.wfsServicelayer="";
        GL.wfsQuery=false;
        GL.wfsLayerId="";
        this.history=[];
        this.layers=[];
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
            break;
          }
          case 'tab3':{
            $("#map").hide();
            this.history=[];
            this.layers=[];
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
                  this.layers.push({name:this.history[i].name,id:layerid,active:true,method:this.history[i].method})
                }else{
                  this.layers.push({name:this.history[i].name,id:layerid,active:false,method:this.history[i].method})
                }
            }
            break;
          }
        }
      },
      saveLayer:function(){
        var that=this;
        if (this.layerName==""){
          GL.uyari("Katman Adı Boş Olamaz");
        }else if(this.url==""){
          GL.uyari("URL adresi boş olamaz");
        }else if(this.servicelayer==""){
          GL.uyari("Servis Katman Adı Boş Olamaz");
        }else{
          //"http://localhost:8080/geoserver/deneme/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=deneme:izmir&maxFeatures=50&outputFormat=application%2Fjson"
          var id = 'wfsLayer'+Date.now();
          GL.wfsUrl=this.url;
          GL.wfslayerName=this.layerName;
          GL.wfsVersion=this.versions.selected;
          GL.wfsServicelayer=this.servicelayer;
          GL.wfsQuery=true;
          GL.wfsLayerId=id;
          // Get initial values
          var zoom=GL.map.getZoom();
          var center=GL.map.getCenter();

          var bbox = geoViewport.bounds(
              [Number(center.lat),
              Number(center.lng)],
              parseInt(zoom,10),
          [600, 400]);
          
          var url2=this.url+"?service=WFS&version="+this.versions.selected+'&srsname=EPSG:4326&request=GetFeature&bbox='+bbox[1]+","+bbox[3]+","+bbox[0]+","+bbox[2]+',EPSG:4326&typeName='+this.servicelayer+"&outputFormat=application%2Fjson";
          
          GL.getWFSQuery(url2,this.layerName,id);

          var style={
            "status": true,
            "type": "color",
            "color": {
              "color": "#35af6d"
            }
          }
          
          GL.createLayerHistory3("createWFS",id,this.layerName,this.url,this.servicelayer,"wfs",this.versions.selected,style);
          
          this.setPage("tab1");
          GL.bilgi("Başarıyla Eklendi");   
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
                GL.removeLayerByID(id);
            }
          }
        }
      },
    deleteLayer:function(item,i){
        this.layers.splice(i,1);
        this.history.splice(i,1);
        GL.savelocalstorage("GL-LayerHistory",this.history);
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

                  '<div class="form-group boxed" style="padding-left:5%; padding-right:5%;">'+
                            '<div class="input-wrapper">'+
                                '<label class="label" for="layername">Katman Adı</label>'+
                                '<input type="text" v-model="layerName" class="form-control" id="layername" placeholder="Lütfen Katman Adını Giriniz">'+
                                '<i class="clear-input">'+
                                    '<ion-icon name="close-circle"></ion-icon>'+
                                '</i>'+
                            '</div>'+
                        '</div>'+
        
                        '<div class="form-group boxed" style="padding-left:5%; padding-right:5%;">'+
                            '<div class="input-wrapper">'+
                                '<label class="label" for="urlwfs">URL</label>'+
                                '<input type="text" v-model="url" class="form-control" id="urlwfs" placeholder="URL adresini girin">'+
                                '<i class="clear-input">'+
                                    '<ion-icon name="close-circle"></ion-icon>'+
                                '</i>'+
                            '</div>'+
                        '</div>'+

                        '<div class="form-group boxed" style="padding-left:5%; padding-right:5%;">'+
                            '<div class="input-wrapper">'+
                                '<label class="label" for="servicelayer">Serviste Kullanılan Katman Adı</label>'+
                                '<input type="text" v-model="servicelayer" class="form-control" id="servicelayer" placeholder="Serviste Kullanılan Katman Adı">'+
                                '<i class="clear-input">'+
                                    '<ion-icon name="close-circle"></ion-icon>'+
                                '</i>'+
                            '</div>'+
                        '</div>'+

                        '<div class="form-group basic" style="padding-left:5%; padding-right:5%;">'+
                            '<div class="input-wrapper">'+
                                '<label class="label" for="version2">Versiyon</label>'+
                                '<select v-model="versions.selected" class="form-control custom-select" id="version2">'+
                                    '<option v-for="item in versions.data" :value="item.value">{{item.name}}</option>'+
                                '</select>'+
                            '</div>'+
                        '</div>'+
                        
                        '<div class="form-group boxed">'+
                            '<button type="button" @click="saveLayer" class="btn btn-primary btn-block ">Kayıt Et</button>'+
                        '</div>'+

                '</div>'+
            '</div>'+
            '</div>'+
              
            // tab3
            '<div :class="pages[2].class">'+
            '<div class="section full mt-1">'+
                '<div class="wide-block pt-2 pb-2">'+
  
                    '<ul class="listview link-listview">'+
                        '<li v-for="(item,i) in layers" v-if="item.method==\'createWFS\'" style="padding:10px;">'+
                                '<div>{{item.name}}</div>'+
                                '<div class="custom-control custom-switch">'+
                                '<button type="button" @click="deleteLayer(item.id,i)" class="btn btn-text-primary">Sil</button>'+
                                '<input :id="item.id" type="checkbox" @change="getActive(item.id,i)" v-model="item.active" class="custom-control-input">'+
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

var addwfs = new Vue({ el: '#addwfs' });