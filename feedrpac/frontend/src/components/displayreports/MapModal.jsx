// MapModal.js
import { useState, useEffect } from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import MapPage from './MapPage';
import './MapModal.css';                      // Import your map component
import EventsMap from '../dashboard/overallsituation/EventsMap';

function MapModal({ show, handleClose, lat, long, report_id, descr, disaster, sever }) {

  const [selectedReport, setSelectedReport] = useState({ lat, long, report_id, descr, disaster, sever });

  useEffect(() => {
    if (show) {
      // Update the selectedReport state with the latest props when the modal is shown
      setSelectedReport({ lat, long, report_id, descr, disaster, sever });
    }
  }, [show, lat, long, report_id, descr, disaster, sever]);

  // Clear latitude, longitude and report_id values to get ready for next data.
  const closeAndClear = () => {
    setSelectedReport({
      lat: 0,
      long: 0,
      report_id: '',
      descr: '',
      disaster: '',
      sever: ''
    });
    handleClose();
  };

  // Check if the location is available
  const locationAvailable = selectedReport.lat && selectedReport.long;

  // Convert selectedReport into the format needed for EventsMap & send as an aray so that events.filter will work in EventsMap.
  const events = locationAvailable ? [
    {
      latitude: selectedReport.lat,
      longitude: selectedReport.long,
      disastertype: selectedReport.disaster,
      severity: selectedReport.sever
    }
  ] : [];

  return (
    <Modal show={show} onHide={closeAndClear} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title><b>Emergency's Location</b></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="map-container">      {/* Map Section */}
          {locationAvailable ? (
            <EventsMap events={events} />
          ) : (
            <p>No location available for this report.</p>
          )
          }
          {/* <MapPage 
              latitude={lat}
              longitude={long}
              report_ID={report_id}
              description={descr}
              />                   */}

        </div>
        <div className="description-container">
          <h5 style={{ marginTop: '10px', marginLeft:'5px'}}>Disaster Overview:</h5>
          <p style={{ paddingLeft: '20px' }}>{selectedReport.descr}</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeAndClear}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default MapModal;
