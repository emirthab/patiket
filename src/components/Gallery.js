import React from 'react'
import { useState, useEffect } from 'react'

export default function Gallery(props) {
    const [galleryData, setGalleryData] = useState(null)

    useEffect(() => {
        var url = ""
        if (props.unique !== null){
            url = "/api/v1/pet/" + window.location.pathname.slice(13) + "/getgallery"
        }
        else{
            url = "/api/v1/pet/" + window.location.pathname.slice(1) + "/getgallery"
        }
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.response === "ok" && data.gallery !== null) {
                    setGalleryData(data.gallery)
                }
            })
    }, [props.unique])

    return (
        <div>
            {galleryData != null &&
                <div>
                    <h6 className="text-muted card-subtitle mb-2"><span className="d-table" style={{ color: 'rgb(92,92,92)', margin: '0 auto' }}>Galeri</span></h6>
                    <div className="carousel slide" data-bs-ride="carousel" id="carousel-1">
                        <div
                            key={props.unique ? props.unique : 0}
                            className="carousel-inner">
                            {galleryData.map((photo, i) =>
                            <div key={i} className={`carousel-item ${i === 0 ? "active" : ""}`}><img alt="" className="w-100 d-block slide-image" src={photo.source} /></div>)
                            }                            
                        </div>
                        <div><a className="carousel-control-prev" href="#carousel-1" role="button" data-bs-slide="prev"><span className="carousel-control-prev-icon" /><span className="visually-hidden">Previous</span></a><a className="carousel-control-next" href="#carousel-1" role="button" data-bs-slide="next"><span className="carousel-control-next-icon" /><span className="visually-hidden">Next</span></a></div>
                        <ol className="carousel-indicators">
                        {galleryData.map((photo, i) => 
                            <li key={i} className={i === 0 ? "active" : ""} data-bs-target="#carousel-1" data-bs-slide-to={i} ></li>)
                            }
                        </ol>
                    </div>
                </div>
            }
        </div>
    )
}
