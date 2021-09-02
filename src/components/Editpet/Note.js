import React from "react";
import { useState } from "react";

export default function NoteUpdate(props) {

    const [uniqueId, setUniqueId] = useState(0)

    return (
        <div className={props.active ? "card pop-up-card active" : "card pop-up-card "} id="update-note" style={{ paddingLeft: '30px', paddingBottom: '10px', paddingRight: '30px', paddingTop: '20px' }}>
            <div className="card-body">
                <h4 style={{ marginBottom: '30px' }}>Notu Düzenle
                <i onClick={() => {
                    props.handler(!props.active);
                    window.setTimeout(function () {
                        setUniqueId(uniqueId + 1);
                    }, 350);
                }}
                className="fa fa-times float-end" style={{ cursor: 'pointer', color: 'var(--bs-red)' }} /></h4>
                <textarea
                    key={uniqueId}
                    className="form-control"
                    placeholder={props.metadata.note}
                    rows={7}
                    defaultValue={""}
                    onChange={(event) => { props.changedMeta.note = event.target.value; props.setChangedMeta(props.changedMeta) }} />
                <button
                    onClick={() => {
                        props.handleUpdate();
                        window.setTimeout(function () {
                            setUniqueId(uniqueId + 1);
                        }, 350);
                    }}
                    className="btn btn-primary" type="button" style={{ width: '100%', marginTop: '15px' }}>Kaydet</button>
            </div>
        </div>
    )
}