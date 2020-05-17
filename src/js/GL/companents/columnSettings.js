Vue.component('columnsettings', {
	data:function(){
		return this.setDefault();
  },
  methods:{
      setDefault:function(){
          return {
              onoff:true,
              header:"Sütun Ayarları",
              close:"Kapat",
              layer:"",
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
              fieldName:"",
              edit:true,
              defaultt:false,
              auto:false,
              defaultValueString:"",
              defaultValueInteger:0,
              defaultValueDouble:0.0,
              defaultValueBoolean:true,
              defaultValueDate:null,
              startValue:0,
              unique:false
          }
      },
      open:function(source){
        $("#columnsettingsModal").modal('show');
        this.layer=GL.layerbox.getSource(source);
      },
      close:function(e){
        $("#columnsettingsModal").modal('hide');
      },
      closee:function(){
        $("#columnsettingsModal").modal('hide');
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
              if(this.unique==true){
                obj["unique"]=true;
              }else{
                obj["unique"]=false;
              }
              if(this.auto==true){
                obj["auto"]=true;
                obj["index"]=parseInt(this.startValue,10);
              }else{
                obj["auto"]=false;
              }

              if(this.defaultt==true){
                obj["default"]=true;
                obj["defaultInteger"]=parseInt(this.defaultValueInteger,10);
              }else{
                obj["default"]=false;
              }
            }

            if(this.edit==true){
              obj["protecth"]=false;
            }else{
              obj["protecth"]=true;
            }

            if(this.dataTypes.selected=='string'){
              if(this.defaultt==true){
                obj["default"]=true;
                obj["defaultString"]=this.defaultValueString;
              }else{
                obj["default"]=false;
              }
            }

            if(this.dataTypes.selected=='double'){
              if(this.defaultt==true){
                obj["default"]=true;
                obj["defaultDouble"]=Number(this.defaultValueDouble);
              }else{
                obj["default"]=false;
              }
            }

            if(this.dataTypes.selected=='boolean'){
              if(this.defaultt==true){
                obj["default"]=true;
                obj["defaultBoolean"]=this.defaultValueBoolean;
              }else{
                obj["default"]=false;
              }
            }

            if(this.dataTypes.selected=='date'){
              if(this.defaultt==true){
                obj["default"]=true;
                obj["defaultDate"]=this.defaultValueDate;
              }else{
                obj["default"]=false;
              }
            }

            this.layer.fields.push(obj);

            var data = GL.datatable.getData(this.layer.geojson,this.layer.fields);
            var columns = GL.datatable.readyColumns(this.layer.fields);
            datatable.$children[0].table={};
            datatable.$children[0].table=new Tabulator("#datatableView1", {
                layout:"fitData",
                height:GL.config.clientHeight+'px',
                resizableColumns:false,
                columns:columns
            });

            setTimeout(function(){
                datatable.$children[0].table.setData(data);
            },30);
            
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
      deleteField:function(col,i){
        this.layer.fields.splice(i,1);
        for(var i=0;i<this.layer.geojson.features.length;i++){
            delete this.layer.geojson.features[i].properties["id"];
        }

        var data = GL.datatable.getData(this.layer.geojson,this.layer.fields);
        var columns = GL.datatable.readyColumns(this.layer.fields);
        datatable.$children[0].table={};
        datatable.$children[0].table=new Tabulator("#datatableView1", {
            layout:"fitData",
            height:GL.config.clientHeight+'px',
            resizableColumns:false,
            columns:columns
          });

        setTimeout(function(){
            datatable.$children[0].table.setData(data);
        },30);
        
        GL.bilgi("Sütun Silinmiştir.");
      },
      change:function(event){
        if(this.default==true){
          if(this.auto==true){
            if(event=="default"){
              this.auto=false
            }else if(event=="auto"){
              this.default=false
            }
          }
        }
      }
  },
  template:
  '<div  class="modal fade modalbox" id="columnsettingsModal" tabindex="-1" role="dialog">'+
            '<div class="modal-dialog" role="document">'+
                '<div class="modal-content">'+
                    '<div class="modal-header">'+
                        '<h5 class="modal-title" style="padding-left: 110px">{{header}}</h5>'+
                        '<a @click="closee" href="javascript:;" data-dismiss="modal">{{close}}</a>'+
                    '</div>'+
                    '<div class="modal-body p-0">'+
                        '<div class="section mt-4 mb-5">'+
                        
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
                                    '<td><a v-if="sutun.protecth!=true" @click="deleteField(sutun,sira)" href="#">Sil</a></td>'+
                                '</tr>'+
                                '</tbody>'+
                            '</table>'+

                            '<div class="divider bg-primary mt-3 mb-3"> <div class="icon-box bg-primary"> <ion-icon name="arrow-down"></ion-icon> </div> </div>'+
        
                            '<div class="form-group basic">'+
                                '<div class="input-wrapper">'+
                                    '<label class="label">Veri Tipi :</label>'+
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
                                '<div style="font-size: 12px;">Düzenlenebilirlik ({{edit==true?\'Açık\':\'Kapalı\'}})</div>'+
                                '<div class="custom-control custom-switch">'+
                                '<input id="stylingVectorCheckbox9" type="checkbox" v-model="edit" class="custom-control-input">'+
                                    '<label for="stylingVectorCheckbox9" class="custom-control-label"></label>'+
                                '</div>'+
                                '</li>'+
                            '</ul>'+

                            '<ul class="listview simple-listview">'+
                                '<li style="padding:0;">'+
                                '<div style="font-size: 12px;">Başlangıç Değeri ({{defaultt==true?\'Açık\':\'Kapalı\'}})</div>'+
                                '<div class="custom-control custom-switch">'+
                                '<input @change="change(\'default\')" id="stylingVectorCheckbox" type="checkbox" v-model="defaultt" class="custom-control-input">'+
                                    '<label for="stylingVectorCheckbox" class="custom-control-label"></label>'+
                                '</div>'+
                                '</li>'+
                            '</ul>'+

                            '<div v-if="defaultt==true && dataTypes.selected==\'string\'" class="form-group basic">'+
                                '<div class="input-wrapper">'+
                                    '<label class="label">Başlangıç Değeri :</label>'+
                                    '<input type="text" class="form-control" v-model="defaultValueString" placeholder="Başlangıç Değeri Giriniz">'+
                                    '<i class="clear-input"> <ion-icon name="close-circle"></ion-icon></i>'+
                                '</div>'+
                            '</div>'+

                            '<div v-if="defaultt==true && dataTypes.selected==\'integer\'" class="form-group basic">'+
                                '<div class="input-wrapper">'+
                                    '<label class="label">Başlangıç Değeri :</label>'+
                                    '<input type="number" class="form-control" v-model="defaultValueInteger" placeholder="Başlangıç Değeri Giriniz">'+
                                    '<i class="clear-input"> <ion-icon name="close-circle"></ion-icon></i>'+
                                '</div>'+
                            '</div>'+

                            '<div v-if="defaultt==true && dataTypes.selected==\'double\'" class="form-group basic">'+
                                '<div class="input-wrapper">'+
                                    '<label class="label">Başlangıç Değeri :</label>'+
                                    '<input type="number" class="form-control" v-model="defaultValueDouble" placeholder="Başlangıç Değeri Giriniz">'+
                                    '<i class="clear-input"> <ion-icon name="close-circle"></ion-icon></i>'+
                                '</div>'+
                            '</div>'+

                            '<div v-if="defaultt==true && dataTypes.selected==\'boolean\'" class="form-group basic">'+
                                '<div class="input-wrapper">'+
                                    '<div class="custom-control custom-checkbox">'+
                                        '<input type="checkbox" v-model="defaultValueBoolean" class="custom-control-input" id="customCheck4">'+
                                        '<label class="custom-control-label" for="customCheck4">{{defaultValueBoolean==true?\'Doğru\':\'Yanlış\'}}</label>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+

                            '<div v-if="defaultt==true && dataTypes.selected==\'date\'" class="form-group basic">'+
                                    '<div  class="input-wrapper">'+
                                    '<label class="label" for="layerfield">Başlangıç Tarihi</label>'+
                                        '<input v-model="defaultValueDate" type="date" class="form-control" id="layerfield" placeholder="Değer Giriniz">'+
                                            '<i class="clear-input">'+
                                                '<ion-icon name="close-circle"></ion-icon>'+
                                            '</i>'+
                                    '</div>'+
                            '</div>'+

                            
                            '<ul v-if="dataTypes.selected==\'integer\'" class="listview simple-listview">'+
                                '<li style="padding:0;">'+
                                '<div style="font-size: 12px;">Otomatik Sayı Artırma ({{auto==true?\'Açık\':\'Kapalı\'}})</div>'+
                                '<div class="custom-control custom-switch">'+
                                '<input @change="change(\'auto\')" id="stylingVectorCheckbox7" type="checkbox" v-model="auto" class="custom-control-input">'+
                                    '<label for="stylingVectorCheckbox7" class="custom-control-label"></label>'+
                                '</div>'+
                                '</li>'+
                            '</ul>'+

                            '<div v-if="dataTypes.selected==\'integer\' && auto==true" class="form-group basic">'+
                                '<div class="input-wrapper">'+
                                '<label class="label">Kayıt Başlangıç Değeri :</label>'+
                                '<input type="number" class="form-control" v-model="startValue" placeholder="Başlangıç Değeri Giriniz">'+
                                '<i class="clear-input"> <ion-icon name="close-circle"></ion-icon></i>'+
                                '</div>'+
                            '</div>'+

                            '<ul v-if="dataTypes.selected==\'integer\'" class="listview simple-listview">'+
                                '<li style="padding:0;">'+
                                '<div style="font-size: 12px;">Benzersiz Değerlere Sahip ({{unique==true?\'Açık\':\'Kapalı\'}})</div>'+
                                '<div class="custom-control custom-switch">'+
                                '<input id="stylingVectorCheckbox8" type="checkbox" v-model="unique" class="custom-control-input">'+
                                    '<label for="stylingVectorCheckbox8" class="custom-control-label"></label>'+
                                '</div>'+
                                '</li>'+
                            '</ul>'+

                            '<div class="form-group basic">'+
                                '<div class="input-wrapper">'+
                                    '<button @click="addField" type="button" class="btn btn-success btn-block">Sütunu Ekle</button>'+
                                '</div>'+
                            '</div>'+


                        '</div>'+
                    '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'
  });

var columnsettings = new Vue({ el: '#columnsettings' });