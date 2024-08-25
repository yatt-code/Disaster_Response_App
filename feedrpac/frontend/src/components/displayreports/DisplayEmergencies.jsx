import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Dropdown, DropdownDivider } from 'react-bootstrap';
import { FaHandsHelping } from "react-icons/fa";
import { IoIosArrowBack } from 'react-icons/io';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { CalculateTimeDifference } from '../others/CalculateTimeDifference';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { emergencyIcons } from '../others/EmergencyIcons';
import './DisplayEmergencies.css'
import { ScrollComponent } from '../others/ScrollComponent';
import HoverWindow from './HoverWindow';
import MapModal from './MapModal';
import VolunteerModal from '../volunteer/VolunteerModal';
import { reportLink } from '../backendAddress/URL';

const DisplayEmergencies = () => {
  const { disastertype } = useParams();
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [filterType, setFilterType] = useState('All');
  const [modalShow, setModalShow] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);     // State to store selected report details
  const navigate = useNavigate();
  const detailContent = "View the exact location on a map.";
  const detailVolunteer = "Click here to volunteer for this report.";

  //Fetch the reports from backend only once.
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(reportLink);
        setReports(response.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, []);

  //Automatically filter the reports when 'disastertype' or 'reports' change.
  useEffect(() => {
    const type = disastertype || 'All';                   // 'type' is assigned the value of 'disastertype' if it exists, otherwise will default to 'All'.
    filterReports(type);

    // Filter the reports based on the selected disaster type
    let filtered = disastertype === 'All' ? reports : reports.filter(report => report.disastertype === disastertype);

    // Sort the filtered reports by createdAt in descending order so that most recent report is shown first.
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Update the state with the filtered and sorted reports
    setFilteredReports(filtered);

  }, [disastertype, reports]);

  const filterReports = (type) => {
    const filtered = type === 'All' ? reports : reports.filter(report => report.disastertype === type);
    setFilteredReports(filtered);
  };

  const filterChangeByDropdown = (type) => {
    navigate(`/emergencies/${type}`);
    setFilterType(type);
    filterReports(type);
  };

  const handleShow = (report) => {
    setSelectedReport(report);              // Store the selected report's details
    setModalShow(true);
  };

  const handleClose = () => setModalShow(false);

  return (

    // Container fluid will enable the reports to be displayed responsively.
    <Container fluid>             
      {/* <ScrollComponent> */}
      <div className='m-2'>
        <Link to="/"> <IoIosArrowBack />Back</Link>
      </div>
      <Row className="my-2">
        <div id='currTextBg'>
          <h1 id='currText'>Current Situation</h1>
          <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
              Filter by Disaster Type
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {Object.keys(emergencyIcons).map((type, index) => (
                <Dropdown.Item key={index} onClick={() => filterChangeByDropdown(type)}>{type}</Dropdown.Item>
              ))}
              <DropdownDivider />
              <Dropdown.Item onClick={() => filterChangeByDropdown('All')}>All</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <br></br>
      </Row>
      <Row>
        <TransitionGroup component={null}>
          {filteredReports.map((report, index) => (
            <CSSTransition key={index} timeout={500} classNames="fade">
              <Col xs={12} md={4} className="mb-2">
                <Card id='reportCard'>
                  <Card.Body id='reportCardBody'>
                    <Row>
                      <Col xs={8}>
                        <Card.Title id='reportCardTitle'>
                          {emergencyIcons[report.disastertype] || emergencyIcons.general} {report.disastertype}
                        </Card.Title>
                        <Card.Text id='reportCardText'>
                          reported at
                        </Card.Text>
                        <Card.Text id='addressText'>
                          {report.location}
                        </Card.Text>
                        <Card.Text>
                          <HoverWindow content={detailContent}>
                            <Button id='MapBtn' variant='info' onClick={() => handleShow(report)}>
                              View on Map
                            </Button>
                          </HoverWindow>
                        </Card.Text>
                        <Card.Text>
                          <small className="text-muted">
                            Submitted {CalculateTimeDifference(report.createdAt)}.
                          </small>
                        </Card.Text>
                      </Col>
                      <Col xs={4} className='d-flex align-items-center justify-content-center'>
                        <HoverWindow content={detailVolunteer}>
                          <Button id="volunBtn" variant="success" onClick={() => VolunteerModal()}> <FaHandsHelping color="white" size="40px" /></Button>
                        </HoverWindow>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </Row>
      <TransitionGroup component={null}>
        <CSSTransition timeout={500} classNames="fade">
          <div id='footer' className='footer-container'>
            <p id='footerText'>You have seen all the reports.</p>
          </div>
        </CSSTransition>
      </TransitionGroup>
      {/* </ScrollComponent> */}
      {selectedReport && (                                   //Render MapModal only if selectedReport is not null.
        <MapModal
          show={modalShow}
          handleClose={handleClose}
          lat={selectedReport.lat}                          //The modal receives the latitude, longitude, and report ID from selectedReport.
          long={selectedReport.lng}
          report_id={selectedReport.id}
          descr={selectedReport.description}
        />
      )}
    </Container>
  );
};

export default DisplayEmergencies;
