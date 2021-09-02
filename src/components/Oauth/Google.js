import React from 'react'
import { useEffect } from 'react';

export default function Google(props) {

    useEffect(() => {
        var href = window.location.search

        const url = "/api/v1/oauth/google/gettoken"+href
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.response === "ok") {
                    localStorage.setItem("token", data.token)
                    window.setTimeout(function () {
                        props.setPage("/mypets")
                    }, 350);
                }
            })

    }, [])

    return (
        <div>

        </div>
    )
}
