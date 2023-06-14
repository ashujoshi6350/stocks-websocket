import React, { useState, useEffect, useRef } from 'react';
import BASE_URL from '../../config';
import './item.css';

const Item = ({data, navigationCallback}) => {
  const [price, setPrice] = useState(data.price || '');
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      fetch(`${BASE_URL}/quotes/${data.token}`)
      .then(res => res.json())
      .then(quotesData => {
        setPrice(quotesData?.payload?.price);
      })
      first.current = false;
    } else {
      setPrice(prev => {
        return data.price || prev
        });
    }
  }, [data])

  return (
    <>
      <li className='row'>
        <p>{data.symbol + ':'}</p>
        <p>{Number(price).toFixed(2)}</p>
        {navigationCallback && <button className='btn' onClick={() => navigationCallback(data.token)}>{'Show directives ->'}</button>}
      </li>
    </>
  )
}

export default Item