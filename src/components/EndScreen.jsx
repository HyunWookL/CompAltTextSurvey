import React from 'react';

function EndScreen() {
  const redirectionUrl = "https://app.prolific.com/submissions/complete?cc=CO00QOFX"
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>CONGRATULATIONS! YOU COMPLETED YOUR TASKS.</h1>
      <p>We will check your response and reward you as we stated in the introduction.
        It will take no longer than a week.
      </p>
      <a href={redirectionUrl} target='_blank' rel='noreferrer'>
        { redirectionUrl}
      </a>
    </div>
  );
}

export default EndScreen;
