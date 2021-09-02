import React from "react";
import Moment from 'moment';
import DatePicker from "react-datepicker"
import { useState } from 'react';
import { registerLocale } from "react-datepicker";
import tr from 'date-fns/locale/tr';
registerLocale('tr', tr)


export default function MainUpdate(props) {

    const [startDate, setStartDate] = useState();
    const [uniqueId, setUniqueId] = useState(0);

    return (
        <div className={props.active ? "card pop-up-card active" : "card pop-up-card "} id="update-main" style={{ paddingLeft: '30px', paddingBottom: '10px', paddingRight: '30px', paddingTop: '20px' }}>
            <div className="card-body">
                <h4 style={{ marginBottom: '30px' }}>Ön Bilgi Değiştir
                    <i onClick={() => {
                        props.handleUpdate(!props.active);
                        window.setTimeout(function () {
                            setUniqueId(uniqueId + 1);
                        }, 350);
                    }}
                        className="fa fa-times float-end" style={{ cursor: 'pointer', color: 'var(--bs-red)' }} />
                </h4>
                <div key={uniqueId}>
                    <h6 style={{ marginBottom: '5px' }}>İsim :<br /></h6>
                    <input className="form-control" type="text" style={{ marginBottom: '5px' }} placeholder={props.data.name}
                        onChange={(event) => { props.setChangedName(event.target.value) }} />

                    <h6 style={{ marginBottom: '5px' }}>Sahip :<br /></h6>
                    <input className="form-control" type="text" style={{ marginBottom: '5px' }} placeholder={props.metadata.owner}
                        onChange={(event) => { props.changedMeta.owner = event.target.value; props.setChangedMeta(props.changedMeta) }} />

                    <h6 style={{ marginBottom: '5px' }}>Telefon :<br /></h6>
                    <input className="form-control" type="tel" placeholder={props.metadata.phone} style={{ marginBottom: '5px' }}
                        onChange={(event) => { props.changedMeta.phone = event.target.value; props.setChangedMeta(props.changedMeta) }} />

                    <h6 style={{ marginBottom: '5px' }}>Doğum Tarihi :<br /></h6>
                    <DatePicker placeholderText={props.metadata.birth} dateFormat="dd.MM.yyyy" locale="tr" className="form-control mb-2" selected={startDate}
                        onChange={(date) => { setStartDate(date); props.changedMeta.birth = Moment(date).format("D.MM.yyyy"); props.setChangedMeta(props.changedMeta) }} />

                    <h6 style={{ marginBottom: '5px' }}>Cinsi :<br /></h6>
                    <input className="form-control" type="text" style={{ marginBottom: '5px' }} placeholder={props.metadata.breed}
                        onChange={(event) => { props.changedMeta.breed = event.target.value; props.setChangedMeta(props.changedMeta) }} />

                    <h6 style={{ marginBottom: '5px' }}>Adres :<br /></h6>
                    <textarea className="form-control" placeholder={props.metadata.adress} style={{ marginBottom: '5px' }} defaultValue={""}
                        onChange={(event) => { props.changedMeta.adress = event.target.value; props.setChangedMeta(props.changedMeta); }} />

                    <h6 style={{ marginBottom: '5px' }}>Cinsiyeti :<br /></h6>
                    <div className="d-flex">
                        <div className="form-check" style={{ width: '100px' }}>

                            <input className="form-check-input" name="gender" type="radio" id="gender-0" defaultChecked={props.metadata.gender === "0"}
                                onChange={(event) => { props.changedMeta.gender = 0; props.setChangedMeta(props.changedMeta) }} />
                            <label className="form-check-label" htmlFor="gender-0">Erkek</label>
                        </div>
                        <div className="form-check" style={{ width: '100px' }}>
                            <input className="form-check-input" name="gender" type="radio" id="gender-1" defaultChecked={props.metadata.gender === "1"}
                                onChange={(event) => { props.changedMeta.gender = 1; props.setChangedMeta(props.changedMeta) }} />
                            <label className="form-check-label" htmlFor="gender-1">Dişi</label>

                        </div>
                    </div>
                </div>
                <button className="btn btn-primary"
                    onClick={() => {
                        props.handler()                        
                        window.setTimeout(function () {
                            setUniqueId(uniqueId + 1);
                        }, 350);
                    }} type="button" style={{ width: '100%', marginTop: '15px' }}>Kaydet</button>
            </div>
        </div >
    )
}
