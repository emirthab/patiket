import React from "react"

export default function ProfilepicUpdate(props) {
    return (
        <div className={props.active ? "card pop-up-card active" : "card pop-up-card "} id="update-pp" style={{ paddingLeft: '30px', paddingBottom: '10px', paddingRight: '30px', paddingTop: '20px' }}>
            <div className="card-body">
                <h4 style={{ marginBottom: '30px' }}>Profil Fotoğrafı Değiştir<i onClick={() => props.handler(!props.active)} className="fa fa-times float-end" style={{ cursor: 'pointer', color: 'var(--bs-red)' }} /></h4>
                <img className="d-flex pet-image" alt="" src={props.metadata.profilepic ? "/uploads/" + props.metadata.profilepic : require("../../static/img/no-image.png")} style={{ margin: '0 auto', marginTop: '10px' }} />
                <input className="form-control" type="file" style={{ marginTop: '20px' }}
                    onChange={(event) => { props.setChangedProfilePic(event.target.files[0]) }} />
                <button onClick={() => props.handleUpdate()} className="btn btn-primary" type="button" style={{ width: '100%', marginTop: '15px' }}>Kaydet</button>
            </div>
        </div>
    )
}