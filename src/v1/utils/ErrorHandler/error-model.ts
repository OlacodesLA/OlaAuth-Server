export class ErrorModel {
  /**
   * Unique error code which identifies the error.
   */
  public code:
    | string
    /**
     * Status code of the error.
     */
    | undefined;
  /**
   * Status code of the error.
   */
  public status: number | undefined;
  /**
   * Any additional data that is required for translation.
   */
  public metaData?: any;
}
