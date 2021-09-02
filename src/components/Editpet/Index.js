import React from 'react'
import { useState, useEffect } from 'react';
import "react-datepicker/dist/react-datepicker.css";

import MainMetasEdit from "./MainMetas"
import NoteEdit from "./Note"
import GalleryEdit from "./GalleryEdit"
import ProfilePicEdit from "./ProfilePic"
import Gallery from '../Gallery';

export default function Editpet(props) {

    const [mainUpdate, setMainUpdate] = useState(false);
    const [noteUpdate, setNoteUpdate] = useState(false);
    const [profilepicUpdate, setProfilepicUpdate] = useState(false);
    const [galleryUpdate, setGalleryUpdate] = useState(false);

    const [response, setResponse] = useState("")
    const [data, setData] = useState("")
    const [metadata, setMetadata] = useState("")

    const [changedMeta, setChangedMeta] = useState({})
    const [changedName, setChangedName] = useState("")
    const [changedProfilePic, setChangedProfilePic] = useState(null)

    const [galleryUniqueId, setGalleryUniqueId] = useState(0)


    useEffect(() => {
        response === "ok" ? props.setLoading(false) : props.setLoading(true)
        if (response !== "ok") {
            const url = "/api/v1/pet/" + props.id;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.response === "ok") {
                        setResponse("ok");
                        setData(data);

                        const url = "/api/v1/pet/" + props.id + "/getmeta"
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                setMetadata(data.metas)
                            })
                            .catch((error)=>{
                                response === "err" ? setResponse("err2") : setResponse("err")
                            })
                    }
                    else {
                        response === "err" ? setResponse("err2") : setResponse("err")
                    }
                })
        }
    }, [response])

    const updatePetName = () => {
        props.setLoading(true)
        const requestOptions = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: changedName,
                token: localStorage.getItem("token")
            })
        };
        const url = "/api/v1/pet/" + props.id + "/updatename"
        fetch(url, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.response === "ok") {
                    setResponse("waiting")
                    setChangedName("")
                }
                else {
                    props.setLoading(false)
                }
            })
            .catch((error) => {
                props.setLoading(false)
            })
    }

    const saveMetaUpdate = () => {
        props.setLoading(true)
        var _note = ""
        String(changedMeta.note).split("\n").map(function (item, i) {
            _note += item + " "
        })

        changedMeta.note = _note
        setChangedMeta(changedMeta)

        const requestOptions = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                metas: changedMeta,
                token: localStorage.getItem("token")
            })
        };
        const url = "/api/v1/pet/" + props.id + "/setmeta"
        fetch(url, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.response === "ok") {
                    setResponse("waiting")
                    setMainUpdate(false)
                    setNoteUpdate(false)
                    setChangedMeta({})
                } else {
                    props.setLoading(false)
                }
            })
            .catch((error) => {
                props.setLoading(false)
            })

        if (changedName !== "") {
            updatePetName();
        }
    }

    const updateProfilePic = () => {
        props.setLoading(true)
        const formdata = new FormData();
        formdata.append("File", changedProfilePic)

        const requestOptions = {
            headers: { token: localStorage.getItem("token") },
            method: "POST",
            body: formdata
        };
        const url = "/api/v1/pet/" + props.id + "/uploadpp"

        fetch(url, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.response === "ok") {
                    setResponse("waiting")
                }
                else {
                    props.setLoading(false)
                }
            })
            .catch((error) => {
                props.setLoading(false)
            })
    }

    const handleRemovePet = () => {

        if (confirm("Bu patiyi silmek istediğinize emin misiniz?\nBu işlemin geri dönüşü olmayacaktır.")) {

            const requestOptions = {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: localStorage.getItem("token")
                })
            };
            const url = "/api/v1/pet/" + props.id + "/delete"

            fetch(url, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.response === "ok") {
                        window.setTimeout(function () {
                            window.location.pathname = "/mypets"
                        }, 350)
                    }
                })
        }
    }

    return (
        <div>
            <GalleryEdit
                id={props.id}
                setLoading = {props.setLoading}
                galleryUniqueId={galleryUniqueId}
                setGalleryUniqueId={setGalleryUniqueId}
                active={galleryUpdate}
                handleUpdate={setGalleryUpdate}>
            </GalleryEdit>

            <ProfilePicEdit
                handler={setProfilepicUpdate}
                handleUpdate={updateProfilePic}
                metadata={metadata}
                setChangedProfilePic={setChangedProfilePic}
                active={profilepicUpdate}>
            </ProfilePicEdit>

            <NoteEdit
                changedMeta={changedMeta}
                setChangedMeta={setChangedMeta}
                handleUpdate={saveMetaUpdate}
                metadata={metadata}
                active={noteUpdate}
                handler={setNoteUpdate}>
            </NoteEdit>

            <MainMetasEdit
                handler={saveMetaUpdate}
                changedMeta={changedMeta}
                setChangedMeta={setChangedMeta}
                data={data}
                metadata={metadata}
                active={mainUpdate}
                setChangedName={setChangedName}
                handleUpdate={setMainUpdate}
            >
            </MainMetasEdit>

            <div>
                <div className="container">
                    <h5 style={{ textAlign: 'center', color: 'var(--bs-orange)', marginTop: '10px' }} >Pati Düzenle</h5>
                    <div style={{ display: "flex" }}>
                    </div>
                    <div className="d-table d-sm-block divider" style={{ width: '90%', margin: '0 auto', maxWidth: '500px' }} />
                    <div style={{ display: "flex" }}>
                        <button onClick={() => props.setPage("/mypets")} className="btn btn-success btn-sm d-table" type="button" style={{ margin: '0 auto', marginTop: '10px' }}>Patilere Dön</button>
                        <button onClick={() => handleRemovePet()} className="btn btn-danger btn-sm d-table" type="button" style={{ margin: '0 auto', marginTop: '10px' }}>Patiyi Sil</button>
                    </div>
                    <div className="card" style={{ margin: '0 auto', marginTop: '18px', maxWidth: '500px' }}>
                        <div className="card-body">
                            <button onClick={() => setProfilepicUpdate(!profilepicUpdate)} className="btn btn-primary btn-sm d-table" type="button" style={{ margin: '0 auto', marginTop: '10px' }}>Profil Fotoğrafı Değiştir</button>
                            <img className="d-flex pet-image" alt="" src={metadata.profilepic ? "/uploads/" + metadata.profilepic : require("../../static/img/no-image.png")} style={{ margin: '0 auto', marginTop: '10px' }} />
                            <div className="row">
                                <div className="col" style={{ background: 'rgba(0, 0, 0, 0.04)', borderRadius: '5px', marginTop: '10px' }}>
                                    <button onClick={() => setMainUpdate(!mainUpdate)} className="btn btn-primary btn-sm d-table" type="button" style={{ margin: '0 auto', marginTop: '10px' }}>Ön Bilgi Düzenle</button>
                                    <h3 style={{ color: 'var(--bs-orange)' }}>
                                        {metadata.gender === "0" && <i className="fa fa-mars" style={{ fontWeight: 900, fontSize: '29px', margin: '0 auto', color: 'var(--bs-cyan)' }} />}
                                        {metadata.gender === "1" && <i className="fa fa-venus" style={{ fontWeight: 900, fontSize: '29px', margin: '0 auto', color: 'var(--bs-pink)' }} />}
                                        &nbsp;{data.name}</h3>
                                    <h6 className="text-muted mb-2"><span style={{ color: 'rgb(92,92,92)' }}>Sahip :</span> {metadata.owner}</h6>
                                    <h6 className="text-muted mb-2"><span style={{ color: 'rgb(92,92,92)' }}>Telefon :</span> {metadata.phone}</h6>
                                    <h6 className="text-muted mb-2"><span style={{ color: 'rgb(92,92,92)' }}>Doğum Tarihi :</span>&nbsp;{metadata.birth}</h6>
                                    <h6 className="text-muted mb-2"><span style={{ color: 'rgb(92,92,92)' }}>Cinsi :</span>&nbsp;{metadata.breed}</h6>
                                    <h6 className="text-muted mb-2"><span style={{ color: 'rgb(92,92,92)' }}>Adres :</span>&nbsp;{metadata.adress}</h6>
                                </div>
                            </div>
                            <div className="d-sm-block divider" />
                            <button onClick={() => setNoteUpdate(!noteUpdate)} className="btn btn-primary btn-sm d-table" type="button" style={{ margin: '0 auto', marginTop: '10px' }}>Notu Düzenle</button>
                            <div className="card" style={{ marginBottom: '14px', marginTop: '10px' }}>
                                <div className="card-body" style={{ background: 'rgba(255, 212, 61, 0.24)' }}>
                                    <p style={{ color: 'rgb(87,95,103)' }}>{metadata.note}</p>
                                </div>
                            </div>
                            <button onClick={() => setGalleryUpdate(!galleryUpdate)} className="btn btn-primary btn-sm d-table" type="button" style={{ margin: '0 auto', marginTop: '10px', marginBottom: '10px' }}>Galeriyi Düzenle</button>
                            <Gallery unique={galleryUniqueId}></Gallery>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

