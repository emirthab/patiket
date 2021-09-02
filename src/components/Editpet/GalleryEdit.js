import React from "react"
import RUG, { DropArea } from "react-upload-gallery"
import "react-upload-gallery/dist/style.css";
import { useState, useEffect } from "react";

export default function GalleryUpdate(props) {

    const [initialState, setInitialState] = useState(null)
    const [changed, setChanged] = useState(null)
    const [uniqueId, setUniqueId] = useState(0)

    useEffect(() => {
        
        const url = "/api/v1/pet/" + props.id + "/getgallery"
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.response === "ok" && data.gallery !== null) {
                    setInitialState(data.gallery)

                }
            })

    }, [uniqueId])

    const saveGallery = () => {
        props.setLoading(true)
        var _met = {}

        for (let i = 0; i < changed.length; i++) {
            var name = changed[i].source.slice(9)
            _met[i] = name
        }

        const requestOptions = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: localStorage.getItem("token"),
                metas: _met
            })
        };
        const url = "/api/v1/pet/" + props.id + "/setgallerymeta"
        fetch(url, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.response === "ok") {
                    setInitialState(null)
                    setUniqueId(uniqueId + 1);
                    props.setGalleryUniqueId(props.galleryUniqueId + 1)
                    window.setTimeout(function () {
                        props.setLoading(false)
                    }, 350);
                }
            })
    }

    const DragArea = (handle) => {
        return (
            <div className="rug-handle ">
                <svg viewBox="0 -5 32 52" className="rug-handle-icon">
                    <g>
                        <polyline points="1 19 1 31 31 31 31 19" />
                        <polyline className="__arrow" points="8 9 16 1 24 9" />
                        <line className="__arrow" x1={16} x2={16} y1={1} y2={25} />
                    </g>
                </svg>
                <div className="rug-handle-info">
                    <div className="rug-handle-button"
                        onClick={handle}>
                        Yüklenecek Dosyaları Seçiniz</div>
                </div>
            </div>
        );
    }

    return (
        <div className={props.active ? "card pop-up-card active" : "card pop-up-card "} id="update-gallery" style={{ paddingLeft: '30px', paddingBottom: '10px', paddingRight: '30px', paddingTop: '20px' }}>
            <div className="card-body">
                <h4 style={{ marginBottom: '30px' }}>Galeriyi Düzenle
                    <i
                        onClick={() => {
                            props.handleUpdate(!props.active);
                            window.setTimeout(function () {
                                if (changed !== initialState) {
                                    setInitialState(null)
                                    setUniqueId(uniqueId + 1);
                                }
                            }, 500);
                        }} className="fa fa-times float-end" style={{ cursor: 'pointer', color: 'var(--bs-red)' }} />
                </h4>
                {initialState !== null &&
                    <RUG
                        header={({ openDialogue }) => (
                            <DropArea>
                                {
                                    (isDrag) => <div style={{ background: isDrag ? 'yellow' : '#fff' }}>
                                        {DragArea(openDialogue)}
                                    </div>
                                }
                            </DropArea>
                        )}
                        accept={['jpg', 'jpeg', 'png', 'gif']}
                        key={uniqueId}
                        initialState={initialState}
                        action={"/api/v1/pet/" + props.id + "/uploadgallery?token=" + localStorage.getItem("token")}
                        source={(response) => "/uploads/" + response.image}
                        onChange={(image) => setChanged(image)}
                    ></RUG>
                }
                <button className="btn btn-primary" type="button" style={{ width: '100%', marginTop: '15px' }}
                    onClick={() => saveGallery()}
                >Kaydet</button>
            </div>
            <h6 style={{ fontSize: '12px', textAlign: 'center', color: 'rgb(142,142,142)' }}>En fazla 5 resim yükleyebilirsiniz. Yüklemediğiniz kısımlar slaytta gözükmeyecektir.</h6>
        </div>
    )
}