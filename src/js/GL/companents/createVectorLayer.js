Vue.component('createvectorlayer', {
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
              header:"Vektör Katman Oluşturma",
              pages:[
                {i:0,id:'tab1',title:'Ayarlar',active:false,class:"tab-pane"},
                {i:1,id:'tab2',title:'Görünüm',active:false,class:"tab-pane"},
                {i:2,id:'tab3',title:'Sütunlar',active:false,class:"tab-pane"}],
              layer:{
                name:'',
                paint:{
                  color:'',
                  status:true,
                  fill:{
                    color:"",
                    opacity:1,
                    outlineColor:"",
                    visibility:true
                  },
                  line:{
                    color:"",
                    dasharray:[],
                    opacity:1,
                    width:3,
                    visibility:true
                  },
                  circle:{
                    color:'',
                    opacity:1,
                    radius:5,
                    outlineColor:'',
                    outlineOpacity:1,
                    outlineWidth:0,
                    visibility:true
                  }
                },
                type:{selected:'collection',data:[
                  {value:'collection',text:'Hepsi'},
                  {value:'polygon',text:'Kapalı Alan'},
                  {value:'linestring',text:'Çizgi'},
                  {value:'point',text:'Nokta'}
                ]},
                fields:[
                  {name:'index',type:'integer',unique:true,auto:true,protecth:true},
                  {name:'geotype',type:'string',protecth:true},
                ],
                unique:false,
                auto:false,
                edit:true,
                default:false,
                startValue:0,
                defaultValueString:"",
                defaultValueInteger:0,
                defaultValueDouble:0.0,
                defaultValueBoolean:true,
                defaultValueDate:null,
                recovery:false,
                service:true
              },
              fieldName:'',
              dataTypes:{
                selected:'string',
                data:[
                  {value:'string',text:'Alfabetik Veri'},
                  {value:'integer',text:'Tam Sayı Verisi'},
                  {value:'double',text:'Noktalı Sayı Verisi'},
                  {value:'boolean',text:'Mantıksal Veri'},
                  {value:'date',text:'Tarih Verisi'},
                ]
              },
              epsgInfo:"EPSG:4326 (WGS84)",
              area:false,
              line:false,
              point:false
              
          }
      },
      open:function(){
        this.onoff = true;
        this.setPage('tab1');
        GL.touch.on('#createvectorlayer',function(event,direction){
          that.setPageDirection(direction);
        });
        var color = GL.layerbox.getNewColor();
        this.layer.paint.status=false;
        this.layer.paint.color=color;
        this.layer.paint.fill.color=color;
        this.layer.paint.fill.outlineColor=color;
        this.layer.paint.line.color=color;
        this.layer.paint.circle.color=color;
        this.layer.paint.circle.outlineColor=color;
      },
      close:function(e){
        this.onoff = false;
        GL.touch.off('#createvectorlayer');
        this.pages.map(function(a){
          a.active=false;
          a.class="tab-pane";
        });
        this.fields=[
          {name:'index',type:'integer',unique:true,auto:true,protecth:true},
          {name:'geotype',type:'string',protecth:true},
        ];
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
            break;
          }
          case 'tab2':{
            if(this.layer.type.selected=="collection"){
              this.area=true;
              this.line=true;
              this.point=true;
            }else if(this.layer.type.selected=="polygon"){
              this.area=true;
              this.line=false;
              this.point=false;
            }else if(this.layer.type.selected=="linestring"){
              this.area=false;
              this.line=true;
              this.point=false;
            }else if(this.layer.type.selected=="point"){
              this.area=false;
              this.line=false;
              this.point=true;
            }
            break;
          }
          case 'tab3':{
            break;
          }
        }
      },
      changeColor:function(type){
        var that = this;
        GL.renkAl(function(color){
          if(type=='color'){
            that.layer.paint.color=color;
          }
          if(type=='fill'){
            that.layer.paint.fill.color=color;
          }
          if(type=='fillborder'){
            that.layer.paint.fill.outlineColor=color;
          }
          if(type=='line'){
            that.layer.paint.line.color=color;
          }
          if(type=='circle'){
            that.layer.paint.circle.color=color;
          }
          if(type=='circleoutlineColor'){
            that.layer.paint.circle.outlineColor=color;
          }
          that.$forceUpdate();
        });
      },
      writeField:function(){
        var fieldName = this.fieldName;
        fieldName = fieldName.toLowerCase();
        fieldName = fieldName.replace(/[^a-z0-9]/gi,'');
        while(fieldName.indexOf(' ')!==-1){
          fieldName=fieldName.replace(' ','');
        }
        fieldName=fieldName.trim();
        if(isNaN(fieldName[0])==false){
          fieldName = fieldName.slice(1);
        }
        this.fieldName=fieldName;
      },
      addField:function(){
        debugger;
        if(this.fieldName!==""){
          this.writeField();
          var fieldName = this.fieldName;
          var kontrol = this.layer.fields.find(function(a){
            if(a.name==fieldName){
              return true;
            }
          });
          if(kontrol==undefined){
            var obj = {name:fieldName,type:this.dataTypes.selected,protecth:false};
            if(this.dataTypes.selected=='integer'){
              if(this.layer.unique==true){
                obj["unique"]=true;
              }else{
                obj["unique"]=false;
              }
              if(this.layer.auto==true){
                obj["auto"]=true;
                obj["index"]=parseInt(this.layer.startValue,10);
              }else{
                obj["auto"]=false;
              }

              if(this.layer.default==true){
                obj["default"]=true;
                obj["defaultInteger"]=parseInt(this.layer.defaultValueInteger,10);
              }else{
                obj["default"]=false;
              }
            }

            if(this.layer.edit==true){
              obj["protecth"]=true;
            }else{
              obj["protecth"]=false;
            }

            if(this.dataTypes.selected=='string'){
              if(this.layer.default==true){
                obj["default"]=true;
                obj["defaultString"]=this.layer.defaultValueString;
              }else{
                obj["default"]=false;
              }
            }

            if(this.dataTypes.selected=='double'){
              if(this.layer.default==true){
                obj["default"]=true;
                obj["defaultDouble"]=Number(this.layer.defaultValueDouble);
              }else{
                obj["default"]=false;
              }
            }

            if(this.dataTypes.selected=='boolean'){
              if(this.layer.default==true){
                obj["default"]=true;
                obj["defaultBoolean"]=this.layer.defaultValueBoolean;
              }else{
                obj["default"]=false;
              }
            }

            if(this.dataTypes.selected=='date'){
              if(this.layer.default==true){
                obj["default"]=true;
                obj["defaultDate"]=this.layer.defaultValueDate;
              }else{
                obj["default"]=false;
              }
            }

            this.layer.fields.push(obj);
            
            GL.bilgi(fieldName+" Sütunu Eklenmiştir");
            this.fieldName='';
            this.dataTypes.selected='string';
          }else{
            GL.uyari("Benzer bir sütun zaten bulunmaktadır");
          }
        }else{
          GL.uyari("Sütun adı boş olamaz");
        }
      },
      deleteField:function(i){
        this.layer.fields.splice(i,1);
        GL.bilgi("Sütun Silinmiştir.");
      },
      nextTab:function(){
        if(this.pages[0].active==true){
          if(this.layer.name==''){
            GL.uyari("Katman Adı Boş Olamaz");
          }else{
            this.setPage('tab2')
          }
        }else if(this.pages[1].active==true){
          this.setPage('tab3')
        }
      },
      createVectorLayer:function(){
        GL.createVectorLayer(this.layer);
        GL.bilgi("Vektör Katman Oluşturuldu");
        this.clearValues();
        this.close();
      },
      changeTab:function(id){
        if(this.pages[0].active==true && id=="tab2"){
          if(this.layer.name==''){
            GL.uyari("Katman Adı Boş Olamaz");
          }else{
            this.setPage('tab2')
          }
        }else if(this.pages[0].active==true && id=="tab3"){
          if(this.layer.name==''){
            GL.uyari("Katman Adı Boş Olamaz");
          }else{
            this.setPage('tab3')
          }
        }else if(this.pages[1].active==true && id=="tab1"){
          this.setPage('tab1')
        }else if(this.pages[1].active==true && id=="tab3"){
          this.setPage('tab3')
        }else if(this.pages[2].active==true && id=="tab2"){
          this.setPage('tab2')
        }else if(this.pages[2].active==true && id=="tab1"){
          this.setPage('tab1')
        }

      },
      change:function(event){
        if(this.layer.default==true){
          if(this.layer.auto==true){
            if(event=="default"){
              this.layer.auto=false
            }else if(event=="auto"){
              this.layer.default=false
            }
          }
        }
      },
      getDate:function(){
        var date=GL.getDate();
        var date2=date.split(" ");
        console.log(date2);
        this.defaultValueDate=date2[0];
        
      },
      clearValues:function(){
        this.layer.name="";
        this.fieldName="";
        this.unique=false;
        this.auto=false;
        this.edit=true;
        this.default=false;
        this.layer.fields=[
          {name:'index',type:'integer',unique:true,auto:true,protecth:true},
          {name:'geotype',type:'string',protecth:true},
        ]
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
                  '<a :class="item.active==true?\'nav-link active\':\'nav-link\'" @click="changeTab(item.id)" href="#">'+
                      '{{item.title}}'+
                  '</a>'+
              '</li>'+
          '</ul>'+
      '</div>'+
    
          '<div id="appCapsule" class="extra-header-active" style="padding-top: 50px !important;">'+

            '<div class="tab-content mt-1">'+

            // tab1
            '<div :class="pages[0].class">'+
            '<div class="section full mt-1">'+
                '<div class="wide-block">'+

                  '<div class="section full">'+
                    '<div class="wide-block pb-1 pt-2">'+
                      '<form>'+

                        '<div class="form-group basic">'+
                          '<div class="input-wrapper">'+
                            '<label class="label">Katmanın Adı :</label>'+
                            '<input type="text" class="form-control" v-model="layer.name" placeholder="Lütfen Katmanın Adını Giriniz">'+
                            '<i class="clear-input"> <ion-icon name="close-circle"></ion-icon></i>'+
                          '</div>'+
                        '</div>'+

                        '<div class="form-group basic">'+
                          '<div class="input-wrapper">'+
                            '<label class="label" >Geometri Tipi :</label>'+
                            '<select class="form-control custom-select" v-model="layer.type.selected">'+
                              '<option v-for="opt in layer.type.data" :value="opt.value">{{opt.text}}</option>'+
                            '</select>'+
                          '</div>'+
                        '</div>'+

                        '<div class="form-group boxed">'+
                            '<div class="input-wrapper">'+
                                '<label class="label" for="distanceresult">Koordinat Sistemi Bilgisi</label>'+
                                '<input type="text" class="form-control" id="distanceresult" v-model="epsgInfo" placeholder="Hesapla Tuşuna Basınız" readonly>'+
                                '<i class="clear-input">'+
                                    '<ion-icon name="close-circle"></ion-icon>'+
                                '</i>'+
                            '</div>'+
                        '</div>'+

                        '<ul class="listview simple-listview">'+
                          '<li style="padding:0;">'+
                            '<div>Telefona Yedekleme</div>'+
                            '<div class="custom-control custom-switch">'+
                            '<input id="stylingVectorCheckbox1" type="checkbox" v-model="layer.recovery" class="custom-control-input">'+
                                '<label for="stylingVectorCheckbox1" class="custom-control-label"></label>'+
                            '</div>'+
                          '</li>'+
                          '<li style="padding:0;">'+
                            '<div>Sisteme Kaydetme</div>'+
                            '<div class="custom-control custom-switch">'+
                                '<input id="stylingVectorCheckbox2" type="checkbox" v-model="layer.service" class="custom-control-input">'+
                                '<label for="stylingVectorCheckbox2" class="custom-control-label"></label>'+
                            '</div>'+
                          '</li>'+
                        '</ul>'+

                        '<div class="form-group basic">'+
                          '<div class="input-wrapper">'+
                            '<button @click="nextTab" type="button" class="btn btn-info btn-block">Kaydet ve İlerle</button>'+
                          '</div>'+
                        '</div>'+

                      '</form>'+
                    '</div>'+
                  '</div>'+

                '</div>'+
            '</div>'+
            '</div>'+

            // tab2
            '<div :class="pages[1].class">'+
            '<div class="section full mt-1">'+
                '<div class="wide-block pt-2 pb-2">'+

                '<div class="section full">'+
                  '<div class="wide-block pb-1 pt-2">'+

                    //tek renk isterse
                    '<form>'+

                    '<ul class="listview simple-listview">'+
                      '<li style="padding:0;">'+
                        '<div style="font-size: 12px;">Tek Renk Kullanımı ({{layer.paint.status==true?\'Açık\':\'Kapalı\'}})</div>'+
                        '<div class="custom-control custom-switch">'+
                        '<input id="stylingVectorCheckbox3" type="checkbox" v-model="layer.paint.status" class="custom-control-input">'+
                            '<label for="stylingVectorCheckbox3" class="custom-control-label"></label>'+
                        '</div>'+
                      '</li>'+
                    '</ul>'+

                    '<div class="form-group basic" v-if="layer.paint.status==true">'+
                      '<div class="input-wrapper">'+
                        '<label class="label mb-1" >Katman Rengi : {{layer.paint.color}}</label>'+
                        '<button type="button" @click="changeColor(\'color\')" :style="{backgroundColor:layer.paint.color,color:\'#FFF\'}" class="btn btn-block">'+
                        '<ion-icon name="color-palette-outline"></ion-icon>'+
                        ' Renk Seç</button>'+
                      '</div>'+
                    '</div>'+

                    '<div  v-if="layer.paint.status==false && area" class="divider bg-primary mt-3 mb-3"> <div class="icon-box bg-primary"> <ion-icon name="arrow-down"></ion-icon> </div> </div>'+

                    //kapalı alan
                    '<h4 v-if="layer.paint.status==false && area" style="color: #8ac24a;">Kapalı Alan Stillendirmesi</h4>'+

                    '<ul v-if="layer.paint.status==false && area"  class="listview simple-listview">'+
                      '<li style="padding:0;">'+
                        '<div style="font-size: 12px;">Görünürlük ({{layer.paint.fill.visibility==true?\'Açık\':\'Kapalı\'}})</div>'+
                        '<div class="custom-control custom-switch">'+
                        '<input id="stylingVectorCheckbox4" type="checkbox" v-model="layer.paint.fill.visibility" class="custom-control-input">'+
                            '<label for="stylingVectorCheckbox4" class="custom-control-label"></label>'+
                        '</div>'+
                      '</li>'+
                    '</ul>'+


                    '<div v-if="layer.paint.status==false && area" class="form-group basic">'+
                      '<div class="input-wrapper">'+
                        '<label class="label mb-1" >Kapalı Alan Rengi : {{layer.paint.fill.color}}</label>'+
                        '<button type="button" @click="changeColor(\'fill\')" :style="{backgroundColor:layer.paint.fill.color,color:\'#FFF\'}" class="btn btn-block">'+
                        '<ion-icon name="color-palette-outline"></ion-icon>'+
                        ' Renk Seç</button>'+
                      '</div>'+
                    '</div>'+

                    '<div v-if="layer.paint.status==false && area" class="form-group basic">'+
                      '<div class="input-wrapper">'+
                        '<label class="label mb-1">Şeffaflık : %{{layer.paint.fill.opacity*100}}</label>'+
                        '<input type="range" class="slider-color" min="0" max="1" step="0.01" v-model="layer.paint.fill.opacity">'+
                        '<i class="clear-input"> <ion-icon name="close-circle"></ion-icon></i>'+
                      '</div>'+
                    '</div>'+

                    '<div v-if="layer.paint.status==false && area" class="form-group basic">'+
                      '<div class="input-wrapper">'+
                        '<label class="label mb-1" >Kapalı Alan Çerçeve Rengi : {{layer.paint.fill.outlineColor}}</label>'+
                        '<button type="button" @click="changeColor(\'fillborder\')" :style="{backgroundColor:layer.paint.fill.outlineColor,color:\'#FFF\'}" class="btn btn-block">'+
                        '<ion-icon name="color-palette-outline"></ion-icon>'+
                        ' Renk Seç</button>'+
                      '</div>'+
                    '</div>'+
                     //kapalı alan

                     '<div v-if="layer.paint.status==false && line" class="divider bg-primary mt-3 mb-3"> <div class="icon-box bg-primary"> <ion-icon name="arrow-down"></ion-icon> </div> </div>'+

                     //line stillendirmesi
                     '<h4 v-if="layer.paint.status==false && line" style="color: #8ac24a;">Çizgi Stillendirmesi</h4>'+
                     '<ul v-if="layer.paint.status==false && line" class="listview simple-listview">'+
                      '<li style="padding:0;">'+
                        '<div style="font-size: 12px;">Görünürlük ({{layer.paint.fill.visibility==true?\'Açık\':\'Kapalı\'}})</div>'+
                        '<div class="custom-control custom-switch">'+
                        '<input id="stylingVectorCheckbox5" type="checkbox" v-model="layer.paint.line.visibility" class="custom-control-input">'+
                            '<label for="stylingVectorCheckbox5" class="custom-control-label"></label>'+
                        '</div>'+
                      '</li>'+
                    '</ul>'+

                    '<div v-if="layer.paint.status==false && line" class="form-group basic">'+
                      '<div class="input-wrapper">'+
                        '<label class="label mb-1">Çizgi Rengi : {{layer.paint.line.color}}</label>'+
                        '<button type="button" @click="changeColor(\'line\')" :style="{backgroundColor:layer.paint.line.color,color:\'#FFF\'}" class="btn btn-block">'+
                        '<ion-icon name="color-palette-outline"></ion-icon>'+
                        ' Renk Seç</button>'+
                      '</div>'+
                    '</div>'+

                    '<div v-if="layer.paint.status==false && line" class="form-group basic">'+
                      '<div class="input-wrapper">'+
                        '<label class="label mb-1">Şeffaflık : %{{layer.paint.line.opacity*100}}</label>'+
                        '<input type="range" class="slider-color" min="0" max="1" step="0.01" v-model="layer.paint.line.opacity">'+
                        '<i class="clear-input"> <ion-icon name="close-circle"></ion-icon></i>'+
                      '</div>'+
                    '</div>'+

                    '<div v-if="layer.paint.status==false && line" class="form-group basic">'+
                      '<div class="input-wrapper">'+
                        '<label class="label mb-1">Çizgi Kalınlığı : {{layer.paint.line.width}}px</label>'+
                        '<input type="range" class="slider-color" min="0" max="10" step="0.1" v-model="layer.paint.line.width">'+
                        '<i class="clear-input"> <ion-icon name="close-circle"></ion-icon></i>'+
                      '</div>'+
                    '</div>'+

                    '<div v-if="layer.paint.status==false && line" class="form-group basic">'+
                      '<div class="input-wrapper">'+
                        '<label class="label" >Kesikli Çizgi px değeri :</label>'+
                        '<input type="number" class="form-control" v-model="layer.paint.line.dasharray" placeholder="Çizgi boşluk px değeri">'+
                        '<i class="clear-input"> <ion-icon name="close-circle"></ion-icon></i>'+
                      '</div>'+
                    '</div>'+
                    //line strillendirme

                    '<div v-if="layer.paint.status==false && point" class="divider bg-primary mt-3 mb-3"> <div class="icon-box bg-primary"> <ion-icon name="arrow-down"></ion-icon> </div> </div>'+

                    //circle stillendirme
                    '<h4 v-if="layer.paint.status==false && point" style="color: #8ac24a;">Nokta Stillendirmesi</h4>'+
                    '<ul v-if="layer.paint.status==false && point" class="listview simple-listview">'+
                     '<li style="padding:0;">'+
                       '<div style="font-size: 12px;">Görünürlük ({{layer.paint.circle.visibility==true?\'Açık\':\'Kapalı\'}})</div>'+
                       '<div class="custom-control custom-switch">'+
                       '<input id="stylingVectorCheckbox6" type="checkbox" v-model="layer.paint.circle.visibility" class="custom-control-input">'+
                           '<label for="stylingVectorCheckbox6" class="custom-control-label"></label>'+
                       '</div>'+
                     '</li>'+
                    '</ul>'+

                    '<div v-if="layer.paint.status==false && point" class="form-group basic">'+
                      '<div class="input-wrapper">'+
                        '<label class="label mb-1">Nokta iç Rengi : {{layer.paint.circle.color}}</label>'+
                        '<button type="button" @click="changeColor(\'circle\')" :style="{backgroundColor:layer.paint.circle.color,color:\'#FFF\'}" class="btn btn-block">'+
                        '<ion-icon name="color-palette-outline"></ion-icon>'+
                        ' Renk Seç</button>'+
                      '</div>'+
                    '</div>'+

                    '<div v-if="layer.paint.status==false && point" class="form-group basic">'+
                      '<div class="input-wrapper">'+
                        '<label class="label mb-1">Nokta iç Şeffaflığı : %{{layer.paint.circle.opacity*100}}</label>'+
                        '<input type="range" class="slider-color" min="0" max="1" step="0.01" v-model="layer.paint.circle.opacity">'+
                        '<i class="clear-input"> <ion-icon name="close-circle"></ion-icon></i>'+
                      '</div>'+
                    '</div>'+

                    '<div v-if="layer.paint.status==false && point" class="form-group basic">'+
                      '<div class="input-wrapper">'+
                        '<label class="label mb-1">Nokta Büyüklüğü : {{layer.paint.circle.radius}}px</label>'+
                        '<input type="range" class="slider-color" min="0" max="20" step="0.1" v-model="layer.paint.circle.radius">'+
                        '<i class="clear-input"> <ion-icon name="close-circle"></ion-icon></i>'+
                      '</div>'+
                    '</div>'+

                    '<div v-if="layer.paint.status==false && point" class="form-group basic">'+
                      '<div class="input-wrapper">'+
                        '<label class="label mb-1">Nokta Dış Çerçeve Rengi : {{layer.paint.circle.outlineColor}}</label>'+
                        '<button type="button" @click="changeColor(\'circleoutlineColor\')" :style="{backgroundColor:layer.paint.circle.outlineColor,color:\'#FFF\'}" class="btn btn-block">'+
                        '<ion-icon name="color-palette-outline"></ion-icon>'+
                        ' Renk Seç</button>'+
                      '</div>'+
                    '</div>'+

                    '<div v-if="layer.paint.status==false && point" class="form-group basic">'+
                      '<div class="input-wrapper">'+
                        '<label class="label mb-1">Nokta Çerçeve Şeffaflığı : %{{layer.paint.circle.outlineOpacity*100}}</label>'+
                        '<input type="range" class="slider-color" min="0" max="1" step="0.01" v-model="layer.paint.circle.outlineOpacity">'+
                        '<i class="clear-input"> <ion-icon name="close-circle"></ion-icon></i>'+
                      '</div>'+
                    '</div>'+

                    '<div v-if="layer.paint.status==false && point" class="form-group basic">'+
                      '<div class="input-wrapper">'+
                        '<label class="label mb-1">Nokta Çerçeve Kalınlığı : {{layer.paint.circle.outlineWidth}}px</label>'+
                        '<input type="range" class="slider-color" min="0" max="10" step="0.1" v-model="layer.paint.circle.outlineWidth">'+
                        '<i class="clear-input"> <ion-icon name="close-circle"></ion-icon></i>'+
                      '</div>'+
                    '</div>'+
                    //circle stillendirme

                    '<div class="divider bg-primary mt-3 mb-3"> <div class="icon-box bg-primary"> <ion-icon name="arrow-down"></ion-icon> </div> </div>'+

                    '<div class="form-group basic">'+
                      '<div class="input-wrapper">'+
                        '<button @click="nextTab" type="button" class="btn btn-info btn-block">Kaydet ve İlerle</button>'+
                      '</div>'+
                    '</div>'+

                    '</form>'+
                  '</div>'+
                '</div>'+

                '</div>'+
            '</div>'+
            '</div>'+
              
            // tab3
            '<div :class="pages[2].class">'+
            '<div class="section full mt-1">'+
                '<div class="wide-block pt-2 pb-2">'+
  
                '<div class="section full">'+
                  '<div class="wide-block pb-1 pt-2">'+
                    '<form>'+

                    '<div class="form-group basic">'+
                      '<div class="input-wrapper">'+
                        '<label class="label">Yeni Sütunun Veri Tipi :</label>'+
                        '<select class="form-control custom-select" v-model="dataTypes.selected">'+
                          '<option v-for="opt in dataTypes.data" :value="opt.value">{{opt.text}}</option>'+
                        '</select>'+
                      '</div>'+
                    '</div>'+

                    '<div class="form-group basic">'+
                      '<div class="input-wrapper">'+
                        '<label class="label">Yeni Sütunun Adı :</label>'+
                        '<input @input="writeField" type="text" class="form-control" v-model="fieldName" placeholder="Küçük harf ve boşluk olmadan">'+
                        '<i class="clear-input"> <ion-icon name="close-circle"></ion-icon></i>'+
                      '</div>'+
                    '</div>'+

                    '<ul class="listview simple-listview">'+
                     '<li style="padding:0;">'+
                       '<div style="font-size: 12px;">Düzenlenebilirlik ({{layer.edit==true?\'Açık\':\'Kapalı\'}})</div>'+
                       '<div class="custom-control custom-switch">'+
                       '<input id="stylingVectorCheckbox9" type="checkbox" v-model="layer.edit" class="custom-control-input">'+
                           '<label for="stylingVectorCheckbox9" class="custom-control-label"></label>'+
                       '</div>'+
                     '</li>'+
                    '</ul>'+

                    '<ul class="listview simple-listview">'+
                     '<li style="padding:0;">'+
                       '<div style="font-size: 12px;">Başlangıç Değeri ({{layer.default==true?\'Açık\':\'Kapalı\'}})</div>'+
                       '<div class="custom-control custom-switch">'+
                       '<input @change="change(\'default\')" id="stylingVectorCheckbox" type="checkbox" v-model="layer.default" class="custom-control-input">'+
                           '<label for="stylingVectorCheckbox" class="custom-control-label"></label>'+
                       '</div>'+
                     '</li>'+
                    '</ul>'+

                    '<div v-if="layer.default==true && dataTypes.selected==\'string\'" class="form-group basic">'+
                      '<div class="input-wrapper">'+
                        '<label class="label">Başlangıç Değeri :</label>'+
                        '<input type="text" class="form-control" v-model="layer.defaultValueString" placeholder="Başlangıç Değeri Giriniz">'+
                        '<i class="clear-input"> <ion-icon name="close-circle"></ion-icon></i>'+
                      '</div>'+
                    '</div>'+

                    '<div v-if="layer.default==true && dataTypes.selected==\'integer\'" class="form-group basic">'+
                      '<div class="input-wrapper">'+
                        '<label class="label">Başlangıç Değeri :</label>'+
                        '<input type="number" class="form-control" v-model="layer.defaultValueInteger" placeholder="Başlangıç Değeri Giriniz">'+
                        '<i class="clear-input"> <ion-icon name="close-circle"></ion-icon></i>'+
                      '</div>'+
                    '</div>'+

                    '<div v-if="layer.default==true && dataTypes.selected==\'double\'" class="form-group basic">'+
                      '<div class="input-wrapper">'+
                        '<label class="label">Başlangıç Değeri :</label>'+
                        '<input type="number" class="form-control" v-model="layer.defaultValueDouble" placeholder="Başlangıç Değeri Giriniz">'+
                        '<i class="clear-input"> <ion-icon name="close-circle"></ion-icon></i>'+
                      '</div>'+
                    '</div>'+

                    '<div v-if="layer.default==true && dataTypes.selected==\'boolean\'" class="form-group basic">'+
                      '<div class="input-wrapper">'+
                        '<div class="custom-control custom-checkbox">'+
                            '<input type="checkbox" v-model="layer.defaultValueBoolean" class="custom-control-input" id="customCheck4">'+
                            '<label class="custom-control-label" for="customCheck4">{{layer.defaultValueBoolean==true?\'Doğru\':\'Yanlış\'}}</label>'+
                        '</div>'+
                      '</div>'+
                    '</div>'+

                    '<div v-if="layer.default==true && dataTypes.selected==\'date\'" class="form-group basic">'+
                        '<div  class="input-wrapper">'+
                        '<label class="label" for="layerfield">Başlangıç Tarihi</label>'+
                            '<input v-model="layer.defaultValueDate" type="date" class="form-control" id="layerfield" placeholder="Değer Giriniz">'+
                                '<i class="clear-input">'+
                                    '<ion-icon name="close-circle"></ion-icon>'+
                                '</i>'+

                        //'<div class="custom-control custom-checkbox">'+
                        //  '<input type="checkbox" @change="getDate" class="custom-control-input" id="customCheck4">'+
                        //'<label class="custom-control-label" for="customCheck4">Bugünün tarihini al</label>'+
                        //    '</div>'+
                        '</div>'+
                    '</div>'+

                    '<ul v-if="dataTypes.selected==\'integer\'" class="listview simple-listview">'+
                     '<li style="padding:0;">'+
                       '<div style="font-size: 12px;">Otomatik Sayı Artırma ({{layer.auto==true?\'Açık\':\'Kapalı\'}})</div>'+
                       '<div class="custom-control custom-switch">'+
                       '<input @change="change(\'auto\')" id="stylingVectorCheckbox7" type="checkbox" v-model="layer.auto" class="custom-control-input">'+
                           '<label for="stylingVectorCheckbox7" class="custom-control-label"></label>'+
                       '</div>'+
                     '</li>'+
                    '</ul>'+

                    '<div v-if="dataTypes.selected==\'integer\' && layer.auto==true" class="form-group basic">'+
                      '<div class="input-wrapper">'+
                        '<label class="label">Kayıt Başlangıç Değeri :</label>'+
                        '<input type="number" class="form-control" v-model="layer.startValue" placeholder="Başlangıç Değeri Giriniz">'+
                        '<i class="clear-input"> <ion-icon name="close-circle"></ion-icon></i>'+
                      '</div>'+
                    '</div>'+

                    '<ul v-if="dataTypes.selected==\'integer\'" class="listview simple-listview">'+
                     '<li style="padding:0;">'+
                       '<div style="font-size: 12px;">Benzersiz Değerlere Sahip ({{layer.unique==true?\'Açık\':\'Kapalı\'}})</div>'+
                       '<div class="custom-control custom-switch">'+
                       '<input id="stylingVectorCheckbox8" type="checkbox" v-model="layer.unique" class="custom-control-input">'+
                           '<label for="stylingVectorCheckbox8" class="custom-control-label"></label>'+
                       '</div>'+
                     '</li>'+
                    '</ul>'+

                    '<div class="form-group basic">'+
                      '<div class="input-wrapper">'+
                        '<button @click="addField" type="button" class="btn btn-success btn-block">Sütunu Ekle</button>'+
                      '</div>'+
                    '</div>'+

                    '<div class="divider bg-primary mt-3 mb-3"> <div class="icon-box bg-primary"> <ion-icon name="arrow-down"></ion-icon> </div> </div>'+

                    '<table class="table">' +
                      '<thead>'+
                        '<tr>'+
                          '<th>#</th>'+
                          '<th>Sütun Adı</th>'+
                          '<th>Veri Tipi</th>'+
                          '<th>Sil</th>'+
                        '</tr>'+
                      '</thead>'+
                      '<tbody>'+
                        '<tr v-for="(sutun,sira) in layer.fields">'+
                          '<th>{{sira+1}}</th>'+
                          '<td>{{sutun.name}}</td>'+
                          '<td>{{sutun.type}}</td>'+
                          '<td><a v-if="sutun.protecth==false" @click="deleteField(sira)" href="#">Sil</a></td>'+
                        '</tr>'+
                      '</tbody>'+
                    '</table>'+

                    '<div class="divider bg-primary mt-3 mb-3"> <div class="icon-box bg-primary"> <ion-icon name="arrow-down"></ion-icon> </div> </div>'+

                    '<div class="form-group basic">'+
                      '<div class="input-wrapper">'+
                        '<button @click="createVectorLayer" type="button" class="btn btn-success btn-block">Vektör Katmanı Oluştur</button>'+
                      '</div>'+
                    '</div>'+
                    
                    '</form>'+
                  '</div>'+
                '</div>'+
  
                '</div>'+
            '</div>'+
            '</div>'+

          '</div>'+
    '</div>'
  
  });

var createvectorlayer = new Vue({ el: '#createvectorlayer' });