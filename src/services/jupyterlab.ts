import { Notification } from '@jupyterlab/apputils';
import { IDocumentManager } from '@jupyterlab/docmanager';
import { Contents, ContentsManager } from '@jupyterlab/services';

import { ISettings } from '../settings';
import { createFileAsset, presign } from '../utils/catalog';

async function downloadTextFile(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.statusText}`);
  }
  return await response.text();
}

export async function downloadAndOpenFile(
  docManager: IDocumentManager,
  url: string
): Promise<void> {
  const filename = new URL(url).pathname.split('/').pop();

  if (filename === undefined) {
    throw Error(`Cannot download file from URL: ${url}`);
  }

  const notificationId = Notification.emit(
    `Downloading\n${filename}`,
    'in-progress',
    {
      autoClose: false
    }
  );

  const contents = new ContentsManager();

  try {
    // Assuming that files are text, which is the case for ipynb and naavrewf,
    // which are the only types that we currently deal with.
    const textContent = await downloadTextFile(url);
    await contents.save(filename, {
      type: 'file',
      format: 'text',
      content: textContent
    });

    Notification.update({
      id: notificationId,
      type: 'success',
      message: `Downloaded \n${filename}`,
      autoClose: 5000,
      actions: [
        {
          label: 'Open',
          callback: _event => {
            docManager.openOrReveal(filename);
          }
        }
      ]
    });
  } catch (err) {
    Notification.update({
      id: notificationId,
      type: 'error',
      message: `Could not download file\n${filename}\n${err}`,
      autoClose: 5000
    });
    console.error('Error downloading or opening file', err);
    throw err;
  }
}

function getFileExtension(fileModel: Contents.IModel): string | undefined {
  return fileModel.name.split('.').pop();
}

function getCataloguePath(fileModel: Contents.IModel): string {
  const extension = getFileExtension(fileModel);
  switch (extension) {
    case 'ipynb':
      return 'notebook-files';
    case 'naavrewf':
      return 'workflow-files';
    default:
      throw `unsupported file extension: ${extension}`;
  }
}

function getSerializedContent(fetchedModel: Contents.IModel): string {
  const extension = getFileExtension(fetchedModel);
  switch (extension) {
    case 'ipynb':
      return JSON.stringify(fetchedModel.content);
    case 'naavrewf':
      return fetchedModel.content;
    default:
      throw `unsupported file extension: ${extension}`;
  }
}

async function uploadTextFile(url: string, data: string) {
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: data
  });
  if (!response.ok) {
    throw new Error(`Failed to upload file: ${response.statusText}`);
  }
}

export async function uploadFile(
  model: Contents.IModel,
  settings: Partial<ISettings>
) {
  const notificationId = Notification.emit(
    `Uploading\n${model.name}`,
    'in-progress',
    {
      autoClose: false
    }
  );

  try {
    const contentsManager = new ContentsManager();
    const fetchedModel = await contentsManager.get(model.path);
    const cataloguePath = getCataloguePath(model);
    if (settings.catalogueServiceUrl === undefined) {
      throw 'catalogue service URL is undefined';
    }

    // Presign
    const presignRes = await presign(
      `${settings.catalogueServiceUrl}/${cataloguePath}/presign/`,
      model.name,
      'application/json'
    );

    // Upload
    const serializedContent = getSerializedContent(fetchedModel);
    await uploadTextFile(presignRes.url, serializedContent);

    // Create in catalogue
    createFileAsset(`${settings.catalogueServiceUrl}/${cataloguePath}/`, {
      virtual_lab: settings.virtualLab || undefined,
      title: model.name,
      key: presignRes.key
    });

    Notification.update({
      id: notificationId,
      type: 'success',
      message: `Uploaded\n${model.name}`,
      autoClose: 5000
      // TODO: implement once there is an assets detail view
      // actions: [
      //   {
      //     label: 'Show',
      //     callback: _event => {
      //     }
      //   }
      // ]
    });
  } catch (err) {
    Notification.update({
      id: notificationId,
      type: 'error',
      message: `Could not upload file\n${model.name}\n${err}`,
      autoClose: 5000
    });
    console.error('Error uploading or opening file', err);
    throw err;
  }
}
