import { ICell } from '../../types/NaaVRECatalogue/workflow-cells';
import {
  INotebookFile,
  IWorkflowFile
} from '../../types/NaaVRECatalogue/file-asset';

export type Asset = INotebookFile | ICell | IWorkflowFile;

export type AssetKind = {
  name: string;
  namePlural: string;
  slug: string;
  cataloguePath: string;
};

export const assetKinds: AssetKind[] = [
  {
    name: 'notebook file',
    namePlural: 'notebook file',
    slug: 'notebook-files',
    cataloguePath: 'notebook-files'
  },
  {
    name: 'workflow component',
    namePlural: 'workflow component',
    slug: 'workflow-cells',
    cataloguePath: 'workflow-cells'
  },
  {
    name: 'workflow file',
    namePlural: 'workflow file',
    slug: 'workflow-files',
    cataloguePath: 'workflow-files'
  }
];
