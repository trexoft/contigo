Vue.component('searchh', {
	data:function(){
		return this.setDefault();
  },
  methods:{
      setDefault:function(){
          return {
              onoff:true,
          }
      },
      open:function(){
        this.onoff = true;
        var geocoder = new MapboxGeocoder({
            accessToken: GL.config.mapboxglAccessToken,
            mapboxgl: mapboxgl
        });
        document.getElementById('geocoder2').appendChild(GL.geocoder.onAdd(GL.map));
      },
      close:function(e){
        this.onoff = false;
      }
  },
  template:
    '<div id="geocoder2" class="geocoder2"></div>'
  });

var searchh = new Vue({ el: '#searchh' });