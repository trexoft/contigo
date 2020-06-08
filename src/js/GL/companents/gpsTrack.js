Vue.component('gpstrack', {
  data: function () {
    return this.setDefault();
  },
  methods: {
    setDefault: function () {
      return {
        onoff: false,
        header: "Koordinat İzleme",
        pages: [{
            i: 0,
            id: 'tab1',
            title: 'Harita',
            active: false,
            class: "tab-pane"
          },
          {
            i: 1,
            id: 'tab2',
            title: 'Koordinatlar',
            active: false,
            class: "tab-pane"
          },
          {
            i: 2,
            id: 'tab3',
            title: 'Analizler',
            active: false,
            class: "tab-pane"
          }
        ],
        track: null,
        data: [],
        currentPos: "",
        lat: "",
        lon: "",
        acc:"",
        lastAdded: [],
        method:'auto',
        geojson:{type:'FeatureCollection',features:[]},
        showbbox:false,
        drawline:false,
        drawchart:false,
        theme:["light1","dark1"],
        pointNumber:0,
        totalLength:0,
        minHeight:99999,
        maxHeight:-1,
        startTime:[],
        finishTime:[]
      }
    },
    open: function () {
      var that = this;
      this.onoff = true;
      this.setPage('tab1');
      GL.touch.on('#gpstrack',function(event,direction){
        debugger;
        that.setPageDirection(direction);
      });

      GL.geolocation.trigger();
      if ("geolocation" in navigator) {
        this.track = navigator.geolocation.watchPosition((position) => {
          that.lat = turf.round(position.coords.latitude,5);
          that.lon = turf.round(position.coords.longitude,5);
          that.acc = parseInt(position.coords.accuracy,10);
          that.currentPos = position;
          if(that.method=="auto"){
            that.addNewCoordinate(that.lon,that.lat,that.acc);
          }
        }, function error(err) {
          console.log('ERROR(' + err.code + '): ' + err.message);
        }, {
          enableHighAccuracy: false,
          //distanceFilter: 1,
          timeout: 5000,
          maximumAge: 0
        });
      } else {
        GL.uyari("Konum bilgisine ulaşılamadı");
      }
      debugger;
      
    },
    close: function (e) {
      GL.titresim();
      this.onoff = false;
      GL.touch.off('#gpstrack');
      this.pages.map(function (a) {
        a.active = false;
        a.class = "tab-pane";
      });
      $("#map").show();
      navigator.geolocation.clearWatch(this.track);
      GL.geolocation.trigger();
      data = [];
      this.geojson.features=[];
      GL.removeLayerByID('gpstrack');
      GL.removeLayerByID('gpsTrackLine');

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
    setPage: function (pageId) {
      var that = this;
      var activePage = this.pages.find(function (p) {
        if (p.active == true) {
          return p;
        }
      });

      var newPage = this.pages.find(function (p) {
        if (p.id == pageId) {
          return p;
        }
      });

      if (typeof activePage !== "undefined") {
        if (activePage.id == newPage.id) {
          return false;
        } else {

          var activePageClass = "fadeOutRight";
          var newPageClass = "fadeInLeft";
          if (newPage.i > activePage.i) {
            activePageClass = "fadeOutLeft";
            newPageClass = "fadeInRight";
          }

          this.pages[activePage.i].active = false;
          this.pages[newPage.i].active = true;
          this.pages[activePage.i].class = "tab-pane animated3 " + activePageClass + " active";
          setTimeout(function () {
            that.pages[activePage.i].class = "tab-pane";
            that.pages[newPage.i].class = "tab-pane animated3 " + newPageClass + " active";
            that.doIt(newPage.id);
          }, 300);
        }
      } else {
        //$("#map").hide();
        this.pages[newPage.i].active = true;
        this.pages[newPage.i].class = "tab-pane animated3 fadeIn active"
        that.doIt('tab1');
      }
    },
    doIt: function (tabId) {
      var that = this;
      switch (tabId) {
        case 'tab1': {
          $("#map").show();

          break;
        }
        case 'tab2': {
          $("#map").hide();
          break;
        }
        case 'tab3': {
          $("#map").hide();
          this.drawChart();
          //number of points
          this.pointNumber=this.data.length;

          var coords2=[];
          if(this.data.length>1){
            for(var j=0; j<this.data.length;j++){
                coords2.push(this.data[j].coordinates);
            }
            var line = turf.lineString(coords2);
            this.totalLength = turf.length(line, {units: 'meters'}).toFixed(3);
          }else{
            this.totalLength=0;
          }

          //start time
          var first=this.data[0].date;
          var spl=first.split(" ");
          this.startTime=spl;

          //Finish time
          var last=this.data[this.data.length-1].date;
          var spl2=last.split(" ");
          this.finishTime=spl2;

          // min height 
          for (var k=0;k<this.data.length;k++){
            var h=this.data[k].height;
            if(this.minHeight>h){
              this.minHeight=h;
            }
            if(this.maxHeight<h){
              this.maxHeight=h;
            }
          }

          break;
        }
      }
    },
    addNewCoordinate:function(lon,lat,accuracy){
      var that = this;
      var date = GL.getDate();
      
      that.lat = lat;
      that.lon = lon;

      if(that.data.length>0){
        var sonNokta = that.data[that.data.length-1];
        if(sonNokta.coordinates[0]==lon && sonNokta.coordinates[1]==lat){
          if(this.method=="manuel"){
            GL.uyari("Aynı koordinat listeleye eklenemez!");
          }
          return false;
        }
      }

      GL.elevation.getElevation([lon,lat], function (result) {
        //var color=GL.config.colors[10];
        if(result.features.length>0 && result.features[0].properties.elevation>0 && result.features[0].properties.elevation<10000){
          that.geojson.features.push(result.features[0]);
        
          var height = result.features[0].properties.elevation;
          var i = that.data.length+1;
          var data = {
            sira:i,
            coord: lat + ", " + lon,
            coordinates:[lon,lat],
            accuracy: accuracy,
            date: date,
            height: height
          };
          that.data.unshift(data);
          that.drawChart();
        }
      });
    },
    addCurrentLoc: function () {
      var that = this;
      if (that.currentPos != "") {
        var acc = parseInt(this.currentPos.coords.accuracy,10);
        if(this.method=="manuel"){
          this.addNewCoordinate(that.lon,that.lat,acc);
        }
      }
    },
    download:function(){
      var coords2=[];
      if(this.data.length>1){
        for(var j=0; j<this.data.length;j++){
            coords2.push(this.data[j].coordinates);
        }
      var line = turf.lineString(coords2);

      var newGeoJSON = { 
        "type" : "FeatureCollection",
        "features": []
      }
      newGeoJSON.features.push(line);
      this.geojson.features.map(function(point){
        newGeoJSON.features.push(point);
      });

      var reader = new ol.format.GeoJSON();
      var features=reader.readFeatures(newGeoJSON,{
          featureProjection: 'EPSG:4326',
          dataProjection: 'EPSG:4326'
      });
      
      var first=this.data[0].date;
      var spl=first.split(" ");
      var date=spl[0];
      var start=spl[1];
      
      var last=this.data[this.data.length-1].date;
      var spl2=last.split(" ");
      var finish=spl2[1];
      GL.downloadFile('gpx',features,"Gislayer-"+date+"-"+start+"-"+finish);

      }else{
          GL.uyari("Toplanan nokta sayısı 1'den fazla olmalı");
      }
    },
    showBbox:function(){
      if(this.showbbox){
        var coords=[];
        if(this.data.length>1){
          var color=GL.config.colors[10];
          if(GL.map.getSource('gpstrack')){
            GL.map.removeLayer('gpstrack-point');
            GL.map.removeLayer('gpstrack-polygon');
            GL.map.removeLayer('gpstrack-line');
            GL.map.removeSource('gpstrack')
            var information={id:"gpstrack",name:"Koordinat  İzleme Noktaları",type:'point',layers:["gpstrack-point","gpstrack-line","gpstrack-polygon"]};
            GL.addGeojsonToLayer(this.geojson,"gpstrack",color,information);
          }else{
            var information={id:"gpstrack",name:"Koordinat  İzleme Noktaları",type:'point',layers:["gpstrack-point","gpstrack-line","gpstrack-polygon"]};
            GL.addGeojsonToLayer(this.geojson,"gpstrack",color,information);
          }
          for(var i=0; i<this.data.length;i++){
            coords.push(this.data[i].coordinates);
          }
          var line = turf.lineString(coords);
          var bbox = turf.bbox(line);
          GL.map.fitBounds([[bbox[0],bbox[1]],[bbox[2],bbox[3]]]);
          this.setPage("tab1");
        }else{
          GL.uyari("Toplanan nokta sayısı 1'den fazla olmalı");
        }
      }else{
        GL.removeLayerByID('gpstrack');
      }

    },
    drawLine:function(){
      if(this.drawline){
        var coords=[];
        var color=GL.config.colors[8];
        if(this.data.length>1){
          for(var i=0; i<this.data.length;i++){
            coords.push(this.data[i].coordinates);
          }
          var line = turf.lineString(coords);
          var geojson={type:'FeatureCollection',features:[]};
          geojson.features.push(line);
          var bbox = turf.bbox(line);
          var information={id:"gpstrackLine",name:"Koordinat İzleme Hattı",type:'linestring',layers:["gpstrackLine-point","gpstrackLine-line","gpstrackLine-polygon"]};
          GL.addGeojsonToLayer(geojson,"gpsTrackLine",color,information);
          GL.map.fitBounds([[bbox[0],bbox[1]],[bbox[2],bbox[3]]]);
          this.setPage("tab1");
        }else{
          GL.uyari("Toplanan nokta sayısı 1'den fazla olmalı");
        }
      }else{
        GL.removeLayerByID('gpsTrackLine');
      }
      
    },
    drawChart:function(){
        if(GL.config.darkMode){
          var theme=this.theme[1]
        }else{
          var theme=this.theme[0]
        }
        var data = { 
          type: "line",
          indexLabelFontSize: 18,
          dataPoints:[]
        };
  
        this.geojson.features.map(function(point){
          data.dataPoints.push({y:point.properties.elevation});
        });
        
        setTimeout(function(){
          var chart = new CanvasJS.Chart("lineelevationchart2",
            {
            backgroundColor: "transparent",
            exportEnabled: true,
            animationEnabled: false,
            zoomEnabled: true,
            title:{
              text: "Yükseklik Profili",
              fontColor:GL.config.darkMode==true?'#efefef':'#666666'
            },
            axisY :{
              includeZero:false
            },
            data: [data]
          });
          chart.render();
        },100);
      
    },
    showFeature:function(obj2){
      //show feature on map
      this.setPage("tab1");
      var color="#2bffff";
      setTimeout(function(){
        GL.zoomFeature(obj2);
        GL.map.setPaintProperty(
          'gpstrack', 
          'circle-color',
          ['match', ['get', 'id'], obj2.id, '#f44336',color ]
        );
      },300)   
  }
  },
  template: '<div v-if="onoff">' +

    '<div class="appHeader bg-primary text-light">' +
    '<div class="left">' +
    '<a href="javascript:;" class="headerButton goBack" @click="close">' +
    '<ion-icon name="chevron-back-outline"></ion-icon>' +
    '</a>' +
    '</div>' +
    '<div class="pageTitle">{{header}}</div>' +
    '<div class="right"></div>' +
    '</div>' +


    //header
    '<div class="extraHeader p-0">' +
    '<ul class="nav nav-tabs lined" role="tablist">' +
    '<li class="nav-item" v-for="(item,i) in pages">' +
    '<a :class="item.active==true?\'nav-link active\':\'nav-link\'" @click="setPage(item.id)" href="#">' +
    '{{item.title}}' +
    '</a>' +
    '</li>' +
    '</ul>' +
    '</div>' +

    '<div id="appCapsule" class="extra-header-active" style="padding-top: 50px !important;">' +

    '<div class="tab-content mt-1">' +

    // tab2
    '<div :class="pages[1].class">' +
    '<div class="section full mt-1">' +

    '<ul class="listview image-listview media"><li><div class="item">'+
      '<div class="imageWrapper">'+
        '<img src="./src/img/graphics/location1.png" alt="image" class="imaged w64">'+
      '</div>'+
      '<div class="in">'+
        '<div>Mevcut Konum<div class="text-muted">Enlem : {{lat}}&deg;<br>Boylam : {{lon}}&deg;<br>Hassasiyet : {{acc}}m</div>'+
        '</div>'+
      '</div>'+
    '</div></li></ul>'+
    
      '<div class="btn-group btn-group-toggle" data-toggle="buttons" style="width:100%; padding:5%;">'+
        '<label class="btn btn-outline-primary active">'+
          '<input type="radio" name="options" @click="method=\'auto\';"> Otomatik Toplama'+
        '</label>'+
        '<label class="btn btn-outline-primary">'+
          '<input type="radio" name="options" @click="method=\'manuel\';"> El ile Toplama'+
        '</label>'+
        '<label v-if="method==\'manuel\'" class="btn btn-outline-success">'+
          '<input type="radio" name="options" @click="addCurrentLoc"> Noktayı Kaydet'+
        '</label>'+
      '</div>'+
    

    '<table class="table">' +
    '<thead>' +
    '<tr>' +
    //'<th scope="col">#</th>'+
    '<th scope="col">#</th>' +
    '<th scope="col">Zaman</th>' +
    '<th scope="col">Koordinat</th>' +
    '<th scope="col">Has.</th>' +
    '<th scope="col">Yük.</th>' +
    '</tr>' +
    '</thead>' +
    '<tbody v-for="(val,i) in data">' +
    '<tr @click="showFeature(val)">' +
    //'<th scope="row">{{i+1}}</th>'+
    '<td>{{val.sira}}</td>' +
    '<td>{{val.date}}</td>' +
    '<td>{{val.coord}}</td>' +
    '<td>{{val.accuracy}}m</td>' +
    '<td>{{val.height}}m</td>' +
    '</tr>' +
    '</tbody>' +
    '</table>' +
    '</div>' +
    '</div>' +

    // tab3
    '<div :class="pages[2].class">' +
    '<div class="section full mt-1">' +
    '<div class="wide-block pt-2 pb-2">' +

    '<ul class="listview image-listview">'+

           '<li style="margin-bottom: 20px;">'+
             '<div id="lineelevationchart2" style="zoom:100%; height:250px; width:100%; padding:5px;"></div>'+
           '</li>'+

            '<li @click="download" >'+
              //'<a href="#" class="item">'+
                '<div class="item">'+
                  '<div class="icon-box" >'+
                    '<img src="./src/img/graphics/gpx.png" alt="image" class="imaged w64" style="height:40px !important; width: 40px !important; ">'+
                  '</div>'+
                    '<div class="in">'+
                        '<div>GPX olarak indir</div>'+
                    '</div>'+
                '</div>'+
              //'</a>'+
            '</li>'+

            '<li>' +
           '<div class="item">' +
           '<div class="icon-box bg-danger"> <ion-icon name="git-commit-outline"></ion-icon> </div>' +
           '<div class="in">' +
           '<div>Noktaları Göster</div>' +
           '<div class="custom-control custom-switch" >' +
           '<input type="checkbox" v-model="showbbox" class="custom-control-input" @change="showBbox" id="showbboxx">' +
           '<label class="custom-control-label" for="showbboxx"></label>' +
           '</div>' +
           '</div>' +
           '</div>' +
           '</li>' +
            

           '<li>' +
           '<div class="item">' +
           '<div class="icon-box bg-danger"> <ion-icon name="git-merge-outline"></ion-icon> </div>' +
           '<div class="in">' +
           '<div>Hattı Göster</div>' +
           '<div class="custom-control custom-switch" >' +
           '<input type="checkbox" v-model="drawline" class="custom-control-input" @change="drawLine" id="drawlinee">' +
           '<label class="custom-control-label" for="drawlinee"></label>' +
           '</div>' +
           '</div>' +
           '</div>' +
           '</li>' +

           

        '</ul>'+

        '<div class="wide-block">'+
          '<div class="timeline timed">'+

            '<div class="item">'+
              '<span class="time">{{startTime[1]}}</span>'+
              '<div class="dot bg-success"></div>'+
              '<div class="content">'+
                '<h4 class="title">Başlama Saati</h4>'+
                '<div class="text">Tarih : {{startTime[0]}} {{startTime[1]}}</div>'+
              '</div>'+
            '</div>'+

            '<div class="item">'+
              '<span class="time">Adet</span>'+
              '<div class="dot bg-info"></div>'+
              '<div class="content">'+
                '<h4 class="title">Nokta Sayısı</h4>'+
                '<div class="text">Toplam : {{pointNumber}}</div>'+
              '</div>'+
            '</div>'+

            '<div class="item">'+
              '<span class="time">Metre</span>'+
              '<div class="dot bg-info"></div>'+
              '<div class="content">'+
                '<h4 class="title">Toplam Uzunluk</h4>'+
                '<div class="text">Toplam : {{totalLength}}</div>'+
              '</div>'+
            '</div>'+

            '<div class="item">'+
              '<span class="time">Metre</span>'+
              '<div class="dot bg-warning"></div>'+
              '<div class="content">'+
                '<h4 class="title">En Düşük Nokta</h4>'+
                '<div class="text">Yükseklik Değeri : {{minHeight}}</div>'+
              '</div>'+
            '</div>'+

            '<div class="item">'+
              '<span class="time">Metre</span>'+
              '<div class="dot bg-warning"></div>'+
              '<div class="content">'+
                '<h4 class="title">En Yüksek Nokta</h4>'+
                '<div class="text">Yükseklik Değeri : {{maxHeight}}</div>'+
              '</div>'+
            '</div>'+

            '<div class="item">'+
              '<span class="time">{{finishTime[1]}}</span>'+
              '<div class="dot bg-danger"></div>'+
              '<div class="content">'+
                '<h4 class="title">Bitiş Saati</h4>'+
                '<div class="text">Tarih : {{finishTime[0]}} {{finishTime[1]}}</div>'+
              '</div>'+
            '</div>'+

          '</div>'+
        '</div>'+

        
    '</div>' +
    '</div>' +
    '</div>' +

    '</div>' +
    '</div>'

});

var gpstrack = new Vue({
  el: '#gpstrack'
});