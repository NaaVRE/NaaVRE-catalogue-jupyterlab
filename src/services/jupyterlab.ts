import { Notification } from '@jupyterlab/apputils';
import { IDocumentManager } from '@jupyterlab/docmanager';
import { ContentsManager } from '@jupyterlab/services';

async function downloadTextFile(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.statusText}`);
  }
  return await response.text();
}

export async function downloadAndOpenFile(
  docManager: IDocumentManager,
  url: string,
): Promise<void> {
  const filename = new URL(url).pathname.split('/').pop()

  if (filename === undefined) {
    throw Error(`Cannot download file from URL: ${url}`)
  }

  const notificationId = Notification.emit(
    `Downloading\n${filename}`,
    'in-progress',
    {
      autoClose: false,
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
          callback: event => {
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
