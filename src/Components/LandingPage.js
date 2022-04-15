import React, { useState, useEffect } from 'react';
import axios from "axios";
//const openuv_api_key = '1e7e335df1ce6168b108d51d229c50bc'
const openuv_api_key = '7505621c8500b13276a27c5ef8dd3409'

axios.defaults.headers.common['x-access-token'] = `${openuv_api_key}`
axios.defaults.headers.common['Content-Type'] = "application/json"

function LandingPage() {
    const [location, setLocation] = useState({ lat: "", lon: "" })
    const [uvIndexData, setUvIndexData] = useState()
    const [uvDataFetched, setUvDataFetched] = useState(false)

    function ask_for_geolocation() {
        navigator.geolocation.getCurrentPosition(function (position) {
            setLocation({ lat: position.coords.latitude, lon: position.coords.longitude })
        });
    }

    useEffect(() => {
        if (location.lat !== "" && location.lon !== "" && !uvDataFetched) {
            /**Call UV Index API */
            getUvIndexData(location.lat, location.lon).then(res => {
                setUvIndexData(res)
            })
        }
    }, [location, uvIndexData, uvDataFetched]);
    useEffect(() => {
        if (typeof (uvIndexData) !== "undefined") {
            if (typeof (uvIndexData.result.safe_exposure_time) !== "undefined") {
                setUvDataFetched(true)
            }
        }
    }, [uvIndexData, uvDataFetched]);


    return (
        <>
            <h1>Welcome to SunAdvisor Demo</h1>
            <div>Please click the button to fetch your location!</div>
            <button
                type="button"
                onClick={() => ask_for_geolocation()}
            >Get Location!</button>

            {location.lat !== "" && location.lon !== "" &&
                <div> The current location is <a href={"https://www.google.com/maps/@"+location.lat+","+location.lon+",18z"}> {location.lat},{location.lon}</a></div>
            }
            {uvDataFetched &&
                <div>
                    <div> The current UV Index is: {uvIndexData.result.uv}</div>
                    <div> The maximum UV Index today is: {uvIndexData.result.uv_max} at {uvIndexData.result.uv_max_time} UTC Time</div>
                    <div> The recommended maximum time in the sun based on skin type is:</div>
                    <div> SkinType 1 {uvIndexData.result.safe_exposure_time.st1} minutes.</div>
                    <div> SkinType 2 {uvIndexData.result.safe_exposure_time.st2} minutes.</div>
                    <div> SkinType 3 {uvIndexData.result.safe_exposure_time.st3} minutes.</div>
                    <div> SkinType 4 {uvIndexData.result.safe_exposure_time.st4} minutes.</div>
                    <div> SkinType 5 {uvIndexData.result.safe_exposure_time.st5} minutes.</div>
                    <div> SkinType 6 {uvIndexData.result.safe_exposure_time.st6} minutes.</div>

                </div>
            }
            {location.lat !== "" && location.lon !== "" &&
                <iframe
                    title="GoogleMap"
                    width="450"
                    height="250"
                    frameBorder="0" 
                    referrerPolicy="no-referrer-when-downgrade"
                    src={"https://www.google.com/maps/embed/v1/MAP_MODE?key=AIzaSyAPcrByCSVIepVCOS5OSZLBryhzmpUVih0&?q="+location.lat+ ","+ location.lon}
                    allowFullScreen>
                </iframe>

            }



        </>
    )
}

const getUvIndexData = (lat, lon) => {
    return new Promise((resolve, reject) => {
        axios
            .get(`https://api.openuv.io/api/v1/uv?lat=${lat}&lng=${lon}`)
            .then(response => {
                resolve(response.data)
            })
            .catch(err => {
                console.log(err)
                reject(err)
                return
            })
    })
}



export default LandingPage;