import React, { useState, useRef, useEffect } from "react";
import DownloadTableButton from "components/DownloadTableButton/DownloadTableButton";
import { Col, Row, Button, Table } from "antd";
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api';

const center = { lat: 48.8584, lng: 2.2945 }
const containerStyle = {
  width: '100%',
  height: '100%'
};

const GpsHistory = () => {

  const csvHeaders = [
    {
        label: "Term",
        key: "term",
      },
      {
        label: "Definition",
        key: "definition",
      }
  ];


  const data = [{
      term : 'Mark as Definition',
      definition : 'If you want to add this event to the Violation History page and report, select this checkbox.'
  }, {
      term : 'Pinned',
      definition : 'Selecting the pin icon will prioritize this event and place it on the Caseload page.'
  }, {
      term : 'Created At',
      definition : 'This is the date and time the event occurred.'
  }, {
      term : 'Received At',
      definition : 'This is the date and time the event data was received by the server.'
  }, {
      term : 'Compliant At',
      definition : 'This is the date and time the event ended and compliance is resumed. Examples of how compliance is resumed include: A low battery being charged; a subsequent negative alcohol reading; airplane mode being turned off; re-entering an inclusion zone; exiting an exclusion zone; turning on location permissions, etc.'
  }, {
      term : 'Notification At',
      definition : 'This is the date and time a notification regarding the event was sent to Alert Recipients.'
  }];

 
  const gpsColumn = [
    {
      title: 'Event Date',
      dataIndex: 'eventdate',
      key: 'eventdate',
      render: (text) => <div>{text}</div>,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Battery',
      dataIndex: 'battery',
      key: 'battery',
    },
    {
      title: 'Charger',
      dataIndex: 'charger',
      key: 'charger',
    },
    {
      title: 'Strap',
      dataIndex: 'strap',
      key: 'strap',
    },
    {
      title: 'Speed',
      dataIndex: 'speed',
      key: 'speed',
    },
  ];

  const gpsData = [
    {
      key: '1',
      eventdate: '06/02/2022 11:58:10 pm',
      location: '8655 North Bremetowe Pwy Chicago, IL 60606',
      battery: '100%',
      charger: 'Off',
      strap: 'On',
      speed: '0 mph',
    },
    {
      key: '1',
      eventdate: '06/02/2022 11:58:10 pm',
      location: '8655 North Bremetowe Pwy Chicago, IL 60606',
      battery: '100%',
      charger: 'Off',
      strap: 'On',
      speed: '0 mph',
    },
    {
      key: '1',
      eventdate: '06/02/2022 11:58:10 pm',
      location: '8655 North Bremetowe Pwy Chicago, IL 60606',
      battery: '100%',
      charger: 'Off',
      strap: 'On',
      speed: '0 mph',
    },
    {
      key: '1',
      eventdate: '06/02/2022 11:58:10 pm',
      location: '8655 North Bremetowe Pwy Chicago, IL 60606',
      battery: '100%',
      charger: 'Off',
      strap: 'On',
      speed: '0 mph',
    },
    {
      key: '1',
      eventdate: '06/02/2022 11:58:10 pm',
      location: '8655 North Bremetowe Pwy Chicago, IL 60606',
      battery: '100%',
      charger: 'Off',
      strap: 'On',
      speed: '0 mph',
    },
    {
      key: '1',
      eventdate: '06/02/2022 11:58:10 pm',
      location: '8655 North Bremetowe Pwy Chicago, IL 60606',
      battery: '100%',
      charger: 'Off',
      strap: 'On',
      speed: '0 mph',
    },
    {
      key: '1',
      eventdate: '06/02/2022 11:58:10 pm',
      location: '8655 North Bremetowe Pwy Chicago, IL 60606',
      battery: '100%',
      charger: 'Off',
      strap: 'On',
      speed: '0 mph',
    },
    {
      key: '1',
      eventdate: '06/02/2022 11:58:10 pm',
      location: '8655 North Bremetowe Pwy Chicago, IL 60606',
      battery: '100%',
      charger: 'Off',
      strap: 'On',
      speed: '0 mph',
    },
    {
      key: '1',
      eventdate: '06/02/2022 11:58:10 pm',
      location: '8655 North Bremetowe Pwy Chicago, IL 60606',
      battery: '100%',
      charger: 'Off',
      strap: 'On',
      speed: '0 mph',
    },
    {
      key: '1',
      eventdate: '06/02/2022 11:58:10 pm',
      location: '8655 North Bremetowe Pwy Chicago, IL 60606',
      battery: '100%',
      charger: 'Off',
      strap: 'On',
      speed: '0 mph',
    },
    {
      key: '1',
      eventdate: '06/02/2022 11:58:10 pm',
      location: '8655 North Bremetowe Pwy Chicago, IL 60606',
      battery: '100%',
      charger: 'Off',
      strap: 'On',
      speed: '0 mph',
    },
    {
      key: '1',
      eventdate: '06/02/2022 11:58:10 pm',
      location: '8655 North Bremetowe Pwy Chicago, IL 60606',
      battery: '100%',
      charger: 'Off',
      strap: 'On',
      speed: '0 mph',
    },
    {
      key: '1',
      eventdate: '06/02/2022 11:58:10 pm',
      location: '8655 North Bremetowe Pwy Chicago, IL 60606',
      battery: '100%',
      charger: 'Off',
      strap: 'On',
      speed: '0 mph',
    },
    
  ];

  // Set google map API
  const [mapData, setMapData] = useState([{ lat: 48.8584, lng: 2.2945 }]);
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

  return (
    <>
      <Row>
          <Col span={3}>
          <h2>GPS History</h2>
          </Col>
          <Col span={5}>
              <Button type="primary"> Request Status Update </Button>
          </Col>
          <Col span={12}></Col>
          <Col span={4}>
          <DownloadTableButton csvData={data} headers={csvHeaders} />
          </Col>
      </Row>

      <Row>
        <Col span={10} className="cs_table">
          <Table columns={gpsColumn} dataSource={gpsData} pagination={false}  />
        </Col>

        <Col span={14}>
          <GoogleMap mapContainerStyle={containerStyle} center={mapData} zoom={20} onLoad={onLoad} onUnmount={onUnmount} >
            <Marker position={mapData} />
          </GoogleMap>
        </Col>
      </Row>
    </>
  );
};

export default GpsHistory;
