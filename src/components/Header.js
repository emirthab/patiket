import React from 'react'
import "../static/style/styles.css"
import logo from "../static/img/logo.png"
import Pet from "./Pet"
import Login from "./Login"
import Mypets from "./Mypets"
import Register from "./Register"
import Editpet from "./Editpet/Index"
import GoogleLogin from "./Oauth/Google"
import Loading from "./Loading"

import { useState, useEffect } from 'react';

function Header() {

    const [response, setResponse] = useState("")
    const [data, setData] = useState("")

    const [uniqueId, setUniqueId] = useState(0)
    const [uniqueKey, setUniqueKey] = useState(0)

    const [loading, setLoading] = useState(true)

    const [page, setPage] = useState()

    const attachPages = () => {
        if (window.location.pathname === "/mypets" && response === "noLogged") {
            setPage("/login")
        }
        else if (window.location.pathname === "/login" && response === "Logged") {
            setPage("/mypets")
        }
        else {
            setPage(window.location.pathname)
        }
    }

    window.onpopstate = () => {
        attachPages()
    }

    useEffect(() => {
        attachPages()
    }, [response])

    useEffect(() => {
        loading === false && setLoading(true)
        const token = localStorage.getItem("token")
        if (token) {
            const requestOptions = {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: token })
            };
            const url = "/api/v1/getpets"
            fetch(url, requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.response === "ok") {
                        setResponse("Logged")
                        setData(data.pets)
                        window.setTimeout(function () {
                            page === "/mypets" && setUniqueKey(uniqueKey + 1);
                        }, 50);
                        window.setTimeout(function () {
                            setLoading(false)
                        }, 350);
                    }
                    else {
                        setResponse("noLogged")
                    }
                })
                .catch((error) => {
                    setResponse("noLogged")
                })
        }
        else {
            setResponse("noLogged")
        }

    }, [uniqueId, page])


    useEffect(() => {
        page === "/mypets" ? window.history.pushState('Patiket - Patilerim', 'Patiket - Patilerim', page) :
            page === "/login" ? window.history.pushState('Patiket - Giriş Yap', 'Patiket - Giriş Yap', page) :
                page === "/register" ? window.history.pushState('Patiket - Kayıt Ol', 'Patiket - Kayıt Ol', page) :
                    String(page).startsWith("/mypets/edit/") ? window.history.pushState('Patiket - Pati Düzenle', 'Patiket - Pati Düzenle', page) :
                        window.history.pushState('Patiket', 'Patiket', page)
        loading === true && page === "/login" && setLoading(false)
    }, [page])

    return (
        <div>
            <Loading isActive={loading} />
            <div className="container"><img className="d-flex" alt="" src={logo} style={{ margin: '0 auto', width: '300px', marginTop: '20px' }} /></div>
            <div className="container">

                {page === "/login" &&
                    <Login setLoading={setLoading} setPage={setPage} />
                }

                {page === "/mypets" &&
                    <Mypets setLoading={setLoading} setPage={setPage} key={uniqueKey} setUnique={setUniqueId} unique={uniqueId} pets={data} />
                }

                {String(page).startsWith("/mypets/edit/") &&
                    <Editpet setLoading={setLoading} setPage={setPage} id={window.location.pathname.replace("/mypets/edit/", "")} />
                }

                {page === "/register" &&
                    <Register setLoading={setLoading} setPage={setPage} />
                }

                {page === "/googlelogin" &&
                    <GoogleLogin setLoading={setLoading} setPage={setPage} />
                }
                {parseInt(window.location.pathname.slice(1,10)) == window.location.pathname.slice(1,10) && <Pet setLoading={setLoading}></Pet>}
            </div>
        </div>
    )
}

export default Header