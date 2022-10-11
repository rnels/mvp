import React, { useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { ReactComponent as Logo } from '../logo.svg';

interface ICloudLogo {
  loading: boolean
}

export default function CloudLogo({loading}: ICloudLogo) {

  const [inProp, setInProp] = useState(false);
  const nodeRef = useRef(null);

    setTimeout(() => {
      if (loading && !inProp) {
        setInProp(true);
        setTimeout(() => {
          setInProp(false);
        }, 4000);
      }
    }, 4000);

  return (
    <div className='cloud-logo'>
      <CSSTransition nodeRef={nodeRef} in={inProp} timeout={2500} classNames="cloud-logo">
        <div ref={nodeRef}>
          <Logo
            height={100}
            width={100}
            onClick={() => {
              if (inProp) setInProp(false);
              else setInProp(true);
            }}
          />
        </div>
      </CSSTransition>
    </div>
  )
};