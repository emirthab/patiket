import React from "react";
import {useEffect, useState } from 'react';

function Login(props) {
    useEffect(() => {
        props.loading === true && props.setLoading(false)
    }, [props.page])

    const [mail, setMail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = () => {
        props.setLoading(true)
        const requestOptions = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mail: mail, pass_hash: password })
        };
        const url = "/api/v1/login"
        fetch(url, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.response === "ok") {
                    localStorage.setItem("token", data.token)
                    window.setTimeout(function () {
                        props.setPage("/mypets")
                    }, 50);
                }
                else{
                    props.setLoading(false)
                }
            })
    };

    const getGoogleLoginUrl = () => {
        const url = "/api/v1/oauth/getgoogleuri"
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.response === "ok") {
                    var uri = data.uri
                    window.setTimeout(function () {
                        window.location.href = uri;
                    }, 50);
                }
            })
    }

    return (
        <div>
            <div className="card" style={{ margin: "0 auto", marginTop: "18px", maxWidth: "500px" }}>
                <div className="card-body">
                    <button onClick={() => getGoogleLoginUrl()} className="btn d-table" type="submit" style={{ background: "#434c59", color: "rgb(255,255,255)", width: "80%", margin: "0 auto" }}>
                        <img alt="" className="float-start" src={require("../static/img/google-icon-logo.png")} style={{ width: "25px", marginTop: "3px" }} />
                        Google ile Giriş
                    </button>
                    <input
                        className="d-flex"
                        type="email"
                        style={{ width: "80%", margin: "0 auto", marginTop: "20px", marginBottom: "20px", borderTopColor: "rgb(0,", borderRightColor: "0,", borderBottomColor: "0)", borderLeftColor: "0," }}
                        placeholder="Email"
                        onChange={event => setMail(event.target.value)}
                    />
                    <input className="d-flex" type="password" style={{ width: "80%", margin: "0 auto", marginBottom: "20px" }}
                        onChange={event => setPassword(event.target.value)}
                        placeholder="Şifre" />
                    <button className="btn btn-primary text-center d-table" type="submit"
                        onClick={handleLogin} style={{ width: "80%", background: "var(--bs-primary)", margin: "0 auto" }}>
                        Giriş
                    </button>
                    <h6 style={{ textAlign: "center", marginTop: "15px", color: "rgb(94,94,95)", fontSize: "13px", textDecoration: "underline" }}>{//link to eklenecek}
                    }</h6>
                </div>
            </div>
        </div>
    );
}

export default Login