Vue.component('measurement', {
	data:function(){
		return this.setDefault();
  },
  methods:{
      setDefault:function(){
          return {
              onoff:true,
              gosterilen:{

            },
            points:[],
            uzunluk:0
          }
      },
      open:function(){
        this.onoff = true;
      },
      close:function(e){
        this.onoff = false;
        var that = this;
        this.gosterilen.class = "toast-box toast-top animated3 fadeOutUp show";
        //GL.draw.deleteById(this.gosterilen.id);
        GL.draw.redraw=false;
        this.points=[];
        GL.draw.deleteAll();
        GL.map.removeControl(GL.draw.draw); 
        GL.draw.init();
      },
      showMeasurement:function(obj){
        console.log(obj);
        console.log(obj["id"]);
        console.log(obj.id);
        this.onoff = true;
        debugger;
          // Uzunluk, ALan, Yükseklik, Koordinat Bilgisi
        var id= obj["id"];
        var type  = obj["type"] || "türü yok";
        var result = obj["result"] || "Sonuç Yok!...";
        var unit = obj["unit"] || "Birim yok";
        var icon = obj["icon"] || "analytics-outline";
        
        var geometry=obj["geometry"]

        var obj2 = {
            icon:icon,
            type:type,
            class:"toast-box toast-top animated3 fadeInDown show",
            result:result,
            unit:unit,
            id:id,
            geometry:geometry,
            show:"değer bulunamadı"
        };

        switch(type){
            case 'uzunluk':{
                if(unit=="Metre" && result>1000){
                    obj2.result=(result/1000).toFixed(3);
                    obj2.unit="km"
                }else if(unit=="inch"){
                    // metre to inch
                    obj2.result=(result*39.3701).toFixed(3);
                    obj2.unit="inch"
                }else if(unit=="Metre" && result<1000){
                    obj2.unit="m"
                    console.log(result);
                    obj2.result=result;
                }
              
              obj2.show = "Uzunluk : "+obj2.result+" "+obj2.unit;
              obj2.result=obj2.result+" "+obj2.unit;
            break;
            }
            case 'alan':{
                if(result>1000000){
                    obj2.result=(result/1000000).toFixed(2);
                    obj2.unit="km<sup>2</sup>"
                }else{
                    obj2.unit="m<sup>2</sup>"
                }
              
              obj2.show = "Alan : "+obj2.result +" "+obj2.unit;
              obj2.result=obj2.result+" "+obj2.unit;
            break;
            }
            case 'nokta':{
              obj2.show = "Enl: "+obj2.result[0].toFixed(5) +"  Boy: "+obj2.result[1].toFixed(5);
              obj2.result = "Enl:"+obj2.result[0].toFixed(5) +" Boy:"+obj2.result[1].toFixed(5);
            break;
            }
            case 'yükseklik':{
              obj2.show = "Yükselik "+obj2.result.toFixed(3)+ " m";
              obj2.unit=" m"
              obj2.result = obj2.result.toFixed(3) + obj2.unit;
            break;
            }
        }

        this.gosterilen = obj2;
        this.$forceUpdate();
        this.points.push(obj2);
      },
      listmeasurements:function(){
        measuretable.$children[0].getValues(this.points);
        console.log(this.points);
        //GL.draw.stop();
      }
  },
  template:
    '<div v-if="onoff" :Class="gosterilen.class">'+
            '<div class="in">'+
              '<ion-icon :name="gosterilen.icon"></ion-icon>'+
                '<div class="text" v-html="gosterilen.show"></div>'+
            '</div>'+
            //padding-left:80px;
            '<div>'+
              '<ion-icon @click="listmeasurements" style="width:24px; height:24px; padding-right:10px;" name="list-circle-outline"></ion-icon>'+
              '<ion-icon @click="close" style="width:24px; height:24px; padding-right:0px;" name="close-circle-outline"></ion-icon>'+
            '</div>'+
    '</div>'
  });

var measurement = new Vue({ el: '#measurement' });