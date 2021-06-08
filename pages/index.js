import { useRef, useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import 'whatwg-fetch';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [ipAddress, setIpAddress] = useState('');
  const [response, setResponse] = useState({});
  const [serverError, setServerError] = useState('');

  const IpDataItems = [
    { heading: 'IP Address',
      body: (response && response.respIpAddress) ? response.respIpAddress : ''},
    { heading: 'Location', 
      body: getLocationString()},
    { heading: 'Timezone', 
      body: getTimezone()},
    { heading: 'ISP', 
      body: (response && response.isp) ? response.isp: ''},
  ]

  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const mapContainer = useRef(null);
  const [lng, setLng] = useState(null);
  const [lat, setLat] = useState(null);
  const [zoom, setZoom] = useState(9);

  const handleInputChange = (ev) => {
    setIpAddress(ev.target.value);
  }

  const handleDataRequest = (ev) => {
    setResponse({});
    setServerError('');
    let url = `https://geo.ipify.org/api/v1?apiKey=${process.env.NEXT_PUBLIC_GEO_IPIFY_KEY}`;
    if (ipAddress) {
      url += `&ipAddress=${ipAddress}`;
    }

    window.fetch(url)
      .then(resp => {
        if (resp.ok) {
          return resp.json();
        }
      })
      .then(json => {
        const {ip, location, isp} = json;
        let response = {
          respIpAddress: ip,
          location,
          isp
        };
        setResponse(response);
        setLat(location.lat);
        setLng(location.lng);
      })
      .catch(err => {
        console.log(`Error: (${err.status}) ${err.message}`);
        setServerError(`${err.message} (status - ${err.status})`);
      })
  }

  function getLocationString() {
    let city = response && response.location && response.location.city ? response.location.city : '';
    let region = response && response.location && response.location.region ? response.location.region : '';
    let postalCode = response && response.location && response.location.postalCode ? response.location.postalCode : '';
    let locationStr = `${city}, ${region} ${postalCode}`;

    return locationStr;
  }

  function getTimezone() {
    let timezone = response && response.location && response.location.timezone ? `UTC (${response.location.timezone})` : '';
    return timezone;
  }

  useEffect(() => {
    if (lng && lat) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [lng, lat],
        zoom: zoom
      });

      var marker = new mapboxgl.Marker({
        color: "#000",
      }).setLngLat([lng, lat])
        .addTo(map);
      
    } else {
      let url = `https://geo.ipify.org/api/v1?apiKey=${process.env.NEXT_PUBLIC_GEO_IPIFY_KEY}`;  
      window.fetch(url)
        .then(resp => {
          if (resp.ok) {
            return resp.json();
          }
        })
        .then(json => {
          const {ip, location, isp} = json;
          let response = {
            respIpAddress: ip,
            location,
            isp
          };
          setResponse(response);
          setLat(location.lat);
          setLng(location.lng);
        })
        .catch(err => {
          console.log('err', err);
          console.log(`Error: (${err.status}) ${err.message}`);
          setServerError(`${err.message} (status - ${err.status})`);
        })
    }
    
  }, [lat, lng]);

  return (
    <div className={styles.container}>
      <Head>
        <title>IP Address Tracker</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="../images/favicon-32x32.png" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap" rel="stylesheet" />
      </Head>

      <main className={styles.main}>
        <div className="form_container bg-hero-pattern"> 
          <h1>IP Address Tracker</h1>
          <div className="error">
            {serverError && (
              <div>{serverError}</div>
            )}
          </div>
          <div className="mt-1 rounded-lg shadow-sm w-11/12 flex flex-row desktop:w-1/3">
            <input type="text" name="price" id="price" className="focus:ring-indigo-500 focus:border-indigo-500 pl-7 pr-12 border-gray-300 rounded-l-md rounded-r-none h-10 w-10/12" placeholder="Search for any IP address or domain" 
              onChange={handleInputChange} />
            <div className="bg-black text-white flex items-center justify-center w-2/12 rounded-r-md rounded-l-none">
              <button className="bg-black text-white" onClick={handleDataRequest}>></button>
            </div>
          </div>
          <div className="ip_data_container relative z-10 mt-6 p-6 space-y-6 flex flex-col  w-11/12 m-h-1/3 desktop:w-4/5 desktop:flex-row desktop:min-h-1/3 desktop:justify-evenly desktop:divide-x desktop:divide-grey-dark desktop:items-start desktop:space-y-0">
            {IpDataItems.map(item => (
              <IpDataItem heading={item.heading} body={item.body} />
            ))}
          </div>
        </div>
        <div>
          <div ref={mapContainer} className="map-container" />
        </div>
      </main>
    </div>
  )
}

const IpDataItem = ({heading, body}) => {
  return (
    <div className="flex flex-col items-center desktop:w-1/4 desktop:items-start desktop:justify-start desktop:pl-6">
      <div className="heading text-grey-dark text-xs font-medium">{heading}</div>
      {body.length > 0 && (
        <div className="body text-grey-darkest font-semibold">{body}</div>
      )}
    </div>
  )
} 