Vue.component('addmvt', {
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
              header:"MVT Servisi Ekleme",
              pages:[{i:0,id:'tab1',title:'Harita',active:false,class:"tab-pane"},
                     {i:1,id:'tab2',title:'Servis Ekle',active:false,class:"tab-pane"},
                     {i:2,id:'tab3',title:'Geçmiş',active:false,class:"tab-pane"}],
              layerName:"",
              url:"",
              minzoom:0,
              maxzoom:18,
              sourcelayer:"",
              history:[],
              layers:[]
          }
      },
      open:function(){
        this.onoff = true;
        this.setPage('tab2');
        GL.touch.on('#addmvt',function(event,direction){
          debugger;
          that.setPageDirection(direction);
        });

      },
      close:function(e){
        this.onoff = false;
        GL.touch.off('#addmvt');
        this.pages.map(function(a){
          a.active=false;
          a.class="tab-pane";
        });
        $("#map").show();
        this.url="";
        this.sourcelayer="";
        this.layerName="";
        this.maxzoom=18;
        this.minzoom=0;
        this.layers=[];
        this.history=[];
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
        if (this.layerName==""){
            GL.uyari("Katman Adı Boş Olamaz");
        }else if(this.url=="" || this.sourcelayer==""){
            GL.uyari("URL adresi boş olamaz");
        }else{
            if(this.maxzoom==""){
                this.maxzoom=18;
            }
            if(this.minzoom=""){
                this.minzoom=0;
            }
            var id=Date.now().toString();
            GL.addMVTLayer(id,this.url,this.sourcelayer,this.layerName,this.minzoom,this.maxzoom);
            //$("#addmvtserver").modal('hide');
            this.setPage("tab1");
            GL.bilgi("Başarıyla Eklendi");

            this.url="";
            this.sourcelayer="";
            this.layerName="";
            this.maxzoom=18;
            this.minzoom=0;
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
                            '<label class="label" for="layernamemvt">Katman Adı</label>'+
                            '<input type="text" v-model="layerName" class="form-control" id="layernamemvt" placeholder="Lütfen Katman Adını Giriniz">'+
                            '<i class="clear-input">'+
                                '<ion-icon name="close-circle"></ion-icon>'+
                            '</i>'+
                        '</div>'+
                    '</div>'+

                    '<div class="form-group boxed" style="padding-left:5%; padding-right:5%;">'+
                        '<div class="input-wrapper">'+
                            '<label class="label" for="urlmvt">URL</label>'+
                            '<input type="text" v-model="url" class="form-control" id="urlmvt" placeholder="URL adresini girin">'+
                            '<i class="clear-input">'+
                                '<ion-icon name="close-circle"></ion-icon>'+
                            '</i>'+
                        '</div>'+
                    '</div>'+

                    '<div class="form-group boxed" style="padding-left:5%; padding-right:5%;">'+
                        '<div class="input-wrapper">'+
                            '<label class="label" for="sourcemvt">Kaynak Katman Adı</label>'+
                            '<input type="text" v-model="sourcelayer" class="form-control" id="sourcemvt" placeholder="Kaynak Katman Adını Giriniz">'+
                            '<i class="clear-input">'+
                                '<ion-icon name="close-circle"></ion-icon>'+
                            '</i>'+
                        '</div>'+
                    '</div>'+

                    '<div class="form-group boxed" style="padding-left:5%; padding-right:5%;">'+
                        '<div class="input-wrapper">'+
                            '<label class="label" for="minzoom">Minumum Yaklaştırma Seviyesi</label>'+
                            '<input type="number" v-model="minzoom" class="form-control" id="minzoom" placeholder="Minumum Yaklaştırma Seviyesi">'+
                            '<i class="clear-input">'+
                                '<ion-icon name="close-circle"></ion-icon>'+
                            '</i>'+
                        '</div>'+
                    '</div>'+

                    '<div class="form-group boxed" style="padding-left:5%; padding-right:5%;">'+
                        '<div class="input-wrapper">'+
                            '<label class="label" for="maxzoom">Maksimum Yaklaştırma Seviyesi</label>'+
                            '<input type="number" v-model="maxzoom" class="form-control" id="maxzoom" placeholder="Maksimum Yaklaştırma Seviyesi">'+
                            '<i class="clear-input">'+
                                '<ion-icon name="close-circle"></ion-icon>'+
                            '</i>'+
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
                //'<div class="section-title">Tab 3</div>'+
                '<div class="wide-block pt-2 pb-2">'+
  
                    '<ul class="listview link-listview">'+
                        '<li v-for="(item,i) in layers" v-if="item.method==\'createMVT\'" style="padding:10px;">'+
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

var addmvt = new Vue({ el: '#addmvt' });