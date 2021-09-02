import React from 'react'

import { useState, useEffect } from 'react';

export default function Mypets(props) {
    const [pets, setPets] = useState([]) 
    const [addPetActive, setAddPetActive] = useState(false)
    const [newPetMeta, setNewPetMeta] = useState({})

    const [mapHandler, setMapHandler] = useState(12)

    useEffect(() => {
        props.loading === false && props.setLoading(true)
        const _pets = props.pets
        for (var i = 0; i < _pets.length; i++) {
            const url = "/api/v1/pet/" + _pets[i].id + "/getmeta"
            const pet = _pets[i]
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.response === "ok") {
                        pet.birth = data.metas.birth;
                        pet.profilepic = data.metas.profilepic;
                        pet.gender = data.metas.gender;
                        _pets[i], pet;
                        setPets(_pets);
                        window.setTimeout(function () {
                            setMapHandler(mapHandler+1)                       
                        }, 50);
                    }
                })
            
        }
    }, [])

    const handleLogOut = () => {
        props.setLoading(true)
        localStorage.removeItem("token")
        window.setTimeout(function () {
            props.setPage("/login")
        }, 250);
    }

    const handleAddPet = () => {
        const requestOptions = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: newPetMeta.id,
                pin: newPetMeta.pin,
                token: localStorage.getItem("token")
            })
        };
        const url = "/api/v1/addnewpet"
        fetch(url, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.response === "ok") {                    
                    setAddPetActive(!addPetActive)
                    window.setTimeout(function () {
                        props.setUnique(props.unique + 1)
                    }, 350);
                }
            })
    }


    const addPet = () => {
        return (
            <div className={addPetActive ? "card pop-up-card active" : "card pop-up-card "} id="add-pet" style={{ paddingLeft: '30px', paddingBottom: '10px', paddingRight: '30px', paddingTop: '20px' }}>
                <div className="card-body">
                    <h4 style={{ marginBottom: '30px' }}>Yeni Pati Ekle
                        <i onClick={() => setAddPetActive(!addPetActive)} className="fa fa-times float-end" style={{ cursor: 'pointer', color: 'var(--bs-red)' }} /></h4>
                    <h6 style={{ marginBottom: '5px' }}>Qr Kod Id :<br /></h6>

                    <input type="text" className="form-control" style={{ marginBottom: '5px' }} defaultValue={""}
                        onChange={(event) => { newPetMeta.id = event.target.value; setNewPetMeta(newPetMeta); }} />

                    <h6 style={{ marginBottom: '5px' }}>Pin Kodu :<br /></h6>
                    <input type="text" className="form-control" style={{ marginBottom: '5px' }} defaultValue={""}
                        onChange={(event) => { newPetMeta.pin = event.target.value; setNewPetMeta(newPetMeta); }} />
                    <button onClick={() => handleAddPet()} className="btn btn-primary" type="button" style={{ width: '100%', marginTop: '15px' }}>Kaydet</button>
                </div>
            </div>
        )
    }

    return (
        <div>
            {addPet()}
            <h5 style={{ textAlign: 'center', color: 'var(--bs-orange)', marginTop: '10px' }} >Patilerim</h5>
            <div className="d-table d-sm-block divider" style={{ width: '90%', margin: '0 auto', maxWidth: '500px' }} />
            <div style={{ display: "flex" }}>
                <button onClick={() => setAddPetActive(true)} className="btn btn-success btn-sm d-table" type="button" style={{ margin: '0 auto', marginTop: '10px' }}>Pati Ekle</button>
                <button onClick={() => handleLogOut()} className="btn btn-danger btn-sm d-table" type="button" style={{ margin: '0 auto', marginTop: '10px' }}>Çıkış Yap</button>
            </div>
            <div key={mapHandler}>
                {pets.map((pet, i) => <Pet key={i} setPage={props.setPage} setLoading={props.setLoading} pet={pet}></Pet>)}
            </div>
        </div>
    )
}

export function Pet(props) {

    const handleClickEditPet = (pet_id) => {
        props.setLoading(true)
        window.setTimeout(() => {
            props.setPage("/mypets/edit/"+pet_id)
        },50)
    }
    
    return (
        <div>
            <div className="card" style={{ margin: '0 auto', marginTop: '18px', maxWidth: '500px' }} onClick={() => handleClickEditPet(props.pet.id)}>
                <div className="card-body" style={{ cursor: "pointer" }}>
                    <div className="row">
                        <div className="col">
                            <h3 style={{ color: "#ffd200" }}>

                                {props.pet.gender === "0" && <i className="fa fa-mars" style={{ fontWeight: 900, fontSize: '29px', margin: '0 auto', color: 'var(--bs-cyan)' }} />}
                                {props.pet.gender === "1" && <i className="fa fa-venus" style={{ fontWeight: 900, fontSize: '29px', margin: '0 auto', color: 'var(--bs-pink)' }} />}
                                &nbsp;{props.pet.name}</h3>
                            <h6 style={{ color: 'var(--bs-blue)' }}><i className="fa fa-calendar" style={{ fontWeight: 900, fontSize: '21px', margin: '0 auto' }} />&nbsp;&nbsp;{props.pet.birth}</h6>
                            <h6 style={{ color: 'var(--bs-purple)' }}><i className="fa fa-user" style={{ fontWeight: 900, margin: '0 auto', fontSize: '23px' }} />&nbsp; &nbsp;{props.pet.id}</h6>
                        </div>
                        <div className="col"><img alt="" className="d-flex float-end pet-image" src={props.pet.profilepic ? "/uploads/" + props.pet.profilepic : require("../static/img/no-image.png")} /></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
