export type AssetKind = {
  title: string;
  slug: string;
  cataloguePath: string;
  isFileAsset: boolean;
};

export const assetKinds: AssetKind[] = [
  {
    title: 'Notebook Files',
    slug: 'notebook-files',
    cataloguePath: 'notebook-files',
    isFileAsset: true
  },
  {
    title: 'Workflow components',
    slug: 'workflow-cells',
    cataloguePath: 'workflow-cells',
    isFileAsset: false
  },
  {
    title: 'Workflow files',
    slug: 'workflow-files',
    cataloguePath: 'workflow-files',
    isFileAsset: true
  }
];
