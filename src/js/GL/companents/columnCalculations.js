Vue.component('columncalculations', {
	data:function(){
		return this.setDefault();
  },
  methods:{
      setDefault:function(){
          return {
              onoff:true,
              header:"Sütun Hesaplamaları",
              close:"Kapat",
              fields:[],
              selectedColumn:"",
              layer:"",
              tabledata:{selected:'all',data:[
                {value:'selected',text:"Sadece Seçilenler"},
                {value:'filtered',text:"Sadece Filtrelenenler"},
                {value:'all',text:"Hepsi"},
              ]},
              islemler:{selected:'',data:[
                {islem:'val', type:'string', value:'+', text:"Birlestir"},
                {islem:'val', type:'string', value:'chardel', text:"Karakter Sil"},
                {islem:'val', type:'string', value:'charedit', text:"Karakter Duzelt"},
                {islem:'self',type:'string', value:'>', text:"Karakterleri Büyüt"},
                {islem:'self',type:'string', value:'<', text:"Karakterleri Küçült"},
                {islem:'self',type:'string', value:'>=', text:"Ilk Harfi Buyut"},
                {islem:'self',type:'string', value:'intflo', text:"Sayiya Cevir"},
                {islem:'val',type:'string', value:'equal', text:"Tek Değere Esitle"},
                {islem:'self',type:'string', value:'clear', text:"Komple Sil"},
                {islem:'val', type:'number', value:'+val', text:"Bir Değer ile Topla"},
                {islem:'val', type:'number', value:'-val', text:"Bir Değer ile Cikart"},
                {islem:'val', type:'number', value:'*val', text:"Bir Değer ile Carp"},
                {islem:'val', type:'number', value:'/val', text:"Bir Değer ile Bol"},
                {islem:'val', type:'number', value:'2val', text:"Bir Değer ile Ussunu Al"},
                {islem:'val', type:'number', value:'3val', text:"Bir Değer ile Kokunu Al"},
                {islem:'val', type:'number', value:'%val', text:"Bir Değere Gore Modunu Al"},
                {islem:'val',type:'number', value:'equal', text:"Tek Değere Esitle"},
                {islem:'val',type:'number', value:'round', text:"Yuvarla"},
                {islem:'self',type:'number', value:'clear', text:"Komple Sil"},
                {islem:'self',type:'number', value:'|val', text:"Mutlak Değerini Al"},
                {islem:'self',type:'number', value:'--', text:"Negatif Yap"},
                {islem:'self',type:'number', value:'cos', text:"Cosinusunu Al"},
                {islem:'self',type:'number', value:'sin', text:"Sinusunu Al"},
                {islem:'self',type:'number', value:'tan', text:"Tanjantini Al"},
                {islem:'self',type:'number', value:'atan', text:"Kotanjantini Al"},
                {islem:'self',type:'number', value:'log', text:"logaritmasini Al"},
                {islem:'self',type:'number', value:'ceil', text:"Yukari Yuvarla"},
                {islem:'self',type:'number', value:'floor', text:"Asagi Yuvarla"},
                {islem:'self',type:'number', value:'int', text:"Tam Sayi Yap"},
                
              ]},
              chosenType:"", // seçilitip
              calculationType:"", // işlemtipi
              yonelim:{selected:'',data:[
                {value:'deger',text:"El ile değer gir"},
                {value:'kolon',text:"Katman kolonunu kullan"}
              ]},
              value:"",
              eklenecek:"",
              filteredColons:[]
          }
      },
      open:function(sourceid){
        $("#columncalculationsModal").modal('show');
        var layer=GL.layerbox.getSource(sourceid);
        console.log(layer);
        this.layer=layer;
        for(var i=0;i<layer.fields.length;i++){
            if(layer.fields[i].name!="index" && layer.fields[i].name!="geotype"){
                this.fields.push({name:layer.fields[i].name,type:layer.fields[i].type});
            }
        }
      },
      close:function(e){
        $("#columncalculationsModal").modal('hide');
      },
      selectColumn:function(){
        var that = this;
        var kolon = this.fields.find(function(a){if(a.name==that.selectedColumn){return true;}});
        console.log(kolon);
        var type = kolon.type;
        
        this.chosenType=type;
        if(this.chosenType=='double' || this.chosenType=="integer"){this.chosenType='number';}
        console.log(this.chosenType);
        
        if(type=='string'){
          this.filteredColons = this.fields;
        }else{
          var filter = this.fields.filter(function(a){if(a.type==type){return true;}});
          this.filteredColons = filter;
        }
        this.calculationType='';
        console.log(this.filteredColons);
      },
      islemSecildi:function(){
        var that = this;
        var islem = this.islemler.data.find(function(a){if(a.value==that.islemler.selected){return true;}});
        console.log(islem);
        var islemtipi = islem.islem; // val or self
        this.calculationType=islemtipi;
        this.yonelim.selected = '';
      },
      calistir:function(){
        var that = this;
        var kolon = this.selectedColumn;
        
        if(kolon!==''){
          var islem = this.islemler.selected;
          
          if(islem!==''){
            var filterislem = this.islemler.data.find(function(a){if(a.value==that.islemler.selected){return true;}});
            var kolonobj = this.fields.find(function(a){if(a.name==kolon){return true;}});

            var datatype = kolonobj.type;
            var degerkendi = filterislem.islem;
            console.log(degerkendi);
            var metod = filterislem.value;
            var secilenler = [];
            if(this.tabledata.selected=='filtered'){
              secilenler = datatable.$children[0].table.getData(true);
            }else if(this.tabledata.selected=='selected'){
              secilenler = datatable.$children[0].table.getSelectedData();
            }else{
              secilenler = datatable.$children[0].table.getData();
            }
            var showindex = [];
            secilenler.map(function(a){
              showindex.push(a.index);
            });

            if(degerkendi=='val'){

              var kolongirdi = this.yonelim.selected;
  
              if(kolongirdi=='deger'){
                var deger = this.value;
                if(deger!==''){
                  //----------
                  var islemsonuc = GL.columnCalculations(this.layer.id,kolon,metod,degerkendi,kolongirdi,deger,datatype,showindex);
                  if(islemsonuc){
                    //GL.layerDataSource(this.layerId);
                    //GL.onay(kolon+' '+that.sysmsg.m108);
                  }else{
                    //GL.uyari(kolon+' '+that.sysmsg.m107);
                  }
                  
                }else{
                  GL.uyari(that.sysmsg.m111);
                }
              }else if(kolongirdi=='kolon'){
                var islemkolon = this.eklenecek;
                if(islemkolon!==''){
                  //---------
                  var islemsonuc = GL.columnCalculations(this.layer.id,kolon,metod,degerkendi,kolongirdi,this.eklenecek,datatype,showindex);
                  if(islemsonuc){
                    GL.layerDataSource(this.layerId);
                    GL.onay(kolon+' '+that.sysmsg.m108);
                  }else{
                    GL.uyari(kolon+' '+that.sysmsg.m107);
                  }
                }else{
                  GL.uyari(that.sysmsg.m109);
                }
  
              }else{
                GL.uyari(that.sysmsg.m110);
              }
            }else if(degerkendi=='self'){
              var islemsonuc = GL.columnCalculations(this.layer.id,kolon,metod,degerkendi,kolongirdi,this.eklenecek,datatype,showindex);
              console.log(islemsonuc);
              if(islemsonuc){
                //GL.layerDataSource(this.layerId);
                //GL.onay(kolon+' '+that.sysmsg.m108);
              }else{
                //GL.uyari(kolon+' '+that.sysmsg.m107);
              }
              //----
  
            }else{
              GL.uyari("hata1");
            }
          }else{
            GL.uyari("hata2");
          }
          
        }else{
          GL.uyari("hata3");
        }
      },
  },
  template:
  '<div  class="modal fade modalbox" id="columncalculationsModal" tabindex="-1" role="dialog">'+
            '<div class="modal-dialog" role="document">'+
                '<div class="modal-content">'+
                    '<div class="modal-header">'+
                        '<h5 class="modal-title" style="padding-left: 70px">{{header}}</h5>'+
                        '<a @click="close" href="javascript:;" data-dismiss="modal">{{close}}</a>'+
                    '</div>'+
                    '<div class="modal-body p-0">'+
                        '<div class="section mt-4 mb-5">'+
                        
                            '<div class="form-group basic">'+
                                '<div class="input-wrapper">'+
                                    '<label class="label">İşlem Yapılacak Sütun</label>'+
                                    '<select @change="selectColumn" v-model="selectedColumn" class="form-control custom-select">'+
                                    '<option v-for="opt in fields" :value="opt.name">{{opt.name}}</option>'+
                                    '</select>'+
                                '</div>'+
                            '</div>'+

                            '<div class="form-group basic">'+
                                '<div class="input-wrapper">'+
                                    '<label class="label">İşlem Yapılacak Sütun</label>'+
                                    '<select v-model="tabledata.selected" class="form-control custom-select">'+
                                    '<option v-for="opt in tabledata.data" :value="opt.value">{{opt.text}}</option>'+
                                    '</select>'+
                                '</div>'+
                            '</div>'+

                            // İşlemler
                            '<div class="form-group basic">'+
                                '<div class="input-wrapper">'+
                                    '<label class="label">İşlem</label>'+
                                    '<select @change="islemSecildi" class="form-control custom-select" v-model="islemler.selected">'+
                                    '<option v-if="item.type==chosenType" v-for="item in islemler.data" :value="item.value">{{item.text}}</option>'+
                                    '</select>'+
                                '</div>'+
                            '</div>'+

                            // yönelim
                            '<div v-if="calculationType==\'val\'" class="form-group basic">'+
                                '<div class="input-wrapper">'+
                                    '<label class="label">Değer nereden alınacak</label>'+
                                    '<select class="form-control custom-select" v-model="yonelim.selected">'+
                                    '<option v-for="item in yonelim.data" :value="item.value">{{item.text}}</option>'+
                                    '</select>'+
                                '</div>'+
                            '</div>'+

                            // input number
                            '<div  v-if="yonelim.selected==\'deger\' && chosenType==\'number\' && calculationType==\'val\'" class="form-group basic">'+
                                '<div class="input-wrapper">'+
                                    '<label class="label">Değer</label>'+
                                    '<input type="number" class="form-control" v-model="value" placeholder="">'+
                                    '<i class="clear-input"> <ion-icon name="close-circle"></ion-icon></i>'+
                                '</div>'+
                            '</div>'+

                            // input string
                            '<div v-if="yonelim.selected==\'deger\' && chosenType==\'string\' && calculationType==\'val\'" class="form-group basic">'+
                                '<div class="input-wrapper">'+
                                    '<label class="label">Değer</label>'+
                                    '<input type="text" class="form-control" v-model="value" placeholder="">'+
                                    '<i class="clear-input"> <ion-icon name="close-circle"></ion-icon></i>'+
                                '</div>'+
                            '</div>'+

                            // Kolon input
                            '<div v-if="yonelim.selected==\'kolon\' && calculationType==\'val\'" class="form-group basic">'+
                                '<div class="input-wrapper">'+
                                    '<label class="label">Değer hangi kolondan alınacak</label>'+
                                    '<select class="form-control custom-select" v-model="eklenecek">'+
                                    '<option v-for="item in filteredColons" :value="item.name">{{item.name}}</option>'+
                                    '</select>'+
                                '</div>'+
                            '</div>'+

                            '<div class="form-button-group">'+
                                '<button @click="calistir" type="button" class="btn btn-primary btn-block">Uygula</button>'+
                            '</div>'+

                        '</div>'+
                    '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'
  });

var columncalculations = new Vue({ el: '#columncalculations' });