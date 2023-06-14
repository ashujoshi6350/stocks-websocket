import React, { useState, useEffect } from 'react';
import Item from '../components/item/Item';
import { subscribeToPrices, unSubscribePrices } from '../utils/websocket';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../config';
import { useDispatch, useSelector } from 'react-redux';
import { updateUnderlyingsData } from '../actions/action';
import store from '../store/store';

const Underlyings = () => {
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();

  const state = useSelector((state) => state);
  const socket = state.socket;

  const navigate = useNavigate();

  useEffect(() => {
    fetchDataAndSubscribe();
    let intervalId = setInterval(fetchDataAndSubscribe, 60000);

    return () => {
      clearInterval(intervalId);
    }
  }, [])

  const fetchDataAndSubscribe = async () => {
    try {
      setIsLoading(true);
      let prevTokens = store.getState().underlyingsData?.map(item => item.token) || [];
      if (prevTokens.length) {
        unSubscribePrices(socket, prevTokens);
      }
      let response = await fetch(`${BASE_URL}/underlyings`);
      let data = await response.json();
      setIsLoading(false);
      dispatch(updateUnderlyingsData({
        data: data.payload
      }));
      let tokensArr = data.payload?.map(item => item.token);
      subscribeToPrices(socket, tokensArr, dispatch, updateUnderlyingsData, 'underlyings');
    }
    catch (e) {
      console.log(e);
    }
  }

  const navigateToDerivatives = (token) => {
    let tokensArr = state.underlyingsData?.map(item => item.token);
    unSubscribePrices(socket, tokensArr);
    navigate(`/derivatives/${token}`);
  }

  return (
    <div className='section'>
      <h1 className='heading'>Underlyings Page</h1>
      <hr/>
      {isLoading ? <div>Loading...</div> : <ul>
        {state.underlyingsData?.map((underlying) => (
          <Item
            key={underlying.token}
            data={underlying}
            navigationCallback={navigateToDerivatives}
          />
        ))}
      </ul>}
    </div>
  );
}

export default Underlyings;
