package com.smarthome.exceptions;

/**
 * Exception thrown when a scene execution fails. This can happen when a scene doesn't exist,
 * devices are unavailable, or individual actions within a scene fail to execute.
 */
public class SceneExecutionException extends Exception {

  public SceneExecutionException(String message) {
    super(message);
  }

  public SceneExecutionException(String message, Throwable cause) {
    super(message, cause);
  }
}
