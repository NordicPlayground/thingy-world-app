const handleEvent=(e,{el:t,callback:n,useCapture:o=!1}={},a)=>{const c=t||document.documentElement;function s(e){e.preventDefault(),e.stopPropagation(),"function"==typeof n&&n.call(a,e)}return s.destroy=function(){return c.removeEventListener(e,s,o)},c.addEventListener(e,s,o),s};function loadScript(e,t){var n,o,a;o=!1,(n=document.createElement("script")).type="text/javascript",n.src=e,n.onload=n.onreadystatechange=function(){o||this.readyState&&"complete"!=this.readyState||(o=!0,t())},(a=document.getElementsByTagName("script")[0]).parentNode.insertBefore(n,a)}function getData(){var e=new XMLHttpRequest;e.onreadystatechange=function(){if(4==this.readyState&&200==this.status){var e=JSON.parse(this.responseText);return console.log(e),new Globe(e)}},e.open("GET","getDeviceData.php",!0),e.send()}document.addEventListener("DOMContentLoaded",(function(){console.log("DOMContentLoaded"),loadScript("https://cesium.com/downloads/cesiumjs/releases/1.73/Build/Cesium/Cesium.js",getData),window.setTimeout((function(){document.querySelector("body").classList.add("loaded"),window.innerWidth>770&&(document.querySelector(".sidebar").classList.add("open"),document.querySelector("body").classList.add("open-sidebar"))}),800),document.querySelector(".intro-container").addEventListener("click",(function(){this.classList.add("hidden"),window.setTimeout((function(){document.querySelector(".intro-container").remove()}),800)})),document.querySelector(".top-tab").addEventListener("click",(function(){document.querySelector(".infobox").classList.contains("reveal")?document.querySelector(".infobox").classList.remove("reveal"):document.querySelector(".infobox").classList.add("reveal")}))}));