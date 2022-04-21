import React, { useState, useEffect } from 'react';
import axios from "axios";

import UserDropDown from './UserDropdown';
const openuv_api_key = '1e7e335df1ce6168b108d51d229c50bc'
//const openuv_api_key = '7505621c8500b13276a27c5ef8dd3409'

axios.defaults.headers.common['x-access-token'] = `${openuv_api_key}`
axios.defaults.headers.common['Content-Type'] = "application/json"



function LandingPage() {
    const [location, setLocation] = useState({ lat: "", lon: "" })
    const [uvIndexData, setUvIndexData] = useState()
    const [uvDataFetched, setUvDataFetched] = useState(false)
    const [skinType, setSkinType] = useState("1")
    const [spf, setSpf] = useState("5")
    const [timeInSun, setTimeInSun] = useState("10")
    const [maxTimeInSunWithSunScreen, setmaxTimeInSunWithSunScreen] = useState(0)
    const [recommendedWithSunScreen, setrecommendedWithSunScreen] = useState(0)
    const [recommendedInSun, setrecommendedInSun] = useState(0)

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

    useEffect(() => {
        if (uvDataFetched) {
            /**SPF x TimeInSun For the selected skinType */
            let maxTimeWithoutSuncreen = parseFloat(uvIndexData.result.safe_exposure_time['st' + skinType])
            setmaxTimeInSunWithSunScreen(parseFloat(spf) * maxTimeWithoutSuncreen)
            /**
             * x=Time to spend without sunscreen | y=Time to spend with sunscreen
             * x=(TotalTimeInSun-SPF*MaxTimeWithoutSunscreen)/(1-SPF)
             * y=TotalTimeInSun-x */
            let recommendedInSun = (parseFloat(timeInSun) - parseFloat(spf) * maxTimeWithoutSuncreen) / (1 - parseFloat(spf))
            if (recommendedInSun > parseFloat(timeInSun)) {
                //console.log("Can stay in sun for max time without sunscreen.")
                setrecommendedInSun(timeInSun)
                setrecommendedWithSunScreen(0)
            }
            else {
                setrecommendedInSun(recommendedInSun)
                setrecommendedWithSunScreen((maxTimeWithoutSuncreen - parseFloat(recommendedInSun)) * parseFloat(spf))
            }
            //console.log(maxTimeWithoutSuncreen, recommendedInSun, spf)

        }
    }, 
    // eslint-disable-next-line
    [timeInSun, spf, skinType, uvDataFetched]);


    return (
        <>
            <h1>Welcome to SunAdvisor Demo</h1>
            <UserDropDown
                setSkinType={setSkinType}
                skinType={skinType}
                setSpf={setSpf}
                spf={spf}
                setTimeInSun={setTimeInSun}
                timeInSun={timeInSun}
            />

            <div style={{ display: 'block', marginBottom: '20px', marginTop: '50px' }}>Please click the button to fetch and calculate the optimal values for you in the sun based on the location and your selection</div>
            <button
                type="button"
                onClick={() => ask_for_geolocation()}
                style={{ marginBottom: "20px" }}
            >
                Get Location & calculate time in sun!
            </button>

            {location.lat !== "" && location.lon !== "" &&
                <div> The current location is <a href={"https://www.google.com/maps/@" + location.lat + "," + location.lon + ",18z"}> {location.lat},{location.lon}</a></div>
            }
            {uvDataFetched &&
                <div>
                    <div> Current UV Index is: {uvIndexData.result.uv}</div>
                    <div> Maximum UV Index today is: {uvIndexData.result.uv_max} at {uvIndexData.result.uv_max_time} UTC Time</div>
                    <div> Recommended maximum time in the sun for skin type {skinType} without sun screen: <strong>{uvIndexData.result.safe_exposure_time['st' + skinType]} minutes.</strong></div>
                    <div> Recommended maximum time in the sun which you can spend with your sun screen (SPF {spf}): <strong>{maxTimeInSunWithSunScreen} minutes.</strong></div>
                    <div> Recommended time for best tan:
                        {recommendedWithSunScreen !== 0 && recommendedInSun > 0 &&
                            <ol>
                                <li>First, stay in the sun without sunscreen for <strong>{Math.round(recommendedInSun)} minutes.</strong></li>
                                <li>Then apply sunscreen (SPF {spf})  and stay in the sun for a maximum of <strong>{Math.round(recommendedWithSunScreen)} minutes.</strong></li>
                            </ol>
                        }
                        {recommendedWithSunScreen === 0 &&
                            <div>
                                You don't have to apply sunscreen and can stay in the sun for <strong>{Math.round(recommendedInSun)} minutes.</strong>
                            </div>
                        }
                        {recommendedInSun < 0 &&
                            <>
                            <div>Your current sunscreens SPF <strong>is not sufficient to protect you </strong>for {timeInSun} minutes.</div>
                            <div>We recommend to either reduce the time in sun with  your sun screen (SPF {spf}) <strong> to a maximum of {maxTimeInSunWithSunScreen} minutes </strong> 
                            or to use a sun screen of <strong> at least SPF {Math.ceil(parseFloat(timeInSun)/parseFloat(uvIndexData.result.safe_exposure_time['st' + skinType]))}</strong>
                            </div>
                            </>
                        }
                    </div>


                </div>
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
