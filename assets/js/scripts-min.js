const handleEvent=(e,{el:t,callback:n,useCapture:o=!1}={},r)=>{const i=t||document.documentElement;function s(e){e.preventDefault(),e.stopPropagation(),"function"==typeof n&&n.call(r,e)}return s.destroy=function(){return i.removeEventListener(e,s,o)},i.addEventListener(e,s,o),s};function loadScript(e,t){var n,o,r;o=!1,(n=document.createElement("script")).type="text/javascript",n.src=e,n.onload=n.onreadystatechange=function(){o||this.readyState&&"complete"!=this.readyState||(o=!0,t())},(r=document.getElementsByTagName("script")[0]).parentNode.insertBefore(n,r)}function globeBuild(){let e=[{position:Cesium.Cartesian3.fromDegrees(-122.675,45.5051),properties:{coords:"45.5051° N, 122.6750° W",name:"Portland Or"}},{position:Cesium.Cartesian3.fromDegrees(-122.675,48.5051),properties:{coords:"48.5051° N, 122.6750° W",name:"Paris France"}}];new Globe(e)}document.addEventListener("DOMContentLoaded",(function(){console.log("DOMContentLoaded"),loadScript("https://cesium.com/downloads/cesiumjs/releases/1.73/Build/Cesium/Cesium.js",globeBuild),window.setTimeout((function(){document.querySelector("body").classList.add("loaded"),document.querySelector(".sidebar").classList.add("open")}),800),document.querySelector(".intro-container").addEventListener("click",(function(){this.classList.add("hidden"),window.setTimeout((function(){document.querySelector(".intro-container").remove()}),800)}))}));