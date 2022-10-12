import React, { useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { ReactComponent as Logo } from '../logo.svg';

type CloudLogoProps = {
  loading: boolean
}

export default function CloudLogo(props: CloudLogoProps) {

  const [inProp, setInProp] = useState(false);
  const nodeRef = useRef(null);

  setTimeout(() => {
    if (props.loading && !inProp) {
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
              if (inProp) { setInProp(false); }
              else { setInProp(true); }
            }}
          />
        </div>
      </CSSTransition>
    </div>
  )
};