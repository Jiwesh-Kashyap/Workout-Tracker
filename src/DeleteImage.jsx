import React from 'react';
import deleteImg from './assets/delete.png';

function DeleteImage() {
  return (
    <img src={deleteImg} className='delete' alt="delete-button" width="20" />
  );
}
export default DeleteImage