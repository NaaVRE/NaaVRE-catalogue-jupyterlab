import { createContext } from 'react';

import { ISharingScope } from '../types/NaaVRECatalogue/base-assets';

export const SharingScopesContext = createContext<ISharingScope[] | null>(null);
