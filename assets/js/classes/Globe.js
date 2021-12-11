class Globe {
  constructor() {
    this.sidebar = new Sidebar();

    this.viewer = this.initViewer();
    this.configScene(this.viewer);
    this.loadDeviceMarkers();
  }

  configScene(viewer) {
    // scene settings
    viewer.scene.screenSpaceCameraController.enableTilt = false;

    // zoom control buttons
    document.querySelector("#zoom-out").addEventListener("click", function () {
      var ellipsoid = viewer.scene.globe.ellipsoid;
      var cameraHeight = ellipsoid.cartesianToCartographic(
        viewer.camera.position
      ).height;
      var moveRate =
        cameraHeight < 300000 ? cameraHeight / 15.0 : cameraHeight / 5.0;
      viewer.camera.moveBackward(moveRate);
    });
    document.querySelector("#zoom-in").addEventListener("click", function () {
      var ellipsoid = viewer.scene.globe.ellipsoid;
      var cameraHeight = ellipsoid.cartesianToCartographic(
        viewer.camera.position
      ).height;
      var moveRate =
        cameraHeight < 300000 ? cameraHeight / 15.0 : cameraHeight / 5.0;
      viewer.camera.moveForward(moveRate);
    });
    return viewer;
  }

  initViewer() {
    var imagery = Cesium.createDefaultImageryProviderViewModels();
    var viewer = new Cesium.Viewer("cesiumContainer", {
      imageryProviderViewModels: imagery,
      selectedImageryProviderViewModel: imagery[1],
    });
    viewer.scene.postRender.addEventListener(function (rendered) {
      if (
        viewer.scene.globe.tilesLoaded == true &&
        document.querySelector(".intro-container") &&
        !document
          .querySelector(".intro-container")
          .classList.contains("globe-rendered")
      ) {
        document
          .querySelector(".intro-container")
          .classList.add("globe-rendered");
        document.querySelector(".message").innerHTML =
          "Click Anywhere to Begin.";
      }
    });
    return viewer;
  }

  loadDeviceMarkers() {
    var globe = this;
    var call = getAjaxSettings(
      "https://api.nrfcloud.com/v1/devices?includeState=true&includeStateMeta=true&pageSort=desc"
    );

    $.ajax(call).done(function (response) {
      var devices = response.items;
      var deviceArray = [];
      for (let i = 0; i < devices.length; i++) {
        deviceArray[devices[i].id] = new Device(devices[i]);
      }
      globe.addDeviceMarkers(deviceArray);
    });
  }

  addDeviceMarkers(deviceArray) {
    var deviceList = document.querySelector(".device-list");
    var viewer = this.viewer;
    var sidebar = this.sidebar;
    var globe = this;

    if (Object.keys(deviceArray).length > 1) {
      for (const device in deviceArray) {
        globe.addDeviceMarker(viewer, deviceArray[device], deviceList, sidebar);
      }
    }
  }

  addDeviceMarker(viewer, data, deviceList, sidebar) {
    let showEntity = data && data.position && data.position.length > 0;
    let position =
      showEntity == true
        ? Cesium.Cartesian3.fromDegrees(data.position[1], data.position[0])
        : null;
    let listEntry = this.createListEntry(data, deviceList);
    let entity = viewer.entities.add({
      id: data.id,
      ...(position ? { position } : {}),
      properties: {
        id: data.id,
        name: data.properties.name,
        list_entry: listEntry,
        coords: data.position,
        data: data.properties.data,
        serviceType: data.serviceType,
        uncertainty: data.uncertainty,
        locationUpdate: data.locationUpdate,
      },
      billboard: {
        height: 32,
        width: 32,
        image: "img/nordic-icon-g.svg",
        show: showEntity,
      },
    });

    listEntry.addEventListener("click", function () {
      viewer.selectedEntity = entity;
      Globe.clickAction(viewer, sidebar);
      if (window.innerWidth < 771) {
        sidebar.closeSidebar();
      }
    });
  }

  createListEntry(data, deviceList) {
    let listEntry = document.createElement("li");
    listEntry.innerHTML = `<a href="#" class=${data.properties.connected} id=${data.id}>${data.properties.name}</a>`;
    deviceList.appendChild(listEntry);

    return listEntry;
  }

  static clickAction(viewer, sidebar) {
    if (document.querySelector(".infobox")) {
      document.querySelector(".infobox").remove();
    }

    Globe.resetIcons(viewer);
    Globe.resetHPE(viewer);
    if (viewer.selectedEntity !== undefined) {
      var deviceId = viewer.selectedEntity.properties.id.getValue();
      Globe.getLocationInfoForDevice(deviceId, viewer);
      Globe.getMessagesForDevice(deviceId);
      Globe.populateSidebar(viewer.selectedEntity);
      Globe.populateMobileData(viewer.selectedEntity);
      viewer.selectedEntity.billboard = {
        height: 64,
        width: 64,
        image: "img/nordic-icon-y.svg",
      };
      var listEntry = viewer.selectedEntity.properties.list_entry.getValue();
      if (listEntry !== undefined) {
        document.querySelector(".device-list li.active") !== null
          ? document
              .querySelector(".device-list li.active")
              .classList.remove("active")
          : false;
        listEntry.classList.add("active");
      }

      if (
        viewer.selectedEntity.properties.coords &&
        viewer.selectedEntity.properties.coords.getValue() &&
        viewer.selectedEntity.properties.coords.getValue().length > 0
      ) {
        viewer.flyTo(viewer.selectedEntity, {
          offset: new Cesium.HeadingPitchRange(0, -90, 5000),
        });
      }

      if (window.innerWidth > 770) {
        sidebar.openSidebar();
      } else {
        document.querySelector(".mobile-sidebar").classList.add("reveal");
      }
    } else {
      sidebar.closeSidebar();
      sidebar.closeMobileSidebar();
    }
  }

  static getLocationInfoForDevice(deviceID, viewer) {
    var locationData = getAjaxSettings(
      "https://api.nrfcloud.com/v1/location/history?deviceId=" +
        deviceID +
        "&pageLimit=1"
    );

    $(".device-data__datum.location_method .datum-info").html("Loading...");
    $(".device-data__datum.uncertainty .datum-info").html("Loading...");
    $(".device-data__datum").show();

    $.ajax(locationData).done(function (response) {
      const deviceLocationHistoryResult =
        response && response.items && response.items[0];
      if (deviceLocationHistoryResult) {
        var lastLocationServiceUpdate = moment(
          new Date(deviceLocationHistoryResult.insertedAt)
        ).format("ddd MMM DD YYYY, kk:mm:ss");
        const deviceLat = +deviceLocationHistoryResult.lat || undefined;
        const deviceLon = +deviceLocationHistoryResult.lon || undefined;
        const serviceType = deviceLocationHistoryResult.serviceType || "N/A";
        const uncertainty = +deviceLocationHistoryResult.uncertainty;

        $(".device-data__datum.location_method .datum-info").html(serviceType);
        $(".device-data__datum.location_method .datum-timestamp").html(
          lastLocationServiceUpdate != "Invalid date"
            ? `updated ${lastLocationServiceUpdate}`
            : "No update"
        );
        $(".device-data__datum.uncertainty .datum-info").html(
          Globe.formatUncertainty(uncertainty)
        );
        $(".device-data__datum.uncertainty .datum-timestamp").html(
          uncertainty ? `updated ${lastLocationServiceUpdate}` : "No update"
        );

        viewer.entities
          .getById(deviceID)
          .position.setValue(
            Cesium.Cartesian3.fromDegrees(deviceLon, deviceLat)
          );
        viewer.entities
          .getById(deviceID)
          .properties.coords.setValue([deviceLat, deviceLon]);

        if (
          uncertainty !== undefined &&
          serviceType !== undefined &&
          deviceLat !== undefined &&
          deviceLon !== undefined
        ) {
          let fillColor = Cesium.Color.PURPLE.withAlpha(0.2);

          if (serviceType === "SCELL") {
            fillColor = Cesium.Color.CORNFLOWERBLUE.withAlpha(0.2);
          } else if (serviceType === "MCELL") {
            fillColor = Cesium.Color.ORANGE.withAlpha(0.2);
          }

          viewer.entities.add({
            id: `${deviceID}-HPE`,
            position: Cesium.Cartesian3.fromDegrees(deviceLon, deviceLat),
            ellipse: {
              semiMinorAxis: uncertainty,
              semiMajorAxis: uncertainty,
              material: fillColor,
            },
          });
        }
      }
    });
  }

  static getMessagesForDevice(deviceID) {
    var getTempData = getAjaxSettings(
      "https://api.nrfcloud.com/v1/messages?inclusiveStart=2018-06-18T19%3A19%3A45.902Z&exclusiveEnd=3000-06-20T19%3A19%3A45.902Z&deviceIdentifiers=" +
        deviceID +
        "&pageLimit=1&pageSort=desc&appId=TEMP"
    );
    var getHumidityData = getAjaxSettings(
      "https://api.nrfcloud.com/v1/messages?inclusiveStart=2018-06-18T19%3A19%3A45.902Z&exclusiveEnd=3000-06-20T19%3A19%3A45.902Z&deviceIdentifiers=" +
        deviceID +
        "&pageLimit=1&pageSort=desc&appId=HUMID"
    );

    $(".device-data__datum.temp .datum-info").html("Loading...");
    $(".device-data__datum.humidity .datum-info").html("Loading...");
    $(".device-data__datum").show();

    $.when($.ajax(getTempData), $.ajax(getHumidityData)).done(function (
      tempResponse,
      humidityResponse
    ) {
      var data = {
        Temperature: {
          data: null,
          timestamp: null,
        },
        Humidity: {
          data: null,
          timestamp: null,
        },
      };

      var tempData = tempResponse[0].items && tempResponse[0].items[0];
      var humidData = humidityResponse[0].items && humidityResponse[0].items[0];

      if (tempData) {
        data.Temperature.data = tempData.message.data;
        data.Temperature.timestamp = moment(
          new Date(Date.parse(tempData.receivedAt))
        ).format("ddd MMM DD YYYY, kk:mm:ss");
      }

      if (humidData) {
        data.Humidity.data = humidData.message.data;
        data.Humidity.timestamp = moment(
          new Date(Date.parse(humidData.receivedAt))
        ).format("ddd MMM DD YYYY, kk:mm:ss");
      }

      $(".device-data__datum.temp .datum-info").html(
        Globe.formatDataString(data, "Temperature")
      );
      $(".device-data__datum.temp .datum-timestamp").html(
        Globe.formatTimestamp(data, "Temperature")
      );
      $(".device-data__datum.humidity .datum-info").html(
        Globe.formatDataString(data, "Humidity")
      );
      $(".device-data__datum.humidity .datum-timestamp").html(
        Globe.formatTimestamp(data, "Humidity")
      );
    });
  }

  static formatDataString(message, dataKey) {
    return message[dataKey].data
      ? `${Number.parseFloat(+message[dataKey].data).toFixed(2)}${
          Device.dataMap[dataKey].unit
        }`
      : "--";
  }

  static formatTimestamp(message, dataKey) {
    return message[dataKey].timestamp
      ? `updated ${message[dataKey].timestamp}`
      : "No update";
  }

  static formatUncertainty(message) {
    return message && message !== "NA" ? `${message} m` : "N/A";
  }

  static populateSidebar(entity) {
    var props = entity.properties;
    var deviceData = document.querySelector(".data-display");
    var name = deviceData.querySelector(".device-location-name-label");
    var coords = deviceData.querySelector(".coordinates");
    var lastLocationServiceUpdate = moment(
      new Date(props.locationUpdate)
    ).format("ddd MMM DD YYYY, kk:mm:ss");
    var uncertainty = props.uncertainty.getValue();

    $(".device-data__datum.location_method .datum-info").html(
      props.serviceType.getValue() || "N/A"
    );

    $(".device-data__datum.location_method .datum-timestamp").html(
      lastLocationServiceUpdate != "Invalid date"
        ? `updated ${lastLocationServiceUpdate}`
        : "No update"
    );

    $(".device-data__datum.uncertainty .datum-info").html(
      Globe.formatUncertainty(uncertainty)
    );

    $(".device-data__datum.uncertainty .datum-timestamp").html(
      uncertainty ? `updated ${lastLocationServiceUpdate}` : "No update"
    );

    name.innerHTML = props.name;
    coords.innerHTML =
      props.coords && props.coords.getValue().length > 0
        ? `${props.coords
            .getValue()[0]
            .toFixed(4)}, ${props.coords.getValue()[1].toFixed(4)}`
        : "No Location Data Available";

    const deviceId = entity.properties.id.getValue();
    const call = getAjaxSettings(
      `https://api.nrfcloud.com/v1/devices?deviceIds=${deviceId}&includeState=true`
    );

    $.ajax(call).done(function (response) {
      const deviceData =
        response && response.items && response && response.items[0];
      if (deviceData) {
        const deviceHTMLElement = document.getElementById(deviceId);
        let connectionStatus = "disconnected";
        if (deviceData.state && deviceData.state.reported) {
          const isConnected_LEGACY_FIRMWARE = !!deviceData.state.reported
            .connected;
          const isConnected_UPDATED_FIRMWARE =
            deviceData.state.reported.connection &&
            deviceData.state.reported.connection.status === "connected";

          if (isConnected_LEGACY_FIRMWARE || isConnected_UPDATED_FIRMWARE) {
            connectionStatus = "connected";
          }
        }

        deviceHTMLElement.className = connectionStatus;
      }
    });
  }

  static populateMobileData(entity) {
    var props = entity.properties;
    var deviceData = document.querySelector(".mobile-sidebar .data-display");
    var name = deviceData.querySelector(".device-location-name-label");
    var coords = deviceData.querySelector(".coordinates");
    var datumContainer = deviceData.querySelector(
      ".mobile-sidebar .device-data"
    );

    name.innerHTML = props.name;
    coords.innerHTML =
      props.coords && props.coords.getValue()
        ? props.coords
        : "No Location Data Available";
  }

  static resetIcons(viewer) {
    var entriesArray = viewer.entities.values;
    if (undefined !== viewer.selectedEntity) {
      for (let i = 0; i < entriesArray.length; i++) {
        if (
          entriesArray[i].billboard &&
          entriesArray[i].billboard.image &&
          entriesArray[i].billboard.image.getValue() !== undefined
        ) {
          entriesArray[i].billboard = {
            height: 32,
            width: 32,
            image: "img/nordic-icon-g.svg",
          };
        }
      }
    }
  }

  static resetHPE(viewer) {
    var entriesArray = viewer.entities.values;
    if (undefined !== viewer.selectedEntity) {
      for (let i = 0; i < entriesArray.length; i++) {
        if (entriesArray[i].id.includes("HPE")) {
          viewer.entities.removeById(entriesArray[i].id);
        }
      }
    }
  }
}
