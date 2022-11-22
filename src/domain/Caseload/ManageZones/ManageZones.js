import React, { useState, useEffect,useRef,useCallback } from "react";
import { StyledButton } from "theme/StyledComponents";
import { Row, Col, Select, Input, Button, notification  } from "antd";
import { css } from 'styled-components';
import { StyledModal } from "./ManageZones.style";
import apiHandler from "api";
import endpoint from "api/endpoint";
import { useSelector } from "react-redux";
import "./ManageZonesCustom.css";
import {useJsApiLoader, GoogleMap, Marker, Circle,Polygon } from '@react-google-maps/api';
import Autocomplete from "react-google-autocomplete";

const center = { lat: 48.8584, lng: 2.2945 };

const containerStyle = {
  width: '100%',
  height: '330px'
};


const ManageZones = () => {
  const { authToken } = useSelector((state) => state.login);
  const [modalVisible, setModalVisible] = useState(false);
  const { Option } = Select;
  const [zoneData, setZoneData] = useState([]);
  const [mapData, setMapData] = useState([{ lat: 48.8584, lng: 2.2945 }]);
  const { activeParticipantId } = useSelector((state) => state.common);
  const [zoneName, setZoneName] = useState("");
  const [zoneType, setzoneType] = useState("");
  const [radius, setRadius] = useState("50");
  const [coordinates, setCoordinates] = useState([]);
  const onChange = (value) => {setzoneType(value)};
  const [addZone, setAddZone] = useState("");
  const zLabel = {isTrue: true, isFalse: false}
  const [shapeType, setShapeType] = useState("");
  const [places,setPlaces] = useState({});
  const [polygonPath, setPolygonPath] = useState([]);
  const [rectanglePath, setRectanglePath] = useState([]);
  const [rectangleCoordinate, setRectangleCoordinate] = useState([]);
  const polygonRef = useRef(null);
  const listenersRef = useRef([]);
  const [isShow, setShow] = useState(false);

  useEffect(() => {
    fetchDetails();
    setzoneType(zLabel.isTrue)
  }, [setZoneData]);

  const fetchDetails = () => { 
    apiHandler({
      url: endpoint.AVAILABLE_ZONES + "/" + `${activeParticipantId}` + "/zones",
      authToken,
    }).then((result) => {
      setAddZone('');
      setZoneName('');
     // setzoneType('');
      setRadius('');
      setZoneData(result.data);
    });
  }

  const closeModal = () => {
    setAddZone('');
    setZoneName('');
    setzoneType('');
    setRadius('');
    setModalVisible(false);
  }

  // Set google auto complete and map API
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyA8FYDU4v-wK_qpC5vkboWcJJyju9psrgY",
    libraries: ['places'],
  })

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])


  // Save GPS  Zone data
  const saveGps = () => {
    var error = 0;
    var errorMsg = "";
    if(zoneName == ''){
      error += 1;
      errorMsg = "Zone name is required";
    }
    else if(shapeType == ''){
      error += 1;
      errorMsg = "Shape is required";
    }
    else if(shapeType == 'Circle' && coordinates.length == 0){
      error += 1;
      errorMsg = "Coorinates not found";
    }
    else if((shapeType == 'Rectangle' || shapeType == 'Polygon') && rectangleCoordinate.length == 0){
      error += 1;
      errorMsg = "Coorinates not found";
    }


    if(error == 0){
     
      var payload = []
      if(shapeType == 'Circle'){ 
        const coord = [coordinates];
      const sendCoord = coord.map(({
        lat: latitude,
        lng: longitude,
        ...rest
      }) => ({
        latitude,
        longitude,
        ...rest
      }));
        
        payload.push({
          "name": zoneName, 
          "coordinates": sendCoord, 
          "radius" : parseInt(radius),
          "isExclusionZone": zoneType,
          "typeOfShape": shapeType.toUpperCase(),
        });
      }
      if(shapeType == 'Rectangle' || shapeType == 'Polygon'){ 
        const sendCoord = rectangleCoordinate.map(({
          lat: latitude,
          lng: longitude,
          ...rest
        }) => ({
          latitude,
          longitude,
          ...rest
        }));
        
        payload.push({
          "name": zoneName, 
          "coordinates": sendCoord, 
          "radius" : 0,
          "isExclusionZone": zoneType,
          "typeOfShape": shapeType.toUpperCase(),
        });
      }

      console.log(payload)

      apiHandler({
        url: endpoint.AVAILABLE_ZONES + "/" + `${activeParticipantId}` + "/zones",
        authToken,
        method: 'POST',
        data:payload
      }).then((result) => {
        // console.log(result)
        closeModal();
        notification.success({
          description: "Zone added successfully",
          placement: "topRight",
          duration: 5,
        });
      });
    }
    else {
      notification.error({
        description: errorMsg,
        placement: "topRight",
        duration: 5,
      });
    }
  };

  const updateGps = () => {
    // console.log(zoneName)
    // console.log(coordinates)
    // console.log(radius)
    // console.log(zoneType)
    var error = 0;
    var errorMsg = "";
    if(zoneName == ''){
      error += 1;
      errorMsg = "Zone name is required";
    }
    else if(shapeType == ''){
      error += 1;
      errorMsg = "Shape is required";
    }
    else if(shapeType == 'Circle' && coordinates.length == 0){
      error += 1;
      errorMsg = "Coorinates not found";
    }
    else if((shapeType == 'Rectangle' || shapeType == 'Polygon') && rectangleCoordinate.length == 0){
      error += 1;
      errorMsg = "Coorinates not found";
    }

    if(error == 0){ 
      var payload = []
      if(shapeType == 'Circle'){ 
        payload.push({
          "name": zoneName, 
          "coordinates": coordinates, 
          "radius" : parseInt(radius),
          "isExclusionZone": zoneType,
          "typeOfShape": shapeType,
        });
      }
      if(shapeType == 'Rectangle' || shapeType == 'Polygon'){ 
        payload.push({
          "name": zoneName, 
          "coordinates": rectangleCoordinate, 
          "radius" : 0,
          "isExclusionZone": zoneType,
          "typeOfShape": shapeType,
        });
      }

      apiHandler({
        url: endpoint.AVAILABLE_ZONES + "/" + `${activeParticipantId}` + "/zones",
        authToken,
        method: 'POST',
        data:payload
      }).then((result) => {
        closeModal();
        notification.success({
          description: "Zone added successfully",
          placement: "topRight",
          duration: 5,
        });
      });
    }
    else {
      notification.error({
        description: errorMsg,
        placement: "topRight",
        duration: 5,
      });
    }
  }

  const options = {
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    clickable: true,
    draggable: true,
    editable: true,
    radius: 50,
    visible: true,
    zIndex: 1
  }

  const onLoaded = circle => {
    // console.log('Circle onLoad circle: ', circle)
  }
  
  const onUnmountLoad = circle => {
    console.log('Circle onUnmount circle: ', circle)
  }

  const changeShapeType = (e)=>{
    setShapeType(e);
    if(e==="Rectangle"){
      var triangle1 = window.google.maps.geometry.spherical.computeOffset(places.geometry.location, 50, 0);
      var triangle2 = window.google.maps.geometry.spherical.computeOffset(places.geometry.location, 0, 120);
      var triangle3 = window.google.maps.geometry.spherical.computeOffset(places.geometry.location, 88, -90);
      var triangle4 = window.google.maps.geometry.spherical.computeOffset(places.geometry.location, 100, -60);
      setRectangleCoordinate([]);
      var t1 = {"lat": parseInt(triangle1.lat()),"lng": parseInt(triangle1.lng())}
      var t2 = {"lat": parseInt(triangle2.lat()),"lng": parseInt(triangle2.lng())}
      var t3 = {"lat": parseInt(triangle3.lat()),"lng": parseInt(triangle3.lng())}
      var t4 = {"lat": parseInt(triangle4.lat()),"lng": parseInt(triangle4.lng())}
      // console.log(t1)
      // console.log(t2)
      // console.log(t3)
      // console.log(t4)
      setRectanglePath([triangle1, triangle2, triangle3, triangle4]);
      setRectangleCoordinate([t1, t2, t3, t4])
      console.log(rectangleCoordinate);
    }
    if(e==="Polygon"){
      var triangle1 = window.google.maps.geometry.spherical.computeOffset(places.geometry.location, 50, 0);
      var triangle2 = window.google.maps.geometry.spherical.computeOffset(places.geometry.location, 50, 120);
      var triangle3 = window.google.maps.geometry.spherical.computeOffset(places.geometry.location, 50, -120);
      setPolygonPath([triangle1, triangle2, triangle3]);
    }
    // const myPolygon = new window.google.maps.Polygon({
    //   path: triangleCoords,
    //   strokeColor: '#FF0000',
    //   strokeOpacity: 0.8,
    //   strokeWeight: 2,

    //   fillColor: '#FF0000',
    //   fillOpacity: 0.35
    // });
    // myPolygon.setMap(map);
  }

  const changeZone = (e) => {
    setAddZone(e);
    if(e == 'new zone'){
      setRadius('');
      setZoneName('');
      setzoneType('');
      setMapData({ lat: 48.8584, lng: 2.2945 });
      setShapeType("Circle");
      setShow(false);
    }
    else {
      setShow(true);
      zoneData.forEach(row => {
        if(row.id == e){
          let latAndLang = row['coordinates'].split(",");
          setMapData({ lat: parseInt(latAndLang[0].trim()), lng: parseInt(latAndLang[1].trim()) });
          setRadius(row['radius']);
          setAddZone(row['name']);
          setZoneName(row['name']);
          setzoneType(row['isExclusionZone']);
          setCoordinates({ lat: latAndLang[0].trim(), lng: latAndLang[1].trim() });
        }
      });
    }
  }

  const changeRadius = (e) => {
    console.log('e here',e);
    if(e.target.value){
      setRadius(parseInt(e.target.value))
    }
    else{
      setRadius(0)
    }
    // setRadius(e.target.value);
    // options['radius'] = parseInt(e.target.value);
   
    // console.log('radius here',window.google.maps.Circle)
  }

  const onEditPoly = useCallback(() => {
    if (polygonRef.current) {
      const nextPath = polygonRef.current.getPath().getArray().map((latLng) => latLng.toJSON());
      console.log(nextPath);
      setRectangleCoordinate([]);
      setRectangleCoordinate(nextPath);
      //  console.log(rectangleCoordinate);
    }
  });

  //const open
  const onLoadPolygon = useCallback(
    (polyline) => {
      polygonRef.current = polyline;
      const path = polyline.getPath();
      listenersRef.current.push(
        path.addListener("set_at", onEditPoly),
        path.addListener("insert_at", onEditPoly),
        path.addListener("remove_at", onEditPoly)
      );
    },
    [onEditPoly]
  );

  return (
    <>
      <StyledButton
        externalCss={css`
          background: #fff;
          border: 1px solid #0557a2;
          color: #0557a2;
          padding: 10px;
          margin: 15px 5px;
        `}
        onClick={() => { fetchDetails(); setModalVisible(true);}}>
        Manage Zones
      </StyledButton>

      <StyledModal visible={modalVisible} closable={false} width={900} footer={null} onCancel={closeModal}
        title={[
          <Row>
            <Col md={9} style={{marginTop:'5px',fontWeight: 'bold'}}>Manage GPS Zones</Col>
            <Col md={15}>
              {addZone == 'new zone' ? (
                <Button type="primary" disabled={addZone == '' || !addZone } onClick={() => saveGps()} style={{float: 'right',marginLeft:'1rem'}}>
                  Save
                </Button>
              ): (
                <Button type="primary" disabled={addZone == '' || !addZone } onClick={() => updateGps()} style={{float: 'right',marginLeft:'1rem'}}>
                  Update
                </Button>
              )}
              <Button style={{float: 'right'}} onClick={closeModal}>Cancel</Button>
            </Col>
          </Row>
        ]}>

        <Row>
          <Col md={3} className="mt-5">
            Zone:
          </Col>

          <Col md={9}>
            {addZone == 'new zone' ? (
              <Input placeholder="Enter Zone Name" onChange={(e) => setZoneName(e.target.value)} style={{ width: '85%',borderRadius: '0px' }} />
            ) : (<></>)}

            {addZone != 'new zone' || addZone == '' ? (
              <Select placeholder="Select zone"  style={{width: "85%"}} value={addZone} onChange={(e) => changeZone(e)}>
                <Option value="">Select Zone</Option>
                <Option value="new zone" key="0" >Create New Zone</Option>
                { zoneData.map(zone => <Option value={zone.id} key={zone.id} >{zone.name}</Option>) }
              </Select>
            ) : (<></>)}
          </Col>

          <Col md={9}>
            <Autocomplete
              apiKey={"AIzaSyA8FYDU4v-wK_qpC5vkboWcJJyju9psrgY"}
              style={{ width: "90%", border: '1px solid #d9d9d9', borderRadius: '2px', padding: '4px' }}
              onPlaceSelected={(place) => {
                setMapData({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
                setPlaces(place);
                setShow(true);
                setCoordinates({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
              }}
              options={{
                types: ["(regions)"],
                componentRestrictions: { country: "us" },
              }}
            />
          </Col>
        </Row>
        
        <Row style={{marginTop: '1rem'}}>
          <GoogleMap mapContainerStyle={containerStyle} center={mapData} zoom={10} onLoad={onLoad} onUnmount={onUnmount} >
            <Row className="mt-15">
              <Col md={7} >
              </Col>

              <Col md={6}>
                <Select placeholder="Select" onChange={onChange} style={{width: "80%"}} value={zoneType}>
                  <Option value="">Select Zone Type</Option>
                  <Option value={zLabel.isTrue} selected>Inclusion Zone</Option>
                  <Option value={zLabel.isFalse}>Exclusion Zone</Option>
                </Select>
              </Col>

              <Col md={4}>
                {shapeType === "Circle" ? (<Input type='text' placeholder='Radius (ft)' onChange={(e) => changeRadius(e)} value={radius}  />)
                : (<></>)}
              </Col>
              
              {isShow == false ? (<Col md={3}></Col> ) : (
                <>
                  {shapeType == '' ? (<Col md={3}></Col> ) : (
                    <>
                      <Col md={1} style={{ marginLeft: '10px', marginRight: '15px' }}>
                        <Button type={shapeType === "Circle" ? 'primary' : ""} onClick={() => changeShapeType("Circle")}>
                          &#9711;
                        </Button>
                      </Col>
                      <Col md={1} style={{ marginRight: '15px' }} onClick={() => changeShapeType("Rectangle")}>
                          <Button type={shapeType === "Rectangle" ? 'primary' : ""}>
                            &#9645;
                          </Button>
                        </Col>
                      <Col md={1}>
                        <Button type={shapeType === "Polygon" ? 'primary' : ""} onClick={() => changeShapeType("Polygon")}>
                          &#9651;
                        </Button>
                      </Col>
                    </>
                  )}
                </>
              )};
            </Row>

            
            <Marker position={mapData} />

            {shapeType == 'Circle' && shapeType != '' ? (
             <Circle onLoad={onLoaded} onUnmount={onUnmountLoad} radius={radius} center={mapData} options={options} />
            ) : (<></>)}
            
            {shapeType == 'Polygon' && shapeType != '' ? (
              <Polygon
              onMouseUp={onEditPoly}
              ref={polygonRef}
              draggable={true}
              editable={true}
              onLoad={onLoadPolygon}
              options={{
                strokeColor: "#FF0000",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#FF0000",
                fillOpacity: 0.35,
              }}
              onClick={function (event) {
               console.log('event here:',event);
              }}
              paths={polygonPath}
              />
            ) : (<></>)}

            {shapeType == 'Rectangle' && shapeType != '' ? (
              <Polygon
              draggable={true}
              editable={true}
              onLoad={onLoadPolygon}
              options={{
                  strokeColor: "#FF0000",
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: "#FF0000",
                  fillOpacity: 0.35,
              }}
              onClick={function (event) {
               console.log('event here:',event);
            }}
            paths={rectanglePath}
          />
            ) : (<></>)}
          </GoogleMap>
        </Row>
      </StyledModal>
    </>
  );
};

export default ManageZones;
