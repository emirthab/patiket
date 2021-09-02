import React from 'react'
import "../static/style/loading.css"

export default function Loading(props) {
    return (
        <div className={props.isActive ? "loading-wrapper active" : "loading-wrapper"}>
            <div className="container">
                <div className="loading-logo">
                    <img src={require("../static/img/logo-loading.png")} alt="" />
                </div>
                <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            </div>
        </div>
    )
}
