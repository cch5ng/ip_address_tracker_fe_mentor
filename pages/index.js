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

  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

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

  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });
  }, [lat, lng]);

  return (
    <div className={styles.container}>
      <Head>
        <title>IP Address Tracker</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="../images/favicon-32x32.png" />
      </Head>

      <main className={styles.main}>
        <div className="form_container"> 
          <h1>IP Address Tracker</h1>
          <div className="error">
            {serverError && (
              <div>{serverError}</div>
            )}
          </div>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input type="text" name="price" id="price" className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md" placeholder="Search for any IP address or domain" />
            <div className="absolute inset-y-0 right-0 flex items-center bg-black text-white">
              <button onClick={handleDataRequest}>></button>
            </div>
          </div>
        </div>
        <div className="ip_data_container">
          <div>
            <div className="heading">IP Address</div>
            {Object.keys(response).length > 0 && (
              <div className="body">{response.respIpAddress}</div>
            )}
          </div>
          <div>
            <div className="heading">Location</div>
            {Object.keys(response).length > 0 && (
              <div className="body">{response.location.city}, {response.location.region} {response.location.postalCode}</div>  
            )}
          </div>
          <div>
            <div className="heading">Timezone</div>
            {Object.keys(response).length > 0 && (
              <div className="body">UTC ({response.location.timezone})</div>  
            )}
          </div>
          <div>
            <div className="heading">ISP</div>
            {Object.keys(response).length > 0 && (
              <div className="body">{response.isp}</div>  
            )}
          </div>
        </div>
        <div>
          <div ref={mapContainer} className="map-container" />
        </div>

      </main>

      <footer className={styles.footer}>
        <div className="attribution">
          Challenge by <a href="https://www.frontendmentor.io?ref=challenge" target="_blank">Frontend Mentor</a>. 
          Coded by <a href="#">Your Name Here</a>.
        </div>
        <div>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{' '}
            <span className={styles.logo}>
              <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
            </span>
          </a>
        </div>
      </footer>
    </div>
  )
}
