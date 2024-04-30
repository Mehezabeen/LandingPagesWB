import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashAlt, faPrint, faTimes } from "@fortawesome/free-solid-svg-icons";
import SideBar3 from "../../../../SideBar/SideBar3";
import Header from "../../../../Admin/Header/Header";
import "./QualityOutboundSpongeIronDetails.css";
import { useMediaQuery } from "react-responsive";
import { useLocation } from 'react-router-dom';
import { Chart, ArcElement } from "chart.js/auto";

const QualityOutboundSpongeIronDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { receiveInboundData } = location.state || {};
  const [formData, setFormData] = useState({
    date: "2024-04-30",
    inTime: "11:16",
    outTime: "12:20",
    vehicleNumber: "OD35F-3948",
    transporter: "JEEN TRADE & EXPORTS",
    transactionType: "Inbound",
    ticketNo: "1",
    tpNo: "I22405984/75",
    poNo: "",
    challanNo: "1310002441-5300030809",
    supplier: "MCL Bhubaneswari",
    supplierAddress: "Talcher",
    material: "Sponge Iron",
    materialType: "hematite",
    size20mm: "65.28",
    size03mm: "9.24",
    fet: "62.54",
    loi: "4.18",
  });

  const closeForm = () => {
    navigate("/QualityCheck");
  };

  const handleSave = () => {
    const data = {
      date: formData.date,
      inTime: formData.inTime,
      customer: formData.customer,
      vehicleNumber: formData.vehicleNumber,
      transporter: formData.transporter,
      ticketNo: formData.ticketNo,
      tpNo: formData.tpNo,
      poNo: formData.poNo,
      challanNo: formData.challanNo,
      supplier: formData.supplier,
      supplierAddress: formData.supplierAddress,
      material: formData.material,
      materialType: formData.materialType,
      transactionType: formData.transactionType,
      size20mm: formData.size20mm,
      size03mm: formData.size03mm,
      fet: formData.fet,
      loi: formData.loi,
    };

    const queryString = new URLSearchParams(data).toString();

    navigate(`/QualityCheck?${queryString}`);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const isTablet = useMediaQuery({ query: "(min-width: 768px) and (max-width: 1023px)" });
  const isDesktop = useMediaQuery({ query: "(min-width: 1024px)" });

  const currentDateTime = new Date().toLocaleString();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [material, setMaterial] = useState("Select");

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  useEffect(() => {
    Chart.register(ArcElement);
  }, []);

  const handleMaterialChange = (event) => {
    setMaterial(event.target.value);
  };

  const renderFieldWithBox = (fieldName, fieldValue, onChange) => (
    <div className="d-flex flex-row mb-3 align-items-center">
      <label htmlFor={fieldName} className="form-label text-muted me-2 fw-normal">
        {fieldName}:
      </label>
      <div style={{ flex: 1 }}>
        <input
          type="text"
          name={fieldName}
          autoComplete="off"
          value={fieldValue}
          onChange={onChange}
          required
          className="form-control"
          readOnly
        />
      </div>
    </div>
  );

  return (
    <div className="d-flex">
      <div className="flex-grow-1">
        <Header toggleSidebar={toggleSidebar} />
        <SideBar3
          isSidebarExpanded={isSidebarExpanded}
          toggleSidebar={toggleSidebar}
        />
        <div
          className={`quality-detail-check-main-content ${
            isMobile ? "mobile" : isTablet ? "tablet" : "desktop"
          }`}
          style={{ marginLeft: "220px" }}
        >
          <div className="container-fluid trans-form-main-div overflow-hidden">
            <div className="close" onClick={closeForm}>
              <FontAwesomeIcon icon={faTimes} />
            </div>
            <div className="d-flex flex-column align-items-center mb-4">
              <div className="text-center mb-4">
                <h3 style={{marginRight: "130px" , marginTop: "60px"}}>Quality Check Inbound Details</h3>
              </div>
              <div className="d-flex" style={{ justifyContent: 'flex-end', width: '100%' }}>
                <button className="btn button-transition mx-3" onClick={handleSave}>
                  <FontAwesomeIcon icon={faSave} />
                </button>
                <button className="btn button-transition mx-3">
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
                <button className="btn button-transition mx-3">
                  <FontAwesomeIcon icon={faPrint} />
                </button>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-4 div2 container-fluid">
                {renderFieldWithBox("Ticket No", formData.ticketNo, handleInputChange )}
                {renderFieldWithBox("Date", formData.date, handleInputChange)}
                {renderFieldWithBox("Vehicle Number", formData.vehicleNumber, handleInputChange)}
                {renderFieldWithBox("In Time",formData.inTime )}
                {renderFieldWithBox("Out Time",formData.outTime )}
                {renderFieldWithBox("Transporter", formData.transporter, handleInputChange)}
              </div>
              <div className="col-lg-4 div2 container-fluid column-margin">
                {renderFieldWithBox("Material", formData.material, handleInputChange)}
                {renderFieldWithBox("Material Type", formData.materialType, handleInputChange)}
                {renderFieldWithBox("Tp No", formData.tpNo, handleInputChange)}
                {renderFieldWithBox("Po No", formData.poNo, handleInputChange)}
                {renderFieldWithBox("Challan No", formData.challanNo, handleInputChange)}
                {renderFieldWithBox("Transaction Type", formData.transactionType, handleInputChange)}
              </div>
              <div className="col-lg-4 div2 container-fluid">
                {renderFieldWithBox("Supplier", formData.supplier, handleInputChange)}
                {renderFieldWithBox("Supplier Address", formData.supplierAddress, handleInputChange)}
                {renderFieldWithBox("Size %+20mm", formData.size20mm, handleInputChange)}
                {renderFieldWithBox("Size %-03mm", formData.size03mm, handleInputChange)}
                {renderFieldWithBox("Fe(t) %", formData.fet, handleInputChange)}
                {renderFieldWithBox("Loi %", formData.loi, handleInputChange)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualityOutboundSpongeIronDetails;