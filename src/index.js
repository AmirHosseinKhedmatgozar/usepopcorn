import React, { useState } from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import App from "./App";
// import StarRating from "./starRating";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating maxRating={5} size={"48"} />
    <StarRating
      maxRating={5}
      size={"40"}
      color="blue"
      className="test"
      message={["Verybad", "Bad", "Normal", "Good", "VeryGood"]}
      defaultRating={3}
    />
    <Test /> */}
  </React.StrictMode>
);
// function Test() {
//   const [movieRating, setMovieRating] = useState(0);
//   return (
//     <div>
//       <StarRating color="red" maxRating={10} onSetRating={setMovieRating} />
//       <p>your star: {movieRating}</p>
//     </div>
//   );
// }
