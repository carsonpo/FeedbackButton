import React, { useState, useRef, useEffect, Fragment } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const useOutsideClick = (ref, callback) => {
  const handleClick = e => {
    if (ref.current && !ref.current.contains(e.target)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  });
};

const TriggerBase = styled.button`
  width: 300px;
  height: 40px;
  border-radius: 3px;
  background: white;
  display: flex;
  -webkit-box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.4);
  box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.4);
  padding: 6px;
  justify-content: space-between;
  align-items: center;
`;

const PopupBase = styled.div`
  width: 300px;
  height: ${props => (props.complete ? '46px' : '200px;')}
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #efefef;
  -webkit-box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.4);
  box-shadow: 2px 2px 10px 0px rgba(0, 0, 0, 0.4);
  padding: 10px;
  tab-index: 69;
  z-index: 69;
`;

const TextArea = styled.textarea`
  background: white;
  border: 1px solid #ddd;
  outline: none;
  width: 100%;
  height: 80%;
  resize: none;
  border-radius: 8px;
`;

const PopupActions = styled.div`
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const SendButton = styled.button`
  background-color: #44c;
  border: none;
  height: 30px;
  border-radius: 15px;
  color: white;
  width: 60px;

  &:hover {
    -webkit-box-shadow: 2px 2px 3px 0px rgba(0, 0, 0, 0.3);
    -moz-box-shadow: 2px 2px 3px 0px rgba(0, 0, 0, 0.3);
    box-shadow: 2px 2px 3px 0px rgba(0, 0, 0, 0.3);
    transition: 0.1s ease-in;
  }
`;

const CancelButton = styled.button`
  background-color: #c44;
  border: none;
  height: 30px;
  border-radius: 15px;
  color: white;
  width: 60px;
  margin-right: 10px;

  &:hover {
    -webkit-box-shadow: 2px 2px 3px 0px rgba(0, 0, 0, 0.3);
    -moz-box-shadow: 2px 2px 3px 0px rgba(0, 0, 0, 0.3);
    box-shadow: 2px 2px 3px 0px rgba(0, 0, 0, 0.3);
    transition: 0.1s ease-in;
  }
`;

const IconButton = styled.button`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #44c;
  color: white;
  font-family: monospace;
`;

const ButtonLabel = styled.p`
  margin-block-end: 0;
`;

const Form = styled.form`
  height: 100%;
  width: 100%;
`;

const prompts = [
  'I hate it when this page...',
  'I feel confused when this page...',
  'This page annoys me by...',
];

export default function FeedbackButton() {
  const [state, setState] = useState({
    text: '',
    response: false,
    show: false,
    prompt: prompts[Math.floor(Math.random() * prompts.length)],
  });
  const ref = useRef();
  const isInitialMount = useRef(true);

  useOutsideClick(ref, () => {
    if (state.show) {
      setState({
        ...state,
        show: false,
      });
    }
  });

  const showPopup = () => {
    setState({
      ...state,
      show: true,
    });
  };
  const onChange = event => {
    setState({
      ...state,
      text: event.target.value,
    });
  };

  const handleSend = () => {
    if (false) {
      //// for testing purposes
      axios
        .post('/api/feedback/message', { message: text })
        .then(() => {
          setState({
            ...state,
            show: true,
            response: true,
          });
        })
        .catch(err => {
          console.error(err);
          setState({
            ...state,
            show: true,
            response: true,
          });
          //// or maybe have some error handling, I just don't wanna piss off an
          //// already frustrated customer with error message. Take the L and move on.
        });
    }
    //// for testing again
    setState({
      ...state,
      response: true,
      show: true,
    });
  };

  useEffect(() => {
    if (!isInitialMount.current) {
      setState({
        ...state,
        show: true,
      });
    } else {
      isInitialMount.current = false;
    }
  }, [state.response]);

  const hidePopup = () => {
    setState({
      ...state,
      show: false,
    });
  };

  return (
    <div>
      {state.show ? (
        <PopupBase ref={ref} complete={state.response}>
          {!state.response && (
            <TextArea placeholder={state.prompt} value={state.text} onChange={onChange} />
          )}

          <PopupActions>
            {state.response ? (
              <p>Thanks for your feedback, we will be in touch soon.</p>
            ) : (
              <Fragment>
                <CancelButton onClick={hidePopup}>Cancel</CancelButton>
                <SendButton onClick={handleSend}>Send</SendButton>
              </Fragment>
            )}
          </PopupActions>
        </PopupBase>
      ) : (
        <TriggerBase onClick={showPopup}>
          <ButtonLabel>{state.prompt}</ButtonLabel>
          <IconButton onClick={showPopup}>i</IconButton>
        </TriggerBase>
      )}
    </div>
  );
}
