import React from 'react'
import { Link } from "react-router-dom";
import { useState } from 'react';

export default function Register() {

    const [mail, setMail] = useState("")
    const [pass, setPass] = useState("")
    const [pass2, setPass2] = useState("")

    const handleRegister = () => {
        const requestOptions = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mail: mail, pass_hash: pass })
        };
        const url = "/api/v1/register"
        if (pass === pass2) {
            fetch(url, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.response === "ok") {
                        localStorage.setItem("token", data.token)
                        window.setTimeout(function () {
                            window.location.pathname = '/mypets';
                        }, 50);
                    }
                })
        }
    }

    return (
        <div>
            <div className="card" style={{ margin: "0 auto", marginTop: "18px", maxWidth: "500px" }}>
                <div className="card-body">
                    <button className="btn d-table" type="button" style={{ background: "#434c59", color: "rgb(255,255,255)", width: "80%", margin: "0 auto" }}>
                        <img alt="" className="float-start" src={require("../static/img/google-icon-logo.png")} style={{ width: "25px", marginTop: "3px" }} />
                        Google ile Giriş
                    </button>

                    <input onChange={event => setMail(event.target.value)} className="d-flex" type="email" style={{ width: "80%", margin: "0 auto", marginTop: "20px", marginBottom: "20px", }} placeholder="Email" />
                    <input onChange={event => setPass(event.target.value)} className="d-flex" type="password" style={{ width: "80%", margin: "0 auto", marginBottom: "20px" }} placeholder="Şifre" />
                    <input onChange={event => setPass2(event.target.value)} className="d-flex" type="password" style={{ width: "80%", margin: "0 auto", marginBottom: "20px" }} placeholder="Şifre doğrulama" />

                    <button onClick={handleRegister} className="btn btn-primary text-center d-table" type="submit" style={{ width: "80%", background: "var(--bs-primary)", margin: "0 auto" }}>
                        Kayıt Ol
                    </button>
                    <h6 style={{ textAlign: "center", marginTop: "15px", color: "rgb(94,94,95)", fontSize: "13px", textDecoration: "underline" }}><Link to="login">Hesabın var mı? Tıkla ve giriş yap.</Link></h6>
                </div>
            </div>


        </div>
    )
}
