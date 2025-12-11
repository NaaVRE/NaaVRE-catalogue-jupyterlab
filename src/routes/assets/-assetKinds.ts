export type AssetKind = {
  title: string;
  slug: string;
};

export const assetKinds: AssetKind[] = [
  {
    title: 'Notebook Files',
    slug: 'notebook-files'
  },
  {
    title: 'Workflow components',
    slug: 'workflow-cells'
  },
  {
    title: 'Workflow files',
    slug: 'workflow-files'
  }
];
