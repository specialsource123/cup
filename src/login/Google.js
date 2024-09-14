import React from 'react'
import { Link } from 'react-router-dom';
import { backend_url } from '../utils';


export const Google = () => {



  return (
    <div>
      <a href={`http://localhost:8123/oauth2/authorization/google`}>Google Login2</a>
      <a href={`https://angelboo.store/oauth2/authorization/google`}>Google Login2</a>
    </div>
  );
};
