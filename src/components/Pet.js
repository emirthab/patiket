import React from 'react'
import Gallery from "./Gallery"
import { useState, useEffect } from 'react'


export default function Pet() {
    const [response, setResponse] = useState("")
    const [data, setData] = useState("")
    const [metadata, setMetadata] = useState("")


    useEffect(() => {
        if (window.location.pathname) {
            const url = "/api/v1/pet/" + window.location.pathname;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.response === "ok") {
                        setResponse("ok");
                        setData(data);

                        const url = "/api/v1/pet/" + window.location.pathname + "/getmeta"
                        fetch(url)
                            .then(response => response.json())
                            .then(data => {
                                setMetadata(data.metas)
                            })
                    }
                    else {
                        setResponse("err");
                    }
                })
        }
    }, [])

    return (
        <div className="card" style={{ margin: '0 auto', marginTop: '18px', maxWidth: '500px' }}>
            {response === "ok" &&
                <div className="card-body">
                    <div className="row">
                        <div className="col">
                            <h3 style={{ color: 'var(--bs-orange)' }}>
                                {metadata.gender === "0" && <i className="fa fa-mars" style={{ fontWeight: 900, fontSize: '29px', margin: '0 auto', color: 'var(--bs-cyan)' }} />}
                                {metadata.gender === "1" && <i className="fa fa-venus" style={{ fontWeight: 900, fontSize: '29px', margin: '0 auto', color: 'var(--bs-pink)' }} />}
                                &nbsp;{data.name}</h3>
                            <h6 className="text-muted mb-2"><span style={{ color: 'rgb(92,92,92)' }}>Sahip :</span>&nbsp; {metadata.owner} </h6>
                            <h6 className="text-muted mb-2"><span style={{ color: 'rgb(92,92,92)' }}>Telefon :</span>&nbsp; {metadata.phone} </h6>
                            <h6 className="text-muted mb-2"><span style={{ color: 'rgb(92,92,92)' }}>Doğum Tarihi :</span>&nbsp; {metadata.birth} </h6>
                            <h6 className="text-muted mb-2"><span style={{ color: 'rgb(92,92,92)' }}>Cinsi :</span>&nbsp; {metadata.breed} </h6>
                            <h6 className="text-muted mb-2"><span style={{ color: 'rgb(92,92,92)' }}>Adres :</span>&nbsp; {metadata.adress} </h6>
                        </div>
                        <div className="col-4 justify-content-center d-flex">
                            <div><img alt="" className="d-flex pet-image" src={"/uploads/" + metadata.profilepic} style={{ margin: '0 auto' }} />
                                <h1 style={{ color: '#fd4c14', fontFamily: '"Archivo Black", sans-serif', textAlign: 'center', fontWeight: 'bold' }}>Kayıp!</h1>
                            </div>
                        </div>
                    </div>
                    <div className="d-sm-block divider" />
                    <div className="col">
                        <h6 className="text-muted mb-2"><span className="d-table" style={{ color: 'rgb(92,92,92)', margin: '0 auto' }}>Sahibinin Notu</span></h6>
                    </div>
                    <div className="card" style={{ marginBottom: '14px' }}>
                        <div className="card-body" style={{ background: 'rgba(255, 212, 61, 0.24)' }}>
                            <p style={{ color: 'rgb(87,95,103)' }}> {metadata.note} </p>
                        </div>
                    </div>
                    <Gallery unique={null}></Gallery>
                </div>
            }
        </div>
    )
}
