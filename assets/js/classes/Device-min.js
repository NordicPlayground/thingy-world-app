class Device{constructor(e){this.id=e.id,this.properties={connected:void 0!==e.state.reported.connected&&1==e.state.reported.connected?"connected":"disconnected",name:e.name},this.getGPSData()}getGPSData(){var e=getAjaxSettings("https://api.nrfcloud.com/v1/messages?inclusiveStart=2018-06-18T19%3A19%3A45.902Z&exclusiveEnd=3000-06-20T19%3A19%3A45.902Z&deviceIdentifiers="+this.id+"&pageLimit=1&pageSort=desc&appId=GPS",!1),t=this;$.ajax(e).done((function(e){if(void 0!==e.items[0].message.data){var s=e.items[0].message.data,a=s.split(",");console.log(a);var i=parseFloat(a[2].substr(a[2].indexOf(".")-2))/60+parseFloat(a[2].substr(0,a[2].indexOf(".")-2)),n=i*("N"==a[3]?1:-1),d=i.toFixed(3),o=parseFloat(a[4].substr(a[4].indexOf(".")-2))/60+parseFloat(a[4].substr(0,a[4].indexOf(".")-2)),r=o*("E"==a[5]?1:-1),c=o.toFixed(3),l=d+"° "+a[3]+", "+c+"° "+a[5],p={lat:n,lng:r,readable:l};return t.position=[p.lat,p.lng],t.gps=p,t}p={lat:n,lng:r,readable:l};return t.position=[p.lat,s.lng],t.gps=p,t}))}}