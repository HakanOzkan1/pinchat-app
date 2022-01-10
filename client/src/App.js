import { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { Room, Star } from "@material-ui/icons";
import "./app.css";
import axios from "axios";
import { format } from "timeago.js";
import Register from "./components/Register";
import Login from "./components/Login";




function App() {
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showLoginError, setShowLoginError] = useState(false);

  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 46,
    longitude: 17,
    zoom: 4,
  });
  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get(process.env.REACT_APP_PINS);
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
  };

  const handleAddClick = (e) => {
    const [long, lat] = e.lngLat;
    setNewPlace({
      long,
      lat,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long,
    };
    try {
      const res = await axios.post(process.env.REACT_APP_PINS, newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () =>{
    myStorage.removeItem("user");
    setCurrentUser(null);
  }

  return (
  
    <div className="App">
        <ReactMapGL
          {...viewport}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
          onViewportChange={(nextViewport) => setViewport(nextViewport)}
          mapStyle="mapbox://styles/hako1/ckxe6sm910n6w14mxjxmia3vi"
          onDblClick={handleAddClick}
        >
          {pins.map((data) => (
            <>
              <Marker
                latitude={data.lat}
                longitude={data.long}
                offsetLeft={-viewport.zoom * 5}
                offsetTop={-viewport.zoom * 10}

              >
                <Room
                  style={{
                    fontSize: viewport.zoom * 10,
                    color: "slateblue",
                    cursor: "pointer",
                  }}
                  onClick={() => handleMarkerClick(data._id, data.lat, data.long)} />
              </Marker>
              {data._id === currentPlaceId && (
                <Popup
                  latitude={data.lat}
                  longitude={data.long}
                  closeButton={true}
                  closeOnClick={false}
                  anchor="left"
                  onClose={() => setCurrentPlaceId(null)}
                >
                  <div className="card">
                    <label>Place</label>
                    <h4 className="place">{data.title}</h4>
                    <label>Review</label>
                    <p className="desc">{data.desc}</p>
                    <label>Rating</label>
                    <div className="stars">
                      {Array(data.rating).fill(<Star className="star" />)}
                    </div>
                    <span className="username">
                      Created by <b>{data.username}</b>{" "}
                    </span>
                    <span className="date">{format(data.createdAt)}</span>
                  </div>
                </Popup>
              )}
            </>
          ))}
          {newPlace && (
            <Popup
              latitude={newPlace.lat}
              longitude={newPlace.long}
              closeButton={true}
              closeOnClick={false}
              anchor="left"
              onClose={() => setNewPlace(null)}
            >
              <div>
                <form onSubmit={handleSubmit}>
                  <label>Title</label>
                  <input
                    placeholder="Enter a title"
                    onChange={(e) => setTitle(e.target.value)} />
                  <label>Review</label>
                  <textarea
                    placeholder="Say us something about this place."
                    onChange={(e) => setDesc(e.target.value)} />
                  <label>Rating</label>
                  <select onChange={(e) => setRating(e.target.value)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <button className="submitButton" type="submit" onClick={() => { !currentUser && setShowLoginError(true); } }>
                    Add Pin
                  </button>
                  {showLoginError && <span className="failure">Please login or register now!</span>}
                </form>
              </div>
            </Popup>
          )}
            
      {currentUser ? (
            <button className="button logout" onClick={handleLogout}>Log out</button>
          ) : (
            <div className="buttons">
              <button className="button login" onClick={() => setShowLogin(true)}>
                Login
              </button>
              <button
                className="button register"
                onClick={() => setShowRegister(true)}
              >
                Register
              </button>
            </div>
          )}
          {showRegister && <Register setShowRegister={setShowRegister} />}
          {showLogin && <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser} />}

      

         
        </ReactMapGL>
      </div>
  );
}

export default App;
