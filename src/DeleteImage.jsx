import React from 'react';
import deleteImg from './assets/delete.png';

function DeleteImage({className}) {
  return (
    <img src={deleteImg} className={className} alt="delete-button" width="20" />
  );
}
export default DeleteImage