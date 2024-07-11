import Response from './Response.mjs';

export default class FileResponse extends Response {
  /**
   * @param {File} file
   * @param res
   */
  static build(file, res) {
    res.setHeader('Content-Disposition', `attachment; filename=${file.getName()}`);
    res.setHeader('Content-Length', file.getLength());
    res.setHeader('Content-Type', file.getContentType());
    res.write(file.getBinary(), 'binary');
    res.end();
  }

  static exception(exception, res = null) {
    res
      .status(exception.status || 500)
      .json({ error: exception.message || 'Упс... Что-то пошло не так' });
  }
}
