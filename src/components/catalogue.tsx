import React, { useContext } from 'react';
import { SettingsContext } from '../settings';

export function Catalogue() {
  const settings = useContext(SettingsContext);
  return (
    <>
      {/*TODO*/}
      <p>{JSON.stringify(settings)}</p>
    </>
  );
}
