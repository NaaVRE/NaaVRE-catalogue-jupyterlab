import { createContext } from 'react';

import { ISharingScope } from '../types/NaaVRECatalogue/BaseAssets';

export const SharingScopesContext = createContext<ISharingScope[]>([]);
