import { IBaseAsset, IVersioningMixin } from './base-assets';

export interface IFileAsset extends IBaseAsset {
  file: string;
}

export interface INotebookFile extends IFileAsset, IVersioningMixin {}

export interface IWorkflowFile extends IFileAsset, IVersioningMixin {}
