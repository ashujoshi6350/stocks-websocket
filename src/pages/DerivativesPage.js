import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { subscribeToPrices, unSubscribePrices } from '../utils/websocket';
import Item from '../components/item/Item';
import BASE_URL from '../config';
import { useSelector, useDispatch } from 'react-redux';
import { updateDerivativesData } from '../actions/action';
import store from '../store/store';

const Derivatives = () => {
  const { underlyingId } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  const state = useSelector((state) => state);
  const socket = state.socket;

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    fetchDataAndSubscribe();
    let intervalId = setInterval(fetchDataAndSubscribe, 30000);

    return () => {
      clearInterval(intervalId);
    }
  }, []);

  const fetchDataAndSubscribe = async () => {
    try {
      setIsLoading(true);
      let prevTokens = store.getState().underlyingsData?.map(item => item.token) || [];
      if (prevTokens.length) {
        unSubscribePrices(socket, prevTokens);
      }
      let response = await fetch(`${BASE_URL}/derivatives/${underlyingId}`)
      let data = await response.json();
      dispatch(updateDerivativesData({
        data: data.payload
      }));
      setIsLoading(false);
      let tokensArr = data.payload?.map(item => item.token);
      subscribeToPrices(socket, tokensArr, dispatch, updateDerivativesData, 'derivatives');
    }
    catch (e) {
      console.log(e);
    }
  }

  const navigateToUnderlyings = () => {
    let tokensArr = state.derivativesData?.map(item => item.token);
    unSubscribePrices(socket, tokensArr);
    navigate(`/`);
  }

  return (
    <div className='section'>
      <h1 className='heading'>Derivatives Page</h1>
      <hr/>
      <button onClick={navigateToUnderlyings}>{'<- Back'}</button>
      {isLoading ? <div>Loading...</div> : <ul>
        {state.derivativesData?.map(derivative => (
          <Item
            key={derivative.token}
            data={derivative}
            page='derivatives'
          />
        ))}
      </ul>}
    </div>
  );
}

export default Derivatives;
