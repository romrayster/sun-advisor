import { createContext } from 'react';
const UserContext = createContext(
    {
        timeToSpendInSun: 0,
        skinType: 1,
        spf: 0,
    })

export default UserContext;