import {getLCP, getFID, getCLS} from 'web-vitals';

export function reportWebVitals(){
    getCLS(console.log);
    getFID(console.log);
    getLCP(console.log);
}
