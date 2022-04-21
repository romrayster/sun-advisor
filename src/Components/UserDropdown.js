import React  from 'react';
import Dropdown from 'react-dropdown';
import '../styles/dropdown-styles.css';

//import UserContext from '../store/UserContext'
function UserDropDown(props) {

    function changeSkinType(item) {
        props.setSkinType(item.value)
    }
    function changeSpf(item) {
        props.setSpf(item.value)
    }
    function changeTimeInSun(item) {
        props.setTimeInSun(item.value)
    }
    const skinTypes = [
        '1', '2', '3', '4', '5', '6'
    ];
    const spfs = [
        '5', '10', '15', '20', '30', '50', '80'
    ];
    const timeInSunOption = [
        '10', '20', '30', '40', '50', '60', '80', '100', '120', '150', '180', '210', '240', '300', '360', '420', '480', '540', '600'
    ];
    const defaultOptionSkinType = skinTypes[0];
    const defaultOptionSpfs = spfs[0];
    const defaultTimeInSunOption = timeInSunOption[0];
    return (
        //<UserContext.Provider values={userDropDownValues}>

        <>
        <div style={{paddingBottom:'20px', fontWeight:'600'}}>Please select your skin type, your sunscreen's SPF and the time you want to spend in the sun to get the sun recommendation!</div>
            <div style={{ display: 'inline-block', width:"200px", textAlign:'center' }}>
                <div> Skin type:</div>
                <Dropdown options={skinTypes} onChange={changeSkinType} value={defaultOptionSkinType} placeholder="Select your skin type." />
            </div>
            <div style={{ display: 'inline-block',width:"200px",textAlign:'center' }}>
                <div>Sun screen SPF:</div>
                <Dropdown options={spfs} onChange={changeSpf} value={defaultOptionSpfs} placeholder="Select your sun screen's SPF." />
            </div>
            <div style={{ display: 'inline-block',width:"200px",textAlign:'center' }}>
                <div>Planned time in the sun:</div>
                <Dropdown options={timeInSunOption} onChange={changeTimeInSun} value={defaultTimeInSunOption} placeholder="Select the time in minutes you plan on spending in the sun." />
            </div>
        </>


        //</UserContext.Provider>

    )
}




export default UserDropDown;