import React, { useState } from 'react';

const ProfileImageUpload = ({ token,onClose }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Veuillez sélectionner une image à télécharger.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/user/upload-profile-pic', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        alert('Image téléchargée avec succès!');
      } else {
        alert('Erreur lors du téléchargement de l’image.');
      }
    } catch (error) {
      alert('Erreur lors du téléchargement de l’image.');
    }
  };

  return (
    <form onSubmit={handleFileUpload}>
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Télécharger l'image</button>
      <button onClick={onClose}>Fermer</button>
    </form>
  );
};

export default ProfileImageUpload;
