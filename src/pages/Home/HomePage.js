import React, { useState, useEffect } from "react";
import DigitCanvas from "../../components/Canvas";
import DigitCard from "../../components/DigitCard";
import * as tf from "@tensorflow/tfjs";
import "./home.css";

const HomePage = (props) => {
  const [mnistModel, setMnistModel] = useState(null);
  const [predictedResult, setPredictedResult] = useState(null);

  const predictDigit = async (data) => {
    // const predictedResult = await mnistModel.predict(data).data();
    // const predictedDigit = predictedResult.indexOf(Math.max(...predictedResult));
    // let form = new FormData();
    // form.append('image', data);
    // form.append('name', 'name');


    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // headers: {'Content-Type': 'multipart/form-data'},

      body: JSON.stringify(data)
    };
    console.log(data)
    // fetch(process.env.REACT_APP_API_URL, requestOptions)
    //     .then((res) => res.json())
    //     .then((data) => {
    //       console.log(data)
    //       // const predictions = data.predictions && data.predictions[0];
    //       // if (predictions) {
    //       //   const predictedDigit = predictions.indexOf(Math.max(...predictions));
    //       //   console.log("Predicted result: ", predictedDigit);
    //       // }
    //     })
    //     .catch((err) => {
    //       console.error("Error: ", err);
    //     });



    // fetch(`http://${window.location.hostname}:5000/image`, requestOptions)
    //         .then((response) => {
    //           if(!response.ok) throw new Error(response.json())
    //           else return response.json()
    //         })

    // .then((res) => console.log(res))
    //     .catch((err) => console.log(err))


    fetch('https://us-central1-chrome-flight-337209.cloudfunctions.net/function-1', requestOptions)
      .then((response) => {
        if (!response.ok) throw new Error(response.json())
        else return response.json()
      })
      .then((data) =>{
          const predictions = data
          if (predictions) {
            const predictedDigit = predictions.indexOf(Math.max(...predictions));
            setPredictedResult(predictedDigit);
            console.log("Predicted result: ", predictedDigit);
          }
      })
      .catch((err) => console.log(err))
  };

  const predictFromApi = (data) => {
    data.array().then((array) => {
      const body = {
        instances: array
      };

      const params = {
        method: "POST",
        body: JSON.stringify(body)
      };

      fetch(process.env.REACT_APP_API_URL, params)
        .then((res) => res.json())
        .then((data) => {
          const predictions = data.predictions && data.predictions[0];
          if (predictions) {
            const predictedDigit = predictions.indexOf(Math.max(...predictions));
            console.log("Predicted result: ", predictedDigit);
          }
        })
        .catch((err) => {
          console.error("Error: ", err);
        });
    });
  };

  useEffect(() => {
    // async function loadModel() {
    //   const model = await tf.loadLayersModel(process.env.REACT_APP_MODEL_URL);
    //   setMnistModel(model);
    // }
    // loadModel();
  }, []);

  return (
    <div className="home-container">
      <div className="inner-container">
        <div style={{ width: "50%", minWidth: "300px" }}>
          <DigitCanvas predictDigit={predictDigit} />

        </div>
        <div style={{ width: "50%", minWidth: "300px" }}>
          <DigitCard digit={predictedResult} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
